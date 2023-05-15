import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Paper, Grid } from "@mui/material";
import { CSVDownload } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { CustomTable } from "../../Components/CustomTable";

export const ProductWiseForecastView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [productWiseForecast, setProductWiseForecast] = useState([]);
  const [exportData, setExportData] = useState([]);

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
          await ProductForecastService.getProductWiseForecastPaginateData(
            currentPage
          );
        setProductWiseForecast(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductForecastService.getProductWiseForecast();
        setProductWiseForecast(response.data.results);
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
        await ProductForecastService.getAllSearchProductWiseForecast(
          filterQuery,
          filterSearch
        );
      if (response) {
        setProductWiseForecast(response.data.results);
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

      if (searchQuery) {
        const response =
          await ProductForecastService.getAllProductWiseForecastPaginate(
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setProductWiseForecast(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductionForecastDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await ProductForecastService.getProductWiseForecastPaginateData(page);
        setProductWiseForecast(response.data.results);
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
    { key: "product", label: "Product" },
    { key: "type", label: "Type" },
    { key: "unit", label: "Unit" },
    {
      key: "lastMonth1",
      label: `${months[lastMonth1]} -- ${
        lastMonth1 < currentMonth ? currentYear : currentYear - 1
      } Forecast-Actual`,
      type: "number",
    },
    {
      key: "lastMonth2",
      label: `${months[lastMonth2]} -- ${
        lastMonth2 < currentMonth ? currentYear : currentYear - 1
      } Forecast-Actual`,
      type: "number",
    },
    {
      key: "currentMonth",
      label: `${months[currentMonth]} -- ${currentYear} Forecast-Actual`,
    },
    {
      key: "nextMonth1",
      label: `${months[nextMonth1]} - ${
        nextMonth1 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      type: "number",
    },
    {
      key: "nextMonth2",
      label: `${months[nextMonth2]} - ${
        nextMonth2 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
    },
    {
      key: "nextMonth3",
      label: `${months[nextMonth3]} - ${
        nextMonth3 > currentMonth ? currentYear : currentYear + 1
      } Forecast`,
      type: "number",
    },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response =
          await ProductForecastService.getAllPaginateProductWiseForecastWithSearch(
            "all",
            filterQuery,
            searchQuery
          );
      } else {
        response =
          await ProductForecastService.getAllPaginateProductWiseForecast("all");
      }

      const data = response.data
        .filter((row) => row.qty_forecast.length > 0) // Filter rows with non-empty qty_forecast array
        .map((row) => {
          return {
            product: row.product__name,
            type: row.product__type,
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

  const Tabledata = productWiseForecast
    .filter((row) => row.qty_forecast.length > 0) // Filter rows with non-empty qty_forecast array
    .map((row) => {
      return {
        product: row.product__name,
        type: row.product__type,
        unit: row.product__unit__name,
        lastMonth1: row.qty_forecast
          .filter((data) => data.index_position === 0)
          .map(
            (filteredData) =>
              `${
                filteredData.total_forecast !== null
                  ? filteredData.total_forecast
                  : ""
              } -- ${filteredData.actual !== null ? filteredData.actual : ""}`
          ),
        lastMonth2: row.qty_forecast
          .filter((data) => data.index_position === 1)
          .map(
            (filteredData) =>
              `${
                filteredData.total_forecast !== null
                  ? filteredData.total_forecast
                  : ""
              } -- ${filteredData.actual !== null ? filteredData.actual : ""}`
          ),
        currentMonth: row.qty_forecast
          .filter((data) => data.index_position === 2)
          .map(
            (filteredData) =>
              `${
                filteredData.total_forecast !== null
                  ? filteredData.total_forecast
                  : ""
              } -- ${filteredData.actual !== null ? filteredData.actual : ""}`
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

  const Tableheaders = [
    "Product",
    "Type",
    "Unit",
    `${months[lastMonth1]} -- ${
      lastMonth1 < currentMonth ? currentYear : currentYear - 1
    } Actual-Forecast`,
    `${months[lastMonth2]} -- ${
      lastMonth2 < currentMonth ? currentYear : currentYear - 1
    } Actual-Forecast`,
    `${months[currentMonth]} -- ${currentYear} Actual-Forecast`,
    `${months[nextMonth1]} - ${
      nextMonth1 > currentMonth ? currentYear : currentYear + 1
    } Forecast`,

    `${months[nextMonth2]} - ${
      nextMonth2 > currentMonth ? currentYear : currentYear + 1
    } Forecast`,

    `${months[nextMonth3]} - ${
      nextMonth3 > currentMonth ? currentYear : currentYear + 1
    } Forecast`,
  ];

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
                Product Wise Forecast
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
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </div>
  );
};

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
