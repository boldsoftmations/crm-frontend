import React, { useState } from "react";
import { Container, TextField, Button, Box, Grid, Paper } from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomerServices from "../../../services/CustomerService";

const UpdateCustomerScheme = ({
  setOpencustomerSchemeupdate,
  getCustomerSchemeData,
  DataById,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    min_per: DataById.min_per || "",
    max_per: DataById.max_per || "",
    scheme_per: DataById.scheme_per || "",
    validity: DataById.validity || "",
  });
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await CustomerServices.updateCustomerscheme(
        DataById.id,
        formData
      );
      setAlertMsg({
        open: true,
        message: response.message || "Customer Scheme updated Successfulyy",
        severity: "success",
      });
      setTimeout(() => {
        setOpencustomerSchemeupdate(false);
        getCustomerSchemeData();
      }, 1000);
    } catch (error) {
      setAlertMsg({
        open: true,
        message: error.message || "Error Customer Scheme update ",
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
                label="Min Percentage"
                name="min_per"
                size="small"
                value={formData.min_per}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Percentage"
                name="max_per"
                size="small"
                value={formData.max_per}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scheme Percentage"
                name="scheme_per"
                size="small"
                value={formData.scheme_per}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Validity"
                name="validity"
                size="small"
                value={formData.validity}
                onChange={handleInputChange}
                required
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

export default UpdateCustomerScheme;
