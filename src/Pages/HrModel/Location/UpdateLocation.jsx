import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Hr from "../../../services/Hr";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomLoader } from "../../../Components/CustomLoader";

export const UpdateLocation = ({
  LocationId,
  setOpenUpdatePopup,
  fetchLocation,
}) => {
  const [location, setLocation] = useState(LocationId.name);
  const [open, setOpen] = useState(false);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: location,
    };
    try {
      setOpen(true);
      await Hr.updateLocation(LocationId.id, payload);
      const successMessage = "Location added successfully";
      handleSuccess(successMessage);
      setTimeout(() => {
        setOpenUpdatePopup(false);
        fetchLocation();
      }, 300);
    } catch (error) {
      handleError(error);
      console.error("Failed to update department", error);
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
            label="Location name"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="success">
            Update Location
          </Button>
        </Box>
      </form>
    </>
  );
};
