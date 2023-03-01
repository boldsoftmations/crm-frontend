import React, { useState, useEffect } from "react";

import { Box, useTheme, Tab, Tabs, AppBar } from "@mui/material";
import PropTypes from "prop-types";
import CustomerServices from "../../../services/CustomerService";
import { BankDetails } from "./../BankDetails/BankDetails";
import { ContactDetails } from "./../ContactDetails/ContactDetails";
import { WareHouseDetails } from "./../WareHouseDetails/WareHouseDetails";
import { SecurityChequesDetails } from "./../SecurityCheckDetails/SecurityChequesDetails";
import { useDispatch } from "react-redux";
import { getCompanyName } from "../../../Redux/Action/Action";
import { CustomLoader } from "../../../Components/CustomLoader";
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

export const CreateAllCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails, recordForEdit } = props;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [securityChequedata, setSecurityChequeData] = useState([]);
  const dispatch = useDispatch();
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
          <Tab label="Bank" {...a11yProps(0)} />
          <Tab label="Contact" {...a11yProps(1)} />
          <Tab label="WareHouse" {...a11yProps(2)} />
          <Tab label="Security Cheques" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <BankDetails
          bankData={bankData}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ContactDetails
          contactData={contactData}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <WareHouseDetails
          contactData={contactData}
          wareHousedata={wareHousedata}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <SecurityChequesDetails
          securityChequedata={securityChequedata}
          open={open}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </TabPanel>
    </div>
  );
};
