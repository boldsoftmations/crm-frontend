import React, { useEffect, useState } from "react";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Button, Container, Grid, TextField } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";

const UpdateSRFStatus = ({ setOpenPopup, getCustomerSRF, recordData }) => {
  const [status, setStatus] = useState(
    recordData.status === "Dispatched" ? recordData.status : ""
  );
  const [customerFeedback, setCustomerFeedback] = useState(
    recordData.feedback ? recordData.feedback : ""
  );
  const [fileData, setFileData] = useState(null);
  const [lr_no, setLr_no] = useState(recordData.lr_no ? recordData.lr_no : "");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const userData = useSelector((state) => state.auth.profile);
  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !status ||
      !lr_no ||
      (status === "Dispatched" && !recordData.lr_no && !lr_no) ||
      (status === "Dispatched" && !recordData.lr_image && !fileData)
    ) {
      setAlertMsg({
        open: true,
        message: !status
          ? "Please select a status."
          : !fileData
          ? "Please upload LR file"
          : !lr_no
          ? "Please enter LR number."
          : "",
        severity: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (status) formData.append("status", status);
      if (!recordData.lr_no && lr_no) formData.append("lr_no", lr_no);
      if (!recordData.lr_image && fileData)
        formData.append("lr_image", fileData);
      if (!recordData.feedback && customerFeedback)
        formData.append("feedback", customerFeedback);
      const res = await CustomerServices.updateCustomerSRfStatus(
        recordData.id,
        formData
      );

      if (res.status === 200) {
        setAlertMsg({
          open: true,
          message: res.data.message || "SRF status updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          setOpenPopup(false);
          getCustomerSRF();
        }, 500);
      }
    } catch (error) {
      setAlertMsg({
        open: true,
        message: "Failed to update SRF status.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fileData) {
      const url = URL.createObjectURL(fileData);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // cleanup
    }
  }, [fileData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setFileData(file);
  };

  return (
    <Container component="form" onSubmit={handleSubmit} noValidate>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={isLoading} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            value={recordData.srf_no || ""}
            label="SRF No"
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="Customer"
            value={recordData.customer || ""}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <CustomAutocomplete
            name="status"
            size="small"
            disablePortal
            value={status}
            id="combo-box-description"
            onChange={(_, value) => setStatus(value)}
            options={["Dispatched"]}
            getOptionLabel={(option) => option}
            label="Status"
          />
        </Grid>
        {!recordData.lr_image && status === "Dispatched" && (
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              component="label"
              fullWidth
              size="small"
            >
              Upload LR
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {!recordData.lr_image && fileData && (
              <>
                <img
                  src={previewUrl}
                  alt="Selected LR"
                  width="90%"
                  height="130px"
                  style={{ objectFit: "cover", marginTop: "1rem" }}
                />
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {fileData.name}
                </p>
              </>
            )}
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="LR Number"
            value={lr_no || ""}
            onChange={(e) => setLr_no(e.target.value)}
          />
        </Grid>
        {(userData.groups.includes("Customer Service") ||
          userData.groups.includes("Director")) &&
          recordData.status === "Dispatched" && (
            <Grid item xs={12}>
              <TextField
                multiline
                rows={3}
                size="small"
                fullWidth
                label="Customer Feedback"
                value={customerFeedback || ""}
                onChange={(e) => setCustomerFeedback(e.target.value)}
              />
            </Grid>
          )}
        <Grid item xs={12}>
          <Button
            color="success"
            variant="contained"
            type="submit"
            fullWidth
            disabled={
              recordData.feedback && recordData.status && recordData.lr_image
            }
          >
            Update Status
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateSRFStatus;
