import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const UpdateWareHouseDetails = (props) => {
  const { IDForEdit, getAllCompanyDetailsByID, setOpenPopup, contactData } =
    props;
  console.log("Data is: ", IDForEdit);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [selectedContact, setSelectedContact] = useState(null);

  const [isDisabledBtn, setIsDisabledBtn] = useState(false);
  // const [SelectedContactId, setSelectedContactId] = useState(null);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });

    if (name === "pincode") {
      setIsDisabledBtn(true);
    }
  };

  useEffect(() => {
    getWareHouseDataByID();
  }, []);

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getWareHouseDataByID = async () => {
    try {
      setOpen(true);

      const response = await CustomerServices.getWareHouseDataById(IDForEdit);

      const warehouse = response.data;

      setInputValue(warehouse);

      // Find current contact and pre-select it
      if (contactData && contactData.length > 0) {
        const contact = contactData.find(
          (item) => item.id === warehouse.contact,
        );

        if (contact) {
          setSelectedContact(contact);
        }
      }

      setOpen(false);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };

  const validatePinCode = async () => {
    try {
      const countryId =
        selectedContact && selectedContact.country_id
          ? selectedContact.country_id
          : "";

      if (!countryId) {
        setAlertMsg({
          message: "Please select a contact.",
          severity: "warning",
          open: true,
        });
        return;
      }

      setOpen(true);

      const response = await MasterService.ValidatePincode(
        countryId,
        inputValue.pincode,
      );

      if (!response.data) {
        setAlertMsg({
          message:
            "This Pin Code does not exist! First create it in the master.",
          severity: "warning",
          open: true,
        });

        setInputValue((prev) => ({
          ...prev,
          state: "",
          city: "",
        }));
        // Disable the button if the pin code is invalid
      } else {
        setAlertMsg({
          message: "Pin code is valid.",
          severity: "success",
          open: true,
        });

        setInputValue((prev) => ({
          ...prev,
          state: response.data.state_name,
          city: response.data.city_name,
        }));
        setIsDisabledBtn(false);
      }
    } catch (error) {
      console.log(error);

      setAlertMsg({
        message: "Error validating pincode.",
        severity: "error",
        open: true,
      });
      setIsDisabledBtn(true);
    } finally {
      setOpen(false);
    }
  };

  const UpdateWareHouseDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedContact ? selectedContact.id : inputValue.contact,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state || "",
        city: inputValue.city || "",
      };
      await CustomerServices.updatetWareHouseData(IDForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllCompanyDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
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
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={selectedContact}
              onChange={(event, value) => {
                setSelectedContact(value);
                // Need validation again
                setIsDisabledBtn(true);
                if (value) {
                  setInputValue((prev) => ({
                    ...prev,
                    contact: value.id,
                    contact_name: value.name,
                    contact_number: value.contact,
                  }));
                }
              }}
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
              value={inputValue.address ? inputValue.address : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode || ""}
            />
            {/* <Button
              onClick={() => validatePinCode()}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={validatePinCode}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
              disabled={!inputValue.pincode}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isDisabledBtn}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
