import { Tab, Tabs, AppBar, Box, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import PropTypes from "prop-types";
import { OrderBookSummaryView } from "./OrderBookSummary/OrderBookSummaryView";
import { CurrentSummaryFM } from "./OrderBookSummary/CurrentSummaryFM";
import { CurrentSummaryRM } from "./OrderBookSummary/CurrentSummaryRM";
import { CurrentMonthFM } from "./SalesSummary/CurrentMonthFM";
import { CurrentMonthRM } from "./SalesSummary/CurrentMonthRM";
import InvoiceServices from "../../services/InvoiceService";
import { SalesPersonSummary } from "./SalesPersonSummary/SalesPersonSummary";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
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
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getAllDashboardDetails();
  }, []);

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
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="OrderBook Summary" {...a11yProps(0)} />
          <Tab label="Current OrderBook(Finish Good)" {...a11yProps(1)} />
          <Tab label="Current OrderBook(Raw Material)" {...a11yProps(2)} />
          <Tab label="Current Month Sales(Finish Good)" {...a11yProps(3)} />
          <Tab label="Current Month Sales(Raw Material)" {...a11yProps(4)} />
          <Tab label="Sales Person Summary" {...a11yProps(5)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <OrderBookSummaryView orderBookSummary={orderBookSummary} />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <CurrentSummaryFM
          currentOrderBookSummaryFM={currentOrderBookSummaryFM}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <CurrentSummaryRM
          currentOrderBookSummaryRM={currentOrderBookSummaryRM}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <CurrentMonthFM currentSalesSummaryFM={currentSalesSummaryFM} />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <CurrentMonthRM currentSalesSummaryRM={currentSalesSummaryRM} />
      </TabPanel>
      <TabPanel value={value} index={5} dir={theme.direction}>
        <SalesPersonSummary salesPersonSummary={salesPersonSummary} />
      </TabPanel>
    </div>
  );
}
