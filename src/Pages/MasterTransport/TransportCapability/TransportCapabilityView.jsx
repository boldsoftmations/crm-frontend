import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import MasterService from "../../../services/MasterService";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

const MODE_OPTIONS = [
  { value: "SURFACE", label: "Surface / Road" },
  { value: "COURIER", label: "Courier" },
  { value: "LOCAL_AGGREGATOR", label: "Local / Aggregator" },
];

const EDIT_ROLES = [
  "Director",
  "Admin",
  "Dispatch",
  "Operations & Supply Chain Manager",
  "Factory-Mumbai-Dispatch",
  "Factory-Delhi-Dispatch",
];

const getStrategyForMode = (mode) => {
  if (mode === "SURFACE") {
    return "PIN_MAPPING";
  }

  if (mode === "COURIER" || mode === "LOCAL_AGGREGATOR") {
    return "UNIVERSAL";
  }

  return "";
};

const getModeLabel = (mode) => {
  const match = MODE_OPTIONS.find((item) => item.value === mode);
  return match ? match.label : mode || "—";
};

const getStrategyLabel = (strategy) => {
  if (strategy === "PIN_MAPPING") {
    return "Unit + Pincode Mapping";
  }
  if (strategy === "UNIVERSAL") {
    return "Universal";
  }
  return strategy || "—";
};

const getDefaultModeForTransporter = (transporter) => {
  if (!transporter || !transporter.transporter_type) {
    return "";
  }

  if (transporter.transporter_type === "Surface Transport") {
    return "SURFACE";
  }
  if (transporter.transporter_type === "Courier") {
    return "COURIER";
  }
  if (transporter.transporter_type === "Local-Adhoc") {
    return "LOCAL_AGGREGATOR";
  }

  return "";
};

const extractErrorMessage = (error) => {
  if (
    error &&
    error.response &&
    error.response.data &&
    typeof error.response.data === "object"
  ) {
    const errorData = error.response.data;

    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.detail) {
      return errorData.detail;
    }

    const firstKey = Object.keys(errorData)[0];
    if (firstKey) {
      const value = errorData[firstKey];
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return String(value);
    }
  }

  return "Unable to save transporter capability.";
};

