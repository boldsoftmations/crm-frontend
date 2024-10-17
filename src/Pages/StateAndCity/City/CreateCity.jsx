import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const CreateCity = ({ setOpenPopup, getMasterCities }) => {
  const [open, setOpen] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [inputValue, setInputValue] = useState({
    name: "",
    state: "",
  });

  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  // Fetch all countries initially
  const getAllMasterCountries = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getAllMasterCountries("all", null);
      setCountryOptions(response.data);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  // Fetch states based on the selected country
  const getStatesByCountry = async (country) => {
    try {
      setOpen(true);
      const response = await MasterService.getAllMasterStates(
        "all",
        "",
        country
      );
      setStateOptions(response.data);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching states",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllMasterCountries(); // Fetch countries on component mount
  }, []);

  const handleCountryChange = (e, value) => {
    if (value) {
      getStatesByCountry(value); // Fetch states when a country is selected
    } else {
      setStateOptions([]); // Clear state options if no country is selected
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const { name, state } = inputValue;
      if (!name || !state) {
        setAlertMsg({
          message: "Please fill all required fields",
          severity: "warning",
          open: true,
        });
        return;
      }
      await MasterService.createcity({ name, state });
      setAlertMsg({
        message: "City created successfully!",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenPopup(false);
        getMasterCities();
      }, 500);
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Error creating city",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
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
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="state"
              size="small"
              disablePortal
              id="state-select"
              options={stateOptions} // Pass the full array of state objects (each containing id and name)
              onChange={(e, value) => {
                setInputValue((prev) => ({
                  ...prev,
                  state: value.id || "", // Store the state id as value
                }));
              }}
              getOptionLabel={(option) => option.name || ""} // Display the state name as the label
              fullWidth
              label="State"
              value={
                stateOptions.find((option) => option.id === inputValue.state) ||
                null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City"
              name="name"
              size="small"
              value={inputValue.name}
              onChange={(e) =>
                setInputValue((prev) => ({ ...prev, name: e.target.value }))
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
