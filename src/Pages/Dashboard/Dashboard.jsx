import React, { useEffect, useState, useReducer } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { OrderBookSummaryView } from "./OrderBookSummary/OrderBookSummaryView";
import { CurrentSummaryFM } from "./OrderBookSummary/CurrentSummaryFM";
import { CurrentSummaryRM } from "./OrderBookSummary/CurrentSummaryRM";
import { CurrentMonthFM } from "./SalesSummary/CurrentMonthFM";
import { CurrentMonthRM } from "./SalesSummary/CurrentMonthRM";
import InvoiceServices from "../../services/InvoiceService";
import { SalesPersonSummary } from "./SalesPersonSummary/SalesPersonSummary";
import { CustomTabs } from "../../Components/CustomTabs";
import { ProductWiseTurnover } from "./ProductWiseTurnover/ProductWiseTurnover";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DailyProfitableReports } from "./DailyProfitableReports/DailyProfitableReports";
import DashboardService from "../../services/DashboardService";
import { useSelector } from "react-redux";
import { Popup } from "../../Components/Popup";
import { DescriptionWiseTurnover } from "./DescriptionWiseTurnover/DescriptionWiseTurnover";
import CustomTextField from "../../Components/CustomTextField";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    orderBookSummary,
    currentOrderBookSummaryFM,
    currentOrderBookSummaryRM,
    currentSalesSummaryFM,
    currentSalesSummaryRM,
    salesPersonSummary,
    dailyProfitableReportsFilterData,
    descriptionWiseTurnoverFilterData,
    salesData,
  } = state;

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "Today") {
      const today = new Date();
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setEndDate(yesterday);
      setStartDate(yesterday);
    } else if (selectedValue === "Last 7 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last 30 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "This Month") {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last Month") {
      const endDate = new Date();
      endDate.setDate(0);
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Custom Date") {
      // Handle custom date logic, for example:
      setStartDate(new Date());
      setEndDate(new Date());
      setOpenPopup(true);
    }
  };

  const getResetData = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "OrderBook Summary" },
    { label: "Current OrderBook(Finish Good)" },
    { label: "Current OrderBook(Raw Material)" },
    { label: "Current Month Sales(Finish Good)" },
    { label: "Current Month Sales(Raw Material)" },
    { label: "Sales Person Summary" },
    { label: "Forecast Turnover" },
    { label: "Description Wise Turnover" },
    ...(userData.email === "devannsh@glutape.com" ||
    userData.email === "mahesh@glutaoe.com" ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Accounts Executive")
      ? [{ label: "Daily Profitability Report" }]
      : []),
  ];

  useEffect(() => {
    getAllDashboardDetails();
  }, []);

  useEffect(() => {
    getFilterByDashboard();
    getFilterByDailyProfitableReports();
    getFilterByDescriptionWiseTurnover();
  }, [startDate, endDate]);

  const getFilterByDashboard = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      let response = await InvoiceServices.getFilterDashboardData(
        StartDate,
        EndDate
      );
      dispatch({
        type: "SET_ORDER_BOOK_SUMMARY",
        payload: response.data.Order_Book_Summary,
      });
      dispatch({
        type: "SET_CURRENT_ORDER_BOOK_SUMMARY_FM",
        payload: response.data.Order_Book_FG,
      });
      dispatch({
        type: "SET_CURRENT_ORDER_BOOK_SUMMARY_RM",
        payload: response.data.Order_Book_RM,
      });
      dispatch({
        type: "SET_CURRENT_SALES_SUMMARY_FM",
        payload: response.data.Sales_Invoice_FG,
      });
      dispatch({
        type: "SET_CURRENT_SALES_SUMMARY_RM",
        payload: response.data.Sales_Invoice_RM,
      });
      // setSalesPersonSummary(response.data.sales_summary);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Dashboard Filter By error", err);
    }
  };

  const getFilterByDailyProfitableReports = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      let response =
        await DashboardService.getDailyProfitableReportsDataByFilter(
          StartDate,
          EndDate
        );
      dispatch({
        type: "SET_DAILY_PROFITABLE_REPORTS_FILTER_DATA",
        payload: response.data,
      });
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Dashboard Filter By error", err);
    }
  };

  const getFilterByDescriptionWiseTurnover = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      let response =
        await DashboardService.getDescriptionWiseTurnoverDataByFilter(
          StartDate,
          EndDate
        );
      dispatch({
        type: "SET_DESCRIPTION_WISE_TURNOVER_FILTER_DATA",
        payload: response.data.description_wise_turnover,
      });

      dispatch({
        type: "SET_SALES_DATA",
        payload: response.data.sales_data,
      });
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Description wise turnover Filter By error", err);
    }
  };

  const getAllDashboardDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllDashboardData();
      dispatch({
        type: "SET_ORDER_BOOK_SUMMARY",
        payload: response.data.Order_Book_Summary,
      });
      dispatch({
        type: "SET_CURRENT_ORDER_BOOK_SUMMARY_FM",
        payload: response.data.Order_Book_FG,
      });
      dispatch({
        type: "SET_CURRENT_ORDER_BOOK_SUMMARY_RM",
        payload: response.data.Order_Book_RM,
      });
      dispatch({
        type: "SET_CURRENT_SALES_SUMMARY_FM",
        payload: response.data.Sales_Invoice_FG,
      });
      dispatch({
        type: "SET_CURRENT_SALES_SUMMARY_RM",
        payload: response.data.Sales_Invoice_RM,
      });
      dispatch({
        type: "SET_SALES_PERSON_SUMMARY",
        payload: response.data.sales_summary,
      });
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Dashboard error", err);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
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
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small">Date</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  label="Date"
                  onChange={(event) => handleChange(event)}
                >
                  {DateOptions.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <div>
          {activeTab === 0 && (
            <div>
              {" "}
              <OrderBookSummaryView orderBookSummary={orderBookSummary} />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <CurrentSummaryFM
                currentOrderBookSummaryFM={currentOrderBookSummaryFM}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <CurrentSummaryRM
                currentOrderBookSummaryRM={currentOrderBookSummaryRM}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <CurrentMonthFM currentSalesSummaryFM={currentSalesSummaryFM} />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <CurrentMonthRM currentSalesSummaryRM={currentSalesSummaryRM} />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <SalesPersonSummary salesPersonSummary={salesPersonSummary} />
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <ProductWiseTurnover />
            </div>
          )}
          {activeTab === 7 && (
            <div>
              <DescriptionWiseTurnover
                descriptionWiseTurnoverFilterData={
                  descriptionWiseTurnoverFilterData
                }
                salesData={salesData}
              />
            </div>
          )}
          {activeTab === 8 && (
            <div>
              <DailyProfitableReports
                dailyProfitableReportsFilterData={
                  dailyProfitableReportsFilterData
                }
              />
            </div>
          )}
        </div>
      </div>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
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
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                min={minDate}
                max={maxDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                min={
                  startDate ? startDate.toISOString().split("T")[0] : minDate
                }
                max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetData}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popup>
    </div>
  );
}

