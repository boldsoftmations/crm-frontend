import React, { useState } from "react";
import { Container, TextField, Button, Box, Grid, Paper } from "@mui/material";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
const CreateActivityOption = ({
  setOpenModal,
  getMasterActivity,
  selectedData,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState("");
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        model_master: selectedData,
        name: formData,
      };
      const response = await MasterService.createMasterActivityOption(payload);
      if (response.status === 200) {
        setAlertMsg({
          open: true,
          message: response.message || "Sub Option Created Successfulyy",
          severity: "success",
        });
        setTimeout(() => {
          setOpenModal(false);
          getMasterActivity();
        }, 1000);
      }
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.message || "Error creating attribute",
        severity: "error",
      });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Master Option"
                name="name"
                size="small"
                value={selectedData || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Sub Option"
                name="name"
                size="small"
                value={formData || ""}
                onChange={(e) => setFormData(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
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

export default CreateActivityOption;
