import React, { useState } from "react";
import { TextField, Grid, Paper, Typography, Button, Box } from "@mui/material";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";

const CreateJustDialLead = () => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    references: "Just dial",
    contact: "",
    name: "",
    stage: "",
    city: "",
    query_product_name: "",
  });
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = { ...formData };

      // Ensure that the contact starts with "+91"
      if (!updatedFormData.contact.startsWith("+91")) {
        updatedFormData.contact = `+91${updatedFormData.contact}`;
      }

      setLoader(true);
      const response = await LeadServices.createJustDialLeads(updatedFormData);

      // Clear form after successful submission
      setFormData({
        references: "",
        contact: "",
        name: "",
        stage: "",
        city: "",
        query_product_name: "",
      });

      setAlertMsg({
        message:
          response.message || "Just Dial lead has been created successfully",
        severity: "success",
        open: true,
      });
    } catch (error) {
      setAlertMsg({
        message: "Failed to create Just Dial lead",
        severity: "error",
        open: true,
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <CustomLoader open={loader} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Grid
        container
        justifyContent="center"
        alignItems="start"
        style={{ minHeight: "100vh", marginTop: "2rem" }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} style={{ padding: "1rem" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Create Just Dial Lead
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact"
                    name="contact"
                    variant="outlined"
                    size="small"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    variant="outlined"
                    size="small"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Stage"
                    name="stage"
                    variant="outlined"
                    size="small"
                    value={formData.stage}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    variant="outlined"
                    size="small"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Query Product Name"
                    name="query_product_name"
                    variant="outlined"
                    size="small"
                    value={formData.query_product_name}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Box mt={3} display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateJustDialLead;
