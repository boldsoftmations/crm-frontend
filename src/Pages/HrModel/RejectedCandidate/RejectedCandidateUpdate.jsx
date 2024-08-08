import React, { useEffect, useState } from "react";
import { Button, TextField, DialogActions, Grid } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const RejectedCandidateUpdate = ({
  row,
  closeDialog,
  fetchRejectedCandidates,
}) => {
  const [email, setEmail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewDate, setInterviewDate] = useState(row.interview_date || "");
  const [interviewTime, setInterviewTime] = useState(row.interview_time || "");
  const [interviewerName, setInterviewerName] = useState(
    row.interviewer_name || ""
  );
  const [stage, setStage] = useState("");

  useEffect(() => {
    setInterviewDate(row.interview_date || "");
    setInterviewTime(row.interview_time || "");
    setInterviewerName(row.interviewer_name || "");
  }, [row]);

  const handleUpdate = async () => {
    const updateInterviewDate = {
      date: interviewDate,
      time: interviewTime,
      interviewer: interviewerName,
      stage: stage,
      status: "Reschedule",
      applicant: row.email,
    };

    try {
      setIsLoading(true);
      await Hr.updateRejectedCandidates(updateInterviewDate);
      closeDialog();
      fetchRejectedCandidates();
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating interview details:", error);
    } finally {
      setIsLoading(false);
    }
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
  const stageOptions = ["Round1", "Round2"];

  const handleInputChange = (event, newValue) => {
    setInterviewerName(newValue);
  };
  const timeOptions = ["11 AM to 1 PM", "1 PM to 3 PM", "3 PM TO 5 PM"];
  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomAutocomplete
            value={stage}
            onChange={(event, newValue) => {
              setStage(newValue);
            }}
            options={stageOptions}
            label="Stage"
            margin="dense"
            fullWidth
          />
        </Grid>
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
          <CustomAutocomplete
            style={{ minWidth: 220 }}
            size="small"
            value={interviewTime}
            onChange={handleTimeChange}
            options={timeOptions}
            label="Interview Time"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomAutocomplete
            style={{ minWidth: 220 }}
            size="small"
            onChange={(event, newValue) => handleInputChange(event, newValue)}
            name="email"
            options={email.map((option) => option.email)}
            getOptionLabel={(option) => `${option}`}
            label="Interviewer Email"
          />
        </Grid>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Grid>
    </>
  );
};
