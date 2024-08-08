import React, { useState } from "react";
import { Container, TextField, Button, Box, Grid, Paper } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const AttributeForm = ({ setOpenAttributePopUp, fetchAttributes }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    iceberg_element: "",
    name: "",
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
      const response = await Hr.createAttribute(formData);
      setAlertMsg({
        open: true,
        message: response.message || "Attribut Created Successfulyy",
        severity: "success",
      });
      setTimeout(() => {
        setOpenAttributePopUp(false);
        fetchAttributes();
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
              <CustomAutocomplete
                value={formData.iceberg_element}
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    iceberg_element: newValue,
                  }));
                }}
                options={iceberg_element_options}
                label="Iceberg Element"
                margin="dense"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                size="small"
                value={formData.name}
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

export default AttributeForm;

const iceberg_element_options = [
  "Skill",
  "Knowledge",
  "Self-Image",
  "Trait",
  "Motive",
];
