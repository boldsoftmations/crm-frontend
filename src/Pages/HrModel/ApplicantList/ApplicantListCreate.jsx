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
  Divider,
  Chip,
  styled,
} from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAxios from "../../../services/api";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import TypoAnimation from "./TypoAnimation";
import { Popup } from "../../../Components/Popup";
import { InterviewStatusCreate } from "../InterviewStatus/InterviewStatusUpdate";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const ApplicantListCreate = ({
  jobOpeningId,
  setOpenApplicantListPopup,
}) => {
  const [contact, setContact] = useState(null);
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
    is_competitor: false,
    cv: null,
  });
  const [followupData, setFollowupData] = useState({
    applicant: contact ? contact : "",
    call_status: "",
    notes: "",
    applicant_status: "",
  });
  const [loader, setLoader] = useState(false);
  const [showAts, setShowAts] = useState(false);
  const [source, setSource] = useState([]);
  const [cvPreview, setCvPreview] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [candidateStatus, setCandidateStatus] = useState([]);
  const [isFollowupDone, setIsFollowupDone] = useState(false);
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

  const handleGetDataFromCVAndCheckATS = async () => {
    try {
      setLoader(true);
      const formDataToSend = new FormData();
      formDataToSend.append("job", formData.job);
      formDataToSend.append("cv", formData.cv);

      const response = await Hr.handleGetDataFromCVAndCheckATS(formDataToSend);

      if (response.status === 200) {
        const data = response.data || {};

        setFormData((prev) => ({
          ...prev,
          match_percentage:
            data.match_percentage && !isNaN(parseFloat(data.match_percentage))
              ? parseFloat(data.match_percentage)
              : null,
          keywords_missing: data.keywords_missing || [],
          final_thoughts: data.final_thoughts || "",
          name: data.name || "",
          email: data.email || "",
          contact: data.phone ? `+91${data.phone}` : "",
          qualification: data.highest_education || "",
        }));
        setShowAts(true);
      } else {
        setAlertMsg({
          open: true,
          message: `Error: Received status ${response.status}`,
          severity: "error",
        });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const formDataToSend = new FormData();

    // Append only fields with values to 'formDataToSend'
    Object.keys(formData).forEach((key) => {
      let value = formData[key];

      // Set `keywords_missing` to an empty array if it's null or undefined
      if (key === "keywords_missing" && !value) {
        value = [];
      }

      if (value) {
        // Convert arrays to JSON strings for proper handling in FormData
        formDataToSend.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value
        );
      }
    });

    try {
      const res = await Hr.addApplicant(formDataToSend);
      if (res.status === 201) {
        const data = res.data;
        setAlertMsg({
          open: true,
          message: data.message || "Applicant created successfully",
          severity: "success",
        });
        setContact(data.contact);
        setFormData((prev) => {
          return {
            ...prev,
            name: "",
            email: "",
            contact: "",
            qualification: "",
            current_location: "",
            current_salary: "",
            expected_salary: "",
            spoken_english: "",
            source: "",
            is_competitor: false,
            cv: null,
          };
        });
      }
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

  const handleFollowChange = (e, newValue, name) => {
    setFollowupData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleFollowInputChange = (event) => {
    let { name, value } = event.target;
    setFollowupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitFollowup = async (e) => {
    e.preventDefault();
    if (!contact) {
      setAlertMsg({
        open: true,
        message: "Contact number is required",
        severity: "error",
      });
      return;
    }
    try {
      setLoader(true);
      const payload = {
        applicant: contact ? contact : "",
        call_status: followupData.call_status,
        applicant_status: followupData.applicant_status,
        notes: followupData.notes,
      };
      const res = await Hr.createCandidateFollowup(payload);
      const data = res.data;
      if (res.status === 201) {
        setAlertMsg({
          open: true,
          message: "Followup created successfully",
          severity: "success",
        });
        if (data.success === true) {
          setIsFollowupDone(true);
        } else {
          setOpenApplicantListPopup(false);
        }
      }
    } catch (e) {
      setAlertMsg({
        open: true,
        message: e.response.data.message || "Error creating followup",
        severity: "error",
      });
      console.error("Error creating followup:", e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const getCandidateStatus = async () => {
      try {
        setLoader(true);
        const res = await Hr.getCandidates();
        setCandidateStatus(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getCandidateStatus();
  }, []);

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
                  <TextField {...params} label="Expected Annual Salary" />
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

            {showAts && (
              <Grid item xs={12} sm={12}>
                <TypoAnimation
                  percent={formData.match_percentage}
                  text={formData.final_thoughts}
                  speed={10}
                  misssingKeyWords={formData.keywords_missing}
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
            <Grid item xs={12} sm={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Applicant
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Root>
                <Divider>
                  <Chip label="Follow up" />
                </Divider>
              </Root>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                id="call_status"
                name="call_status"
                options={["Connected", "Disconnected"]}
                renderInput={(params) => (
                  <TextField {...params} label="Call Status" />
                )}
                value={followupData.call_status}
                onChange={(e, value) =>
                  handleFollowChange(e, value, "call_status")
                }
                label="Call Status"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                size="small"
                id="applicant_status"
                options={candidateStatus}
                getOptionLabel={(option) => option.name} // Show name in the dropdown
                renderInput={(params) => (
                  <TextField {...params} label="Applicant Status" />
                )}
                value={
                  candidateStatus.find(
                    (option) => option.id === followupData.applicant_status
                  ) || null
                } // Ensure selected value is an object
                onChange={
                  (e, value) =>
                    handleFollowChange(
                      e,
                      value ? value.id : null,
                      "applicant_status"
                    ) // Store the ID
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                label="Notes"
                name="notes"
                fullWidth
                value={followupData.notes}
                onChange={handleFollowInputChange}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              fullWidth
              onClick={handleSubmitFollowup}
              variant="contained"
              color="secondary"
            >
              Add Followup
            </Button>
          </Box>
        </Box>
        <Popup
          openPopup={isFollowupDone}
          setOpenPopup={setIsFollowupDone}
          title="Schedule Interview"
          maxWidth="md"
        >
          <InterviewStatusCreate
            setIsFollowupDone={setIsFollowupDone}
            contact={contact}
            setOpenApplicantListPopup={setOpenApplicantListPopup}
          />
        </Popup>
      </Container>
    </>
  );
};
