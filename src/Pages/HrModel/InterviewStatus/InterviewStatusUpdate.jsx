import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Autocomplete } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import CustomTextField from "../../../Components/CustomTextField";

export const InterviewStatusCreate = ({ row, closeDialog }) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [email, setEmail] = useState([]);
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

  const handleInputChange = (event, newValue) => {
    setInterviewerName(newValue);
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await CustomAxios.get(
          `/api/user/users/?is_active=True`
        );
        if (Array.isArray(response.data.users)) {
          setEmail(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching Email:", error);
      }
    };

    fetchEmail();
  }, []);

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
          <Autocomplete
            style={{ minWidth: 220 }}
            size="small"
            onChange={(event, newValue) => handleInputChange(event, newValue)}
            name="email"
            options={email.map((option) => option.email)}
            getOptionLabel={(option) => `${option}`}
            renderInput={(params) => (
              <CustomTextField {...params} label="Interviewer Email" />
            )}
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
