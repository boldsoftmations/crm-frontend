import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  CircularProgress,
} from "@mui/material";

import InvoiceServices from "../../../services/InvoiceService";
import MasterService from "../../../services/MasterService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";
import { canEditTransporterMappings } from "../../../utility/masterAccess";

const TransportMappingUpdate = ({
  recordForEdit,
  getMappingData,
  setOpenPopup,
  lockedTransporter,
}) => {
  const [formData, setFormData] = useState({
    unit: recordForEdit.unit || "",
    pincode: recordForEdit.pincode || "",
    transporter: recordForEdit.transporter_name || "",
    is_inactive: false,
  });
  const userData = useSelector((state) => state.auth.profile);
  const canEditMappings = canEditTransporterMappings(userData);
  const [loading, setLoading] = useState(false);

  const [unitOptions, setUnitOptions] = useState([]);
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [countyList, setCountyList] = useState([]);

  // Country + Pincode validation state
  const [countyName, setCountyName] = useState("");
  const [pincodeInput, setPincodeInput] = useState(recordForEdit.pincode || "");
  const [isPincodeValid, setIsPincodeValid] = useState(
    recordForEdit && recordForEdit.pincode ? true : false,
  );
  const [validatingPincode, setValidatingPincode] = useState(false);

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

  const getAllCountryList = async () => {
    try {
      const response = await MasterService.getAllMasterCountries();
      if (response && response.data && response.data.results) {
        setCountyList(response.data.results);
      } else {
        setCountyList([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Load dropdowns
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllSellerAccountsDetails(),
      getTransportName(),
      getAllCountryList(),
    ]).finally(() => setLoading(false));
  }, []);

  // Pre-fill when recordForEdit changes
  useEffect(() => {
    if (recordForEdit) {
      setFormData({
        unit: recordForEdit.unit || "",
        pincode: recordForEdit.pincode || "",
        transporter: recordForEdit.transporter || "",
        is_inactive: recordForEdit.is_inactive === true ? true : false,
      });
      setPincodeInput(recordForEdit.pincode || "");
      setIsPincodeValid(recordForEdit.pincode ? true : false);
    }
  }, [recordForEdit]);

  // Pre-select country once countyList is loaded (match on recordForEdit's country name)
  useEffect(() => {
    if (countyList.length && recordForEdit && recordForEdit.country) {
      const matchedCountry = countyList.find(
        (c) => c.name === recordForEdit.country,
      );
      if (matchedCountry) {
        setCountyName(matchedCountry);
      }
    }
  }, [countyList, recordForEdit]);

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleCountryChange = (e, value) => {
    setCountyName(value || "");
    // country badalte hi pincode dobara validate karwana padega
    setIsPincodeValid(false);
  };

  const handlePincodeInputChange = (e) => {
    setPincodeInput(e.target.value);
    setFormData((prev) => ({ ...prev, pincode: "" }));
    setIsPincodeValid(false);
  };

  const handleValidatePincode = async () => {
    if (!countyName || !countyName.id) {
      handleError("Please select country first");
      return;
    }
    if (!pincodeInput.trim()) {
      handleError("Please enter pincode to validate");
      return;
    }

    try {
      setValidatingPincode(true);

      const response = await MasterService.ValidatePincode(
        countyName.id,
        pincodeInput,
      );

      if (response && response.data) {
        const verified = response.data;

        setFormData((prev) => ({ ...prev, pincode: verified.pincode }));
        setPincodeInput(verified.pincode);
        setIsPincodeValid(true);

        handleSuccess("Pincode validated successfully");
      } else {
        setIsPincodeValid(false);
        setFormData((prev) => ({ ...prev, pincode: "" }));
        handleError("Invalid pincode");
      }
    } catch (error) {
      setIsPincodeValid(false);
      setFormData((prev) => ({ ...prev, pincode: "" }));
      handleError(error);
    } finally {
      setValidatingPincode(false);
    }
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canEditMappings) {
      return;
    }

    if (!recordForEdit || !recordForEdit.id) {
      handleError("No record selected for update.");
      return;
    }

    if (!isPincodeValid) {
      handleError("Please validate pincode before submitting.");
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

  const selectedUnit =
    unitOptions.find((opt) => opt.unit === formData.unit) || null;

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

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={countyList}
              value={countyName || null}
              getOptionLabel={(option) => (option.name ? option.name : "")}
              onChange={handleCountryChange}
              label="Country"
              required
            />
          </Grid>

          {/* Pincode + Validate */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <input
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={pincodeInput}
                onChange={handlePincodeInputChange}
                readOnly={isPincodeValid}
                placeholder="Enter Pincode"
              />

              <Button
                variant="contained"
                size="small"
                onClick={handleValidatePincode}
                disabled={validatingPincode || isPincodeValid || !countyName}
                sx={{ whiteSpace: "nowrap" }}
              >
                {validatingPincode ? (
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                ) : (
                  "Validate"
                )}
              </Button>
            </Box>
          </Grid>

          {/* Transporter - disabled when opened from inside a workspace
              (lockedTransporter given), same reasoning as
              TransportContactUpdate.jsx. */}
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
              disabled={Boolean(lockedTransporter)}
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
          {canEditMappings && (
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading || !isPincodeValid}
            >
              Update
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TransportMappingUpdate;
