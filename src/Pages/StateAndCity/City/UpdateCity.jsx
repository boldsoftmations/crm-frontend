import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const UpdateCity = ({
  setOpenUpdatePopup,
  getMasterCities,
  recordForEdit,
}) => {
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [inputValue, setInputValue] = useState({
    name: recordForEdit.name || "",
    state: recordForEdit.state || "", // Use state id for handling backend interaction
    country: recordForEdit.country || "",
  });

  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, state } = inputValue;
    if (!name || !state) {
      setAlertMsg({
        message: "Please fill all required fields",
        severity: "warning",
        open: true,
      });
      return;
    }

    try {
      setOpen(true);
      const payload = { name, state };
      await MasterService.updateMasterCity(recordForEdit.id, payload);
      setAlertMsg({
        message: "City updated successfully!",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenUpdatePopup(false);
        getMasterCities(); // Refresh city list after update
      }, 500);
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Error updating city",
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
              options={[recordForEdit ? recordForEdit.country : ""]}
              getOptionLabel={(option) => option}
              fullWidth
              label="Country"
              value={inputValue.country}
              inputProps={{ readOnly: true }}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="state"
              size="small"
              disablePortal
              id="state-select"
              options={[recordForEdit ? recordForEdit.state_name : ""]}
              getOptionLabel={(option) => option}
              fullWidth
              label="State"
              value={recordForEdit ? recordForEdit.state_name : ""}
              disabled
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
