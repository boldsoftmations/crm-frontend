import React, { useState, useEffect } from "react";
import {
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const OfferStatusUpdate = ({ row, closeDialog, onUpdateComplete }) => {
  const [status, setStatus] = useState(row ? row.status : "");
  const [joiningDate, setJoiningDate] = useState(
    row && row.joining_date ? row.joining_date : null
  );

  const [rejectionReason, setRejectionReason] = useState("");

  const offerStatusOptions = ["Accepted", "Rejected", "Sent"];

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
      offer_status: status,
      joining_date: joiningDate || null,
      rejection_reason: status === "Rejected" ? rejectionReason : null,
    };
    try {
      await Hr.updateOfferStatus(row.id, updatedOfferStatus);
      onUpdateComplete();
      closeDialog();
      alert("Offer status updated successfully!");
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  return (
    <Grid container spacing={2}>
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
