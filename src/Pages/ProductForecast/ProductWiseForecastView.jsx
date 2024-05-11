import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, Box, Paper, Grid } from "@mui/material";
import { CSVLink } from "react-csv";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomTable } from "../../Components/CustomTable";
import CustomTextField from "../../Components/CustomTextField";

export const ProductWiseForecastView = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [productWiseForecast, setProductWiseForecast] = useState([]);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

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

  const headers = [
    { key: "description", label: "Description" },
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
      const response =
        await ProductForecastService.getAllProductWiseForecastData(
          "all",
          searchQuery
        );

      const data = response.data
        .filter((row) => row.qty_forecast.length > 0) // Filter rows with non-empty qty_forecast array
        .map((row) => {
          return {
            description: row.product__description__name,
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

  useEffect(() => {
    getAllProductWiseForecastDetails(currentPage);
  }, [currentPage, getAllProductWiseForecastDetails]);

  const getAllProductWiseForecastDetails = useCallback(
    async (page, query = searchQuery) => {
      try {
        setOpen(true);
        const response =
          await ProductForecastService.getAllProductWiseForecastData(
            page,
            query
          );
        setProductWiseForecast(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching Customer Having Forecast", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tabledata = productWiseForecast
    .filter((row) => row.qty_forecast.length > 0) // Filter rows with non-empty qty_forecast array
    .map((row) => {
      return {
        description: row.product__description__name,
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
    "Description",
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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
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
                    getAllProductWiseForecastDetails(currentPage, searchQuery)
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
                    getAllProductWiseForecastDetails(1, "");
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
                    filename={"Product Wise forecast.csv"}
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
              Product Wise Forecast
            </h3>
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
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
    </div>
  );
};
