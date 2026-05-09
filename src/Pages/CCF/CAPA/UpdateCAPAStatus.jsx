import React, { useEffect, useState } from "react";
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

const UpdateCAPAStatus = ({
  recordForEdit,
  setUpdateCAPAPopup,
  getAllCAPAData,
}) => {
  const [formData, setFormData] = useState({
    status: recordForEdit.status || "",
    ccf_status: "",
    remark: null,
  });

  useEffect(() => {
    const updatedStatus =
      formData.status === "Accept"
        ? "Pending Note"
        : formData.status === "Reject"
          ? "Capa Revision Required"
          : "";

    setFormData((prev) => ({
      ...prev,
      ccf_status: updatedStatus,
    }));
  }, [formData.status]);

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [isRemarkRequired, setisRemarkRequired] = useState(false);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(
        recordForEdit.id,
        formData,
      );
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        setUpdateCAPAPopup(false);
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
                  rows={4}
                  size="small"
                  label="Root Cause (1 Whys)"
                  name="root_cause"
                  value={recordForEdit.root_cause_why1}
                  disabled
                  // onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (2 Whys)"
                  name="root_cause"
                  value={recordForEdit.root_cause_why2}
                  disabled
                  // onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (3 Whys)"
                  name="root_cause"
                  value={recordForEdit.root_cause_why3}
                  disabled
                  // onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (4 Whys)"
                  name="root_cause"
                  value={recordForEdit.root_cause_why4}
                  disabled
                  // onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (5 Whys)"
                  name="root_cause"
                  value={recordForEdit.root_cause_why5}
                  disabled
                  // onChange={handleChange}
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
                  value={recordForEdit.cap}
                  disabled
                  // onChange={handleChange}
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
                  // onChange={handleChange}
                  disabled
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
                  value={recordForEdit.cap}
                  // onChange={handleChange}
                  disabled
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
                  onChange={(e, value) => {
                    if (value === "Reject") {
                      setisRemarkRequired(true);
                    }
                    setFormData((prev) => ({ ...prev, status: value }));
                  }}
                  label="Complaint Status"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                style={{
                  display: formData.status === "Reject" ? "block" : "none",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Remark"
                  name="remark"
                  variant="outlined"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, remark: e.target.value }))
                  }
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

export default UpdateCAPAStatus;
const CAPAstatus = ["Accept", "Reject"];
