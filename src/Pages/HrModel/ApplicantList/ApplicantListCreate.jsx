import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Container,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import CustomTextField from "../../../Components/CustomTextField";

export const ApplicantListCreate = ({ jobOpeningId, onSuccess }) => {
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

  const [source, setSource] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await CustomAxios.get("/api/hr/source/");
        if (Array.isArray(response.data)) {
          setSource(response.data);
        }
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchSource();
  }, []);

  const handleInputChange = (event, newValue) => {
    let { name, value } = event.target || {};
    if (name === "contact" && !value.startsWith("+91")) {
      value = `+91${value}`;
    }

    if (newValue !== undefined) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Hr.addApplicant({
        ...formData,
        // job: formData.jobOpeningId,
      });
      console.log("Applicant created:", response.data);
      onSuccess();
    } catch (error) {
      console.error("Error creating applicant:", error);
    }
  };

  const spokenEnglishOptions = ["Bad", "Average", "Good"];

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
          Create Applicant
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name of Candidate"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="contact"
              fullWidth
              value={formData.contact}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Highest Education Qualification"
              name="qualification"
              fullWidth
              value={formData.qualification}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              style={{ minWidth: 220 }}
              size="small"
              onChange={(event, newValue) =>
                handleInputChange(
                  { target: { name: "source", value: newValue } },
                  newValue
                )
              }
              name="source"
              options={source.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <CustomTextField {...params} label="Candidate Source" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Location"
              name="current_location"
              value={formData.current_location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Current Salary"
              name="current_salary"
              fullWidth
              value={formData.current_salary}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Expected Salary"
              name="expected_salary"
              fullWidth
              value={formData.expected_salary}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              id="interested"
              options={["Yes", "No", "CallBackLater"]}
              fullWidth
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
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              id="spoken_english"
              options={spokenEnglishOptions}
              fullWidth
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
            />
          </Grid>
          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create Applicant
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
