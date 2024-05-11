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
import CustomAxios from "../../../services/api";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const ApplicantListCreate = ({ jobOpeningId }) => {
  console.log("jobOpeningId:", jobOpeningId);
  const [formData, setFormData] = useState({
    job: jobOpeningId,
    name: "",
    contact: "",
    email: "",
    qualification: "",
    current_location: "",
    current_salary: "",
    expected_salary: "",
    spoken_english: "",
    source: "",
    interested: "",
    shortlisted: false,
  });
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [source, setSource] = useState([]);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await CustomAxios.get("/api/hr/source/");
        if (Array.isArray(response.data)) {
          setSource(response.data);
        }
      } catch (error) {
        handleError("error");
        console.error("Error fetching designations:", error);
      }
    };

    fetchSource();
  }, []);

  const handleInputChange = (event, newValue, name) => {
    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      let { name, value } = event.target;
      if (name === "contact" && !value.startsWith("+91")) {
        value = `+91${value}`;
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Hr.addApplicant(formData);
      console.log("Applicant created:", response.data);
      handleSuccess("Applicant created successfully");
      setTimeout(() => {}, 300);
    } catch (error) {
      handleError(error);
      console.error("Error creating applicant:", error);
    }
  };
  const spokenEnglishOptions = ["Bad", "Average", "Good"];

  const salaryRange = [
    "0.6 LPA - 1.2 LPA",
    "1.2 LPA - 1.8 LPA",
    "1.8 LPA - 2.4 LPA",
    "2.4 LPA - 3.0 LPA",
    "3.0 LPA - 3.6 LPA",
    "3.6 LPA - 4.8 LPA",
    "4.8 LPA - 6.0 LPA",
    "7.2 LPA - 9.6 LPA",
    "9.6 LPA - 12 LPA",
    "12 LPA - 15 LPA",
    "15 LPA - 18 LPA",
    "18 LPA - 21 LPA",
    "21 LPA - 24 LPA",
    "24 LPA - Above",
  ];
  return (
    <>
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
          height: "70vh",
          overflowY: "auto",
        }}
      >
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Name of Candidate"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Phone Number"
                name="contact"
                fullWidth
                value={formData.contact}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Email Address"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Highest Education Qualification"
                name="qualification"
                fullWidth
                value={formData.qualification}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                style={{ minWidth: 220 }}
                onChange={(event, newValue) =>
                  handleInputChange(
                    { target: { name: "source", value: newValue } },
                    newValue
                  )
                }
                options={source.map((option) => option.name)}
                getOptionLabel={(option) => `${option}`}
                label="Candidate Source"
                value={formData.source}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Current Location"
                name="current_location"
                value={formData.current_location}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                label="Current Salary"
                name="current_salary"
                fullWidth
                value={formData.current_salary}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                id="expected_salary"
                options={salaryRange}
                renderInput={(params) => (
                  <TextField {...params} label="Expected Salary" />
                )}
                value={formData.expected_salary}
                onChange={(event, newValue) => {
                  handleInputChange(event, newValue, "expected_salary");
                }}
                label="Expected Salary"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                id="interested"
                options={["Yes", "No", "CallBackLater"]}
                renderInput={(params) => (
                  <TextField {...params} label="Interested" />
                )}
                value={formData.is_interested}
                onChange={(event, newValue) => {
                  handleInputChange(event, newValue);
                  if (newValue === "No") {
                    setFormData({
                      ...formData,
                      noReason: "",
                    });
                  }
                }}
                label="Interested"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                id="spoken_english"
                options={spokenEnglishOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Spoken English" />
                )}
                value={formData.spoken_english}
                onChange={(event, newValue) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    spoken_english: newValue,
                  }));
                }}
                label="Spoken English"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.shortlisted}
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
            <Button fullWidth type="submit" variant="contained" color="primary">
              Add Applicant
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};
