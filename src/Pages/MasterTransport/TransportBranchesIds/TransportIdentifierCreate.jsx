import React, { useState } from "react";
import {
  Autocomplete,
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

// One identifier (e.g. one GSTIN) can apply to more than one branch of the
// same transporter - the API confirms this with "branches": [3, 7] (a list
// of branch ids) in the create payload. This matches the real-world GST
// rule (one GSTIN per state, and a transporter can have several branches
// in the same state) and resolves the earlier open question about whether
// GSTIN belongs to one branch or is shared - it's a many-to-many.
const IDENTIFIER_TYPE_CHOICES = ["GSTIN", "TRANSIN", "COMMON_ENROLMENT"];

const getIdentifierTypeLabel = (value) => {
  if (value === "COMMON_ENROLMENT") {
    return "Common Enrolment Number";
  }
  return value || "";
};

// Doc rule: "GSTIN - ID entry is 15 alphanumeric characters; show inline
// validation result." No length rule is given for TRANSIN or Common
// Enrolment Number - doc explicitly says backend validates those, so this
// component does not fabricate a length check for them.
const validateIdentifierValue = (type, value) => {
  if (type === "GSTIN") {
    const isValidLength = value.length === 15;
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(value);
    if (!isValidLength || !isAlphanumeric) {
      return "GSTIN must be exactly 15 alphanumeric characters.";
    }
  }
  return "";
};

function TransportIdentifierCreate({
  transporterId,
  transporterName,
  branchOptions, // list of this transporter's branches: [{ id, branch_name }, ...]
  getIdentifierData,
  setOpenPopup,
}) {
  const initialFormState = {
    identifier_type: "",
    identifier_value: "",
    is_primary: false,
    is_active: true,
    branches: [], // selected branch objects
  };

  const [formData, setFormData] = useState(initialFormState);
  const [inlineError, setInlineError] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  const handleValueChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, identifier_value: value }));
    setInlineError(validateIdentifierValue(formData.identifier_type, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier_type || !formData.identifier_value) {
      handleError("Identifier Type and Value are required.");
      return;
    }

    const validationMessage = validateIdentifierValue(
      formData.identifier_type,
      formData.identifier_value,
    );
    if (validationMessage) {
      handleError(validationMessage);
      return;
    }

    const payload = {
      transporter: transporterName,
      identifier_type: formData.identifier_type,
      identifier_value: formData.identifier_value,
      is_primary: formData.is_primary,
      is_active: formData.is_active,
      branches: formData.branches.map((branch) => branch.id),
    };

    try {
      setLoading(true);
      const response = await MasterService.createTransportIdentifier(payload);
      const successMessage =
        (response && response.data && response.data.message) ||
        "Identifier created successfully!";
      handleSuccess(successMessage);
      if (getIdentifierData) {
        await getIdentifierData(transporterId);
      }
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
    } catch (error) {
      // Doc rule: "If backend returns a uniqueness conflict, show the
      // transporter already owning the ID. Do not offer a 'save anyway'
      // option." - handleError below shows whatever detail message the
      // backend sends back (expected to name the owning transporter), and
      // there is intentionally no fallback/override action here.
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
          <CustomAutocomplete
            fullWidth
            size="small"
            options={IDENTIFIER_TYPE_CHOICES}
            value={formData.identifier_type || null}
            getOptionLabel={(option) => getIdentifierTypeLabel(option)}
            onChange={(e, value) => {
              setFormData((prev) => ({
                ...prev,
                identifier_type: value || "",
              }));
              setInlineError(
                validateIdentifierValue(value || "", formData.identifier_value),
              );
            }}
            label="Identifier Type"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Identifier Value"
            name="identifier_value"
            value={formData.identifier_value}
            onChange={handleValueChange}
            error={Boolean(inlineError)}
            helperText={inlineError}
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            size="small"
            options={branchOptions || []}
            value={formData.branches}
            getOptionLabel={(option) => option.branch_name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, branches: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Applicable Branches"
                placeholder="Select one or more branches"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            label="Primary"
            control={
              <Switch
                checked={formData.is_primary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_primary: e.target.checked,
                  }))
                }
              />
            }
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
      </Grid>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
        Save Statutory Details
      </Button>
    </Box>
  );
}

export default TransportIdentifierCreate;
