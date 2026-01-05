import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const CreateState = ({
  setOpenPopup,
  getAllMasterStates,
  StateData,
}) => {
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [zoneOptions, setZoneOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const [inputValue, setInputValue] = useState({
    country: "",
    name: "",
    zone: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
  const getZoneStateMaster = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getZoneMasterList(
        inputValue.country
      );
      setZoneOptions(response.data.results);
      console.log(response.data);
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
    getZoneStateMaster();
  }, [inputValue.country]);
  useEffect(() => {
    getAllMasterCountries();
  }, []);
  const createMasterState = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      const { name, country } = inputValue;
      if (!name || !country) {
        setAlertMsg({
          message: "Please fill all required fields",
          severity: "warning",
          open: true,
        });
        return;
      }
      const response = await MasterService.createMasterState(inputValue);
      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "Country created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenPopup(false);
          getAllMasterStates();
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Failed to create country",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "An unexpected error occurred",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
      // Reset input value after submission
      setInputValue({ name: "" });
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
      <Box
        component="form"
        noValidate
        onSubmit={createMasterState} // Moved onSubmit to the Box component
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="country"
              size="small"
              disablePortal
              id="combo-box-demo"
              options={countryOptions.map((option) => option.name)}
              onChange={(e, value) => {
                setInputValue((prev) => ({ ...prev, country: value }));
              }}
              getOptionLabel={(option) => option}
              fullWidth
              label="Country"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="zone"
              size="small"
              disablePortal
              id="combo-box-demo"
              options={zoneOptions && zoneOptions.map((option) => option.name)}
              onChange={(e, value) => {
                setInputValue((prev) => ({ ...prev, zone: value }));
              }}
              getOptionLabel={(option) => option}
              fullWidth
              label="Zone"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter state"
              name="name"
              size="small"
              value={inputValue.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit" // Keep type submit for the button
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
