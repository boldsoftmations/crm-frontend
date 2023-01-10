import {
  Container,
  Paper,
  Box,
  Grid,
  Button,
  Tab,
  Typography,
  Tabs,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const paperStyle = { width: 340, margin: "20px auto" };
export const Auths = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Paper elevation={20} style={paperStyle}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="SIGN IN" {...a11yProps(0)} />
            <Tab label="SIGN UP" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Login />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SignUp handleChange={handleChange} />
          </TabPanel>
        </Box>
      </Paper>
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <>{children}</>
        </Box>
      )}
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
