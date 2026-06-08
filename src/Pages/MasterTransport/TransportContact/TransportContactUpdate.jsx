import React, { useEffect, useState } from "react";
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
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const DESIGNATION_ROLE_CHOICES = [
  "Booking",
  "Delivery",
  "Accounts",
  "Branch Manager",
  "Owner",
];

const TransportContactUpdate = ({
  recordForEdit,
  getTransportContactData,
  setOpenPopup,
}) => {
  const [formData, setFormData] = useState({
    transporter: "",
    transporter_id: "",
    unit: "",
    city: "",
    contact_person: "",
    designation_role: "",
    mobile_number: "",
    alternate_mobile_number: "",
    email: "",
    office_address: "",
    is_primary: false,
    is_inactive: false,
  });

  const [loading, setLoading] = useState(false);
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  // ==============================
  // Get Transporter Master
  // ==============================
  const getTransporterOptions = async () => {
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

  // ==============================
  // Fetch Units & Cities by Transporter ID
  // ==============================
  const fetchUnitAndCity = async (transporterId, currentUnit, currentCity) => {
    if (!transporterId) return;

    try {
      setLoading(true);

      const response = await MasterService.getTransportContact(transporterId);
      const results = Array.isArray(response.data) ? response.data : [];

      // Unique units
      const seenUnits = {};
      const units = [];
      results.forEach((item) => {
        if (item.unit && !seenUnits[item.unit]) {
          seenUnits[item.unit] = true;
          units.push({ unit_id: item.unit_id, unit: item.unit });
        }
      });

      // Unique cities
      const seenCities = {};
      const cities = [];
      results.forEach((item) => {
        if (item.city && !seenCities[item.city]) {
          seenCities[item.city] = true;
          cities.push({ city_id: item.city_id, city: item.city });
        }
      });

      setUnitOptions(units);
      setCityOptions(cities);

      // Restore existing unit/city if still valid, otherwise auto-fill if only one option
      setFormData((prev) => ({
        ...prev,
        unit: currentUnit
          ? currentUnit
          : units.length === 1
            ? units[0].unit
            : "",
        city: currentCity
          ? currentCity
          : cities.length === 1
            ? cities[0].city
            : "",
      }));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // On Mount: load transporters, then
  // load units/cities for the existing record
  // ==============================
  useEffect(() => {
    setLoading(true);
    getTransporterOptions().finally(() => setLoading(false));
  }, []);

  // ==============================
  // Populate form when recordForEdit arrives
  // ==============================
  useEffect(() => {
    if (recordForEdit) {
      setFormData({
        transporter: recordForEdit.transporter || "",
        transporter_id: recordForEdit.transporter_id || "",
        unit: recordForEdit.unit || "",
        city: recordForEdit.city || "",
        contact_person: recordForEdit.contact_person || "",
        designation_role: recordForEdit.designation_role || "",
        mobile_number: recordForEdit.mobile_number || "",
        alternate_mobile_number: recordForEdit.alternate_mobile_number || "",
        email: recordForEdit.email || "",
        office_address: recordForEdit.office_address || "",
        is_primary: recordForEdit.is_primary || false,
        is_inactive: recordForEdit.is_inactive || false,
      });

      // Load units & cities for the existing transporter,
      // preserving the already-selected unit & city
      if (recordForEdit.transporter_id) {
        fetchUnitAndCity(
          recordForEdit.transporter_id,
          recordForEdit.unit || "",
          recordForEdit.city || "",
        );
      }
    }
  }, [recordForEdit]);

  // ==============================
  // Transporter Change — reset unit & city
  // ==============================
  const handleTransporterChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      transporter: value ? value.transporter_name : "",
      transporter_id: value ? value.id : "",
      unit: "",
      city: "",
    }));

    setUnitOptions([]);
    setCityOptions([]);

    if (!value || !value.id) return;

    await fetchUnitAndCity(value.id, "", "");
  };

  // ==============================
  // Generic Handlers
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // ==============================
  // Submit
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        transporter: formData.transporter,
        unit: formData.unit,
        city: formData.city,
        contact_person: formData.contact_person,
        designation_role: formData.designation_role,
        mobile_number: formData.mobile_number,
        alternate_mobile_number: formData.alternate_mobile_number || "",
        email: formData.email || "",
        office_address: formData.office_address || "",
        is_primary: formData.is_primary,
        is_inactive: formData.is_inactive,
      };

      await MasterService.updateTransportContact(recordForEdit.id, payload);

      handleSuccess("Transporter contact updated successfully");

      setTimeout(() => {
        setOpenPopup(false);
        getTransportContactData();
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
          {/* Transporter */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={transporterOptions}
              value={
                transporterOptions.find(
                  (opt) => opt.transporter_name === formData.transporter,
                ) || null
              }
              getOptionLabel={(option) =>
                option.transporter_name ? option.transporter_name : ""
              }
              onChange={(e, value) => handleTransporterChange(value)}
              label="Transporter"
            />
          </Grid>

          {/* Unit — auto-populated from transporter */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={unitOptions}
              value={
                unitOptions.find((opt) => opt.unit === formData.unit) || null
              }
              getOptionLabel={(option) => (option.unit ? option.unit : "")}
              onChange={(e, value) =>
                handleAutocompleteChange("unit", value ? value.unit : "")
              }
              label="Unit"
              disabled={!formData.transporter}
            />
          </Grid>

          {/* City — auto-populated from transporter */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={cityOptions}
              value={
                cityOptions.find((opt) => opt.city === formData.city) || null
              }
              getOptionLabel={(option) => (option.city ? option.city : "")}
              onChange={(e, value) =>
                handleAutocompleteChange("city", value ? value.city : "")
              }
              label="City"
              disabled={!formData.transporter}
            />
          </Grid>

          {/* Contact Person */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Designation / Role */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={DESIGNATION_ROLE_CHOICES}
              value={
                DESIGNATION_ROLE_CHOICES.find(
                  (option) => option === formData.designation_role,
                ) || null
              }
              getOptionLabel={(option) => option || ""}
              onChange={(e, value) =>
                handleAutocompleteChange("designation_role", value || "")
              }
              label="Designation / Role"
            />
          </Grid>

          {/* Mobile Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              size="small"
              placeholder="+919087675434"
              inputProps={{ maxLength: 13 }}
            />
          </Grid>

          {/* Alternate Mobile Number */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alternate Mobile Number"
              name="alternate_mobile_number"
              value={formData.alternate_mobile_number}
              onChange={handleChange}
              size="small"
              placeholder="+919087675434"
              inputProps={{ maxLength: 13 }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
              type="email"
              placeholder="example@email.com"
            />
          </Grid>

          {/* Office Address */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Office Address"
              name="office_address"
              value={formData.office_address}
              onChange={handleChange}
              size="small"
              multiline
              rows={2}
            />
          </Grid>

          {/* Is Primary */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_primary}
                  onChange={handleSwitchChange}
                  name="is_primary"
                  color="primary"
                />
              }
              label={formData.is_primary ? "Primary Contact" : "Not Primary"}
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
                  onChange={handleSwitchChange}
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

export default TransportContactUpdate;
