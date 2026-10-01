import React, { useEffect, useState } from "react";
import {
  Alert,
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
  transporter_id: "", // FIX: store transporter_id so it can be sent in payload
  transporter_type: "",
  branch_id: null,
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

function ContactTransportCreate({
  getTransportContactData,
  setOpenPopup,
  lockedTransporter,
}) {
  const [formData, setFormData] = useState(initialFormState);

  const DESIGNATION_ROLE_CHOICES = [
    "Booking",
    "Delivery",
    "Accounts",
    "Branch Manager",
    "Owner",
  ];

  const [loading, setLoading] = useState(false);
  const [transporterOptions, setTransporterOptions] = useState([]);

  const [unitOptions, setUnitOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  // Branch is separate from Unit - Branch is the TRANSPORTER's own office
  // (from the Branches & IDs tab), Unit is GLUTAPE's dispatch point. Doc:
  // "Add contact -> Branch optional/selected." - applies to every
  // transporter type, not just Surface, since every transporter can have
  // branches/offices regardless of capability.
  const [branchOptions, setBranchOptions] = useState([]);
  const [serviceabilityStatus, setServiceabilityStatus] = useState("idle");

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  // ==============================
  // Get Transporter Master
  // ==============================
  const getTransporterOptions = async () => {
    try {
      const response = await MasterService.getAllTransportMaster("1");

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

  // GAP FIX (2/3): when opened from a workspace, the transporter is
  // implicit - auto-run the same selection logic as if the user had
  // picked it from the dropdown, so branch/unit/city load the same way.
  useEffect(() => {
    if (lockedTransporter) {
      handleTransporterChange(lockedTransporter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedTransporter]);

  // ==============================
  // Transporter Change
  // ==============================
  const handleTransporterChange = async (value) => {
    setFormData((prev) => ({
      ...prev,
      transporter: value ? value.transporter_name : "",
      // FIX: this was reading value.transporter_id, which does not exist on
      // the object returned by getAllTransportMaster (that API returns
      // "id", not "transporter_id"). Every contact saved until now was
      // sending an EMPTY transporter_id to the backend - the id field
      // below is the real fix, not just the Surface/Unit/City change.
      transporter_id: value ? value.id : "",
      transporter_type: value ? value.transporter_type : "",
      branch_id: null,
      unit: "",
      city: "",
    }));

    setUnitOptions([]);
    setCityOptions([]);
    setBranchOptions([]);
    setServiceabilityStatus("idle");

    if (!value || !value.id) {
      console.log("Invalid transporter selection");
      return;
    }

    // Branch applies to every transporter type - fetch regardless of
    // Surface/Courier/Local-Adhoc.
    try {
      const branchResponse = await MasterService.getAllTransportBranch(
        value.id,
      );
      const branchResults =
        branchResponse &&
        branchResponse.data &&
        Array.isArray(branchResponse.data.results)
          ? branchResponse.data.results
          : [];
      setBranchOptions(branchResults);
    } catch (branchError) {
      console.error("Error loading branch options:", branchError);
      setBranchOptions([]);
    }

    // Unit and City only mean anything for Surface transporters - they are
    // derived from the transporter's Serviceability (unit + pincode)
    // mappings, which only exist for Surface. Courier/Local-Adhoc
    // transporters have no such mapping, so calling this API for them
    // would always return an empty list anyway - skip the wasted call and
    // leave Unit/City hidden entirely (see the render section below).
    if (value.transporter_type !== "Surface Transport") {
      setServiceabilityStatus("not-applicable");
      return;
    }

    try {
      setLoading(true);
      setServiceabilityStatus("loading");

      const response = await MasterService.getTransportContact(value.id);
      console.log(value.id, response);
      const results = Array.isArray(response.data) ? response.data : [];

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
      setServiceabilityStatus(
        units.length > 0 || cities.length > 0 ? "available" : "none",
      );

      // ==============================
      // Auto Fill Single Option
      // ==============================
      setFormData((prev) => ({
        ...prev,
        transporter: value.transporter_name,
        transporter_id: value.id,
        unit: units.length === 1 ? units[0].unit : "",
        city: cities.length === 1 ? cities[0].city : "",
      }));
    } catch (error) {
      // Serviceability mapping is optional for a transporter contact.
      // If there is no Unit/Pincode mapping (or the helper lookup fails),
      // keep Unit/City empty and still allow the contact to be created.
      console.error("Serviceability lookup unavailable for contact:", error);
      setUnitOptions([]);
      setCityOptions([]);
      setServiceabilityStatus("none");
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

      const isSurface = formData.transporter_type === "Surface Transport";

      const payload = {
        transporter: formData.transporter,
        transporter_id: formData.transporter_id,
        // NOTE: sending as "branch" (id) - no explicit API contract was
        // given for this field on the Contact model, unlike Branch/
        // Identifier which had exact payload shapes specified. Confirm
        // the real field name with backend before relying on this.
        branch: formData.branch_id,
        unit: isSurface && formData.unit ? formData.unit : null,
        city: isSurface && formData.city ? formData.city : null,
        contact_person: formData.contact_person,
        designation_role: formData.designation_role,
        mobile_number: formData.mobile_number,
        alternate_mobile_number: formData.alternate_mobile_number || "",
        office_address: formData.office_address || "",
        email: formData.email || "",
        is_primary: formData.is_primary,
      };

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
    setFormData(initialFormState); // transporter_id is "" in initialFormState — auto-reset

    setUnitOptions([]);
    setCityOptions([]);
    setBranchOptions([]);
    setServiceabilityStatus("idle");
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
          {/* Transporter - hidden when opened from inside a workspace
              (lockedTransporter given); shown as plain text instead, since
              doc says "Transporter is implicit from workspace." */}
          <Grid item xs={12} sm={6}>
            {lockedTransporter ? (
              <TextField
                fullWidth
                disabled
                label="Transporter"
                value={lockedTransporter.transporter_name}
                size="small"
              />
            ) : (
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
            )}
          </Grid>

          {/* Branch - the transporter's own office, from the Branches & IDs
              tab. Optional per doc ("Branch optional/selected"), applies to
              every transporter type. */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={branchOptions}
              value={
                branchOptions.find((opt) => opt.id === formData.branch_id) ||
                null
              }
              getOptionLabel={(option) =>
                option.branch_name ? option.branch_name : ""
              }
              onChange={(e, value) =>
                setFormData((prev) => ({
                  ...prev,
                  branch_id: value ? value.id : null,
                }))
              }
              label="Branch (optional)"
              disabled={!formData.transporter}
            />
          </Grid>

          {/* Surface contact does NOT depend on serviceability mapping.
              When mappings exist, Unit/City are optional helper fields. When
              no Unit/Pincode mapping exists, the user can still save the
              transporter contact normally. */}
          {formData.transporter_type === "Surface Transport" &&
            serviceabilityStatus === "none" && (
              <Grid item xs={12}>
                <Alert severity="info">
                  No Unit / Pincode serviceability mapping is available for
                  this Surface transporter. You can still add the contact;
                  Unit and City are optional contact details.
                </Alert>
              </Grid>
            )}

          {formData.transporter_type === "Surface Transport" &&
            serviceabilityStatus === "available" && (
              <>
                <Grid item xs={12} sm={6}>
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    options={unitOptions}
                    value={
                      unitOptions.find((opt) => opt.unit === formData.unit) ||
                      null
                    }
                    getOptionLabel={(option) =>
                      option.unit ? option.unit : ""
                    }
                    onChange={(e, value) =>
                      handleAutocompleteChange("unit", value ? value.unit : "")
                    }
                    label="Unit (optional)"
                    disabled={!formData.transporter}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    options={cityOptions}
                    value={
                      cityOptions.find((opt) => opt.city === formData.city) ||
                      null
                    }
                    getOptionLabel={(option) =>
                      option.city ? option.city : ""
                    }
                    onChange={(e, value) =>
                      handleAutocompleteChange("city", value ? value.city : "")
                    }
                    label="City (optional)"
                    disabled={!formData.transporter}
                  />
                </Grid>
              </>
            )}

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
