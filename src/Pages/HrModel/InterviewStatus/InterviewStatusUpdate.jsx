import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Autocomplete, Box } from "@mui/material";
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
      alert("Interview Scheduled Successfully");
    } catch (error) {
      alert("Error scheduling interview");
      console.error("Error scheduling interview:", error);
    }
  };

  const timeOptions = ["11 AM to 1 PM", "1 PM to 3 PM", "3 PM TO 5 PM"];

  const handleInputChange = (event, newValue) => {
    setInterviewerName(newValue);
  };

  const handleTimeChange = (event, newValue) => {
    setInterviewTime(newValue);
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
    <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            label="Interview Date"
            type="date"
            fullWidth
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            style={{ minWidth: 220 }}
            size="small"
            value={interviewTime}
            onChange={handleTimeChange}
            options={timeOptions}
            renderInput={(params) => (
              <CustomTextField {...params} label="Interview Time" />
            )}
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
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button fullwidth type="submit" variant="contained" color="primary">
          Schedule Interview
        </Button>
      </Box>
    </form>
  );
};
