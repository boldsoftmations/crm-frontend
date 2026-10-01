import React, { useState } from "react";
import { Box, Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material";

import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";

// API contract (as given):
// POST /api/master/transporter-branch/
// { transporter: "VRL Logistics", branch_name, city, pincode, address, is_active }
//
// NOTE: "transporter" is sent as the transporter's NAME string here, not its
// id - that's what was specified for this endpoint. This is inconsistent
// with the GET list filter (?transporter_id=5, numeric id) and with how
// every other master screen in this app sends a transporter (by id). Worth
// double-checking with backend that this is really intended and not a typo
// in the contract, since a name-based FK is fragile if the transporter is
// ever renamed. Implemented exactly as specified for now.

function TransportBranchCreate({
  transporterId,
  transporterName,
  getBranchData,
  setOpenPopup,
}) {
  const initialFormState = {
    branch_name: "",
    city: "",
    pincode: "",
    address: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.branch_name || !formData.city || !formData.pincode) {
      handleError("Branch Name, City and Pincode are required.");
      return;
    }

    const payload = {
      transporter: transporterName,
      branch_name: formData.branch_name,
      city: formData.city,
      pincode: formData.pincode,
      address: formData.address,
      is_active: formData.is_active,
    };

    try {
      setLoading(true);
      const response = await MasterService.createTransportBranch(payload);
      const successMessage =
        (response && response.data && response.data.message) ||
        "Branch created successfully!";
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
        Save Branch
      </Button>
    </Box>
  );
}

export default TransportBranchCreate;
