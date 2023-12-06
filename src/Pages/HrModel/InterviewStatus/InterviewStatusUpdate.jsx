import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import Hr from "../../../services/Hr";

export const InterviewStatusCreate = ({ row, closeDialog }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  console.log("row", row);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInterviewDetails = {
      applicant: row.email,
      date: interviewDate,
      time: interviewTime,
      interviewer: interviewerName,
    };

    try {
      await Hr.addInterviewDate(newInterviewDetails);
      closeDialog();
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Interview Date"
            type="date"
            fullWidth
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Interview Time"
            type="time"
            fullWidth
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Interviewer Name"
            fullWidth
            value={interviewerName}
            onChange={(e) => setInterviewerName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Schedule Interview
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
