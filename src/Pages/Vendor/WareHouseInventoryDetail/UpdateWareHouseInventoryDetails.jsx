import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";

import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import validatePincode from "../../../utility/validatePincode";
import {
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const UpdateWareHouseInventoryDetails = (props) => {
  const {
    IDForEdit,
    getAllVendorDetailsByID,
    setOpenPopup,
    contactData,
    vendorData,
  } = props;
  const isDomestic = vendorData && vendorData.type === "Domestic";
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(() =>
    isDomestic ? clearPostalFields({ ...IDForEdit }) : { ...IDForEdit },
  );
  const data = useSelector((state) => state.auth);
  const [selectedcontact, setSelectedContact] = useState("");
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  useEffect(() => {
    const autoValidateLoadedPincode = async () => {
      if (!isDomestic || !IDForEdit || !IDForEdit.pincode) {
        return;
      }
      if (!vendorData || !vendorData.country_id) {
        return;
      }

      try {
        setOpen(true);
        const postalData = await validatePincode(
          vendorData.country_id,
          IDForEdit.pincode,
        );
        setInputValue((prev) => applyPostalLookupSuccess(prev, postalData));
      } catch (error) {
        setAlertMsg({
          message:
            error.message ||
            "Loaded postal code could not be verified. Please validate again.",
          severity: "warning",
          open: true,
        });
      } finally {
        setOpen(false);
      }
    };

    autoValidateLoadedPincode();
  }, []);

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

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

  const validatePinCode = async () => {
    try {
      if (!vendorData || !vendorData.country_id) {
        setAlertMsg({
          message: "Vendor country is required before validating postal code",
          severity: "warning",
          open: true,
        });
        return;
      }

      setOpen(true);
      const response = await validatePincode(
        vendorData.country_id,
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

  const UpdateWareHouseDetails = async (e) => {
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

      if (
        isDomestic &&
        (!inputValue.pin_code || !inputValue.city || !inputValue.state)
      ) {
        setAlertMsg({
          message:
            "Please validate the postal code before updating the warehouse",
          severity: "error",
          open: true,
        });
        return;
      }

      setOpen(true);
      const req = {
        vendor: data ? data.vendorName : "",
        contact: selectedcontact.id ? selectedcontact.id : inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode || "",
        state: inputValue.state || "",
        city: inputValue.city || "",
      };
      await InventoryServices.updatetWareHouseInventoryData(inputValue.id, req);
      setOpenPopup(false);
      getAllVendorDetailsByID();
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
        onSubmit={(e) => UpdateWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
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
          {isDomestic ? (
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                fullWidth
                size="small"
                id="grouped-demo"
                onChange={(event, value) => setSelectedContact(value)}
                options={contactData.map((option) => option)}
                groupBy={(option) => option.designation}
                getOptionLabel={(option) => `${option.name} ${option.contact}`}
                label="Update Contact"
              />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <CustomTextField
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
          {isDomestic ? (
            <>
              <Grid item xs={12} sm={8}>
                <CustomTextField
                  fullWidth
                  name="pincode"
                  size="small"
                  label="Pin Code"
                  variant="outlined"
                  value={inputValue.pincode ? inputValue.pincode : ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={validatePinCode}
                  disabled={!inputValue.pincode}
                  sx={{ height: "40px" }}
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
