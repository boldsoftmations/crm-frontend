import React, { useState, useEffect } from "react";

import { Box, useTheme, Tab, Tabs, AppBar } from "@mui/material";
import PropTypes from "prop-types";
import { CustomLoader } from "../../../Components/CustomLoader";
import { BankInventoryDetails } from "../BanksInventoryDetail/BankInventoryDetails";
import { ContactInventoryDetails } from "../ContactInventoryDetail/ContactInventoryDetails";
import InventoryServices from "../../../services/InventoryService";
import { WareHouseInventoryDetails } from "../WareHouseInventoryDetail/WareHouseInventoryDetails";
import { getVendorName } from "../../../Redux/Action/Action";
import { useDispatch } from "react-redux";
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

export const CreateAllVendorDetails = (props) => {
  const { recordForEdit } = props;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const dispatch = useDispatch();
  // All Company Details Api
  useEffect(() => {
    if (recordForEdit) getAllVendorDetailsByID();
  }, [recordForEdit]);

  const getAllVendorDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getVendorDataById(recordForEdit);
      setVendorData(response.data);
      setBankData(response.data.bank);
      setContactData(response.data.contacts);
      setWareHouseData(response.data.warehouse);
      dispatch(getVendorName(response.data.name));
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
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <BankInventoryDetails
          vendorData={vendorData}
          bankData={bankData}
          open={open}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ContactInventoryDetails
          vendorData={vendorData}
          contactData={contactData}
          open={open}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <WareHouseInventoryDetails
          vendorData={vendorData}
          contactData={contactData}
          wareHousedata={wareHousedata}
          open={open}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </TabPanel>
    </div>
  );
};
