import React, { useState, useEffect } from "react";
import { DialogActions, Button, TextField, Grid } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const OfferStatusUpdate = ({ row, closeDialog, onUpdateComplete }) => {
  const [status, setStatus] = useState(row ? row.status : "");
  const [joiningDate, setJoiningDate] = useState(
    row && row.joining_date ? row.joining_date : null
  );
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const offerStatusOptions = ["Sent", "Accepted", "Rejected", "Joined"];

  const rejectionReasonOptions = [
    "Candidate is not interested in the offer want higher offer.",
    "Candidate had a negative reference.",
    "Candidate didn’t give correct last salary.",
  ];

  useEffect(() => {
    if (status === "Rejected") {
      setJoiningDate("");
    }
  }, [status]);

  const handleStatusChange = (event, newValue) => {
    setStatus(newValue);
  };

  const handleDateChange = (event) => {
    setJoiningDate(event.target.value);
  };

  const handleRejectionReasonChange = (event, newValue) => {
    setRejectionReason(newValue);
  };

  const handleUpdate = async () => {
    const updatedOfferStatus = {
      status: status,
      email: row.email,
      contact: row.contact,
      doj: joiningDate || null,
      stage: "Offer",
      rejection_reason: status === "Rejected" ? rejectionReason : null,
    };
    try {
      setLoading(true);
      await Hr.updateApplicant(row.id, updatedOfferStatus);
      handleSuccess("Offer status updated successfully!");
      setTimeout(() => {
        closeDialog();
        onUpdateComplete();
      }, 500);
    } catch (error) {
      handleError("Error updating offer status:" || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: "20px" }}>
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <Grid item xs={12}>
        <CustomAutocomplete
          value={status}
          onChange={handleStatusChange}
          options={offerStatusOptions}
          label="Offer Status"
          fullWidth
        />
      </Grid>
      {status === "Rejected" && (
        <Grid item xs={12}>
          <CustomAutocomplete
            value={rejectionReason}
            onChange={handleRejectionReasonChange}
            options={rejectionReasonOptions}
            label="Rejection Reason"
            fullWidth
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <TextField
          label="Joining Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={joiningDate}
          onChange={handleDateChange}
          disabled={status === "Rejected"} // Disable date input if status is "Rejected"
        />
      </Grid>
      <Grid item xs={12}>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
};
