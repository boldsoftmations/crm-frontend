import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomTable } from "../../../Components/CustomTable";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import { Popup } from "../../../Components/Popup";
import InvoiceServices from "../../../services/InvoiceService";

const StockRportView = () => {
  const [open, setOpen] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [productType, setProductType] = useState("finished-goods");
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [stateData, setStateData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [state, setSate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [customDataPopup, setCustomDataPopup] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("Today");
  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getStockReportData(
        state ? state.id : 1,
        productType,
        StartDate,
        EndDate,
        searchQuery,
      );
      setStoresInventoryData(response.data);
      console.log(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (stateData.length > 0) {
      const defaultState = stateData.find(
        (item) => item.unit === "M1" && item.id === 1,
      );
      setSate(defaultState || null);
    }
  }, [stateData]);

  const getSubmitDate = () => {
    // setIsToday(!isToday);
    setCustomDataPopup(false);
  };
  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllSellerAccountData();
      setStateData(response.data.results);
      console.log("resData :", response.data.results);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
  const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";

  useEffect(() => {
    getAllStoresInventoryDetails();
  }, [state, productType, isToday, customDataPopup, searchQuery]);
  const handleReset = () => {
    setSearchQuery("");
  };
  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };
  const handleChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Today") {
      const today = new Date();
      setIsToday(!isToday);
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Custom Date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setCustomDataPopup(true);
    }
  };

  console.log(storesInventoryData);
  // Filter the productionInventoryData based on the search query
  // const filteredData =
  //   storesInventoryData &&
  //   storesInventoryData.filter(
  //     (row) =>
  //       row.product__name &&
  //       row.product__name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  const Tableheaders = [
    "DATE",
    "UNIT",
    "PRODUCT",
    "OPEING STOCK",
    "ORDERBOOK STOCK",
    "INVOICED STOCK",
    "CLOSE STOCK",
    "AVAILABLE STOCK",
  ];

  // available_stock: "40.00";
  // closing_stock: "40.00";
  // date: "2026-01-27";
  // invoiced_stock: "0.00";
  // opening_stock: "40.00";
  // orderbook_stock: "0.00";
  // product: "39C08-GREY-GPX-12x9-240-P1";
  // seller_account: "M1";
  // unit: "CTN";
  const headers = [
    { label: "DATE", key: "date" },
    { label: "UNIT", key: "unit" },
    { label: "PRODUCT", key: "product" },
    // { label: "SELLER UNIT", key: "seller_account" },
    { label: "OPEING STOCK", key: "opening_stock" },

    { label: "ORDERBOOK STOCK", key: "orderbook_stock" },
    { label: "INVOICED STOCK", key: "invoiced_stock" },
    { label: "CLOSE STOCK", key: "closing_stock" },

    { label: "AVAILABLE STOCK", key: "available_stock" },
  ];
  const DateOptions = ["Today", "Custom Date"];

  const data =
    storesInventoryData &&
    storesInventoryData.map((row) => {
      return {
        date: row.date,

        unit: row.unit,
        product: row.product,
        opening_stock: row.opening_stock,
        orderbook_stock: row.orderbook_stock,
        // total_stock: row.total_stock,
        invoiced_stock: row.invoiced_stock,
        closing_stock: row.closing_stock,

        available_stock: row.available_stock,
      };
    });
  // const stateOption = ["M1", "M2", "D1", "T1", "BS1"];
  const ProductType = ["finished-goods", "raw-materials", "consumables"];
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
        <Grid item xs={12} md={7}>
          <Box display="flex" gap="1rem" marginBottom="1rem">
            <CustomAutocomplete
              fullWidth
              size="small"
              value={state}
              onChange={(e, value) => setSate(value)}
              options={stateData || []}
              getOptionLabel={(option) => (option ? option.unit : "")}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Select a State"
            />

            <CustomAutocomplete
              fullWidth
              size="small"
              disablePortal
              id="combo-box-start-month"
              value={productType}
              onChange={(e, value) => setProductType(value)} // Convert to 0-indexed
              options={ProductType.map((option) => option)}
              getOptionLabel={(option) => option}
              label="Select Product Type"
            />

            <CustomAutocomplete
              fullWidth
              size="small"
              onChange={(event, newValue) => handleChange(newValue)}
              options={DateOptions.map((option) => option)}
              getOptionLabel={(option) => option}
              label="Filter By Date" // Passed directly to CustomAutocomplete
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box sx={{ flexGrow: 1, maxWidth: "400px" }}>
              <SearchComponent
                onSearch={handleSearch}
                size="small"
                onReset={handleReset}
              />
            </Box>
            <Typography
              variant="h3"
              sx={{
                flexGrow: 2,
                textAlign: "center",
                margin: "0",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                minWidth: "150px",
              }}
            >
              Stock Report
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
              }}
            >
              <CSVLink
                data={data}
                headers={headers}
                filename={"Low Stock Alerts.csv"}
                target="_blank"
                style={{ textDecoration: "none", outline: "none" }}
              >
                <Button variant="contained">Download CSV</Button>
              </CSVLink>
            </Box>
          </Box>
        </Grid>

        <CustomTable Isviewable={false} headers={Tableheaders} data={data} />
      </Paper>
      <Popup
        openPopup={customDataPopup}
        setOpenPopup={setCustomDataPopup}
        title="Date Filter"
        maxWidth="md"
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            padding: "20px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                // min={minDate}
                // max={maxDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                // min={startDate ? startDate : minDate}
                // max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getSubmitDate}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetDate}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popup>
    </>
  );
};
export default StockRportView;
