import React, { useState, useEffect } from "react";
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
import { BankInventoryDetails } from "../BanksInventoryDetail/BankInventoryDetails";
import { ContactInventoryDetails } from "../ContactInventoryDetail/ContactInventoryDetails";
import { WareHouseInventoryDetails } from "../WareHouseInventoryDetail/WareHouseInventoryDetails";
import { UpdateVendorDetails } from "./UpdateVendorDetails";
import InventoryServices from "../../../services/InventoryService";

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

export const UpdateAllVendorDetails = (props) => {
  const [open, setOpen] = useState(false);
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
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
          <Tab label="Vendor" {...a11yProps(0)} />
          <Tab label="Bank" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
          <Tab label="WareHouse" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <UpdateVendorDetails
          setOpenPopup={setOpenPopup}
          getAllVendorDetails={getAllVendorDetails}
          recordForEdit={recordForEdit}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <BankInventoryDetails
          vendorData={vendorData}
          bankData={bankData}
          open={open}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ContactInventoryDetails
          contactData={contactData}
          vendorData={vendorData}
          open={open}
          getAllVendorDetailsByID={getAllVendorDetailsByID}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
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
