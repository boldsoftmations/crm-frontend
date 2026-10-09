import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";

import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import {
  canDeactivateTransporter,
  canEditTransporterTypeDetails,
  canEditTransporterCore,
} from "../../../utility/masterAccess";

const TRANSPORTER_TYPE_CHOICES = [
  "Surface Transport",
  "Courier",
  "Local-Adhoc",
];

function MasterTransportUpdate({
  recordForEdit,
  getTransportData,
  setOpenPopup,
}) {
  const [formData, setFormData] = useState({
    transporter_name: "",
    transporter_type: "",
    is_inactive: false,
  });
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.profile);
  const canEditCore = canEditTransporterCore(userData);
  const canEditType = canEditTransporterTypeDetails(userData);
  const canDeactivate = canDeactivateTransporter(userData);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  // Pre-fill the form when the record prop changes
  useEffect(() => {
    if (recordForEdit) {
      setFormData({
        transporter_name: recordForEdit.transporter_name || "",
        transporter_type: recordForEdit.transporter_type || "",
        is_inactive: recordForEdit.is_inactive === true ? true : false,
      });
    }
  }, [recordForEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    setFormData((prev) => ({ ...prev, is_inactive: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEditCore) {
      return;
    }
    console.log("Data is :", recordForEdit);

    if (!recordForEdit || !recordForEdit.id) return;
    console.log("is passed");

    try {
      setLoading(true);

      const payload = {
        transporter_name: formData.transporter_name,
      };

      if (canEditType) {
        payload.transporter_type = formData.transporter_type;
      }

      if (canDeactivate) {
        payload.is_inactive = formData.is_inactive;
      }

      await MasterService.updateTransportMaster(recordForEdit.id, payload);
      console.log("Clisked");

      handleSuccess("Transport updated successfully");

      setTimeout(() => {
        setOpenPopup(false);
        getTransportData();
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <CustomLoader open={loading} />

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
        <Grid container spacing={2}>
          {/* Transporter Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Transporter Name"
              name="transporter_name"
              value={formData.transporter_name}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Transporter Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              label="Transporter Type"
              name="transporter_type"
              value={formData.transporter_type}
              onChange={handleChange}
              size="small"
              disabled={!canEditType}
            >
              {TRANSPORTER_TYPE_CHOICES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Is Inactive toggle */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_inactive}
                  onChange={handleToggle}
                  name="is_inactive"
                  color="error"
                  disabled={!canDeactivate}
                />
              }
              label={formData.is_inactive ? "Inactive" : "Active"}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 3,
          }}
        >
          {canEditCore && (
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
            >
              Update
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}

export default MasterTransportUpdate;
