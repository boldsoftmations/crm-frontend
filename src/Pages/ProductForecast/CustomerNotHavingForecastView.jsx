import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Button,
  Box,
  Paper,
  Grid,
  Autocomplete,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import ProductForecastService from "../../services/ProductForecastService";
import { Popup } from "../../Components/Popup";
import { ForecastUpdate } from "../Cutomers/ForecastDetails/ForecastUpdate";
import { ProductForecastAssignTo } from "./ProductForecastAssignTo";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import CustomTextField from "../../Components/CustomTextField";

export const CustomerNotHavingForecastView = () => {
  const [open, setOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [salesPersonByFilter, setSalesPersonByFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerNotHavingForecast, setCustomerNotHavingForecast] = useState(
    []
  );
  const [exportData, setExportData] = useState([]);
  const [forecastDataByID, setForecastDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const csvLinkRef = useRef(null);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const UserData = useSelector((state) => state.auth.profile);
  const assignedOption = UserData.sales_users || [];

  // Get the current date, month, and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the previous and next months
  const lastMonth1 = (currentMonth - 2 + 12) % 12;
  const lastMonth2 = (currentMonth - 1 + 12) % 12;
  const nextMonth1 = (currentMonth + 1) % 12;
  const nextMonth2 = (currentMonth + 2) % 12;
  const nextMonth3 = (currentMonth + 3) % 12;

  // Define the months array
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setCustomerNotHavingForecast([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllCustomerNotHavingForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const generateHeaders = () => {
    // Basic headers
    const basicHeaders = [
      { label: "Company", key: "company" },
      { label: "Sales Person", key: "sales_person" },
      { label: "Product", key: "product" },
    ];

    // Generating headers for each forecast month
    const forecastHeaders = [];
    for (let i = -2; i <= 3; i++) {
      const monthIndex = (currentMonth + i + 12) % 12;
      const year =
        i < 0
          ? monthIndex > currentMonth
            ? currentYear
            : currentYear - 1
          : monthIndex < currentMonth
          ? currentYear + 1
          : currentYear;
      const monthName = months[monthIndex];
      forecastHeaders.push({
        label: `${monthName} - ${year} Actual-Forecast`,
        key: `${monthName}-${year} Actual-Forecast`,
      });
    }

    return [...basicHeaders, ...forecastHeaders];
  };

  const headers = generateHeaders();

  useEffect(() => {
    if (isDownloadReady && exportData.length > 0) {
      csvLinkRef.current.link.click();
      setIsDownloadReady(false); // Reset the flag after download
    }
  }, [isDownloadReady, exportData]);

  const handleDownload = async () => {
    try {
      setOpen(true);
      const data = await handleExport();
      setExportData(data);
      // Using a small delay to ensure state update
      setTimeout(() => {
        csvLinkRef.current.link.click();
      }, 0);
    } catch (error) {
      console.error("CSVLink Download error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllCustomerNotHavingData(
        "all",
        salesPersonByFilter,
        searchQuery
      );

      const data = response.data.map((row) => {
        const obj = {
          company: row.company,
          sales_person: row.sales_person,
          product: row.product,
        };

        row.product_forecast.forEach((forecast) => {
          // Convert month number to month name and create the key
          const monthName = months[parseInt(forecast.month) - 1];
          const forecastKey = `${monthName}-${forecast.year} Actual-Forecast`;

          // Assign the actual-forecast data to the corresponding month-year key
          obj[forecastKey] =
            forecast.actual !== null
              ? `${forecast.actual}--${forecast.forecast}`
              : `-${forecast.forecast}`;
        });

        return obj;
      });

      setOpen(false);
      console.log("Export Data: ", data); // This line is for debugging, you can remove it later
      return data;
    } catch (err) {
      console.error("Error in handleExport", err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllCustomerNotHavingForecastDetails(currentPage);
  }, [currentPage, getAllCustomerNotHavingForecastDetails]);

  const getAllCustomerNotHavingForecastDetails = useCallback(
    async (page, filter = salesPersonByFilter, query = searchQuery) => {
      try {
        setOpen(true);
        const response =
          await ProductForecastService.getAllCustomerNotHavingData(
            page,
            filter,
            query
          );
        setCustomerNotHavingForecast(response.data.results);
        const total = response.data.count;
        setPageCount(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching Customer Having Forecast", error);
        setOpen(false);
      }
    },
    [salesPersonByFilter, searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = useCallback(
    (item) => {
      const matchedForecast = customerNotHavingForecast.find(
        (forecast) => forecast.id === item.id
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup(true);
    },
    [customerNotHavingForecast]
  );

  const handleAssignTo = useCallback(
    (item) => {
      const matchedForecast = customerNotHavingForecast.find(
        (forecast) => forecast.id === item.id
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup2(true);
    },
    [customerNotHavingForecast]
  );

  const handleFilterChange = (value) => {
    setSalesPersonByFilter(value);
    getAllCustomerNotHavingForecastDetails(currentPage, value, searchQuery);
  };

  // Get the unique index_position values to use as column headers
  const indexPositions = [
    ...new Set(
      customerNotHavingForecast &&
        customerNotHavingForecast.flatMap((row) =>
          row.product_forecast.map((rowData) => rowData.index_position)
        )
    ),
  ];

  // Sort the index_positions array in ascending order
  indexPositions.sort((a, b) => a - b);

  return (
    <div>
      <Helmet>
        <style>
          {`
            @media print {
              html, body {
                filter: ${isPrinting ? "blur(10px)" : "none"} !important;
              }
            }
          `}
        </style>
      </Helmet>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              {!UserData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    size="small"
                    sx={{ minWidth: 150 }}
                    onChange={(event, value) => handleFilterChange(value)}
                    value={salesPersonByFilter}
                    options={assignedOption.map((option) => option.email)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Filter By Sales Person"
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    getAllCustomerNotHavingForecastDetails(
                      currentPage,
                      salesPersonByFilter,
                      searchQuery
                    )
                  }
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getAllCustomerNotHavingForecastDetails(
                      1,
                      salesPersonByFilter,
                      ""
                    );
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename={"Customer Not Having forecast.csv"}
                    style={{ display: "none" }} // Hide the link
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Customer Not Having Forecast
            </h3>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">SALES PERSON</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[lastMonth1]} - ${
                      lastMonth1 < currentMonth ? currentYear : currentYear - 1
                    }`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[lastMonth2]} - ${
                      lastMonth2 < currentMonth ? currentYear : currentYear - 1
                    }`}{" "}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[currentMonth]} - ${currentYear}`} <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth1]} - ${
                      nextMonth1 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth2]} - ${
                      nextMonth2 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth3]} - ${
                      nextMonth3 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {customerNotHavingForecast &&
                  customerNotHavingForecast.map((row) => (
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.sales_person}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      {indexPositions.map((position) => {
                        const rowData = row.product_forecast.find(
                          (data) => data.index_position === position
                        );

                        if (rowData) {
                          if (rowData.actual !== null) {
                            return (
                              <TableCell key={position} align="center">
                                {rowData.actual} - {rowData.forecast}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={position} align="center">
                                - {rowData.forecast}
                              </TableCell>
                            );
                          }
                        } else {
                          // Render an empty cell if no matching rowData is found
                          return (
                            <TableCell key={position} align="center">
                              N/A
                            </TableCell>
                          );
                        }
                      })}
                      <StyledTableCell align="center">
                        <Button
                          sx={{ color: "#1976d2" }}
                          onClick={() => handleEditClick(row)}
                        >
                          View
                        </Button>
                        <Button
                          sx={{ color: "#28a745" }}
                          onClick={() => handleAssignTo(row)}
                        >
                          Assign To
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Update Forecast Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ForecastUpdate
          getAllCompanyDetailsByID={getAllCustomerNotHavingForecastDetails}
          setOpenPopup={setOpenPopup}
          forecastDataByID={forecastDataByID}
        />
      </Popup>
      <Popup
        title={"Product Forecast Assign To"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProductForecastAssignTo
          getAllCompanyDetailsByID={getAllCustomerNotHavingForecastDetails}
          setOpenPopup2={setOpenPopup2}
          forecastDataByID={forecastDataByID}
        />
      </Popup>
    </div>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
