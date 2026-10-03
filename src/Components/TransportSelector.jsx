import React, { useEffect, useState } from "react";
import { Alert, Autocomplete, CircularProgress, TextField } from "@mui/material";
import CustomerServices from "../services/CustomerService";

const MODES = [
  { value: "SURFACE", label: "Surface / Road" },
  { value: "COURIER", label: "Courier" },
  { value: "LOCAL_AGGREGATOR", label: "Local / Aggregator" },
  { value: "TRAIN", label: "Train" },
  { value: "BUS", label: "Bus" },
  { value: "AIR", label: "Air" },
  { value: "SELF_PICKUP", label: "Self Pickup" },
];

const DIRECT_MODES = ["TRAIN", "BUS", "AIR", "SELF_PICKUP"];
const CAPABILITY_MODES = ["COURIER", "LOCAL_AGGREGATOR"];

const isDirectMode = (mode) => DIRECT_MODES.indexOf(mode) !== -1;
const isCapabilityMode = (mode) => CAPABILITY_MODES.indexOf(mode) !== -1;

const getCapabilityList = (response) => {
  if (!response || !response.data) {
    return [];
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data.results)) {
    return response.data.results;
  }

  return [];
};

export default function TransportSelector({
  countryId,
  pincode,
  unitId,
  unitCode,
  value,
  onChange,
  disabled = false,
  preserveSelectionOnLoad = false,
}) {
  const [mode, setMode] = useState(value && value.mode ? value.mode : "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [surfaceVerifiedPincodeId, setSurfaceVerifiedPincodeId] = useState(
    value && value.verifiedPincodeId ? value.verifiedPincodeId : null,
  );

  useEffect(() => {
    const nextMode = value && value.mode ? value.mode : "";
    if (nextMode !== mode) {
      setMode(nextMode);
      setOptions([]);
      setError("");
      setWarning("");
      setSurfaceVerifiedPincodeId(
        value && value.verifiedPincodeId ? value.verifiedPincodeId : null,
      );
    }
    // mode is intentionally omitted. This synchronizes an external reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    let active = true;

    const loadOptions = async () => {
      setOptions([]);
      setError("");
      setWarning("");

      if (!mode) {
        return;
      }

      if (isDirectMode(mode)) {
        setSurfaceVerifiedPincodeId(null);
        if (onChange) {
          onChange({
            mode: mode,
            transporterId: null,
            transporterName: "",
            mappingId: null,
            verifiedPincodeId: null,
            assignmentStatus: null,
          });
        }
        return;
      }

      if (isCapabilityMode(mode)) {
        try {
          setLoading(true);

          const response = await CustomerServices.getTransporterCapabilities({
            transportMode: mode,
            isActive: true,
          });

          if (!active) {
            return;
          }

          const capabilityOptions = getCapabilityList(response);
          setOptions(capabilityOptions);

          if (capabilityOptions.length === 0) {
            setWarning(
              mode === "COURIER"
                ? "No active Courier transporter is configured. Please contact Admin/Dispatch."
                : "No active Local / Aggregator transporter is configured. Please contact Admin/Dispatch.",
            );
          }
        } catch (capabilityError) {
          if (!active) {
            return;
          }

          const backendMessage =
            capabilityError &&
            capabilityError.response &&
            capabilityError.response.data &&
            (capabilityError.response.data.message ||
              capabilityError.response.data.detail)
              ? capabilityError.response.data.message ||
                capabilityError.response.data.detail
              : "Unable to load transporters for the selected method.";

          setError(backendMessage);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
        return;
      }

      if (mode === "SURFACE") {
        if (!countryId || !pincode || !unitId || !unitCode) {
          setWarning(
            "Select Shipping Address and Seller Unit before loading Surface transporters.",
          );
          return;
        }

        try {
          setLoading(true);

          const response = await CustomerServices.getPincodeTransporter({
            countryId: countryId,
            pincode: pincode,
            unitId: unitId,
            unitCode: unitCode,
          });

          if (!active) {
            return;
          }

          const data = response && response.data ? response.data : {};
          const surfaceOptions = Array.isArray(data.options)
            ? data.options
            : [];
          const verifiedPincodeId = data.verified_pincode_id || null;

          setSurfaceVerifiedPincodeId(verifiedPincodeId);
          setOptions(surfaceOptions);

          const currentMapping =
            preserveSelectionOnLoad && value && value.mappingId
              ? surfaceOptions.find(
                  (option) =>
                    String(option.mapping_id) === String(value.mappingId),
                )
              : null;

          if (currentMapping) {
            if (
              onChange &&
              (String(value.transporterId || "") !==
                String(currentMapping.transporter_id || "") ||
                String(value.verifiedPincodeId || "") !==
                  String(verifiedPincodeId || ""))
            ) {
              onChange({
                ...value,
                transporterId: currentMapping.transporter_id,
                transporterName: currentMapping.transporter_name,
                verifiedPincodeId: verifiedPincodeId,
                assignmentStatus: "Assigned",
              });
            }
          } else if (preserveSelectionOnLoad && value && value.mappingId) {
            setWarning(
              "The current transporter mapping is not available for this Unit and Pincode. Select an available transporter before saving.",
            );
            if (onChange) {
              onChange({
                mode: "SURFACE",
                transporterId: null,
                transporterName: null,
                mappingId: null,
                verifiedPincodeId: verifiedPincodeId,
                assignmentStatus: null,
              });
            }
          } else if (!data.mapping_found || surfaceOptions.length === 0) {
            setWarning(
              'No Surface transporter mapping found for this Unit + Pincode. PI will be saved as "To Be Assigned".',
            );

            if (onChange) {
              onChange({
                mode: "SURFACE",
                transporterId: null,
                transporterName: "To Be Assigned",
                mappingId: null,
                verifiedPincodeId: verifiedPincodeId,
                assignmentStatus: "Unassigned",
              });
            }
          } else if (onChange) {
            // Keep verified pincode from lookup but force the user to choose
            // one of the returned mappings. Never auto-select the first row.
            onChange({
              mode: "SURFACE",
              transporterId: null,
              transporterName: null,
              mappingId: null,
              verifiedPincodeId: verifiedPincodeId,
              assignmentStatus: null,
            });
          }
        } catch (lookupError) {
          if (!active) {
            return;
          }

          const backendData =
            lookupError && lookupError.response
              ? lookupError.response.data
              : null;
          const backendMessage =
            backendData && (backendData.message || backendData.detail)
              ? backendData.message || backendData.detail
              : "Unable to load Surface transporter mapping.";

          setSurfaceVerifiedPincodeId(null);
          setOptions([]);
          setError(backendMessage);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
    };

    loadOptions();

    return () => {
      active = false;
    };
    // onChange intentionally omitted to avoid re-fetching when parent state
    // is updated by this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, countryId, pincode, unitId, unitCode, preserveSelectionOnLoad]);

  const handleModeChange = (event, selectedMode) => {
    const nextMode = selectedMode && selectedMode.value ? selectedMode.value : "";

    setMode(nextMode);
    setOptions([]);
    setError("");
    setWarning("");
    setSurfaceVerifiedPincodeId(null);

    if (onChange) {
      onChange({
        mode: nextMode,
        transporterId: null,
        transporterName: null,
        mappingId: null,
        verifiedPincodeId: null,
        assignmentStatus: null,
      });
    }
  };

  const handleSurfaceTransporterChange = (event, selectedOption) => {
    if (!onChange) {
      return;
    }

    if (!selectedOption) {
      onChange({
        mode: "SURFACE",
        transporterId: null,
        transporterName: null,
        mappingId: null,
        verifiedPincodeId: surfaceVerifiedPincodeId,
        assignmentStatus: null,
      });
      return;
    }

    onChange({
      mode: "SURFACE",
      transporterId: selectedOption.transporter_id || null,
      transporterName: selectedOption.transporter_name || null,
      mappingId: selectedOption.mapping_id || null,
      verifiedPincodeId: surfaceVerifiedPincodeId,
      assignmentStatus: "Assigned",
    });
  };

  const handleCapabilityTransporterChange = (event, selectedOption) => {
    if (!onChange) {
      return;
    }

    if (!selectedOption) {
      onChange({
        mode: mode,
        transporterId: null,
        transporterName: null,
        mappingId: null,
        verifiedPincodeId: null,
        assignmentStatus: null,
      });
      return;
    }

    // Backend-confirmed contract: capability id is NOT transporter id.
    // Always save transporter_id from the capability response.
    onChange({
      mode: mode,
      transporterId: selectedOption.transporter_id || null,
      transporterName:
        selectedOption.transporter || selectedOption.transporter_name || null,
      mappingId: null,
      verifiedPincodeId: null,
      assignmentStatus: "Assigned",
    });
  };

  const selectedSurfaceOption =
    mode === "SURFACE" && value && value.transporterId
      ? options.find((option) =>
          value.mappingId
            ? String(option.mapping_id) === String(value.mappingId)
            : String(option.transporter_id) === String(value.transporterId),
        ) ||
        (preserveSelectionOnLoad && options.length === 0 && value.mappingId
          ? {
              mapping_id: value.mappingId,
              transporter_id: value.transporterId,
              transporter_name: value.transporterName,
            }
          : null)
      : null;

  const selectedCapabilityOption =
    isCapabilityMode(mode) && value
      ? options.find((option) => {
          if (value.transporterId && option.transporter_id) {
            return String(option.transporter_id) === String(value.transporterId);
          }

          const optionName = option.transporter || option.transporter_name || "";
          return optionName === value.transporterName;
        }) ||
        (preserveSelectionOnLoad && options.length === 0 && value.transporterName
          ? {
              transporter_id: value.transporterId,
              transporter_name: value.transporterName,
            }
          : null)
      : null;

  return (
    <>
      <Autocomplete
        disabled={disabled}
        options={MODES}
        value={MODES.find((item) => item.value === mode) || null}
        getOptionLabel={(option) =>
          option && option.label ? option.label : ""
        }
        isOptionEqualToValue={(option, selectedValue) =>
          option && selectedValue
            ? option.value === selectedValue.value
            : false
        }
        onChange={handleModeChange}
        renderInput={(params) => (
          <TextField {...params} label="Transport Method" required />
        )}
      />

      {mode === "SURFACE" && (
        <Autocomplete
          sx={{ mt: 1 }}
          disabled={disabled || loading || options.length === 0}
          loading={loading}
          options={options}
          value={selectedSurfaceOption}
          getOptionLabel={(option) =>
            option && option.transporter_name ? option.transporter_name : ""
          }
          isOptionEqualToValue={(option, selectedValue) =>
            option && selectedValue
              ? String(option.mapping_id) === String(selectedValue.mapping_id)
              : false
          }
          onChange={handleSurfaceTransporterChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Transporter"
              required={options.length > 0}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}

      {isCapabilityMode(mode) && (
        <Autocomplete
          sx={{ mt: 1 }}
          disabled={disabled || loading || options.length === 0}
          loading={loading}
          options={options}
          value={selectedCapabilityOption}
          getOptionLabel={(option) => {
            if (!option) {
              return "";
            }
            return option.transporter || option.transporter_name || "";
          }}
          isOptionEqualToValue={(option, selectedValue) => {
            if (!option || !selectedValue) {
              return false;
            }

            if (option.transporter_id && selectedValue.transporter_id) {
              return (
                String(option.transporter_id) ===
                String(selectedValue.transporter_id)
              );
            }

            const optionName =
              option.transporter || option.transporter_name || "";
            const selectedName =
              selectedValue.transporter ||
              selectedValue.transporter_name ||
              "";
            return optionName === selectedName;
          }}
          onChange={handleCapabilityTransporterChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                mode === "COURIER"
                  ? "Courier Transporter"
                  : "Local / Aggregator Transporter"
              }
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}

      {warning && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {warning}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
