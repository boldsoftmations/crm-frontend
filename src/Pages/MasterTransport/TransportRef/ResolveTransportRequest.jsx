import React, { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const ResolveTransportRequest = ({
  dataForResolve,
  setOpenResolvePopup,
  getTransportRefData,
}) => {
  const [surfaceTransporters, setSurfaceTransporters] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [loadingTransporters, setLoadingTransporters] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  useEffect(() => {
    const loadSurfaceTransporters = async () => {
      try {
        setLoadingTransporters(true);

        const response = await MasterService.getAllTransportMaster(
          "all",
          false,
          "Surface Transport",
        );

        let rows = [];
        if (response && response.data && Array.isArray(response.data)) {
          rows = response.data;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.results)
        ) {
          rows = response.data.results;
        }

        const surfaceOnly = rows.filter(
          (item) =>
            item &&
            item.transporter_type === "Surface Transport" &&
            !item.is_inactive,
        );

        setSurfaceTransporters(surfaceOnly);
      } catch (error) {
        setSurfaceTransporters([]);
        setAlertMsg({
          message: "Unable to load active Surface Transport transporters",
          severity: "error",
          open: true,
        });
      } finally {
        setLoadingTransporters(false);
      }
    };

    if (dataForResolve && dataForResolve.id) {
      loadSurfaceTransporters();
      setSelectedTransporter(null);
    }
  }, [dataForResolve]);

  const handleResolve = async () => {
    if (!dataForResolve || !dataForResolve.id) {
      setAlertMsg({
        message: "No mapping request selected",
        severity: "error",
        open: true,
      });
      return;
    }

    if (!dataForResolve.canonical_pincode) {
      setAlertMsg({
        message:
          "This request has no verified/canonical pincode and cannot be resolved",
        severity: "error",
        open: true,
      });
      return;
    }

    if (!selectedTransporter || !selectedTransporter.id) {
      setAlertMsg({
        message: "Please select a Surface Transport transporter",
        severity: "error",
        open: true,
      });
      return;
    }

    try {
      setIsResolving(true);

      await MasterService.resolveTransportRequest(dataForResolve.id, {
        transporter_id: selectedTransporter.id,
      });

      setAlertMsg({
        message: "Transport mapping request resolved successfully",
        severity: "success",
        open: true,
      });

      if (getTransportRefData) {
        await getTransportRefData();
      }

      if (setOpenResolvePopup) {
        setOpenResolvePopup(false);
      }
    } catch (error) {
      console.log("error is : ", error);
      setAlertMsg({
        message:
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
            ? error.response.data.message
            : "Unable to resolve transport mapping request",
        severity: "error",
        open: true,
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />

      <Box sx={{ p: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Request ID"
              value={
                dataForResolve && dataForResolve.id ? dataForResolve.id : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="PI Number"
              value={
                dataForResolve && dataForResolve.pi_number
                  ? dataForResolve.pi_number
                  : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Unit"
              value={
                dataForResolve && dataForResolve.unit ? dataForResolve.unit : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Canonical Pincode"
              value={
                dataForResolve && dataForResolve.canonical_pincode
                  ? dataForResolve.canonical_pincode
                  : ""
              }
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Customer"
              value={
                dataForResolve && dataForResolve.company
                  ? dataForResolve.company
                  : ""
              }
              disabled
            />
          </Grid>

          {!dataForResolve || !dataForResolve.canonical_pincode ? (
            <Grid item xs={12}>
              <Alert severity="warning">
                This request has no verified/canonical pincode. Backend resolve
                API will reject it until the pincode is verified.
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Autocomplete
              options={surfaceTransporters}
              value={selectedTransporter}
              loading={loadingTransporters}
              isOptionEqualToValue={(option, value) =>
                option && value && option.id === value.id
              }
              getOptionLabel={(option) =>
                option && option.transporter_name ? option.transporter_name : ""
              }
              onChange={(event, newValue) => {
                setSelectedTransporter(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Surface Transporter"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingTransporters ? (
                          <CircularProgress color="inherit" size={18} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {surfaceTransporters.length === 0 && !loadingTransporters ? (
            <Grid item xs={12}>
              <Alert severity="info">
                No active Surface Transport transporter is configured in
                Transporter Master.
              </Alert>
            </Grid>
          ) : null}


          <Grid item xs={12}>
            <Alert severity="info">
              Resolving will create/reuse the Unit + Pincode + Transporter
              mapping and the backend will update the PI transporter fields
              automatically.
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                disabled={isResolving}
                onClick={() => {
                  if (setOpenResolvePopup) {
                    setOpenResolvePopup(false);
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={
                  isResolving ||
                  loadingTransporters ||
                  !selectedTransporter ||
                  !dataForResolve ||
                  !dataForResolve.canonical_pincode
                }
                onClick={handleResolve}
              >
                {isResolving ? (
                  <CircularProgress size={20} />
                ) : (
                  "Resolve Request"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ResolveTransportRequest;
