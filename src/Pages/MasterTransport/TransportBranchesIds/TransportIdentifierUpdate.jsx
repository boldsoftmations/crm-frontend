import React, { useEffect, useState } from "react";
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

const IDENTIFIER_TYPE_CHOICES = ["GSTIN", "TRANSIN", "COMMON_ENROLMENT"];

const normalizeIdentifierType = (value) => {
  if (value === "Common Enrolment Number") {
    return "COMMON_ENROLMENT";
  }
  return value || "";
};

const getIdentifierTypeLabel = (value) => {
  if (value === "COMMON_ENROLMENT" || value === "Common Enrolment Number") {
    return "Common Enrolment Number";
  }
  return value || "";
};

const validateIdentifierValue = (type, value) => {
  if (type === "GSTIN") {
    const cleanValue = value || "";
    const isValidLength = cleanValue.length === 15;
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(cleanValue);

    if (!isValidLength || !isAlphanumeric) {
      return "GSTIN must be exactly 15 alphanumeric characters.";
    }
  }
  return "";
};

const getBranchId = (branch) => {
  if (branch && typeof branch === "object") {
    return branch.id;
  }
  return branch;
};

const getSelectedBranches = (recordForEdit, branchOptions) => {
  const recordBranches =
    recordForEdit && Array.isArray(recordForEdit.branches)
      ? recordForEdit.branches
      : [];

  const selectedIds = recordBranches
    .map((branch) => getBranchId(branch))
    .filter((id) => id !== null && id !== undefined && id !== "")
    .map((id) => String(id));

  return (branchOptions || []).filter(
    (branch) => branch && selectedIds.includes(String(branch.id)),
  );
};

function TransportIdentifierUpdate({
  recordForEdit,
  transporterId,
  branchOptions,
  getIdentifierData,
  setOpenPopup,
}) {
  const [formData, setFormData] = useState({
    identifier_type: "",
    identifier_value: "",
    is_primary: false,
    is_active: true,
    branches: [],
  });
  const [inlineError, setInlineError] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  // The popup component stays mounted even when it is closed. Hydrate the
  // form every time a different statutory record is selected, otherwise the
  // first empty state remains in the form and existing branch links look lost.
  useEffect(() => {
    if (!recordForEdit) {
      setFormData({
        identifier_type: "",
        identifier_value: "",
        is_primary: false,
        is_active: true,
        branches: [],
      });
      setInlineError("");
      return;
    }

    const identifierType = normalizeIdentifierType(
      recordForEdit.identifier_type,
    );
    const identifierValue = recordForEdit.identifier_value || "";

    setFormData({
      identifier_type: identifierType,
      identifier_value: identifierValue,
      is_primary:
        typeof recordForEdit.is_primary === "boolean"
          ? recordForEdit.is_primary
          : false,
      is_active:
        typeof recordForEdit.is_active === "boolean"
          ? recordForEdit.is_active
          : true,
      branches: getSelectedBranches(recordForEdit, branchOptions),
    });

    setInlineError(validateIdentifierValue(identifierType, identifierValue));
  }, [recordForEdit, branchOptions]);

  const handleValueChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, identifier_value: value }));
    setInlineError(validateIdentifierValue(formData.identifier_type, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recordForEdit || !recordForEdit.id) {
      handleError("No statutory detail selected to update.");
      return;
    }

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
      identifier_type: formData.identifier_type,
      identifier_value: formData.identifier_value,
      is_primary: formData.is_primary,
      is_active: formData.is_active,
      // One GSTIN/statutory record can be linked with multiple branches.
      // PATCH always sends the complete selected branch-id list so add/remove
      // branch links are persisted correctly by the backend many-to-many update.
      branches: formData.branches.map((branch) => branch.id),
    };

    try {
      setLoading(true);
      const response = await MasterService.updateTransportIdentifier(
        recordForEdit.id,
        payload,
      );

      const successMessage =
        (response && response.data && response.data.message) ||
        "Statutory details updated successfully!";

      handleSuccess(successMessage);

      // Wait for refreshed identifier data before closing so the same GSTIN is
      // immediately shown against every branch selected in this update.
      if (getIdentifierData) {
        await getIdentifierData(transporterId);
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
          <CustomAutocomplete
            fullWidth
            size="small"
            options={IDENTIFIER_TYPE_CHOICES}
            value={formData.identifier_type || null}
            getOptionLabel={(option) => getIdentifierTypeLabel(option)}
            onChange={(e, value) => {
              const identifierType = normalizeIdentifierType(value);
              setFormData((prev) => ({
                ...prev,
                identifier_type: identifierType,
              }));
              setInlineError(
                validateIdentifierValue(
                  identifierType,
                  formData.identifier_value,
                ),
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
            inputProps={{ maxLength: 32 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            size="small"
            options={branchOptions || []}
            value={formData.branches}
            getOptionLabel={(option) =>
              option && option.branch_name ? option.branch_name : ""
            }
            isOptionEqualToValue={(option, value) =>
              option && value ? String(option.id) === String(value.id) : false
            }
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, branches: value }))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Linked Branches"
                placeholder="Select one or more branches"
                helperText="Existing linked branches are already selected. Add or remove branches, then update."
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
        Update Statutory Details
      </Button>
    </Box>
  );
}

export default TransportIdentifierUpdate;
