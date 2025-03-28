import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const UpdateCAPA = ({ recordForEdit, setUpdateCAPAPopup, getAllCAPAData }) => {
  const [formData, setFormData] = useState({
    root_cause: recordForEdit.root_cause || "",
    cap: recordForEdit.cap || "",
    pap: recordForEdit.pap || "",
    status: recordForEdit.status || "",
  });

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(
        recordForEdit.id,
        formData
      );
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        setUpdateCAPAPopup(false); // Close the form dialog if submission is successful
        getAllCAPAData();
      }, 400);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message || "Error creating CPA");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader} />
      <Card elevation={3} sx={{ marginTop: 1 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Root Cause (5 Whys)"
                  name="root_cause"
                  value={formData.root_cause}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Corrective Action Plan"
                  name="cap"
                  value={formData.cap}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Preventive Action Plan"
                  name="pap"
                  value={formData.pap}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <CustomAutocomplete
                  size="small"
                  disablePortal
                  id="product-selector"
                  value={formData.status}
                  options={CAPAstatus}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  label="Complaint Status"
                />
              </Grid>
            </Grid>
            <Grid sx={12} style={{ marginTop: "2rem" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateCAPA;
const CAPAstatus = ["Accept", "Reject"];
