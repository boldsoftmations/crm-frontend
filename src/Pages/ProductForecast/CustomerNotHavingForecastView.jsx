import React, { useEffect, useRef, useState } from "react";
import {
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
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { Popup } from "../../Components/Popup";
import { ForecastUpdate } from "../Cutomers/ForecastDetails/ForecastUpdate";
import { CustomTable } from "../../Components/CustomTable";
import { ProductForecastAssignTo } from "./ProductForecastAssignTo";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

export const CustomerNotHavingForecastView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [productNotHavingForecast, setProductNotHavingForecast] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [forecastDataByID, setForecastDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const csvLinkRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const UserData = useSelector((state) => state.auth.profile);
  const assigned = UserData.sales_users || [];

  const filterOption = [
    {
      label: "Company",
      value: "product_forecast__company__name",
    },
    {
      label: "Product",
      value: "product_forecast__product__name",
    },
    ...(!UserData.groups.includes("Sales Executive")
      ? [
          {
            label: "Sales Person",
            value: "product_forecast__sales_person__email",
          },
        ]
      : []),
    { label: "Search", value: "search" },
  ];

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setProductNotHavingForecast([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllProductionForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const openInPopup = (item) => {
    const matchedForecast = productNotHavingForecast.find(
      (forecast) => forecast.id === item.id
    );
    setForecastDataByID(matchedForecast);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    const matchedForecast = productNotHavingForecast.find(
      (forecast) => forecast.id === item.id
    );
    setForecastDataByID(matchedForecast);
    setOpenPopup2(true);
  };

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
            searchQuery || filterSelectedQuery
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

  const Tabledata = productNotHavingForecast.map((row) => {
    const tableRow = {
      id: row.id,
      company: row.company,
      sales_person: row.sales_person,
      product: row.product,
    };

    row.product_forecast.forEach((rowData, index) => {
      tableRow[`product_forecast_${index}`] =
        rowData.actual !== null
          ? `${rowData.actual}--${rowData.forecast}`
          : `-${rowData.forecast}`;
    });

    return tableRow;
  });

  const Tableheaders = [
    "ID",
    "Company",
    "Sales Person",
    "Product",
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
    "ACTION",
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
              {filterQuery === "product_forecast__sales_person__email" ? (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By Sales Person
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
                      <MenuItem key={i} value={option}>
                        {option}
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
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename={"Customer Not Having forecast.csv"}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
            </Box>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            openInPopup3={null}
            openInPopup4={null}
            ButtonText={"AssignTo"}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
          />
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
      <Popup
        title={"Product Forecast Assign To"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProductForecastAssignTo
          getAllCompanyDetailsByID={getAllProductionForecastDetails}
          setOpenPopup2={setOpenPopup2}
          forecastDataByID={forecastDataByID}
        />
      </Popup>
    </div>
  );
};
