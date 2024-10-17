import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";

export const CreatePincode = ({ getMasterPincode, setOpenPopup }) => {
  const [open, setOpen] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [inputValue, setInputValue] = useState({
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setAlertMsg((prev) => ({ ...prev, open: false }));
  };

  // Fetch all countries on component mount
  const getAllMasterCountries = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getAllMasterCountries("all", null);
      setCountryOptions(response.data);
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllMasterCountries();
  }, []);

  // Fetch states based on selected country
  const getStatesByCountry = async (country) => {
    try {
      setOpen(true);
      const response = await MasterService.getAllMasterStates(
        "all",
        "",
        country
      );
      setStateOptions(response.data);
      setCityOptions([]); // Clear city options when country changes
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Error fetching states",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  // Fetch cities based on selected state
  const getCitiesByState = async (state) => {
    try {
      setOpen(true);
      const response = await MasterService.getMasterCities(
        "all",
        "",
        inputValue.country,
        state
      );
      setCityOptions(response.data);
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Error fetching cities",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { city, pincode } = inputValue;

    if (!city || !pincode) {
      setAlertMsg({
        message: "Please fill all required fields",
        severity: "warning",
        open: true,
      });
      return;
    }

    try {
      setOpen(true);
      const payload = {
        pincode: inputValue.pincode,
        city: inputValue.city,
        state: inputValue.state,
        country: inputValue.country,
      };
      await MasterService.createMasterPincode(payload);
      setAlertMsg({
        message: "Pincode created successfully!",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenPopup(false);
        getMasterPincode();
      }, 500);
    } catch (error) {
      setAlertMsg({
        message:
          (error && error.response.data.message) || "Error creating pincode",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  // Handle country change and fetch states
  const handleCountryChange = (e, value) => {
    setInputValue((prev) => ({ ...prev, country: value, state: "", city: "" }));
    if (value) {
      getStatesByCountry(value);
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  };

  // Handle state change and fetch cities
  const handleStateChange = (e, value) => {
    setInputValue((prev) => ({ ...prev, state: value, city: "" }));
    if (value) {
      getCitiesByState(value);
    } else {
      setCityOptions([]);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="country"
              size="small"
              disablePortal
              id="country-select"
              options={countryOptions.map((option) => option.name)}
              onChange={handleCountryChange}
              getOptionLabel={(option) => option}
              fullWidth
              label="Country"
              value={inputValue.country}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="state"
              size="small"
              disablePortal
              id="state-select"
              options={stateOptions.map((option) => option.name)}
              onChange={handleStateChange}
              getOptionLabel={(option) => option}
              fullWidth
              label="State"
              value={inputValue.state}
              disabled={!inputValue.country} // Disable until country is selected
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="city"
              size="small"
              disablePortal
              id="city-select"
              options={cityOptions}
              onChange={(e, value) =>
                setInputValue((prev) => ({ ...prev, city: value.id }))
              }
              getOptionLabel={(option) => option.name}
              fullWidth
              label="City"
              value={cityOptions.find(
                (cityOption) => cityOption.id === inputValue.city
              )}
              disabled={!inputValue.state} // Disable until state is selected
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pin Code"
              name="pincode"
              size="small"
              value={inputValue.pincode}
              onChange={(e) =>
                setInputValue((prev) => ({ ...prev, pincode: e.target.value }))
              }
              required
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
    </>
  );
};
