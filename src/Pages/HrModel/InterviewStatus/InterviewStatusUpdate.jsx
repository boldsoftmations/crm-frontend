import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const InterviewStatusCreate = ({
  row,
  contact,
  closeDialog,
  setIsFollowupDone,
  getInterviewData,
  setOpenApplicantListPopup,
}) => {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInterviewDetails = {
      date: interviewDate,
      time: interviewTime,
      interviewer: interviewerName,
      status: "Schedule",
      stage: "Round1",
      applicant: contact || row.contact,
    };

    try {
      setLoading(true);
      await Hr.addInterviewDate(newInterviewDetails);
      handleSuccess("Interview Scheduled Successfully");
      setTimeout(() => {
        if (typeof closeDialog === "function") {
          closeDialog();
        }

        if (typeof getInterviewData === "function") {
          getInterviewData();
        }

        if (typeof setIsFollowupDone === "function") {
          setIsFollowupDone(false);
        }
        if (typeof setOpenApplicantListPopup === "function") {
          setOpenApplicantListPopup(false);
        }
      }, 500);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError("Error scheduling interview");
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
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
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
          <CustomAutocomplete
            sx={{ minWidth: 220 }}
            size="small"
            value={interviewTime}
            onChange={handleTimeChange}
            options={timeOptions}
            label="Interview Time"
          />
        </Grid>
        <Grid item xs={12}>
          <CustomAutocomplete
            sx={{ minWidth: 220 }}
            size="small"
            onChange={(event, newValue) => handleInputChange(event, newValue)}
            name="email"
            options={email.map((option) => option.email)}
            getOptionLabel={(option) => `${option}`}
            label="Interviewer Email"
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2} gap={3}>
        {typeof setOpenApplicantListPopup === "function" && (
          <Button
            fullwidth
            variant="contained"
            color="error"
            onClick={() => setOpenApplicantListPopup(false)}
          >
            Cancel
          </Button>
        )}
        <Button fullwidth type="submit" variant="contained" color="primary">
          Schedule Interview
        </Button>
      </Box>
    </form>
  );
};

