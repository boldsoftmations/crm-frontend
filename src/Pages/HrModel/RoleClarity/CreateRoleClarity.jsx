import React, { useEffect, useState } from "react";
import { Container, Paper, TextField, Button, Grid, Box } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const CreateRoleForm = ({ setOpenPopupRoleClarity, getRoleClarityData }) => {
  const [formData, setFormData] = useState({
    name: "",
    role_definition: "",
    responsibility_deliverable: "",
    tasks_activities: "",
    measurement_metrics: "",
  });
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const getUserRoleList = async () => {
    try {
      setLoading(true);
      const response = await Hr.getUserGroupList();
      setRole(response.data.data || []);
    } catch (error) {
      console.error("Error fetching role list:", error);
      setRole([]); // Ensure role is always an array
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserRoleList();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Hr.createRoleClarity(formData);
      setAlertMsg({
        open: true,
        message: response.message || "Role created successfully",
        severity: "success",
      });
      setTimeout(() => {
        getRoleClarityData();
        setOpenPopupRoleClarity(false);
      }, 1000);
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.message || "Error creating role",
        severity: "error",
      });
      console.error("Error creating role:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlertMsg({ ...alertMsg, open: false });
  };

  return (
    <Container maxWidth="md">
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomAutocomplete
                options={role}
                value={formData.role}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, name: value }))
                }
                label="Role"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Role Definition"
                name="role_definition"
                value={formData.role_definition}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Responsibility Deliverable"
                name="responsibility_deliverable"
                value={formData.responsibility_deliverable}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tasks Activities"
                name="tasks_activities"
                value={formData.tasks_activities}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Measurement Metrics"
                name="measurement_metrics"
                value={formData.measurement_metrics}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateRoleForm;
