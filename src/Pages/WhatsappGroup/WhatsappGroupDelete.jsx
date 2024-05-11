import React, { useState } from "react";
import { Button, Checkbox, Box } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const WhatsappGroupDelete = ({ selectedData, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleDelete = async () => {
    if (selectedData) {
      try {
        await CustomerServices.deleteWhatsappData(selectedData.id);
        handleSuccess("Group deleted successfully");
        setTimeout(() => {}, 300);
      } catch (error) {
        handleError(error);
        console.error("Error deleting group:", error);
        alert("Error deleting group");
      } finally {
        onClose();
      }
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
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}
      >
        <Checkbox
          checked={isChecked}
          onChange={handleCheckboxChange}
          color="primary"
        />
        <span>
          Are you sure you want to delete the WhatsApp group "
          {selectedData.whatsapp_group}" of "{selectedData.name}"?
        </span>
      </Box>
      <Button
        variant="contained"
        color="error"
        onClick={handleDelete}
        fullWidth // Use fullWidth for the button to span the entire container width
        disabled={!isChecked} // The button is disabled if isChecked is false
      >
        Delete Group
      </Button>
    </>
  );
};
