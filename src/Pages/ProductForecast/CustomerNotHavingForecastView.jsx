import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Button,
  Box,
  Paper,
  Grid,
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
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const CustomerNotHavingForecastView = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [salesPersonByFilter, setSalesPersonByFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerNotHavingForecast, setCustomerNotHavingForecast] = useState(
    [],
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
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // Get the current date, month, and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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

  // HELPER FUNCTION: Calculate month and year for offset
  const getMonthYear = (monthOffset) => {
    const targetMonth = currentMonth + monthOffset;
    const monthIndex = ((targetMonth % 12) + 12) % 12; // Handle negative months
    const yearOffset = Math.floor(targetMonth / 12);
    const year = currentYear + yearOffset;

    return { monthIndex, year };
  };

  // Calculate the previous and next months with correct years
  const lastMonth1Data = getMonthYear(-2);
  const lastMonth2Data = getMonthYear(-1);
  const currentMonthData = getMonthYear(0);
  const nextMonth1Data = getMonthYear(1);
  const nextMonth2Data = getMonthYear(2);
  const nextMonth3Data = getMonthYear(3);

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setCustomerNotHavingForecast([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      getAllCustomerNotHavingForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  // FIXED: Correct header generation with proper year calculation
  const generateHeaders = () => {
    const basicHeaders = [
      { label: "Company", key: "company" },
      { label: "Sales Person", key: "sales_person" },
      { label: "Product", key: "product" },
    ];

    const forecastHeaders = [];

    // Generate headers for months from -2 to +3
    for (let i = -2; i <= 3; i++) {
      const { monthIndex, year } = getMonthYear(i);
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
    if (isDownloadReady) {
      csvLinkRef.current.link.click();
      setIsDownloadReady(false);
    }
  }, [isDownloadReady, exportData]);

  const handleDownload = async () => {
    try {
      setOpen(true);

      const response =
        await ProductForecastService.downloadCustomerNotHavingData("csv");

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "customer_not_having_data.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      handleSuccess("CSV downloaded successfully");
    } catch (error) {
      handleError(error);
      console.error("CSV Download error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      setOpen(true);

      const response =
        await ProductForecastService.downloadCustomerNotHavingData("csv");

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "customer_not_having_data.csv");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error in handleExport", err);
    } finally {
      setOpen(false);
    }
  };

  const getAllCustomerNotHavingForecastDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllCustomerNotHavingData(
        currentPage,
        salesPersonByFilter,
        searchQuery,
      );
      setCustomerNotHavingForecast(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      handleError(error);
      console.error("Error fetching Customer Having Forecast", error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, salesPersonByFilter, searchQuery]);

  useEffect(() => {
    getAllCustomerNotHavingForecastDetails();
  }, [currentPage, salesPersonByFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = useCallback(
    (item) => {
      const matchedForecast = customerNotHavingForecast.find(
        (forecast) => forecast.id === item.id,
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup(true);
    },
    [customerNotHavingForecast],
  );

  const handleAssignTo = useCallback(
    (item) => {
      const matchedForecast = customerNotHavingForecast.find(
        (forecast) => forecast.id === item.id,
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup2(true);
    },
    [customerNotHavingForecast],
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
          row.product_forecast.map((rowData) => rowData.index_position),
        ),
    ),
  ];

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
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
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
                  <CustomAutocomplete
                    size="small"
                    sx={{ minWidth: 150 }}
                    onChange={(event, value) => handleFilterChange(value)}
                    value={salesPersonByFilter}
                    options={assignedOption.map((option) => option.email)}
                    getOptionLabel={(option) => option}
                    label="Filter By Sales Person"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                >
                  Download CSV
                </Button>
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
                    {`${months[lastMonth1Data.monthIndex]} - ${lastMonth1Data.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[lastMonth2Data.monthIndex]} - ${lastMonth2Data.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[currentMonthData.monthIndex]} - ${currentMonthData.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[nextMonth1Data.monthIndex]} - ${nextMonth1Data.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[nextMonth2Data.monthIndex]} - ${nextMonth2Data.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[nextMonth3Data.monthIndex]} - ${nextMonth3Data.year}`}
                    <br />
                    ACTUAL - FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {customerNotHavingForecast &&
                  customerNotHavingForecast.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.assign_to_email.join(", ")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      {indexPositions.map((position) => {
                        const rowData = row.product_forecast.find(
                          (data) => data.index_position === position,
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
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
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
    padding: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
