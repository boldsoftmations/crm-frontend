import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const UpdateState = ({
  setOpenUpdatePopup,
  recordForEdit,
  getAllMasterStates,
}) => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [inputValue, setInputValue] = useState({
    country: recordForEdit.country || "",
    name: recordForEdit.name || "",
  });

  // Close the Snackbar
  const handleCloseSnackbar = () => {
    setAlertMsg({ ...alertMsg, open: false });
  };

  // Handle input changes for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to update the state in the master list
  const updateMasterState = async (e) => {
    e.preventDefault();
    try {
      setOpen(true); // Show loader
      const response = await MasterService.updateMasterState(
        recordForEdit.id,
        inputValue
      );

      // Check if the response is successful
      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "State updated successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenUpdatePopup(false); // Close the popup
          getAllMasterStates(); // Refresh the state list
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Failed to update state",
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
      setOpen(false); // Hide loader
      // Reset form values if needed
      setInputValue((prevData) => ({
        ...prevData,
        name: "", // Reset only the state name
      }));
    }
  };

  return (
    <>
      {/* Snackbar for displaying alert messages */}
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      {/* Loader for async operations */}
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={updateMasterState} // Attach form submission handler
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* Autocomplete for displaying country, disabled as it's non-editable */}
            <CustomAutocomplete
              name="country"
              size="small"
              disablePortal
              id="country-select"
              value={inputValue.country}
              options={[recordForEdit.country || ""]}
              getOptionLabel={(option) => option}
              fullWidth
              label="Country"
              disabled={true}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Input field for state name */}
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

        {/* Submit button for the form */}
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
