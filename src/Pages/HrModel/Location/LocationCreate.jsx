import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import Hr from "../../../services/Hr";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const LocationCreate = ({ fetchLocation, setOpenCreatePopup }) => {
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState("");

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: locationName,
    };
    try {
      setOpen(true);
      await Hr.addLocation(payload);
      const successMessage = "Location added successfully";
      handleSuccess(successMessage);
      setTimeout(() => {
        setOpenCreatePopup(false);
        fetchLocation();
      }, 300);
    } catch (error) {
      console.error("Failed to add location", error);
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Location Name"
            variant="outlined"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add Location
          </Button>
        </Box>
      </form>
    </>
  );
};
