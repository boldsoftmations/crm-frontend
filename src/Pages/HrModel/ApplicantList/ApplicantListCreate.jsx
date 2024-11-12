import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Container,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import TypoAnimation from "./TypoAnimation";

export const ApplicantListCreate = ({
  jobOpeningId,
  setOpenApplicantListPopup,
}) => {
  const [formData, setFormData] = useState({
    job: jobOpeningId.job_id,
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
    is_competitor: false,
    cv: null,
  });
  const [loader, setLoader] = useState(false);
  const [showAts, setShowAts] = useState(false);
  const [missingKeyWords, setMissingKeyWords] = useState([]);
  const [source, setSource] = useState([]);
  const [cvPreview, setCvPreview] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await CustomAxios.get("/api/hr/source/");
        if (Array.isArray(response.data)) {
          setSource(response.data);
        }
      } catch (error) {
        setAlertMsg({
          open: true,
          message: error.message || "Error fetching designations",
          severity: "error",
        });
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file && validFileTypes.includes(file.type)) {
      setFormData((prevData) => ({
        ...prevData,
        cv: file,
      }));
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setCvPreview(fileURL);
      } else {
        setCvPreview(null); // Clear preview if not a PDF
      }
    } else {
      setAlertMsg({
        open: true,
        message: "Invalid file type. Please upload a PDF or DOC file",
        severity: "error",
      });
      event.target.value = null; // Reset file input
    }
  };

  const handleRemoveCv = () => {
    setFormData((prevData) => ({
      ...prevData,
      cv: null,
    }));
    setCvPreview(null);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const formDataToSend = new FormData();

    // Append only fields with values to 'formDataToSend'
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await Hr.addApplicant(formDataToSend);
      setAlertMsg({
        open: true,
        message: "Applicant created successfully",
        severity: "success",
      });
      setTimeout(() => {
        setOpenApplicantListPopup(false);
      }, 300);
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.response.data.message || "Error creating applicant",
        severity: "error",
      });
      console.error("Error creating applicant:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleGetDataFromCVAndCheckATS = async () => {
    try {
      setLoader(true);
      const formDataToSend = new FormData();
      formDataToSend.append("job", formData.job);
      formDataToSend.append("cv", formData.cv);

      const response = await Hr.handleGetDataFromCVAndCheckATS(formDataToSend);
      if (response.data) {
        setFormData((prev) => ({
          ...prev,
          match_percentage:
            response.data && !isNaN(parseFloat(response.data.match_percentage))
              ? parseFloat(response.data.match_percentage)
              : null,
          keywords_missing: response.data.keywords_missing || [],
          final_thoughts: response.data.final_thoughts || null,
          name: response.data.name || "",
          email: response.data.email || "",
          contact: `+91${response.data.phone}` || "",
          qualification: response.data.highest_education || "",
        }));
        setMissingKeyWords(JSON.parse(response.data.keywords_missing));
        setShowAts(true);
      }
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.response.data.message || "Error getting data from CV",
        severity: "error",
      });
      console.error("Error getting data from CV", error);
    } finally {
      setLoader(false);
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
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader}></CustomLoader>
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
                label="Annual Salary"
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
                value={formData.interested}
                onChange={(event, newValue) => {
                  handleInputChange(event, newValue, "interested");
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
                  <Checkbox
                    checked={setFormData.is_competitor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_competitor: e.target.checked,
                      }))
                    }
                  />
                }
                label="Is Competitor"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                component="label"
                fullWidth
                size="small"
              >
                Upload CV
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {cvPreview && (
                <Box mt={2} position="relative">
                  <Typography variant="body1">CV Preview:</Typography>
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={handleRemoveCv}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <embed
                    src={cvPreview}
                    width="100%"
                    height="150px"
                    type="application/pdf"
                  />
                </Box>
              )}
            </Grid>

            {showAts && (
              <Grid item xs={12} sm={12}>
                <TypoAnimation
                  percent={formData.match_percentage}
                  text={formData.final_thoughts}
                  speed={10}
                  misssingKeyWords={missingKeyWords}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                color="success"
                component="label"
                fullWidth
                onClick={handleGetDataFromCVAndCheckATS}
                disabled={showAts}
              >
                eluavate resume
              </Button>
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
