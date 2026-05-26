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

const initialFormState = {
  transporter: "",
  unit: "",
  city: "",
  contact_person: "",
  designation_role: "",
  mobile_number: "",
  alternate_mobile_number: "",
  email: "",
  office_address: "",
  is_primary: false,
};

function ContactTransportCreate({ getTransportContactData, setOpenPopup }) {
  const [formData, setFormData] = useState(initialFormState);
  const DESIGNATION_ROLE_CHOICES = [
    "Booking",
    "Delivery",
    "Accounts",
    "Branch Manager",
    "Owner",
  ];
  const [loading, setLoading] = useState(false);

  // transporter dropdown
  const [transporterOptions, setTransporterOptions] = useState([]);

  // auto unit & city data
  const [unitCityData, setUnitCityData] = useState([]);

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

  useEffect(() => {
    setLoading(true);

    getTransporterOptions().finally(() => setLoading(false));
  }, []);

  // ==============================
  // Transporter Change
  // ==============================
  const handleTransporterChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      transporter: value ? value.transporter_name : "",
      unit: "",
      city: "",
    }));

    setUnitCityData([]);
    setUnitOptions([]);
    setCityOptions([]);

    if (!value || !value.id) {
      return;
    }

    try {
      setLoading(true);

      const response = await MasterService.getTransportContact(
        value.transporter_id,
      );

      const results = Array.isArray(response.data) ? response.data : [];

      setUnitCityData(results);

      // ==============================
      // Unit Options
      // ==============================
      const seenUnits = {};

      const units = [];

      results.forEach((item) => {
        if (item.unit && !seenUnits[item.unit]) {
          seenUnits[item.unit] = true;

          units.push({
            unit_id: item.unit_id,
            unit: item.unit,
          });
        }
      });

      // ==============================
      // City Options
      // ==============================
      const seenCities = {};

      const cities = [];

      results.forEach((item) => {
        if (item.city && !seenCities[item.city]) {
          seenCities[item.city] = true;

          cities.push({
            city_id: item.city_id,
            city: item.city,
          });
        }
      });

      setUnitOptions(units);

      setCityOptions(cities);

      // ==============================
      // Auto Fill Single Option
      // ==============================
      setFormData((prev) => ({
        ...prev,
        transporter: value.transporter_name,
        unit: units.length === 1 ? units[0].unit : "",
        city: cities.length === 1 ? cities[0].city : "",
      }));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Text Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // Autocomplete Change
  // ==============================
  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  // ==============================
  // Toggle Change
  // ==============================
  const handleToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_primary: e.target.checked,
    }));
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
        office_address: formData.office_address || "",
        email: formData.email || "",
        is_primary: formData.is_primary,
      };

      console.log("payload", payload);

      await MasterService.createTransportContact(payload);

      handleSuccess("Transport contact created successfully");

      setTimeout(() => {
        setOpenPopup(false);

        getTransportContactData();

        handleReset();
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Reset
  // ==============================
  const handleReset = () => {
    setFormData(initialFormState);

    setUnitCityData([]);

    setUnitOptions([]);

    setCityOptions([]);
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
              required
            />
          </Grid>

          {/* Unit */}
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
              required
              disabled={!formData.transporter}
            />
          </Grid>

          {/* City */}
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
              required
              disabled={!formData.transporter}
            />
          </Grid>

          {/* Contact Person */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              size="small"
            />
          </Grid>

          {/* Designation */}
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
              required
            />
          </Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              size="small"
              placeholder="+919087675434"
              inputProps={{
                maxLength: 13,
              }}
            />
          </Grid>

          {/* Alternate Mobile */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alternate Mobile Number"
              name="alternate_mobile_number"
              value={formData.alternate_mobile_number}
              onChange={handleChange}
              size="small"
              placeholder="+919087675434"
              inputProps={{
                maxLength: 13,
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
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
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_primary}
                  onChange={handleToggle}
                  name="is_primary"
                  color="primary"
                />
              }
              label={formData.is_primary ? "Primary Contact" : "Not Primary"}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
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

export default ContactTransportCreate;
