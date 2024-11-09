import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DynamiFileds from "./DynamicField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import CloseIcon from "@mui/icons-material/Close";
const UpdateJobDescription = ({ getJobDescription, setOpenPopup, data }) => {
  const [role, setRole] = useState([]);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [cvPreview, setCvPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    designation: data.designation || "",
    job_purpose: data.job_purpose || "",
    report_line: data.report_line || "",
    reports_to: data.reports_to || "",
    directs_report: data.directs_report || [],
    kra: data.kra || [],
    mtr: data.mtr || [],
    occasional_duties: data.occasional_duties || [],
    min_education_level: data.min_education_level || "",
    work_experience: data.work_experience || "",
    desc_work_exp: data.desc_work_exp || "",
    ssa: data.ssa || [""],
    relevant_skill: data.relevant_skill || [],
    preferred_background: data.preferred_background || [],
    keywords: data.keywords || "",
  });

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await Hr.getDesginationList();
        setRole(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartmentList();
  }, []);

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (arrayName, values) => {
    setFormData({
      ...formData,
      [arrayName]: values,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append only fields with values to 'formDataToSend'
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      const response = await Hr.UpdateJobDescription(data.id, formDataToSend);
      setAlertMsg({
        open: true,
        message: response.message || "Job description updated successfully",
        severity: "success",
      });
      setTimeout(() => {
        getJobDescription();
        setOpenPopup(false);
      }, 500);
    } catch (error) {
      console.error("Error creating job description:", error);
      setAlertMsg({
        open: true,
        message: error.message || "Error creating job description",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
        jd: file,
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
      jd: null,
    }));
    setCvPreview(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <CustomLoader open={loading} />
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              options={role.map((option) => option.designation)}
              value={formData.designation}
              onChange={(e, value) =>
                setFormData((prev) => ({ ...prev, designation: value }))
              }
              label="Designation"
              margin="dense"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Job Purpose"
              size="small"
              name="job_purpose"
              value={formData.job_purpose}
              onChange={handleChange}
              fullWidth
              multiline
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Reports To"
              size="small"
              name="reports_to"
              value={formData.reports_to}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              label="Direct Reports"
              size="small"
              values={formData.directs_report}
              onChange={(values) => handleArrayChange("directs_report", values)}
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              size="small"
              label="Key Responsibility Areas (KRA)"
              values={formData.kra}
              onChange={(values) => handleArrayChange("kra", values)}
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              label="Major Tasks and Responsibilities (MTR)"
              values={formData.mtr}
              onChange={(values) => handleArrayChange("mtr", values)}
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              label="Occasional Duties"
              values={formData.occasional_duties}
              onChange={(values) =>
                handleArrayChange("occasional_duties", values)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              label="Minimum Education Level"
              name="min_education_level"
              value={formData.min_education_level}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Work Experience (in years)"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              fullWidth
              type="number"
              size="small"
              inputProps={{
                step: "0.5",
                min: "0",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              size="small"
              label="Describe Work Experience"
              name="desc_work_exp"
              value={formData.desc_work_exp}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              label="Special Skills and Abilities (SSA)"
              size="small"
              values={formData.ssa}
              onChange={(values) => handleArrayChange("ssa", values)}
            />
          </Grid>
          <Grid item xs={12}>
            <DynamiFileds
              label="Relevant Skills"
              values={formData.relevant_skill}
              onChange={(values) => handleArrayChange("relevant_skill", values)}
            />
          </Grid>

          <Grid item xs={12}>
            <DynamiFileds
              label="Preferred Background"
              values={formData.preferred_background}
              onChange={(values) =>
                handleArrayChange("preferred_background", values)
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} marginTop={4}>
            <Button
              variant="contained"
              color="secondary"
              component="label"
              fullWidth
            >
              Upload JD
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {cvPreview && (
              <Box mt={2} position="relative">
                <Typography variant="body1">JD Preview:</Typography>
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

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UpdateJobDescription;
