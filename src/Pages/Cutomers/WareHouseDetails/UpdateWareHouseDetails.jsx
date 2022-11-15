import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Autocomplete
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import axios from "axios";

export const UpdateWareHouseDetails = (props) => {
  const { IDForEdit, getWareHouseDetailsByID, setOpenPopup,contactData } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);
  const [pinCodeData, setPinCodeData] = useState([]);
  const [selectedcontact, setSelectedContact] = useState("");
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const validatePinCode = async () => {
    try {
      setOpen(true);
      const PINCODE = inputValue.pincode;
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${PINCODE}`
      );
      setPinCodeData(response.data[0].PostOffice[0]);
      setOpen(false);
    } catch (error) {
      console.log("Creating Bank error ", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getWareHouseDataByID();
  }, []);

  const getWareHouseDataByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getWareHouseDataById(IDForEdit);
      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const UpdateWareHouseDetails = async (e) => {
    try {
      
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedcontact.name ? selectedcontact.name : inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: pinCodeData.State ? pinCodeData.State : inputValue.state,
        city: pinCodeData.District ? pinCodeData.District : inputValue.city,
      };
      await CustomerServices.updatetWareHouseData(IDForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getWareHouseDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };
  console.log("inputValue :>> ", inputValue);

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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateWareHouseDetails(e)}
      >
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="contact"
              label="Contact"
              variant="outlined"
              value={inputValue.contact ? inputValue.contact : ""}
            />
          </Grid>
 
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setSelectedContact(value)}
              options={contactData.map((option) => option)}
              groupBy={(option) => option.designation}
              getOptionLabel={(option) => option.name}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Update Contact" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              onChange={handleInputChange}
              size="small"
              name="address"
              label="Address"
              variant="outlined"
              value={inputValue.address ? inputValue.address : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ minWidth: "400px" }}
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
            />
            <Button
              onClick={() => validatePinCode()}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={pinCodeData.State ? pinCodeData.State : inputValue.state}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={
                pinCodeData.District ? pinCodeData.District : inputValue.city
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
