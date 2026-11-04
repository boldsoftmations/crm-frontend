import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import validatePincode from "../../../utility/validatePincode";
import {
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const UpdateWareHouseDetails = (props) => {
  const { IDForEdit, getAllCompanyDetailsByID, setOpenPopup, contactData } =
    props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    address: "",
    pincode: "",
    pin_code: "",
    city: "",
    state: "",
    contact: "",
  });
  const data = useSelector((state) => state.auth);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    getWareHouseDataByID();
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

  const handleContactChange = (event, value) => {
    setSelectedContact(value);
    setInputValue((prev) => {
      const cleared = clearPostalFields(prev);
      if (!value) {
        return { ...cleared, contact: "" };
      }
      return {
        ...cleared,
        contact: value.id,
        contact_name: value.name,
        contact_number: value.contact,
      };
    });
  };

  const getWareHouseDataByID = async () => {
    try {
      setOpen(true);

      const response = await CustomerServices.getWareHouseDataById(IDForEdit);
      const warehouse = response.data || {};

      /*
       * Loaded geo is unverified until lookup succeeds.
       * Auto-validate so non-address edits still save.
       */
      let nextValue = clearPostalFields({ ...warehouse });
      let contact = null;

      if (contactData && contactData.length > 0) {
        contact = contactData.find((item) => item.id === warehouse.contact);
        if (contact) {
          setSelectedContact(contact);
        }
      }

      setInputValue(nextValue);
      setOpen(false);

      if (contact && contact.country_id && nextValue.pincode) {
        try {
          const postalData = await validatePincode(
            contact.country_id,
            nextValue.pincode,
          );
          nextValue = applyPostalLookupSuccess(nextValue, postalData);
          setInputValue(nextValue);
        } catch (error) {
          setAlertMsg({
            message:
              error.message ||
              "Loaded postal code could not be verified. Please validate again.",
            severity: "warning",
            open: true,
          });
        }
      }
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const validatePinCode = async () => {
    try {
      if (!selectedContact || !selectedContact.country_id) {
        setAlertMsg({
          message: "Please select a contact before validating postal code",
          severity: "warning",
          open: true,
        });
        return;
      }

      setOpen(true);
      const response = await validatePincode(
        selectedContact.country_id,
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

  const updateWareHouseDetails = async (e) => {
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
            "Please validate the postal code before updating the warehouse",
          severity: "error",
          open: true,
        });
        return;
      }

      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedContact ? selectedContact.id : inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
      };
      await CustomerServices.updatetWareHouseData(IDForEdit, req);
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
        onSubmit={(e) => updateWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={selectedContact}
              onChange={handleContactChange}
              options={contactData || []}
              groupBy={(option) => option.designation || ""}
              getOptionLabel={(option) =>
                option ? `${option.name} ${option.contact}` : ""
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Update Contact"
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
              value={inputValue.address || ""}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              sx={{ minWidth: "300px" }}
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode || ""}
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
