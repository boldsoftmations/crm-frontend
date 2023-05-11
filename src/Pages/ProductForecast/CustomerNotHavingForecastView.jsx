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
  InputLabel,
  FormControl,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CSVDownload } from "react-csv";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomPagination } from "../../Components/CustomPagination";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { Popup } from "../../Components/Popup";
import { ForecastUpdate } from "../Cutomers/ForecastDetails/ForecastUpdate";

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

export const CustomerNotHavingForecastView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [productNotHavingForecast, setProductNotHavingForecast] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [forecastDataByID, setForecastDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const openInPopup = (item) => {
    setForecastDataByID(item);
    setOpenPopup(true);
  };
  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");

    getAllProductionForecastDetails();
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
    getAllProductionForecastDetails();
  }, []);

  const getAllProductionForecastDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await ProductForecastService.getProductNotHavingForecastPaginateData(
            currentPage
          );
        setProductNotHavingForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response =
          await ProductForecastService.getProductNotHavingForecast();
        setProductNotHavingForecast(response.data.results);
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
        await ProductForecastService.getAllSearchProductNotHavingForecast(
          filterQuery,
          filterSearch
        );
      if (response) {
        setProductNotHavingForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllProductionForecastDetails();
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

      if (searchQuery || filterSelectedQuery) {
        const response =
          await ProductForecastService.getAllProductNotHavingForecastPaginate(
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setProductNotHavingForecast(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductionForecastDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await ProductForecastService.getProductNotHavingForecastPaginateData(
            page
          );
        setProductNotHavingForecast(response.data.results);
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
    { label: "Company", key: "company" },
    { label: "Sales Person", key: "sales_person" },
    { label: "Product", key: "product" },
    {
      label: `${months[lastMonth1]} -- ${
        lastMonth1 < currentMonth ? currentYear : currentYear - 1
      } Actual-Forecast`,
      key: "product_forecast_0",
    },
    {
      label: `${months[lastMonth2]} -- ${
        lastMonth2 < currentMonth ? currentYear : currentYear - 1
      } Actual-Forecast`,
      key: "product_forecast_1",
    },
    {
      label: `${months[currentMonth]} -- ${currentYear} Actual-Forecast`,
      key: "product_forecast_2",
    },
    {
      label: `${months[nextMonth1]} - ${
        nextMonth1 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "product_forecast_3",
    },
    {
      label: `${months[nextMonth2]} - ${
        nextMonth2 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "product_forecast_4",
    },
    {
      label: `${months[nextMonth3]} - ${
        nextMonth3 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      key: "product_forecast_5",
    },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery || filterSelectedQuery) {
        response =
          await ProductForecastService.getAllPaginateProductNotHavingForecastWithSearch(
            "all",
            filterQuery,
            searchQuery || filterSelectedQuery
          );
      } else {
        response =
          await ProductForecastService.getAllPaginateProductNotHavingForecast(
            "all"
          );
      }
      const data = response.data.map((row) => {
        const obj = {
          company: row.company,
          sales_person: row.sales_person,
          product: row.product,
        };
        row.product_forecast.forEach((rowData, index) => {
          obj[`product_forecast_${index}`] =
            rowData.actual !== null
              ? `${rowData.actual}--${rowData.forecast}`
              : `-${rowData.forecast}`;
        });
        return obj;
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
            <Box flexGrow={1}>
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
            </Box>
            <Box flexGrow={1}>
              {filterQuery === "sales_person__email" ? (
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
              ) : (
                <CustomSearchWithButton
                  filterSelectedQuery={searchQuery}
                  setFilterSelectedQuery={setSearchQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              )}
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
                Customer Not Having Forecast
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
                  filename={"Customer Not Having forecast.csv"}
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
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">SALES PERSON</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
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
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {productNotHavingForecast.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div
                        style={{
                          border: "1px solid #4caf50",
                          borderRadius: "20px",
                          padding: "4px 8px",
                          color: "#4caf50",
                        }}
                      >
                        {row.sales_person}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    {row.product_forecast.map((rowData) => {
                      return rowData.actual !== null ? (
                        <StyledTableCell align="center">
                          {rowData.actual} - {rowData.forecast}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell align="center">
                          {rowData.forecast} -
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => openInPopup(row)}
                      >
                        View
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
          getAllCompanyDetailsByID={getAllProductionForecastDetails}
          setOpenPopup={setOpenPopup}
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
