import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useSelector } from "react-redux";

import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

import MasterService from "../../../services/MasterService";
import TransportMappingUpdate from "./TransportMappingUpdate";
import TransportMappingCreate from "./TransportMappingCreate";
import { canEditTransporterMappings } from "../../../utility/masterAccess";
import InvoiceServices from "../../../services/InvoiceService";

const TransPortMapping = ({ lockedTransporter }) => {
  const [mappingData, setMappingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // false = Active, true = Inactive
  const [isInactiveFilter, setIsInactiveFilter] = useState(false);

  // Filter states - GAP FIX (2/3 + 3/3): when opened from inside a
  // transporter's workspace (lockedTransporter passed in), this is forced
  // to that transporter and the filter dropdown is hidden, same as
  // Contacts. On top of that, Serviceability only applies to Surface
  // transporters (doc Section 8: "This tab is primarily for Surface / Road
  // transporters... Courier providers marked universal do not need PIN
  // rows.") - if the locked transporter isn't Surface, this renders a
  // message instead of the mapping list/create UI further down.
  const [selectedTransporter, setSelectedTransporter] = useState(
    lockedTransporter || null,
  );
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedPincode, setSelectedPincode] = useState(null);

  useEffect(() => {
    if (lockedTransporter) {
      setSelectedTransporter(lockedTransporter);
    }
  }, [lockedTransporter]);

  // Filter options
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  // const [pincodeOptions, setPincodeOptions] = useState([]);

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const userData = useSelector((state) => state.auth.profile);

  const canEditMappings = canEditTransporterMappings(userData);

  const tableHeader = [
    "ID",
    "TRANSPORTER",
    "PINCODE",
    "UNIT",
    "CREATED BY",
    "UPDATED BY",
    "CREATION DATE",
    "UPDATED DATE",
    "IS INACTIVE",
    "ACTION",
  ];

  // ==============================
  // Fetch Filter Options
  // ==============================
  const getFilterOptions = async () => {
    try {
      const transportRes = await MasterService.getAllTransportMaster();
      console.log("trans is ", transportRes);

      // const pincodeRes = await MasterService.getMasterPincode("all", "");
      const unitRes = await InvoiceServices.getAllSellerAccountData();

      if (transportRes && transportRes.data && transportRes.data.results) {
        setTransporterOptions(transportRes.data.results);
      }
      if (unitRes && unitRes.data && unitRes.data.results) {
        setUnitOptions(unitRes.data.results);
      }
      // if (pincodeRes && pincodeRes.data && pincodeRes.data) {
      //   console.log("pincode is:", pincodeRes);
      //   setPincodeOptions(pincodeRes.data);
      // }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

  // ==============================
  // Fetch Table Data
  // ==============================
  const getMappingData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await MasterService.getTransportMapping(
        isInactiveFilter,
        currentPage,
        searchQuery,
        selectedTransporter ? selectedTransporter.transporter_name : null,
        selectedUnit ? selectedUnit.unit : null,
        selectedPincode ? selectedPincode.pincode : null,
      );

      if (response && response.data && response.data.results) {
        setMappingData(response.data.results);
      } else {
        setMappingData([]);
      }

      if (response && response.data && response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 25));
      } else {
        setTotalPages(0);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [
    isInactiveFilter,
    currentPage,
    searchQuery,
    selectedTransporter,
    selectedUnit,
    selectedPincode,
    handleError,
  ]);

  useEffect(() => {
    getMappingData();
  }, [getMappingData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event, newValue) => {
    if (newValue !== null) {
      setIsInactiveFilter(newValue);
      setCurrentPage(1);
    }
  };

  const handleClearFilters = () => {
    setSelectedTransporter(null);
    setSelectedUnit(null);
    setSelectedPincode(null);
    setCurrentPage(1);
  };

  const openInPopup = (item) => {
    const selectedData = mappingData.find((data) => data.id === item.id);
    setRecordForEdit(selectedData || null);
    setOpenUpdatePopup(true);
  };

  const tableData = mappingData.map((value) => ({
    id: value.id,
    transporter: value.transporter,
    pincode: value.pincode,
    unit: value.unit,
    created_by: value.created_by,
    updated_by: value.updated_by,
    creation_date: value.creation_date,
    updated_date: value.updated_date,
    is_inactive: value.is_inactive ? "Yes" : "No",
  }));

  const hasActiveFilters =
    selectedTransporter || selectedUnit || selectedPincode;

  // GAP FIX (3/3): Serviceability only applies to Surface transporters.
  // When opened from a workspace for a Courier/Local-Adhoc transporter,
  // don't even render the list/filters/Add button - there is nothing
  // valid to map for them (doc: "Never create Train, Bus, Air, Self
  // Pickup or Phase-1 Courier rows for every PIN.").
  if (lockedTransporter && lockedTransporter.transporter_type !== "Surface Transport") {
    return (
      <Paper sx={{ p: 4, m: 4, textAlign: "center" }}>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <h3 style={{ margin: 0, color: "#666" }}>
          Serviceability not applicable
        </h3>
        <p style={{ color: "#999" }}>
          {lockedTransporter.transporter_name} is a{" "}
          {lockedTransporter.transporter_type} transporter. Pincode
          serviceability mapping only applies to Surface transporters -
          {lockedTransporter.transporter_type === "Courier"
            ? " Courier providers are treated as universal, no PIN mapping needed."
            : " no PIN mapping is needed for this type."}
        </p>
      </Paper>
    );
  }

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <CustomLoader open={loading} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          {/* ── Top bar ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              p: 2,
              gap: 2,
            }}
          >
            {/* Search */}
            <Box sx={{ flexGrow: 1, flexBasis: "20%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            {/* Title */}
            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Transport Mapping
              </h3>
            </Box>

            {/* Add Button */}
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: "20%",
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
              }}
            >
              {canEditMappings && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenCreatePopup(true)}
                >
                  Add
                </Button>
              )}
            </Box>
          </Box>

          {/* ── Filter Row ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              px: 2,
              pb: 2,
              gap: 2,
            }}
          >
            {/* Transporter Filter - hidden when locked to one transporter
                from a workspace (Surface-only guard above already ensures
                we only reach here for Surface transporters). */}
            <Box sx={{ minWidth: "200px", flexGrow: 1, maxWidth: "250px" }}>
              {lockedTransporter ? (
                <Box sx={{ fontSize: 14, color: "#555" }}>
                  Transporter: <b>{lockedTransporter.transporter_name}</b>
                </Box>
              ) : (
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  options={transporterOptions}
                  value={selectedTransporter}
                  getOptionLabel={(option) =>
                    option.transporter_name ? option.transporter_name : ""
                  }
                  onChange={(e, value) => {
                    setSelectedTransporter(value || null);
                    setCurrentPage(1);
                  }}
                  label="Filter by Transporter"
                />
              )}
            </Box>

            {/* Unit Filter */}
            <Box sx={{ minWidth: "180px", flexGrow: 1, maxWidth: "220px" }}>
              <CustomAutocomplete
                fullWidth
                size="small"
                options={unitOptions}
                value={selectedUnit}
                getOptionLabel={(option) => (option.unit ? option.unit : "")}
                onChange={(e, value) => {
                  setSelectedUnit(value || null);
                  setCurrentPage(1);
                }}
                label="Filter by Unit"
              />
            </Box>

            {/* Pincode Filter */}
            {/* <Box sx={{ minWidth: "180px", flexGrow: 1, maxWidth: "220px" }}>
              <CustomAutocomplete
                fullWidth
                size="small"
                options={pincodeOptions}
                value={selectedPincode}
                getOptionLabel={(option) =>
                  option.pincode ? String(option.pincode) : ""
                }
                onChange={(e, value) => {
                  setSelectedPincode(value || null);
                  setCurrentPage(1);
                }}
                label="Filter by Pincode"
              />
            </Box> */}

            {/* Clear Filters + Active/Inactive Toggle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginLeft: "auto",
              }}
            >
              {hasActiveFilters && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}

              <ToggleButtonGroup
                value={isInactiveFilter}
                exclusive
                onChange={handleFilterChange}
                size="small"
                color="primary"
              >
                <ToggleButton value={false}>Active</ToggleButton>
                <ToggleButton value={true}>Inactive</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <CustomTable
            headers={tableHeader}
            data={tableData}
            openInPopup={openInPopup}
            Isviewable={canEditMappings}
          />

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      {/* Create Popup */}
      <Popup
        maxWidth="xl"
        title="Create Transport Mapping"
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <TransportMappingCreate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenCreatePopup}
          getMappingData={getMappingData}
          currentPage={currentPage}
          searchQuery={searchQuery}
          lockedTransporter={lockedTransporter}
        />
      </Popup>

      {/* Update Popup */}
      <Popup
        maxWidth="xl"
        title="Update Transport Mapping"
        openPopup={openUpdatePopup}
        setOpenPopup={setOpenUpdatePopup}
      >
        <TransportMappingUpdate
          getMappingData={getMappingData}
          setOpenPopup={setOpenUpdatePopup}
          currentPage={currentPage}
          searchQuery={searchQuery}
          recordForEdit={recordForEdit}
          lockedTransporter={lockedTransporter}
        />
      </Popup>
    </>
  );
};

export default TransPortMapping;
