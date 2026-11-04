import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

import CustomSnackbar from "../../../Components/CustomerSnackbar";
import validatePincode from "../../../utility/validatePincode";
import {
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const CreateWareHouseDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID, contactData } = props;
  const [open, setOpen] = useState(false);
  const [selectedcontact, setSelectedContact] = useState("");
  const data = useSelector((state) => state.auth);

  const [inputValue, setInputValue] = useState({
    address: "",
    pincode: "",
    pin_code: "",
    city: "",
    state: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "pincode") {
      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        pincode: value,
      }));
      return;
    }
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleContactChange = (event, value) => {
    setSelectedContact(value);
    setInputValue((prev) => clearPostalFields(prev));
  };

  const validatePinCode = async () => {
    try {
      if (!selectedcontact || !selectedcontact.country_id) {
        setAlertMsg({
          message: "Please select a contact before validating postal code",
          severity: "warning",
          open: true,
        });
        return;
      }

      setOpen(true);
      const response = await validatePincode(
        selectedcontact.country_id,
        inputValue.pincode,
      );

      setInputValue((prev) => applyPostalLookupSuccess(prev, response));
      setAlertMsg({
        message: "Postal code validated successfully",
        severity: "success",
        open: true,
      });
    } catch (error) {
      setInputValue((prev) => clearPostalFields(prev));
      setAlertMsg({
        message: error.message || "Error validating postal code",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const createWareHouseDetails = async (e) => {
    try {
      e.preventDefault();

      if (!inputValue.address || !String(inputValue.address).trim()) {
        setAlertMsg({
          message: "Address is required",
          severity: "error",
          open: true,
        });
        return;
      }

      if (!inputValue.pin_code || !inputValue.city || !inputValue.state) {
        setAlertMsg({
          message:
            "Please validate the postal code before creating the warehouse",
          severity: "error",
          open: true,
        });
        return;
      }

      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedcontact.id,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
      };
      await CustomerServices.createWareHouseData(req);
      setOpenPopup(false);
      getAllCompanyDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={handleContactChange}
              options={contactData.map((option) => option)}
              groupBy={(option) => option.designation}
              getOptionLabel={(option) => `${option.name} ${option.contact}`}
              renderInput={(params) => (
                <CustomTextField {...params} label="Contact" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
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
          <Grid item xs={12} sm={12}>
            <CustomTextField
              sx={{ minWidth: "300px" }}
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              value={inputValue.pincode}
            />
            <Button
              onClick={validatePinCode}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              disabled
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
