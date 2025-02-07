import React, { useState } from "react";
import { Container, TextField, Button, Box, Grid, Paper } from "@mui/material";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";

const CreateMasterActivity = ({ setOpenModal, getMasterActivity }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
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
      const response = await MasterService.createMasterActivityMainHeading({
        name,
      });
      setAlertMsg({
        open: true,
        message: response.message || "Master Option Created Successfulyy",
        severity: "success",
      });
      setTimeout(() => {
        setOpenModal(false);
        getMasterActivity();
      }, 1000);
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
                label="Add master option"
                name="name"
                size="small"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
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

export default CreateMasterActivity;
