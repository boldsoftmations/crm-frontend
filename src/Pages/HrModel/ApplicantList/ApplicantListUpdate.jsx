import React, { useEffect, useState } from "react";
import {
  Box,
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
  );
};
