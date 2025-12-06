import React, { useEffect, useState } from "react";
import { TextField, Grid, Paper, Typography, Button, Box } from "@mui/material";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

const CreateJustDialLead = () => {
  const [loader, setLoader] = useState(false);
  const [referenceData, setReferenceData] = useState([]);
  const [formData, setFormData] = useState({
    references: "",
    contact: "",
    name: "",
    stage: "new",
    city: "",
    query_product_name: "",
  });
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const FetchData = async (value) => {
    try {
      setLoader(true);
      const res = await LeadServices.getAllRefernces();
      setReferenceData(res.data);
    } catch (error) {
      console.log("error", error);
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

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

  const handleFilterChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      references: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.contact || !formData.name) {
      setAlertMsg({
        message: "Please fill in all required fields",
        severity: "warning",
        open: true,
      });
      return;
    }
    try {
      const updatedFormData = { ...formData };

      // Ensure that the contact starts with "+91"
      if (!updatedFormData.contact.startsWith("+91")) {
        updatedFormData.contact = `+91${updatedFormData.contact}`;
      }

      setLoader(true);
      const response = await LeadServices.createJustDialLeads(updatedFormData);

      if (response.status === 201) {
        setAlertMsg({
          message:
            response.message || "Just Dial lead has been created successfully",
          severity: "success",
          open: true,
        });

        // Clear form after successful submission
        setFormData((prev) => {
          return {
            ...prev,
            contact: "",
            name: "",
            city: "",
            query_product_name: "",
          };
        });
      }
    } catch (error) {
      setAlertMsg({
        message:
          error.response.data.message || "Failed to create Just Dial lead",
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
            Assign lead 
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomAutocomplete
                    size="small"
                    fullWidth
                    value={formData.references}
                    name="references"
                    onChange={(event, value) => handleFilterChange(value)}
                    options={referenceData.map((option) => option.source)}
                    getOptionLabel={(option) => option}
                    label="Filter By References"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    required
                    variant="outlined"
                    size="small"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact"
                    type="number"
                    name="contact"
                    required
                    variant="outlined"
                    size="small"
                    value={formData.contact}
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
