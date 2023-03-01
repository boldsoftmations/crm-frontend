import React, { useState, useEffect } from "react";
import { BankDetails } from "../BankDetails/BankDetails";

import {
  Box,
  useTheme,
  Tab,
  Tabs,
  AppBar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { ContactDetails } from "../ContactDetails/ContactDetails";
import { WareHouseDetails } from "../WareHouseDetails/WareHouseDetails";
import { UpdateCompanyDetails } from "./UpdateCompanyDetails";
import CustomerServices from "../../../services/CustomerService";
import { SecurityChequesDetails } from "../SecurityCheckDetails/SecurityChequesDetails";
// import { ForecastView } from "../ForecastDetails/ForecastView";
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

export const UpdateAllCompanyDetails = (props) => {
  const [open, setOpen] = useState(false);
  const { setOpenPopup, getAllCompanyDetails, recordForEdit } = props;
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [securityChequedata, setSecurityChequeData] = useState([]);
  // const [forecastdata, setForecastData] = useState([]);
  // All Company Details Api
  useEffect(() => {
    if (recordForEdit) getAllCompanyDetailsByID();
  }, [recordForEdit]);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);

      setBankData(response.data.bank);
      setContactData(response.data.contacts);
      setWareHouseData(response.data.warehouse);
      setSecurityChequeData(response.data.security_cheque);
      // setForecastData(response.data.forecast);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Company" {...a11yProps(0)} />
          <Tab label="Bank" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
          <Tab label="WareHouse" {...a11yProps(3)} />
          <Tab label="Security Cheques" {...a11yProps(4)} />
          {/* <Tab label="Forecast" {...a11yProps(5)} /> */}
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <UpdateCompanyDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetails={getAllCompanyDetails}
          recordForEdit={recordForEdit}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <BankDetails
          bankData={bankData}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ContactDetails
          contactData={contactData}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <WareHouseDetails
          contactData={contactData}
          wareHousedata={wareHousedata}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <SecurityChequesDetails
          securityChequedata={securityChequedata}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      {/* <TabPanel value={value} index={5} dir={theme.direction}>
        <ForecastView
          forecastdata={forecastdata}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel> */}
    </div>
  );
};
