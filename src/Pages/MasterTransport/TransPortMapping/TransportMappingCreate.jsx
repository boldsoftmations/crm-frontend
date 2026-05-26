import React, { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, Switch } from "@mui/material";

import InvoiceServices from "../../../services/InvoiceService";
import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const initialFormState = {
  unit: "",
  pincode: "",
  transporter: "",
  is_system_default: false,
};

const TransportMappingCreate = ({ getMappingData, setOpenPopup }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  // Separate states for each dropdown — avoids overwrite bug
  const [unitOptions, setUnitOptions] = useState([]);
  const [pincodeOptions, setPincodeOptions] = useState([]);
  const [transporterOptions, setTransporterOptions] = useState([]);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  // Fetch unit options from seller accounts
  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllSellerAccountData();
      if (response && response.data && response.data.results) {
        setUnitOptions(response.data.results);
      } else {
        setUnitOptions([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch pincode options
  const getMasterPincode = async () => {
    try {
      const response = await MasterService.getMasterPincode("all", "");
      if (response && response.data && response.data) {
        setPincodeOptions(response.data);
      } else {
        setPincodeOptions([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch transporter name options
  const getTransportName = async () => {
    try {
      const response = await MasterService.getAllTransportMaster();
      if (response && response.data && response.data.results) {
        setTransporterOptions(response.data.results);
      } else {
        setTransporterOptions([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllSellerAccountsDetails(),
      getMasterPincode(),
      getTransportName(),
    ]).finally(() => setLoading(false));
  }, []);

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleToggle = (e) => {
    setFormData((prev) => ({ ...prev, is_system_default: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await MasterService.createTransportMapping(formData);

      handleSuccess("Transport mapping created successfully");

      setTimeout(() => {
        setOpenPopup(false);
        getMappingData();
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
          {/* Unit */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={unitOptions}
              value={formData.unit || null}
              getOptionLabel={(option) => (option.unit ? option.unit : option)}
              onChange={(e, value) =>
                handleAutocompleteChange(
                  "unit",
                  value ? value.unit || value : "",
                )
              }
              label="Unit"
              required
            />
          </Grid>

          {/* Pincode */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={pincodeOptions}
              value={formData.pincode || null}
              getOptionLabel={(option) =>
                option.pincode ? option.pincode : option
              }
              onChange={(e, value) =>
                handleAutocompleteChange(
                  "pincode",
                  value ? value.pincode || value : "",
                )
              }
              label="Pincode"
              required
            />
          </Grid>

          {/* Transporter */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={transporterOptions}
              value={formData.transporter || null}
              getOptionLabel={(option) =>
                option.transporter_name ? option.transporter_name : option
              }
              onChange={(e, value) =>
                handleAutocompleteChange(
                  "transporter",
                  value ? value.transporter_name || value : "",
                )
              }
              label="Transporter"
              required
            />
          </Grid>

          {/* Is System Default */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_system_default}
                  onChange={handleToggle}
                  name="is_system_default"
                  color="primary"
                />
              }
              label={
                formData.is_system_default
                  ? "System Default: Yes"
                  : "System Default: No"
              }
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
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
};

export default TransportMappingCreate;
