import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";
import CustomerServices from "../../services/CustomerService";
import InvoiceServices from "../../services/InvoiceService";
import MasterService from "../../services/MasterService";

const FINDER_MODES = [
  { value: "SURFACE", label: "Surface / Road" },
  { value: "COURIER", label: "Courier" },
  { value: "LOCAL_AGGREGATOR", label: "Local / Aggregator" },
];

const getArrayData = (response) => {
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

const getIndiaOption = (countries) => {
  if (!Array.isArray(countries)) {
    return null;
  }

  return (
    countries.find(
      (item) =>
        item &&
        item.name &&
        String(item.name).toLowerCase() === "india",
    ) || null
  );
};

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return String(value);
};

const getModeLabel = (modeValue) => {
  const match = FINDER_MODES.find((item) => item.value === modeValue);
  return match ? match.label : modeValue || "-";
};

const normalizeCapabilityResult = (item, modeValue) => {
  const transporterName =
    item && item.transporter
      ? item.transporter
      : item && item.transporter_name
        ? item.transporter_name
        : "";

  return {
    finder_mode: modeValue,
    capability_id: item && item.id ? item.id : null,
    transporter_id:
      item && item.transporter_id ? item.transporter_id : null,
    transporter_name: transporterName,
    transporter_type: getModeLabel(modeValue),
    serviceability_strategy:
      item && item.serviceability_strategy
        ? item.serviceability_strategy
        : "",
    is_active:
      item && item.is_active !== undefined ? item.is_active : true,
    raw: item,
  };
};

