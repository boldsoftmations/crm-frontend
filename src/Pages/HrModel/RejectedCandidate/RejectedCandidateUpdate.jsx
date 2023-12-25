import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  DialogActions,
  Autocomplete,
  Grid,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAxios from "../../../services/api";
import { CustomLoader } from "../../../Components/CustomLoader";

export const RejectedCandidateUpdate = ({
  row,
  closeDialog,
  fetchRejectedCandidates,
}) => {
  const [email, setEmail] = useState([]);
  const [id, setId] = useState(row.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewDate, setInterviewDate] = useState(row.interview_date || "");
  const [interviewTime, setInterviewTime] = useState(row.interview_time || "");
  const [status, setStatus] = useState(row.status || null);
  const [interviewerName, setInterviewerName] = useState(
    row.interviewer_name || ""
  );
  const [stage, setStage] = useState(row.stage || "");

  useEffect(() => {
    setId(row.id || "");
    setInterviewDate(row.interview_date || "");
    setInterviewTime(row.interview_time || "");
    setInterviewerName(row.interviewer_name || "");
    setStage(row.stage || "");
  }, [row]);
  console.log("row", row);

  const handleUpdate = async () => {
    const updateInterviewDate = {
      id: id,
      date: interviewDate,
      time: interviewTime,
      interviewer_name: interviewerName,
      stage: stage,
      offer_status: status,
    };

    try {
      setIsLoading(true);
      await Hr.updateRejectedCandidates(row.id, updateInterviewDate);

      closeDialog();
      fetchRejectedCandidates();
      setIsLoading(true);
    } catch (error) {
      setIsLoading(true);
      console.error("Error updating interview details:", error);
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
  const stageOptions = ["Scheduled"];

  const handleInputChange = (event, newValue) => {
    setInterviewerName(newValue);
  };
  const timeOptions = ["11 AM to 1 PM", "1 PM to 3 PM", "3 PM TO 5 PM"];
  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={stage}
            onChange={(event, newValue) => {
              setStage(newValue);
            }}
            options={stageOptions}
            renderInput={(params) => (
              <TextField {...params} label="Stage" margin="dense" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Interview Date"
            type="date"
            fullWidth
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
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