const TransportCapabilityForm = ({
  transporter,
  capability,
  capabilityData,
  onSaved,
  setOpenPopup,
}) => {
  const defaultMode = capability
    ? capability.transport_mode
    : getDefaultModeForTransporter(transporter);

  const [formData, setFormData] = useState({
    transport_mode: defaultMode,
    serviceability_strategy: capability
      ? capability.serviceability_strategy
      : getStrategyForMode(defaultMode),
    is_active:
      capability && typeof capability.is_active === "boolean"
        ? capability.is_active
        : true,
  });
  const [loading, setLoading] = useState(false);

  const { handleError, handleCloseSnackbar, alertInfo, handleSuccess } =
    useNotificationHandling();

  const existingModes = useMemo(() => {
    return (capabilityData || [])
      .filter((item) => !capability || item.id !== capability.id)
      .map((item) => item.transport_mode);
  }, [capabilityData, capability]);

  const handleModeChange = (event) => {
    const mode = event.target.value;
    setFormData((prev) => ({
      ...prev,
      transport_mode: mode,
      serviceability_strategy: getStrategyForMode(mode),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!transporter || !transporter.transporter_name) {
      handleError("Transporter is required.");
      return;
    }

    if (!formData.transport_mode) {
      handleError("Transport Mode is required.");
      return;
    }

    if (existingModes.includes(formData.transport_mode)) {
      handleError(
        "This transport mode capability already exists for the transporter.",
      );
      return;
    }

    const payload = {
      transporter: transporter.transporter_name,
      transport_mode: formData.transport_mode,
      serviceability_strategy: getStrategyForMode(formData.transport_mode),
      is_active: Boolean(formData.is_active),
    };

    try {
      setLoading(true);
      let response;

      if (capability && capability.id) {
        response = await MasterService.updateTransportCapability(
          capability.id,
          payload,
        );
      } else {
        response = await MasterService.createTransportCapability(payload);
      }

      const successMessage =
        response && response.data && response.data.message
          ? response.data.message
          : capability
            ? "Transporter Capability updated successfully"
            : "Transporter Capability created successfully";

      handleSuccess(successMessage);
      await onSaved();

      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
    } catch (error) {
      handleError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Transporter"
            value={
              transporter && transporter.transporter_name
                ? transporter.transporter_name
                : ""
            }
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            required
            size="small"
            label="Transport Mode"
            value={formData.transport_mode}
            onChange={handleModeChange}
          >
            {MODE_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={existingModes.includes(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Serviceability Strategy"
            value={getStrategyLabel(formData.serviceability_strategy)}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          {formData.transport_mode === "SURFACE" ? (
            <Alert severity="info">
              Surface capability uses Unit + Pincode Mapping. Maintain the
              actual unit-postal mappings in the Serviceability tab.
            </Alert>
          ) : formData.transport_mode ? (
            <Alert severity="info">
              {getModeLabel(formData.transport_mode)} is configured as
              Universal, so PI selection does not require unit-pincode mapping.
            </Alert>
          ) : null}
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            label="Active"
            control={
              <Switch
                checked={Boolean(formData.is_active)}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: event.target.checked,
                  }))
                }
              />
            }
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mt: 3,
        }}
      >
        <Button variant="outlined" onClick={() => setOpenPopup(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {capability ? "Update" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

const TransportCapabilityView = ({ transporter }) => {
  const userData = useSelector((state) => state.auth.profile);

  const [capabilityData, setCapabilityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const canEdit = useMemo(() => {
    const groups =
      userData && userData.groups && Array.isArray(userData.groups)
        ? userData.groups
        : [];

    return EDIT_ROLES.some((role) => groups.includes(role));
  }, [userData]);

  const getCapabilityData = useCallback(async () => {
    if (!transporter || !transporter.id) {
      setCapabilityData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await MasterService.getTransportCapabilities(
        transporter.id,
      );

      if (response && response.data && Array.isArray(response.data)) {
        setCapabilityData(response.data);
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.results)
      ) {
        setCapabilityData(response.data.results);
      } else {
        setCapabilityData([]);
      }
    } catch (error) {
      setCapabilityData([]);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [transporter, handleError]);

  useEffect(() => {
    getCapabilityData();
  }, [getCapabilityData]);

  const handleAdd = () => {
    setRecordForEdit(null);
    setOpenPopup(true);
  };

  const handleEdit = (row) => {
    setRecordForEdit(row);
    setOpenPopup(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Transporter Capabilities
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Configure which PI transport modes this transporter can handle.
            </Typography>
          </Box>

          {canEdit ? (
            <Button variant="contained" onClick={handleAdd}>
              Add Capability
            </Button>
          ) : null}
        </Box>

        {capabilityData.length === 0 && !loading ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No capability is configured for this transporter. Courier and Local
            / Aggregator transporters will not appear in PI mode selection until
            an active capability is created.
          </Alert>
        ) : null}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Transport Mode</TableCell>
                <TableCell>Serviceability Strategy</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Updated By</TableCell>
                {canEdit ? <TableCell align="right">Action</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {capabilityData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{getModeLabel(row.transport_mode)}</TableCell>
                  <TableCell>
                    {getStrategyLabel(row.serviceability_strategy)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.is_active ? "Active" : "Inactive"}
                      color={row.is_active ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell>{row.created_by || "—"}</TableCell>
                  <TableCell>{row.updated_by || "—"}</TableCell>
                  {canEdit ? (
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Popup
        title={recordForEdit ? "Update Capability" : "Add Capability"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        maxWidth="sm"
      >
        <TransportCapabilityForm
          transporter={transporter}
          capability={recordForEdit}
          capabilityData={capabilityData}
          onSaved={getCapabilityData}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </Box>
  );
};

export default TransportCapabilityView;
