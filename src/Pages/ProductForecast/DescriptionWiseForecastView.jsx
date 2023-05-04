import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { CSVDownload } from "react-csv";
import { tableCellClasses } from "@mui/material/TableCell";

import { CustomPagination } from "../../Components/CustomPagination";

import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";

const filterOption = [
  {
    label: "Sales Person",
    value: "sales_person__email",
  },
  {
    label: "Product",
    value: "product__name",
  },
  {
    label: "Company",
    value: "company__name",
  },
  { label: "Search", value: "search" },
];

export const DescriptionWiseForecastView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [descriptionWiseForecast, setDescriptionWiseForecast] = useState([]);
  const [exportData, setExportData] = useState([]);

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");

    getAllDescriptionionForecastDetails();
  };

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(searchQuery);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  // Get the current date
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the last 2 months
  const lastMonth1 = (currentMonth - 2 + 12) % 12;
  const lastMonth2 = (currentMonth - 1 + 12) % 12;
  console.log("lastMonth2", lastMonth2);
  // Get the next 2 months
  const nextMonth1 = (currentMonth + 1) % 12;
  const nextMonth2 = (currentMonth + 2) % 12;
  const nextMonth3 = (currentMonth + 3) % 12;
  // Convert month number to month name
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
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();

      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllDescriptionionForecastDetails();
  }, []);

  const getAllDescriptionionForecastDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await ProductForecastService.getDescriptionWiseForecastPaginateData(
            currentPage
          );
        setDescriptionWiseForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response =
          await ProductForecastService.getDescriptionWiseForecast();
        setDescriptionWiseForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response =
        await ProductForecastService.getAllSearchDescriptionWiseForecast(
          filterQuery,
          filterSearch
        );
      if (response) {
        setDescriptionWiseForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllDescriptionionForecastDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (searchQuery) {
        const response =
          await ProductForecastService.getAllDescriptionWiseForecastPaginate(
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setDescriptionWiseForecast(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllDescriptionionForecastDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await ProductForecastService.getDescriptionWiseForecastPaginateData(
            page
          );
        setDescriptionWiseForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const headers = [
    { label: "Description", key: "description" },
    { label: "Brand", key: "brand" },
    { label: "Unit", key: "unit" },
    {
      label: `${months[lastMonth1]} -- ${
        lastMonth1 < currentMonth ? currentYear : currentYear - 1
      } Forecast-Actual`,
      key: "lastMonth1",
    },
    {
      label: `${months[lastMonth2]} -- ${
        lastMonth2 < currentMonth ? currentYear : currentYear - 1
      } Forecast-Actual`,
      key: "lastMonth2",
    },
    {
      label: `${months[currentMonth]} -- ${currentYear} Forecast-Actual`,
      key: "currentMonth",
    },
    {
      label: `${months[nextMonth1]} - ${
        nextMonth1 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "nextMonth1",
    },
    {
      label: `${months[nextMonth2]} - ${
        nextMonth2 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "nextMonth2",
    },
    {
      label: `${months[nextMonth3]} - ${
        nextMonth3 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "nextMonth3",
    },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response =
          await ProductForecastService.getAllPaginateDescriptionWiseForecastWithSearch(
            "all",
            filterQuery,
            searchQuery
          );
      } else {
        response =
          await ProductForecastService.getAllPaginateDescriptionWiseForecast(
            "all"
          );
      }

      const data = descriptionWiseForecast
        .filter((row) => row.qty_forecast.length > 0) // Filter rows with non-empty qty_forecast array
        .map((row) => {
          return {
            description: row.product__description__name,
            brand: row.product__brand__name,
            unit: row.product__unit__name,
            lastMonth1: row.qty_forecast
              .filter((data) => data.index_position === 0)
              .map(
                (filteredData) =>
                  `${
                    filteredData.total_forecast !== null
                      ? filteredData.total_forecast
                      : ""
                  } -- ${
                    filteredData.actual !== null ? filteredData.actual : ""
                  }`
              ),
            lastMonth2: row.qty_forecast
              .filter((data) => data.index_position === 1)
              .map(
                (filteredData) =>
                  `${
                    filteredData.total_forecast !== null
                      ? filteredData.total_forecast
                      : ""
                  } -- ${
                    filteredData.actual !== null ? filteredData.actual : ""
                  }`
              ),
            currentMonth: row.qty_forecast
              .filter((data) => data.index_position === 2)
              .map(
                (filteredData) =>
                  `${
                    filteredData.total_forecast !== null
                      ? filteredData.total_forecast
                      : ""
                  } -- ${
                    filteredData.actual !== null ? filteredData.actual : ""
                  }`
              ),
            nextMonth1: row.qty_forecast
              .filter((data) => data.index_position === 3)
              .map((filteredData) => filteredData.total_forecast),
            nextMonth2: row.qty_forecast
              .filter((data) => data.index_position === 4)
              .map((filteredData) => filteredData.total_forecast),
            nextMonth3: row.qty_forecast
              .filter((data) => data.index_position === 5)
              .map((filteredData) => filteredData.total_forecast),
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

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            {/* <Box flexGrow={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Fliter By"
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                >
                  {filterOption.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box> */}
            <Box flexGrow={1}>
              {/* {filterQuery === "sales_person__email" ? (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By State
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Filter By State"
                    value={filterSelectedQuery}
                    onChange={(event) => handleInputChanges(event)}
                    sx={{
                      "& .MuiSelect-iconOutlined": {
                        display: filterSelectedQuery ? "none" : "",
                      },
                      "&.Mui-focused .MuiIconButton-root": {
                        color: "primary.main",
                      },
                    }}
                    endAdornment={
                      <IconButton
                        sx={{
                          visibility: filterSelectedQuery
                            ? "visible"
                            : "hidden",
                        }}
                        onClick={getResetData}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                  >
                    {assigned.map((option, i) => (
                      <MenuItem key={i} value={option.email}>
                        {option.first_name} {option.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : ( */}
              <CustomSearchWithButton
                filterSelectedQuery={searchQuery}
                setFilterSelectedQuery={setSearchQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
              {/* )} */}
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Description Wise Forecast
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVDownload
                  data={exportData}
                  headers={headers}
                  target="_blank"
                />
              )}
            </Box>
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
            component={Paper}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">DESCRIPTION</StyledTableCell>
                  <StyledTableCell align="center">BRAND</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[lastMonth1]} - ${
                      lastMonth1 < currentMonth ? currentYear : currentYear - 1
                    }`}
                    <br />
                    FORECAST - ACTUAL
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[lastMonth2]} - ${
                      lastMonth2 < currentMonth ? currentYear : currentYear - 1
                    }`}{" "}
                    <br />
                    FORECAST - ACTUAL
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {`${months[currentMonth]} - ${currentYear}`} <br />
                    FORECAST - ACTUAL
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth1]} - ${
                      nextMonth1 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth2]} - ${
                      nextMonth2 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {` ${months[nextMonth3]} - ${
                      nextMonth3 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {descriptionWiseForecast.map(
                  (row) =>
                    // add condition to check if qty_forecast is not empty
                    row.qty_forecast.length !== 0 && (
                      <StyledTableRow>
                        <StyledTableCell align="center">
                          {row.product__description__name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.product__brand__name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.product__unit__name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 0)
                            .map(
                              (filteredData) =>
                                `${
                                  filteredData.total_forecast !== null
                                    ? filteredData.total_forecast
                                    : ""
                                } - ${
                                  filteredData.actual !== null
                                    ? filteredData.actual
                                    : ""
                                }`
                            )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 1)
                            .map(
                              (filteredData) =>
                                `${
                                  filteredData.total_forecast !== null
                                    ? filteredData.total_forecast
                                    : ""
                                } - ${
                                  filteredData.actual !== null
                                    ? filteredData.actual
                                    : ""
                                }`
                            )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 2)
                            .map(
                              (filteredData) =>
                                `${
                                  filteredData.total_forecast !== null
                                    ? filteredData.total_forecast
                                    : ""
                                } - ${
                                  filteredData.actual !== null
                                    ? filteredData.actual
                                    : ""
                                }`
                            )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 3)
                            .map((filteredData) => filteredData.total_forecast)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 4)
                            .map((filteredData) => filteredData.total_forecast)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.qty_forecast
                            .filter((data) => data.index_position === 5)
                            .map((filteredData) => filteredData.total_forecast)}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </div>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
