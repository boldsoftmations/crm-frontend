import React, { useRef, useState } from "react";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";

export const CreateWareHouseInventoryDetails = (props) => {
  const { setOpenPopup, getAllVendorDetailsByID, contactData,vendorData } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [pinCodeData, setPinCodeData] = useState(null);
  const [selectedcontact, setSelectedContact] = useState("");
  const data = useSelector((state) => state.auth);
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

  const createWareHouseDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        vendor: data ? data.vendorName : "",
        contact: selectedcontact.id,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: pinCodeData.State,
        city: pinCodeData.District,
      };
      await InventoryServices.createWareHouseInventoryData(req);
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
        onSubmit={(e) => createWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
                <TextField {...params} label="Contact" />
              )}
            />
          </Grid>
          {vendorData.type === "Domestic" ? (
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode}
              onChange={handleInputChange}
              onBlur={handleInputChange}
            />
          </Grid>
          ) : null }
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              onChange={handleInputChange}
              size="small"
              name="address"
              label="Address"
              variant="outlined"
              value={inputValue.address}
            />
          </Grid>

          {pinCodeData ? (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="state"
                  label="State"
                  variant="outlined"
                  value={pinCodeData.State ? pinCodeData.State : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  name="city"
                  label="City"
                  variant="outlined"
                  value={pinCodeData.District ? pinCodeData.District : ""}
                />
              </Grid>
            </>
          ) : null}
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
