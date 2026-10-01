import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";

import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";

function TransportBranchUpdate({
  recordForEdit,
  transporterId,
  getBranchData,
  setOpenPopup,
}) {
  const [formData, setFormData] = useState({
    branch_name:
      recordForEdit && recordForEdit.branch_name
        ? recordForEdit.branch_name
        : "",
    city: recordForEdit && recordForEdit.city ? recordForEdit.city : "",
    pincode:
      recordForEdit && recordForEdit.pincode ? recordForEdit.pincode : "",
    address:
      recordForEdit && recordForEdit.address ? recordForEdit.address : "",
    is_active:
      recordForEdit && typeof recordForEdit.is_active === "boolean"
        ? recordForEdit.is_active
        : true,
  });
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recordForEdit || !recordForEdit.id) {
      handleError("No branch selected to update.");
      return;
    }

    // Only send the fields the PATCH contract showed (branch_name,
    // is_active) plus the other editable fields, all as a partial update.
    const payload = {
      branch_name: formData.branch_name,
      city: formData.city,
      pincode: formData.pincode,
      address: formData.address,
      is_active: formData.is_active,
    };

    try {
      setLoading(true);
      const response = await MasterService.updateTransportBranch(
        recordForEdit.id,
        payload,
      );
      const successMessage =
        (response && response.data && response.data.message) ||
        "Branch updated successfully!";
      handleSuccess(successMessage);
      if (getBranchData) {
        getBranchData(transporterId);
      }
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Branch Name"
            name="branch_name"
            value={formData.branch_name}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            label="Active"
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            size="small"
          />
        </Grid>
      </Grid>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
        Update Branch
      </Button>
    </Box>
  );
}

export default TransportBranchUpdate;
