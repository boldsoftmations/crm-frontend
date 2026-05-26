import React, { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, Switch } from "@mui/material";

import InvoiceServices from "../../../services/InvoiceService";
import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const TransportMappingUpdate = ({
  recordForEdit,
  getMappingData,
  setOpenPopup,
}) => {
  console.log("recordit", recordForEdit);
  console.log("mappingData", getMappingData);
  const [formData, setFormData] = useState({
    unit: recordForEdit.unit || "",
    pincode: recordForEdit.pincode || "",
    transporter: recordForEdit.transporter_name || "",
    is_system_default: false,
    is_inactive: false,
  });
  const [loading, setLoading] = useState(false);

  const [unitOptions, setUnitOptions] = useState([]);
  const [pincodeOptions, setPincodeOptions] = useState([]);
  const [transporterOptions, setTransporterOptions] = useState([]);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

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

  // Load dropdowns and pre-fill form
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllSellerAccountsDetails(),
      getMasterPincode(),
      getTransportName(),
    ]).finally(() => setLoading(false));
  }, []);

  // Pre-fill when recordForEdit changes
  useEffect(() => {
    if (recordForEdit) {
      setFormData({
        unit: recordForEdit.unit || "",
        pincode: recordForEdit.pincode || "",
        transporter: recordForEdit.transporter || "",
        is_system_default:
          recordForEdit.is_system_default === true ? true : false,
        is_inactive: recordForEdit.is_inactive === true ? true : false,
      });
    }
  }, [recordForEdit]);

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recordForEdit || !recordForEdit.id) {
      handleError("No record selected for update.");
      return;
    }

    try {
      setLoading(true);

      await MasterService.updateTransportMapping(recordForEdit.id, formData);

      handleSuccess("Transport mapping updated successfully");

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

  // Find the matching option object from the options array using the stored string value
  const selectedUnit =
    unitOptions.find((opt) => opt.unit === formData.unit) || null;

  const selectedPincode =
    pincodeOptions.find((opt) => opt.pincode === formData.pincode) || null;

  const selectedTransporter =
    transporterOptions.find(
      (opt) => opt.transporter_name === formData.transporter,
    ) || null;

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
              value={selectedUnit}
              getOptionLabel={(option) => (option.unit ? option.unit : option)}
              onChange={(e, value) =>
                handleAutocompleteChange("unit", value ? value.unit : "")
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
              value={selectedPincode}
              getOptionLabel={(option) =>
                option.pincode ? option.pincode : option
              }
              onChange={(e, value) =>
                handleAutocompleteChange("pincode", value ? value.pincode : "")
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
              value={selectedTransporter}
              getOptionLabel={(option) =>
                option.transporter_name ? option.transporter_name : option
              }
              onChange={(e, value) =>
                handleAutocompleteChange(
                  "transporter",
                  value ? value.transporter_name : "",
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

          {/* Is Inactive */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_inactive}
                  onChange={handleToggle}
                  name="is_inactive"
                  color="error"
                />
              }
              label={formData.is_inactive ? "Inactive" : "Active"}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TransportMappingUpdate;
