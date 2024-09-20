import React, { useEffect, useState } from "react";
import { TextField, Button, Paper, Grid, Typography, Box } from "@mui/material";
import DynamiFileds from "./DynamicField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";

const JobDescriptionForm = ({ getJobDescription }) => {
  const [role, setRole] = useState([]);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    designation: "",
    job_purpose: "",
    report_line: "",
    reports_to: "",
    directs_report: [""],
    kra: [""],
    mtr: [""],
    occasional_duties: "",
    min_education_level: "",
    work_experience: "",
    ssa: [""],
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
  const validateForm = () => {
    if (!formData.job_title) return "Job title is required";
    if (!formData.job_purpose) return "Job purpose is required";
    if (!formData.report_line) return "Report line is required";
    if (!formData.reports_to) return "Reports to is required";
    if (formData.directs_report.length === 0)
      return "Please add at least one direct report";
    if (formData.kra.length === 0) return "Please add at least one KRA";
    if (formData.mtr.length === 0) return "Please add at least one MTR";
    if (!formData.min_education_level)
      return "Minimum education level is required";
    if (!formData.work_experience) return "Work experience is required";
    if (formData.ssa.length === 0) return "Please add at least one SSA";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setAlertMsg({
        open: true,
        message: error,
        severity: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await Hr.createJobDescription(formData);
      setAlertMsg({
        open: true,
        message: response.message || "Job description created successfully",
        severity: "success",
      });
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
              required
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Report Line"
              name="report_line"
              size="small"
              value={formData.report_line}
              onChange={handleChange}
              fullWidth
              required
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
              required
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
            <TextField
              size="small"
              label="Occasional Duties"
              name="occasional_duties"
              value={formData.occasional_duties}
              onChange={handleChange}
              fullWidth
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
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Work Experience (in years)"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              fullWidth
              required
              type="number"
              size="small"
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default JobDescriptionForm;
