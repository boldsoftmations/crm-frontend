import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";

export const UpdatePincode = ({
  recordForEdit,
  getMasterPincode,
  setOpenUpdatePopup,
}) => {
  const [open, setOpen] = useState(false);

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [inputValue, setInputValue] = useState({
    country: recordForEdit.country || "",
    state: recordForEdit.state || "",
    city: recordForEdit.city || "",
    pincode: recordForEdit.pincode || "",
  });

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setAlertMsg((prev) => ({ ...prev, open: false }));
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
      };
      await MasterService.updateMasterPincode(recordForEdit.id, payload);
      setAlertMsg({
        message: "Pincode updated successfully!",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenUpdatePopup(false);
        getMasterPincode();
      }, 500);
    } catch (error) {
      setAlertMsg({
        message:
          (error && error.response.data.message) || "Error updating pincode",
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
              options={[inputValue.country]} // Provide the country option
              getOptionLabel={(option) => option}
              fullWidth
              label="Country"
              value={inputValue.country}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="state"
              size="small"
              disablePortal
              id="state-select"
              options={[inputValue.state]} // Provide the state option
              getOptionLabel={(option) => option}
              fullWidth
              label="State"
              value={inputValue.state}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="city"
              size="small"
              disablePortal
              id="city-select"
              options={[inputValue.city_name]} // Provide the city option
              getOptionLabel={(option) => option}
              fullWidth
              label="City"
              value={recordForEdit && recordForEdit.city_name}
              disabled={true}
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
          Update
        </Button>
      </Box>
    </>
  );
};
