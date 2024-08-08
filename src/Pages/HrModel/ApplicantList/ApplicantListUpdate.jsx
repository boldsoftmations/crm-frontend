import React, { useEffect, useState } from "react";
import { Box, Grid, Button, TextField, Container } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const ApplicantListUpdate = ({
  candidateData,
  setOpenCandidatePopup,
  getCandidateProfile,
}) => {
  const [formData, setFormData] = useState({
    name: candidateData.name || "",
    contact: candidateData.contact || "",
    email: candidateData.email || "",
    status: "",
  });
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [loader, setLoader] = useState(false);
  const handleInputChange = (event, newValue) => {
    let { name, value } = event.target || {};

    if (name === "contact" && !value.startsWith("+91")) {
      value = `+91${value}`;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue !== undefined ? newValue : value,
    }));
  };

  const handleFilterChange = (e, value) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoader(false);
      await Hr.updateApplicant(candidateData.id, formData);
      handleSuccess("Successfully updated");
      setTimeout(() => {
        setOpenCandidatePopup(false);
        getCandidateProfile();
      }, 500);
    } catch (error) {
      console.error("Error updating applicant:", error);
      handleError("Error in update applicant");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <CustomLoader open={loader}></CustomLoader>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <Container
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          mt: 1,
          padding: "20px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          height: "70vh",
          overflowY: "auto",
        }}
      >
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Name of Candidate"
                name="name"
                fullWidth
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Phone Number"
                name="contact"
                fullWidth
                value={formData.contact || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Email Address"
                name="email"
                fullWidth
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomAutocomplete
                name="status"
                size="small"
                disablePortal
                id="combo-box-description"
                onChange={handleFilterChange}
                options={shortList}
                getOptionLabel={(option) => option}
                label="Status"
              />
            </Grid>
            {formData.status === "Rejected" && (
              <Grid item xs={12} sm={12}>
                <CustomAutocomplete
                  name="rejection_reason"
                  size="small"
                  disablePortal
                  id="combo-box-description"
                  onChange={(e, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      rejection_reason: value,
                    }))
                  }
                  options={rejected_reason}
                  getOptionLabel={(option) => option}
                  label="rejection_reason"
                />
              </Grid>
            )}
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              fullwidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Update Applicant
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};
const shortList = ["Shortlisted", "Rejected"];
const rejected_reason = [
  "Insufficient Technical Knowledge",
  "Poor Problem-Solving Skills",
  "Lack of Practical Experience",
  "Poor Communication Skills",
  "Cultural Mismatch",
  "Lack of Enthusiasm or Interest",
  "Inadequate Responses to Behavioral Questions",
  "Inconsistent Career Goals",
  "Negative Team Feedback",
  "Poor Performance in Team Exercises",
  "Unprofessional Behavior",
  "Overconfidence or Arrogance",
  "Failed Technical Assessments",
  "Background Check Issues",
  "Better Fit Found",
];
