import React, { useEffect, useState } from "react";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Button, Container, Grid, TextField } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";

const WEIGHT_REGEX = /^\d+(\.\d{1,4})?$/;

const isValidTotalWeight = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const str = String(value).trim();
  if (!WEIGHT_REGEX.test(str)) return false;
  const num = Number(str);
  if (Number.isNaN(num)) return false;
  const parts = str.split(".");
  const decimals = parts[1] || "";
  return decimals.length <= 4;
};

const UpdateSRFStatus = ({ setOpenPopup, getCustomerSRF, recordData }) => {
  const userData = useSelector((state) => state.auth.profile);
  const groups = (userData && userData.groups) || [];

  const isQA = groups.includes("QA");
  const isDirector = groups.includes("Director");
  const isSalesExecutive = groups.includes("Sales Executive");
  const isCustomerService = groups.includes("Customer Service");

  const canEditDispatch = isQA || isDirector;
  const canEditFeedback =
    (isDirector || isCustomerService || isSalesExecutive) &&
    recordData.status === "Dispatched";

  const [status, setStatus] = useState(
    recordData.status === "Dispatched" ? recordData.status : ""
  );
  const [customerFeedback, setCustomerFeedback] = useState(
    recordData.feedback || ""
  );
  const [fileData, setFileData] = useState(null);
  const [lr_no, setLr_no] = useState(recordData.lr_no || "");
  const [transportCourier, setTransportCourier] = useState(
    recordData.transport || ""
  );
  const [totalWeight, setTotalWeight] = useState(
    recordData.total_weight != null && recordData.total_weight !== ""
      ? String(recordData.total_weight)
      : ""
  );
  const [grn, setGrn] = useState(recordData.grn || "");
  const [dateOfDispatch, setDateOfDispatch] = useState(
    recordData.date_of_dispatch || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const isDispatchedSelected =
    status === "Dispatched" || recordData.status === "Dispatched";
  const showFeedbackField =
    isDispatchedSelected &&
    (isDirector || isCustomerService || isSalesExecutive);

  const isSubmitDisabled = (() => {
    if (canEditFeedback && !canEditDispatch) {
      return Boolean(recordData.feedback);
    }
    if (canEditDispatch) {
      if (recordData.status === "Dispatched") {
        if (canEditFeedback) return Boolean(recordData.feedback);
        return true;
      }
      return false;
    }
    return true;
  })();

  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));

  const submitFormData = async (formData) => {
    setIsLoading(true);
    try {
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

  const submitFeedbackOnly = async () => {
    if (!customerFeedback || !customerFeedback.trim()) {
      setAlertMsg({
        open: true,
        message: "Please enter customer feedback.",
        severity: "warning",
      });
      return;
    }
    if (recordData.feedback) {
      setAlertMsg({
        open: true,
        message: "Feedback has already been submitted.",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("feedback", customerFeedback.trim());
    await submitFormData(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Feedback-only (Sales Executive / Customer Service), or Director after Dispatched
    if (
      canEditFeedback &&
      (!canEditDispatch || recordData.status === "Dispatched")
    ) {
      await submitFeedbackOnly();
      return;
    }

    if (!canEditDispatch) {
      setAlertMsg({
        open: true,
        message: "You do not have permission to update this SRF.",
        severity: "warning",
      });
      return;
    }

    if (!status) {
      setAlertMsg({
        open: true,
        message: "Please select a status.",
        severity: "warning",
      });
      return;
    }

    if (status === "Dispatched") {
      if (!lr_no || !lr_no.trim()) {
        setAlertMsg({
          open: true,
          message: "Please enter LR No/Tracking.",
          severity: "warning",
        });
        return;
      }
      if (!recordData.lr_image && !fileData) {
        setAlertMsg({
          open: true,
          message: "Please upload LR file",
          severity: "warning",
        });
        return;
      }
      if (!transportCourier || !transportCourier.trim()) {
        setAlertMsg({
          open: true,
          message: "Please enter Transport/Courier.",
          severity: "warning",
        });
        return;
      }
      if (!isValidTotalWeight(totalWeight)) {
        setAlertMsg({
          open: true,
          message:
            "Please enter a valid Total Weight in kg (up to 4 decimal places).",
          severity: "warning",
        });
        return;
      }
      if (!grn || !grn.trim()) {
        setAlertMsg({
          open: true,
          message: "Please enter GRN.",
          severity: "warning",
        });
        return;
      }
      if (!dateOfDispatch) {
        setAlertMsg({
          open: true,
          message: "Please select Date of Dispatch.",
          severity: "warning",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("status", status);
    if (lr_no) formData.append("lr_no", lr_no.trim());
    if (!recordData.lr_image && fileData) {
      formData.append("lr_image", fileData);
    }
    formData.append("transport", transportCourier.trim());
    formData.append("total_weight", String(totalWeight).trim());
    formData.append("grn", grn.trim());
    formData.append("date_of_dispatch", dateOfDispatch);

    await submitFormData(formData);
  };

  useEffect(() => {
    if (fileData) {
      const url = URL.createObjectURL(fileData);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [fileData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileData(file);
  };

  const showLrUpload =
    canEditDispatch && !recordData.lr_image && status === "Dispatched";
  const dispatchFieldsLocked =
    !canEditDispatch || recordData.status === "Dispatched";

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
            disabled={dispatchFieldsLocked}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Transport/Courier"
            value={transportCourier}
            onChange={(e) => setTransportCourier(e.target.value)}
            disabled={dispatchFieldsLocked}
            required={canEditDispatch && status === "Dispatched"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="Total Weight (kg)"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            disabled={dispatchFieldsLocked}
            required={canEditDispatch && status === "Dispatched"}
            inputProps={{ inputMode: "decimal" }}
            helperText={
              canEditDispatch && recordData.status !== "Dispatched"
                ? "Up to 4 decimal places"
                : undefined
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            label="GRN"
            value={grn}
            onChange={(e) => setGrn(e.target.value)}
            disabled={dispatchFieldsLocked}
            required={canEditDispatch && status === "Dispatched"}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            size="small"
            fullWidth
            type="date"
            label="Date of Dispatch"
            value={dateOfDispatch}
            onChange={(e) => setDateOfDispatch(e.target.value)}
            disabled={dispatchFieldsLocked}
            required={canEditDispatch && status === "Dispatched"}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label="LR No/Tracking"
            value={lr_no || ""}
            onChange={(e) => setLr_no(e.target.value)}
            disabled={dispatchFieldsLocked}
            required={canEditDispatch && status === "Dispatched"}
          />
        </Grid>

        {showLrUpload && (
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              component="label"
              fullWidth
              size="small"
              disabled={!canEditDispatch}
            >
              Upload LR
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                disabled={!canEditDispatch}
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

        {showFeedbackField && (
          <Grid item xs={12}>
            <TextField
              multiline
              rows={3}
              size="small"
              fullWidth
              label="Customer Feedback"
              value={customerFeedback || ""}
              onChange={(e) => setCustomerFeedback(e.target.value)}
              disabled={!canEditFeedback || Boolean(recordData.feedback)}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            color="success"
            variant="contained"
            type="submit"
            fullWidth
            disabled={isSubmitDisabled}
          >
            Update Status
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UpdateSRFStatus;
