import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";

export const UpdateWareHouseDetails = (props) => {
  const { IDForEdit, getWareHouseDetailsByID, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  // const [contact, setContact] = useState([]);
  const data = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  // useEffect(() => {
  //   getAllCompanyDetails();
  // }, []);

  // const getAllCompanyDetails = async () => {
  //   try {
  //     setOpen(true);
  //     const response = await CustomerServices.getAllContactData();
  //     setContact(response.data.results);
  //     setOpen(false);
  //   } catch (err) {
  //     setOpen(false);
  //   }
  // };

  useEffect(() => {
    getWareHouseDataByID();
  }, []);

  const getWareHouseDataByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getWareHouseDataById(IDForEdit);
      console.log("response update warehouse", response);
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
        contact: inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="contact"
              label="Contact"
              variant="outlined"
              value={inputValue.contact ? inputValue.contact : ""}
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state ? inputValue.state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={inputValue.city ? inputValue.city : ""}
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
