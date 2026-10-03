import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";

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
};

const TransportMappingCreate = ({
  getMappingData,
  setOpenPopup,
  recordForEdit,
  lockedTransporter,
}) => {
  const [formData, setFormData] = useState(
    lockedTransporter
      ? { ...initialFormState, transporter: lockedTransporter.transporter_name }
      : initialFormState,
  );
  const [loading, setLoading] = useState(false);

  // Separate states for each dropdown — avoids overwrite bug
  const [unitOptions, setUnitOptions] = useState([]);
  // const [pincodeOptions, setPincodeOptions] = useState([]);
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [countyList, setCountyList] = useState([]);
  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();
  const [countyName, setCountyName] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [isValidPincode, setIsValidPincode] = useState(false);

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
  // const getMasterPincode = async () => {
  //   try {
  //     const response = await MasterService.getMasterPincode("all", "");
  //     if (response && response.data && response.data) {
  //       setPincodeOptions(response.data);
  //     } else {
  //       setPincodeOptions([]);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

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
    Promise.all([getAllSellerAccountsDetails(), getTransportName()]).finally(
      () => setLoading(false),
    );
  }, []);

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };


  const getAllCountryList = async () => {
    try {
      const response = await MasterService.getAllMasterCountries();
      setCountyList(response.data && response.data.results);
      console.log("Data is :", response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCountryList();
  }, []);
  const ValidatePincode = async () => {
    if (!pincodeInput.trim()) {
      handleError({
        response: {
          data: {
            message: "Please enter a pincode.",
          },
        },
      });
      return;
    }

    try {
      setLoading(true);

      const response = await MasterService.ValidatePincode(
        countyName.id,
        pincodeInput,
      );

      if (response && response.data) {
        const verified = response.data;

        setFormData((prev) => ({
          ...prev,
          pincode: verified.pincode,
        }));

        setPincodeInput(verified.pincode);
        setIsValidPincode(true);

        handleSuccess("Pincode verified successfully.");
      } else {
        setIsValidPincode(false);

        setFormData((prev) => ({
          ...prev,
          pincode: "",
        }));

        handleError({
          response: {
            data: {
              message: "Invalid pincode.",
            },
          },
        });
      }
    } catch (error) {
      setIsValidPincode(false);
      console.log(error);
      setFormData((prev) => ({
        ...prev,
        pincode: "",
      }));

      handleError(
        (error.response && error.response.data.message) ||
          "Error validating pincode.",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCountryChange = (e, value) => {
    if (value) {
      setCountyName(value);
    } else {
      setCountyName("");
    }

    setPincodeInput("");
    setIsValidPincode(false);

    setFormData((prev) => ({
      ...prev,
      pincode: "",
    }));
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
      console.log(error);
      handleError(error.response && error.response.data.non_field_errors[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(lockedTransporter
      ? { ...initialFormState, transporter: lockedTransporter.transporter_name }
      : initialFormState);
    setCountyName("");
    setPincodeInput("");
    setIsValidPincode(false);
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
          <Grid item xs={12} sm={6}>
            <Box display="flex" gap={1}>
              <CustomAutocomplete
                fullWidth
                name="country"
                size="small"
                label="Country"
                options={countyList}
                getOptionLabel={(option) => option.name}
                value={countyName || null}
                onChange={handleCountryChange}
                required
              />

              {/* <Button
                variant="contained"
                onClick={ValidatePincode}
                disabled={!countyName || isValidPincode}
              >
                Validate
              </Button> */}
            </Box>
          </Grid>
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

          <Grid item xs={12} sm={6}>
            <Box display="flex" gap={1}>
              <input
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                value={pincodeInput}
                onChange={(e) => {
                  setPincodeInput(e.target.value);

                  setIsValidPincode(false);

                  setFormData((prev) => ({
                    ...prev,
                    pincode: "",
                  }));
                }}
                readOnly={isValidPincode}
                placeholder="Enter Pincode"
              />

              <Button
                variant="contained"
                onClick={ValidatePincode}
                disabled={isValidPincode || !countyName}
              >
                Validate
              </Button>
            </Box>
          </Grid>

          {/* Transporter - hidden when opened from inside a workspace
              (lockedTransporter given, always Surface type here since
              TransPortMapping.jsx already blocks non-Surface before this
              form can even open). */}
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
            )}
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
            disabled={loading || !isValidPincode}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TransportMappingCreate;
