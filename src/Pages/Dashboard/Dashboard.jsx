import React, { useEffect, useState } from "react";
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
import { Box, Button, Grid, TextField } from "@mui/material";
import { DailyProfitableReports } from "./DailyProfitableReports/DailyProfitableReports";
import DashboardService from "../../services/DashboardService";
import { useSelector } from "react-redux";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [orderBookSummary, setOrderBookSummary] = useState([]);
  const [currentOrderBookSummaryFM, setCurrentOrderBookSummaryFM] = useState(
    []
  );
  const [currentOrderBookSummaryRM, setCurrentOrderBookSummaryRM] = useState(
    []
  );
  const [currentSalesSummaryFM, setCurrentSalesSummaryFM] = useState([]);
  const [currentSalesSummaryRM, setCurrentSalesSummaryRM] = useState([]);
  const [salesPersonSummary, setSalesPersonSummary] = useState([]);
  const [
    dailyProfitableReportsFilterData,
    setDailyProfitableReportsFilterData,
  ] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
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
    { label: "Product Wise Turnover" },
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
      setOrderBookSummary(response.data.Order_Book_Summary);
      setCurrentOrderBookSummaryFM(response.data.Order_Book_FG);
      setCurrentOrderBookSummaryRM(response.data.Order_Book_RM);
      setCurrentSalesSummaryFM(response.data.Sales_Invoice_FG);
      setCurrentSalesSummaryRM(response.data.Sales_Invoice_RM);
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
      setDailyProfitableReportsFilterData(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Dashboard Filter By error", err);
    }
  };

  const getAllDashboardDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllDashboardData();
      setOrderBookSummary(response.data.Order_Book_Summary);
      setCurrentOrderBookSummaryFM(response.data.Order_Book_FG);
      setCurrentOrderBookSummaryRM(response.data.Order_Book_RM);
      setCurrentSalesSummaryFM(response.data.Sales_Invoice_FG);
      setCurrentSalesSummaryRM(response.data.Sales_Invoice_RM);
      setSalesPersonSummary(response.data.sales_summary);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
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
              <TextField
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
              <TextField
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
              <DailyProfitableReports
                dailyProfitableReportsFilterData={
                  dailyProfitableReportsFilterData
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
