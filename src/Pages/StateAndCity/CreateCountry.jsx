import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import MasterService from "../../services/MasterService";

export const CreateCountry = ({ setOpenPopup, getAllMasterCountries }) => {
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const [inputValue, setInputValue] = useState({
    name: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createCountry = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      const response = await MasterService.createMasterCountry(inputValue);
      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "Country created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenPopup(false);
          getAllMasterCountries();
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
        onSubmit={createCountry} // Moved onSubmit to the Box component
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
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
