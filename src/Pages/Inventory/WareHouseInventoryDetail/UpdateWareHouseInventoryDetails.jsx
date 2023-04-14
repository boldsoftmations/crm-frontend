import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid, TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";

export const UpdateWareHouseInventoryDetails = (props) => {
  const {
    IDForEdit,
    getAllVendorDetailsByID,
    setOpenPopup,
    contactData,
    vendorData,
  } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);
  const [pinCodeData, setPinCodeData] = useState([]);
  const [selectedcontact, setSelectedContact] = useState("");
  const timeoutRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });

    if (name === "pincode") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        validatePinCode(value);
      }, 500);
    }
  };

  const validatePinCode = async (pinCode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      setPinCodeData(response.data[0].PostOffice[0]);
    } catch (error) {
      console.log("Creating Bank error ", error);
    }
  };

  useEffect(() => {
    getWareHouseDataByID();
  }, []);

  const getWareHouseDataByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getWareHouseInventoryDataById(
        IDForEdit
      );
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
        vendor: data ? data.vendorName : "",
        contact: selectedcontact.id ? selectedcontact.id : inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: pinCodeData.State ? pinCodeData.State : inputValue.state,
        city: pinCodeData.District ? pinCodeData.District : inputValue.city,
      };
      await InventoryServices.updatetWareHouseInventoryData(IDForEdit, req);
      setOpenPopup(false);
      getAllVendorDetailsByID();
      setOpen(false);
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="contact"
              label="Contact"
              variant="outlined"
              value={
                inputValue.contact_name
                  ? `${inputValue.contact_name} ${inputValue.contact_number}`
                  : ""
              }
            />
          </Grid>
          {vendorData.type === "Domestic" ? (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                size="small"
                id="grouped-demo"
                onChange={(event, value) => setSelectedContact(value)}
                options={contactData.map((option) => option)}
                groupBy={(option) => option.designation}
                getOptionLabel={(option) => `${option.name} ${option.contact}`}
                // sx={{ minWidth: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Update Contact" />
                )}
              />
            </Grid>
          ) : null}
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
              fullWidth
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
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
