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
import validatePincode from "../../../utility/validatePincode";
import {
  getCountryIdForOrigin,
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

// pin_code / state / zone are client-side verification fields from postal
// lookup only — not sent in the branch API payload.

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
    pin_code: "",
    state: "",
    zone: "",
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

  useEffect(() => {
    const verifyLoadedPincode = async () => {
      const loadedPincode =
        recordForEdit && recordForEdit.pincode ? recordForEdit.pincode : "";
      if (!loadedPincode) {
        return;
      }

      try {
        setLoading(true);
        const postalData = await validatePincode(
          getCountryIdForOrigin("Domestic"),
          loadedPincode
        );
        setFormData((prev) => applyPostalLookupSuccess(prev, postalData));
      } catch (error) {
        handleError(
          error.message ||
            "Loaded postal code could not be verified. Please validate again."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyLoadedPincode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "pincode") {
      setFormData((prev) => ({
        ...clearPostalFields(prev),
        pincode: value,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePinCode = async () => {
    try {
      if (!formData.pincode) {
        handleError("Please enter postal code before validation");
        return;
      }

      setLoading(true);
      const data = await validatePincode(
        getCountryIdForOrigin("Domestic"),
        formData.pincode
      );
      setFormData((prev) => applyPostalLookupSuccess(prev, data));
      handleSuccess("Postal code validated successfully");
    } catch (error) {
      setFormData((prev) => clearPostalFields(prev));
      handleError(error.message || "Error validating postal code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recordForEdit || !recordForEdit.id) {
      handleError("No branch selected to update.");
      return;
    }

    if (!formData.branch_name || !formData.city || !formData.pincode) {
      handleError("Branch Name, City and Pincode are required.");
      return;
    }

    if (!formData.pin_code) {
      handleError(
        "Please validate the postal code before updating the branch."
      );
      return;
    }

    // Only send the fields the PATCH contract showed (branch_name,
    // is_active) plus the other editable fields, all as a partial update.
    // pin_code / state / zone stay client-only.
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
        payload
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

        <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            required
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            size="small"
          />
          <Button
            onClick={validatePinCode}
            variant="contained"
            sx={{ marginLeft: "1rem", whiteSpace: "nowrap" }}
          >
            Validate
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="City"
            name="city"
            value={formData.city}
            size="small"
            disabled
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
