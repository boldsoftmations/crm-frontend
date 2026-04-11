import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import MasterService from "../../services/MasterService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const UpdatePackagingMaster = ({
  recordForEdit,
  setOpenUpdatePopup,
  getAllMasterCountries,
}) => {
  const [open, setOpen] = useState(false);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  const [inputValue, setInputValue] = useState({
    is_inactive: recordForEdit.is_inactive || false,
    name: recordForEdit.name || "",
    charges: recordForEdit.charges || 0.0,
    gst: 0.0,
  });

  // ✅ FIXED LOGIC
  const handleAutocompleteChange = (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      is_inactive: value === "Inactive",
    }));
  };
  const handleInputChange = (event) => {
    setInputValue((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const updateMasterCountry = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);

      const response = await MasterService.updatePackagingMaster(
        recordForEdit.id,
        inputValue,
      );

      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "Updated successfully",
          severity: "success",
          open: true,
        });

        setTimeout(() => {
          setOpenUpdatePopup(false);
          getAllMasterCountries();
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Update failed",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          "An unexpected error occurred",
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

      <Box component="form" noValidate onSubmit={updateMasterCountry}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              fullWidth
              value={inputValue.is_inactive ? "Inactive" : "Active"} // ✅ FIXED
              onChange={handleAutocompleteChange}
              options={["Active", "Inactive"]}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="name"
              size="small"
              name="name"
              fullWidth
              value={inputValue.name} // ✅ FIXED
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="charges"
              size="small"
              name="charges"
              fullWidth
              value={inputValue.charges} // ✅ FIXED
              onChange={handleInputChange}
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