const DateOptions = [
  {
    value: "Today",
  },
  {
    value: "Yesterday",
  },
  {
    value: "Last 7 Days",
  },
  {
    value: "Last 30 Days",
  },
  {
    value: "This Month",
  },
  {
    value: "Last Month",
  },
  {
    value: "Custom Date",
  },
];

// Define initial state for the reducer
const initialState = {
  orderBookSummary: [],
  currentOrderBookSummaryFM: [],
  currentOrderBookSummaryRM: [],
  currentSalesSummaryFM: [],
  currentSalesSummaryRM: [],
  salesPersonSummary: [],
  dailyProfitableReportsFilterData: [],
  descriptionWiseTurnoverFilterData: [],
  salesData: [],
};

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDER_BOOK_SUMMARY":
      return { ...state, orderBookSummary: action.payload };
    case "SET_CURRENT_ORDER_BOOK_SUMMARY_FM":
      return { ...state, currentOrderBookSummaryFM: action.payload };
    case "SET_CURRENT_ORDER_BOOK_SUMMARY_RM":
      return { ...state, currentOrderBookSummaryRM: action.payload };
    case "SET_CURRENT_SALES_SUMMARY_FM":
      return { ...state, currentSalesSummaryFM: action.payload };
    case "SET_CURRENT_SALES_SUMMARY_RM":
      return { ...state, currentSalesSummaryRM: action.payload };
    case "SET_SALES_PERSON_SUMMARY":
      return { ...state, salesPersonSummary: action.payload };
    case "SET_DAILY_PROFITABLE_REPORTS_FILTER_DATA":
      return { ...state, dailyProfitableReportsFilterData: action.payload };
    case "SET_DESCRIPTION_WISE_TURNOVER_FILTER_DATA":
      return { ...state, descriptionWiseTurnoverFilterData: action.payload };
    case "SET_SALES_DATA":
      return { ...state, salesData: action.payload };
    default:
      return state;
  }
};