export const TransporterFinder = () => {
  const [loading, setLoading] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [sellerOptions, setSellerOptions] = useState([]);

  const [selectedMode, setSelectedMode] = useState(FINDER_MODES[0]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [pincode, setPincode] = useState("");

  const [searched, setSearched] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [verifiedPincode, setVerifiedPincode] = useState("");
  const [transporterSearch, setTransporterSearch] = useState("");
  const [message, setMessage] = useState({
    severity: "",
    text: "",
  });

  const [openContacts, setOpenContacts] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [contactError, setContactError] = useState("");

  const modeValue =
    selectedMode && selectedMode.value ? selectedMode.value : "SURFACE";
  const isSurface = modeValue === "SURFACE";
  const isCapabilityMode =
    modeValue === "COURIER" || modeValue === "LOCAL_AGGREGATOR";

  const normalizedTransporterSearch = transporterSearch.trim().toLowerCase();
  const filteredResultData = resultData.filter((item) => {
    if (!normalizedTransporterSearch) {
      return true;
    }

    const name =
      item && item.transporter_name ? String(item.transporter_name).toLowerCase() : "";
    return name.indexOf(normalizedTransporterSearch) !== -1;
  });

  const closeContacts = () => {
    setOpenContacts(false);
    setSelectedTransporter(null);
    setContactData([]);
    setContactError("");
  };

  const clearSearchResult = () => {
    setSearched(false);
    setResultData([]);
    setVerifiedPincode("");
    setTransporterSearch("");
    setMessage({
      severity: "",
      text: "",
    });
    closeContacts();
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const responses = await Promise.all([
        MasterService.getAllMasterCountries("all"),
        InvoiceServices.getAllPaginateSellerAccountData("all"),
      ]);

      const countries = getArrayData(responses[0]);
      const sellers = getArrayData(responses[1]);

      setCountryOptions(countries);
      setSellerOptions(sellers);

      const india = getIndiaOption(countries);
      if (india) {
        setSelectedCountry(india);
      }
    } catch (error) {
      setMessage({
        severity: "error",
        text: "Unable to load Country or Seller Unit data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleModeChange = (event, value) => {
    setSelectedMode(value || FINDER_MODES[0]);
    clearSearchResult();
  };

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
    clearSearchResult();
  };

  const handleSellerChange = (event, value) => {
    setSelectedSeller(value);
    clearSearchResult();
  };

  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
    clearSearchResult();
  };

  const handleReset = () => {
    setSelectedMode(FINDER_MODES[0]);
    setSelectedCountry(getIndiaOption(countryOptions));
    setSelectedSeller(null);
    setPincode("");
    clearSearchResult();
  };

  const handleViewContacts = async (item) => {
    if (!item || !item.transporter_name) {
      return;
    }

    setSelectedTransporter(item);
    setOpenContacts(true);
    setContactData([]);
    setContactError("");

    try {
      setContactLoading(true);

      const response = await MasterService.getAllTransportConstact(
        item.transporter_name,
        "all",
        false,
        "",
      );

      const contacts = getArrayData(response);
      setContactData(contacts);

      if (contacts.length === 0) {
        setContactError(
          "No active contact details found for this transporter.",
        );
      }
    } catch (error) {
      const backendData =
        error && error.response && error.response.data
          ? error.response.data
          : null;

      const backendMessage =
        backendData && (backendData.message || backendData.detail)
          ? backendData.message || backendData.detail
          : "Unable to load transporter contact details.";

      setContactData([]);
      setContactError(backendMessage);
    } finally {
      setContactLoading(false);
    }
  };

  const findSurfaceTransporters = async () => {
    if (!selectedCountry || !selectedCountry.id) {
      setMessage({
        severity: "warning",
        text: "Please select Country.",
      });
      return;
    }

    if (!pincode || !String(pincode).trim()) {
      setMessage({
        severity: "warning",
        text: "Please enter Destination Pincode / Postal Code.",
      });
      return;
    }

    if (!selectedSeller || !selectedSeller.id || !selectedSeller.unit) {
      setMessage({
        severity: "warning",
        text: "Please select Seller Unit.",
      });
      return;
    }

    try {
      setLoading(true);
      setSearched(false);
      setResultData([]);
      setVerifiedPincode("");
      closeContacts();
      setMessage({
        severity: "",
        text: "",
      });

      const response = await CustomerServices.getPincodeTransporter({
        countryId: selectedCountry.id,
        pincode: String(pincode).trim(),
        unitId: selectedSeller.id,
        unitCode: selectedSeller.unit,
      });

      const data = response && response.data ? response.data : {};
      const options = Array.isArray(data.options) ? data.options : [];

      setSearched(true);
      setVerifiedPincode(
        data.verified_pincode
          ? String(data.verified_pincode)
          : String(pincode).trim(),
      );

      if (!data.mapping_found || options.length === 0) {
        setResultData([]);
        setMessage({
          severity: "warning",
          text:
            "No Surface transporter mapping found for " +
            selectedSeller.unit +
            " and destination " +
            String(pincode).trim() +
            ".",
        });
        return;
      }

      setResultData(
        options.map((item) => ({
          ...item,
          finder_mode: "SURFACE",
        })),
      );

      setMessage({
        severity: "success",
        text:
          options.length +
          " Surface transporter" +
          (options.length > 1 ? "s" : "") +
          " found for this Unit + Pincode.",
      });
    } catch (error) {
      const backendData =
        error && error.response && error.response.data
          ? error.response.data
          : null;

      const backendMessage =
        backendData && (backendData.message || backendData.detail)
          ? backendData.message || backendData.detail
          : "Unable to find transporter for the selected Unit + Pincode.";

      setSearched(true);
      setResultData([]);
      setVerifiedPincode("");
      setMessage({
        severity: "error",
        text: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const findCapabilityTransporters = async () => {
    try {
      setLoading(true);
      setSearched(false);
      setResultData([]);
      setVerifiedPincode("");
      closeContacts();
      setMessage({
        severity: "",
        text: "",
      });

      const response = await CustomerServices.getTransporterCapabilities({
        transportMode: modeValue,
        isActive: true,
      });

      const capabilities = getArrayData(response);
      const normalized = capabilities
        .map((item) => normalizeCapabilityResult(item, modeValue))
        .filter((item) => item.transporter_name);

      setSearched(true);
      setResultData(normalized);

      if (normalized.length === 0) {
        setMessage({
          severity: "warning",
          text:
            "No active " +
            getModeLabel(modeValue) +
            " transporter capability is configured.",
        });
        return;
      }

      setMessage({
        severity: "success",
        text:
          normalized.length +
          " active " +
          getModeLabel(modeValue) +
          " transporter" +
          (normalized.length > 1 ? "s" : "") +
          " found.",
      });
    } catch (error) {
      const backendData =
        error && error.response && error.response.data
          ? error.response.data
          : null;

      const backendMessage =
        backendData && (backendData.message || backendData.detail)
          ? backendData.message || backendData.detail
          : "Unable to load transporter capabilities.";

      setSearched(true);
      setResultData([]);
      setMessage({
        severity: "error",
        text: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFindTransporter = async () => {
    if (isSurface) {
      await findSurfaceTransporters();
      return;
    }

    if (isCapabilityMode) {
      await findCapabilityTransporters();
    }
  };

  const resultTitle =
    modeValue === "SURFACE"
      ? "Available Surface Transporters"
      : "Available " + getModeLabel(modeValue) + " Transporters";

  const emptyTitle =
    modeValue === "SURFACE"
      ? "No mapped Surface transporter found"
      : "No active " + getModeLabel(modeValue) + " transporter found";

  return (
    <Box sx={{ p: 2 }}>
      <CustomLoader open={loading} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Transporter Finder
        </Typography>

        <Typography variant="body2" sx={{ color: "#666", mt: 0.5, mb: 2 }}>
          Find Surface transporters by Unit + Pincode, or view active Courier
          and Local / Aggregator transporters from capability setup.
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              fullWidth
              size="small"
              label="Transport Method"
              options={FINDER_MODES}
              value={selectedMode}
              onChange={handleModeChange}
              getOptionLabel={(option) =>
                option && option.label ? option.label : ""
              }
              isOptionEqualToValue={(option, value) =>
                option && value ? option.value === value.value : false
              }
            />
          </Grid>

          {isSurface ? (
            <>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  label="Country"
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  getOptionLabel={(option) =>
                    option && option.name ? option.name : ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option && value ? option.id === value.id : false
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="pincode"
                  label="Destination Pincode / Postal Code"
                  value={pincode}
                  onChange={handlePincodeChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  label="Seller Unit"
                  options={sellerOptions}
                  value={selectedSeller}
                  onChange={handleSellerChange}
                  getOptionLabel={(option) =>
                    option && option.unit ? option.unit : ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option && value ? option.id === value.id : false
                  }
                />
              </Grid>
            </>
          ) : (
            <Grid item xs={12} md={8}>
              <Alert severity="info">
                {modeValue === "COURIER"
                  ? "Courier finder uses active Courier capability setup. Unit and Pincode are not required."
                  : "Local / Aggregator finder uses active Local / Aggregator capability setup. Unit and Pincode are not required."}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                onClick={handleFindTransporter}
                disabled={loading}
              >
                Find Transporters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {message.text ? (
        <Alert severity={message.severity || "info"} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      ) : null}

      {searched && resultData.length > 0 ? (
        <Paper sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {resultTitle}
              </Typography>

              <Typography variant="caption" sx={{ color: "#666" }}>
                {isSurface
                  ? (selectedSeller && selectedSeller.unit
                      ? selectedSeller.unit
                      : "") +
                    (verifiedPincode ? "  |  " + verifiedPincode : "")
                  : "Active capability records"}
              </Typography>
            </Box>

            <Chip
              size="small"
              label={filteredResultData.length + " Found"}
              color="success"
              variant="outlined"
            />
          </Box>

          <Box sx={{ px: 2, pb: 1.5 }}>
            <CustomTextField
              fullWidth
              size="small"
              label="Search Transporter"
              value={transporterSearch}
              onChange={(event) => setTransporterSearch(event.target.value)}
            />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Transporter Name
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>
                    Transport Method
                  </TableCell>

                  {!isSurface ? (
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Serviceability
                    </TableCell>
                  ) : null}

                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Contact Details
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredResultData.map((item, index) => (
                  <TableRow
                    hover
                    key={
                      item && item.mapping_id
                        ? "mapping-" + String(item.mapping_id)
                        : item && item.capability_id
                          ? "capability-" + String(item.capability_id)
                          : item && item.transporter_id
                            ? "transporter-" +
                              String(item.transporter_id) +
                              "-" +
                              String(index)
                            : String(index)
                    }
                  >
                    <TableCell>
                      {item && item.transporter_name
                        ? item.transporter_name
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {getModeLabel(
                        item && item.finder_mode
                          ? item.finder_mode
                          : modeValue,
                      )}
                    </TableCell>

                    {!isSurface ? (
                      <TableCell>
                        {getDisplayValue(item.serviceability_strategy)}
                      </TableCell>
                    ) : null}

                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewContacts(item)}
                        disabled={!item || !item.transporter_name}
                      >
                        View Contacts
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResultData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isSurface ? 3 : 4}
                      align="center"
                      sx={{ py: 3, color: "text.secondary" }}
                    >
                      No transporter matches your search.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : null}

      {searched && resultData.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {emptyTitle}
          </Typography>

          <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
            {isSurface
              ? "Try another Seller Unit or destination Pincode."
              : "Check Transporter Capability setup and active status."}
          </Typography>
        </Paper>
      ) : null}

      <Dialog
        open={openContacts}
        onClose={closeContacts}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Transporter Contacts
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {selectedTransporter && selectedTransporter.transporter_name
                  ? selectedTransporter.transporter_name
                  : "-"}
                {selectedTransporter && selectedTransporter.finder_mode
                  ? "  |  " +
                    getModeLabel(selectedTransporter.finder_mode)
                  : ""}
              </Typography>
            </Box>

            {!contactLoading && !contactError ? (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                label={
                  contactData.length +
                  " Active Contact" +
                  (contactData.length === 1 ? "" : "s")
                }
              />
            ) : null}
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 0 }}>
          {contactLoading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Loading contact details...
              </Typography>
            </Box>
          ) : contactError ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="warning">{contactError}</Alert>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 430 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Contact Person
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Alternate Mobile
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Primary</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {contactData.map((contact, index) => (
                    <TableRow
                      hover
                      key={
                        contact && contact.id
                          ? String(contact.id)
                          : String(index)
                      }
                    >
                      <TableCell>
                        {getDisplayValue(contact.contact_person)}
                      </TableCell>
                      <TableCell>
                        {getDisplayValue(contact.designation_role)}
                      </TableCell>
                      <TableCell>
                        {getDisplayValue(contact.branch_name)}
                      </TableCell>
                      <TableCell>{getDisplayValue(contact.unit)}</TableCell>
                      <TableCell>{getDisplayValue(contact.city)}</TableCell>
                      <TableCell>
                        {getDisplayValue(contact.mobile_number)}
                      </TableCell>
                      <TableCell>
                        {getDisplayValue(contact.alternate_mobile_number)}
                      </TableCell>
                      <TableCell>{getDisplayValue(contact.email)}</TableCell>
                      <TableCell>
                        {contact && contact.is_primary ? (
                          <Chip
                            size="small"
                            label="Primary"
                            color="primary"
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeContacts}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransporterFinder;
