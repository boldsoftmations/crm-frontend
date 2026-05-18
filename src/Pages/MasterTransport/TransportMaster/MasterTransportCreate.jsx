import React, { useState } from "react";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";

import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";

const TRANSPORTER_TYPE_CHOICES = [
  "Universal Mode",
  "Surface Transport",
  "Courier",
  "Local-Adhoc",
  "Transporter",
];

const initialFormState = {
  transporter_name: "",
  transporter_type: "",
};

function MasterTransportCreate({ getTransportData, setOpenPopup }) {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await MasterService.createTransportMaster(formData);

      handleSuccess("Transport created successfully");

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

  const handleReset = () => setFormData(initialFormState);

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
            >
              {TRANSPORTER_TYPE_CHOICES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
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
          <Button variant="outlined" color="error" onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default MasterTransportCreate;
