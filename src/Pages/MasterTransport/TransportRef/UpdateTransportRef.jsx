import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  TextField,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

// Closed is intentionally NOT editable here.
// Backend requires the dedicated resolve endpoint to close a mapping request.
const STATUS_OPTIONS = ["Open", "In Progress", "Rejected", "PI Dropped"];

const UpdateTransportRef = ({
  dataForEdit,
  setOpenEditPopup,
  getTransportRefData,
}) => {
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("Open");
  const [isSaving, setIsSaving] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  useEffect(() => {
    if (dataForEdit) {
      setRemarks(dataForEdit.remarks ? dataForEdit.remarks : "");
      setStatus(dataForEdit.status ? dataForEdit.status : "Open");
    }
  }, [dataForEdit]);

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleSubmit = async () => {
    if (!dataForEdit || !dataForEdit.id) {
      setAlertMsg({
        message: "No mapping request selected",
        severity: "error",
        open: true,
      });
      return;
    }

    if (status === "Closed") {
      setAlertMsg({
        message: "Use Resolve Request to close a transporter mapping request",
        severity: "error",
        open: true,
      });
      return;
    }

    const payload = {
      remarks: remarks,
      status: status,
    };

    try {
      setIsSaving(true);
      await MasterService.UpdateMasterRefRequest(dataForEdit.id, payload);

      setAlertMsg({
        message: "Mapping request updated successfully",
        severity: "success",
        open: true,
      });

      if (getTransportRefData) {
        await getTransportRefData();
      }

      if (setOpenEditPopup) {
        setOpenEditPopup(false);
      }
    } catch (error) {
      setAlertMsg({
        message:
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
            ? error.response.data.message
            : "Error updating mapping request",
        severity: "error",
        open: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentStatusIsClosed =
    dataForEdit && dataForEdit.status === "Closed" ? true : false;

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />

      <Box sx={{ p: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Request ID"
              value={dataForEdit && dataForEdit.id ? dataForEdit.id : ""}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="PI Number"
              value={
                dataForEdit && dataForEdit.pi_number
                  ? dataForEdit.pi_number
                  : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Company"
              value={
                dataForEdit && dataForEdit.company ? dataForEdit.company : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Unit"
              value={dataForEdit && dataForEdit.unit ? dataForEdit.unit : ""}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Pincode (Raw)"
              value={
                dataForEdit && dataForEdit.pincode_text
                  ? dataForEdit.pincode_text
                  : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Canonical Pincode"
              value={
                dataForEdit && dataForEdit.canonical_pincode
                  ? dataForEdit.canonical_pincode
                  : ""
              }
              disabled
            />
          </Grid>

          {currentStatusIsClosed ? (
            <Grid item xs={12}>
              <Alert severity="info">
                This request is already Closed. Closed requests are read-only.
              </Alert>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                select
                label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Remarks"
              multiline
              rows={3}
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              disabled={currentStatusIsClosed}
            />
          </Grid>

          {!currentStatusIsClosed ? (
            <Grid item xs={12}>
              <Alert severity="warning">
                Do not set a request to Closed here. Use Resolve Request after selecting the Surface transporter.
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                disabled={isSaving}
                onClick={() => {
                  if (setOpenEditPopup) {
                    setOpenEditPopup(false);
                  }
                }}
              >
                {currentStatusIsClosed ? "Close" : "Cancel"}
              </Button>

              {!currentStatusIsClosed ? (
                <Button
                  variant="contained"
                  disabled={isSaving}
                  onClick={handleSubmit}
                >
                  {isSaving ? <CircularProgress size={20} /> : "Save"}
                </Button>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UpdateTransportRef;
