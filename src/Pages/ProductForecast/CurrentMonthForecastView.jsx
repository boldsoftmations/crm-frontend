import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Box, Paper, Grid, Autocomplete } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import ProductForecastService from "../../services/ProductForecastService";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Popup } from "../../Components/Popup";
import { AnticipatedDateUpdate } from "./AnticipatedDateUpdate";
import CustomTextField from "../../Components/CustomTextField";

export const CurrentMonthForecastView = () => {
  const [open, setOpen] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [salesPersonByFilter, setSalesPersonByFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonthForecast, setCurrentMonthForecast] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [idForEdit, setIdForEdit] = useState("");
  const csvLinkRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const UserData = useSelector((state) => state.auth.profile);
  const assignedOption = UserData.sales_users || [];

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setCurrentMonthForecast([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllCurrentMonthForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const headers = [
    { label: "Company", key: "company" },
    { label: "Sales Person", key: "sales_person" },
    { label: "Product", key: "product" },
    { label: "Forecast", key: "forecast" },
    { label: "Actual", key: "actual" },
    { label: "Orderbook Value", key: "orderbook_value" },
    { label: "Shortfall", key: "forecast_achieved" },
  ];

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllCurrentMonthData(
        "all",
        salesPersonByFilter,
        searchQuery
      );
      const data = response.data
        .filter((row) => row.forecast > 0)
        .map((row) => {
          const sumValue = row.orderbook_value + row.actual;
          const forecast_achieved = row.forecast - sumValue;
          return {
            company: row.company,
            sales_person: row.sales_person,
            product: row.product,
            forecast: row.forecast,
            actual: row.actual,
            orderbook_value: row.orderbook_value,
            forecast_achieved: forecast_achieved > 0 ? forecast_achieved : 0,
          };
        });
      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllCurrentMonthForecastDetails(currentPage);
  }, [currentPage, getAllCurrentMonthForecastDetails]);

  const getAllCurrentMonthForecastDetails = useCallback(
    async (page, filter = salesPersonByFilter, query = searchQuery) => {
      try {
        setOpen(true);
        const response = await ProductForecastService.getAllCurrentMonthData(
          page,
          filter,
          query
        );
        setCurrentMonthForecast(response.data.results);
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
      setIdForEdit(item);
      setOpenPopup(true);
    },
    [currentMonthForecast]
  );

  const handleFilterChange = (value) => {
    setSalesPersonByFilter(value);
    getAllCurrentMonthForecastDetails(currentPage, value, searchQuery);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(dateString))
      : "-";
  };

  const getColorForDate = (anticipatedDate) => {
    // If anticipatedDate is null, return an empty string or a default color
    if (!anticipatedDate) {
      console.log("No anticipated date provided.");
      return ""; // No color
    }

    const today = new Date();
    const anticipated = new Date(anticipatedDate);

    // You can also check if anticipated is an Invalid Date
    if (isNaN(anticipated.getTime())) {
      console.log("Invalid date provided.");
      return ""; // No color
    }

    today.setHours(0, 0, 0, 0);
    anticipated.setHours(0, 0, 0, 0);

    console.log(
      `Today: ${today.toISOString()}, Anticipated: ${anticipated.toISOString()}`
    );

    if (anticipated.getTime() === today.getTime()) {
      // Date is today
      console.log("Date is today.");
      return "#ccccff";
    } else if (anticipated < today) {
      // Date is in the past
      console.log("Date is in the past.");
      return "#ffcccc";
    } else {
      // Date is in the future
      console.log("Date is in the future.");
      return "#ffffcc";
    }
  };

  // Example use:
  console.log(getColorForDate("2023-12-25")); // Future date example

  const Tableheaders = [
    "Company",
    "Sales Person",
    "Product",
    "Forecast",
    "Actual",
    "Orderbook Value",
    "Shortfall",
    "Estimate Date",
    "Action",
  ];

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
                    getAllCurrentMonthForecastDetails(
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
                    getAllCurrentMonthForecastDetails(
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
                    filename={"Current Month forecast.csv"}
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
              Current Month Forecast
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  {Tableheaders.map((header) => (
                    <StyledTableCell key={header} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {currentMonthForecast.map((row, i) => {
                  const rowColor = getColorForDate(row.anticipated_date); // Get the color for the date
                  return (
                    <StyledTableRow
                      key={row.id}
                      sx={{
                        backgroundColor: rowColor,
                      }}
                    >
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.sales_person}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.forecast}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.actual}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.orderbook_value}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.forecast_achieved}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {formatDate(row.anticipated_date)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button onClick={() => handleEditClick(row)}>
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
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
        maxWidth="md"
        title={"Update Current Month Forecast"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AnticipatedDateUpdate
          idForEdit={idForEdit}
          setOpenPopup={setOpenPopup}
          getAllCurrentMonthForecastDetails={getAllCurrentMonthForecastDetails}
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
