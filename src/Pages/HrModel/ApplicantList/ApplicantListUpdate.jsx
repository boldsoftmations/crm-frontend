import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Container,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Hr from "../../../services/Hr";

export const ApplicantListUpdate = ({ recordForEdit, onApplicantUpdated }) => {
  console.log("recordForEdit", recordForEdit);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    source: recordForEdit.source,
    shortlisted: false,
  });

  useEffect(() => {
    if (recordForEdit) {
      setFormData({ ...recordForEdit });
    }
  }, [recordForEdit]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Hr.updateApplicant(recordForEdit.id, formData);
      console.log("Applicant updated successfully");
      onApplicantUpdated();
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
  };

  return (
    <Container
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 1,
        height: "70vh",
        overflowY: "auto",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Update Applicant
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name of Candidate"
              name="name"
              fullWidth
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="contact"
              fullWidth
              value={formData.contact || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              value={formData.email || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.shortlisted || ""}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      shortlisted: event.target.checked,
                    });
                  }}
                  name="shortlisted"
                />
              }
              label="Shortlisted"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update Applicant
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
