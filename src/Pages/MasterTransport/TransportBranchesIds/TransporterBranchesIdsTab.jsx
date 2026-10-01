import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import MasterService from "../../../services/MasterService";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

import TransportBranchCreate from "./TransportBranchCreate";
import TransportBranchUpdate from "./TransportBranchUpdate";
import TransportIdentifierCreate from "./TransportIdentifierCreate";
import TransportIdentifierUpdate from "./TransportIdentifierUpdate";

// V3 handover, Section 6: branches and identifiers are shown together for
// usability but are separate backend child tables. An identifier can apply
// to more than one branch (API confirms via "branches": [id, id] on the
// identifier), so this view fetches both lists independently and, for each
// branch, derives "IDs applicable to this branch" by filtering identifiers
// whose branches array includes that branch's id - it does not assume a
// 1:1 branch->identifier relationship.

const TransporterBranchesIdsTab = ({ transporter, onDataChanged }) => {
  const [branches, setBranches] = useState([]);
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openBranchCreate, setOpenBranchCreate] = useState(false);
  const [openBranchUpdate, setOpenBranchUpdate] = useState(false);
  const [openIdentifierCreate, setOpenIdentifierCreate] = useState(false);
  const [openIdentifierUpdate, setOpenIdentifierUpdate] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getBranchData = useCallback(async (transporterId) => {
    if (!transporterId) return;
    try {
      const response = await MasterService.getAllTransportBranch(
        transporterId,
      );
      const results =
        response && response.data && response.data.results
          ? response.data.results
          : response && response.data
            ? response.data
            : [];
      setBranches(Array.isArray(results) ? results : []);
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIdentifierData = useCallback(async (transporterId) => {
    if (!transporterId) return;
    try {
      const response = await MasterService.getAllTransportIdentifier(
        transporterId,
      );
      const results =
        response && response.data && response.data.results
          ? response.data.results
          : response && response.data
            ? response.data
            : [];
      setIdentifiers(Array.isArray(results) ? results : []);
    } catch (error) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!transporter || !transporter.id) return;
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        getBranchData(transporter.id),
        getIdentifierData(transporter.id),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [transporter, getBranchData, getIdentifierData]);

  const refreshBranchData = useCallback(
    async (transporterId) => {
      await getBranchData(transporterId);
      if (onDataChanged) {
        onDataChanged();
      }
    },
    [getBranchData, onDataChanged],
  );

  const refreshIdentifierData = useCallback(
    async (transporterId) => {
      await getIdentifierData(transporterId);
      if (onDataChanged) {
        onDataChanged();
      }
    },
    [getIdentifierData, onDataChanged],
  );

  const getIdentifierBranchId = (branch) => {
    if (branch && typeof branch === "object") {
      return branch.id;
    }
    return branch;
  };

  const identifiersForBranch = (branchId) =>
    identifiers.filter((identifier) => {
      if (!identifier || !Array.isArray(identifier.branches)) {
        return false;
      }

      return identifier.branches.some(
        (linkedBranch) =>
          String(getIdentifierBranchId(linkedBranch)) === String(branchId),
      );
    });

  const getIdentifierTypeLabel = (value) => {
    if (value === "COMMON_ENROLMENT") {
      return "Common Enrolment Number";
    }
    return value || "";
  };

  const getLinkedBranches = (identifier) => {
    if (!identifier || !Array.isArray(identifier.branches)) {
      return [];
    }

    const linkedIds = identifier.branches
      .map((branch) => getIdentifierBranchId(branch))
      .filter((id) => id !== null && id !== undefined && id !== "")
      .map((id) => String(id));

    return branches.filter(
      (branch) => branch && linkedIds.includes(String(branch.id)),
    );
  };

  const openBranchEdit = (branch) => {
    setRecordForEdit(branch);
    setOpenBranchUpdate(true);
  };

  const openIdentifierEdit = (identifier) => {
    setRecordForEdit(identifier);
    setOpenIdentifierUpdate(true);
  };

  if (!transporter) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      <CustomLoader open={loading} />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenBranchCreate(true)}>
          + Add Branch
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenIdentifierCreate(true)}
          disabled={branches.length === 0}
        >
          + Add Statutory Details
        </Button>
      </Stack>
      {branches.length === 0 && (
        <Typography variant="caption" sx={{ color: "#999" }}>
          Add at least one branch before adding statutory details.
        </Typography>
      )}

      {branches.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#fafbff",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            sx={{ mb: identifiers.length > 0 ? 1.5 : 0 }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Statutory Details
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                Select an existing GSTIN / TRANSIN to add or remove linked branches.
              </Typography>
            </Box>
            <Chip
              size="small"
              label={String(identifiers.length) + " record(s)"}
              variant="outlined"
            />
          </Stack>

          {identifiers.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#999" }}>
              No statutory details added yet.
            </Typography>
          ) : (
            identifiers.map((identifier) => {
              const linkedBranches = getLinkedBranches(identifier);

              return (
                <Box
                  key={identifier.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    border: "1px solid #e6e9f2",
                    borderRadius: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={1.5}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Chip
                          size="small"
                          label={getIdentifierTypeLabel(
                            identifier.identifier_type,
                          )}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {identifier.identifier_value}
                        </Typography>
                        {identifier.is_primary ? (
                          <Chip size="small" color="primary" label="Primary" />
                        ) : null}
                        {!identifier.is_active ? (
                          <Chip size="small" label="Inactive" />
                        ) : null}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ mt: 1 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#666", mr: 0.5 }}
                        >
                          Linked Branches:
                        </Typography>
                        {linkedBranches.length === 0 ? (
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            None
                          </Typography>
                        ) : (
                          linkedBranches.map((branch) => (
                            <Chip
                              key={branch.id}
                              size="small"
                              variant="outlined"
                              label={branch.branch_name || "Branch #" + branch.id}
                            />
                          ))
                        )}
                      </Stack>
                    </Box>

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => openIdentifierEdit(identifier)}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Update / Manage Branches
                    </Button>
                  </Stack>
                </Box>
              );
            })
          )}
        </Paper>
      )}

      {branches.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", color: "#999" }}>
          No branches recorded yet for this transporter.
        </Paper>
      ) : (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {branches.map((branch) => (
            <Grid item xs={12} key={branch.id}>
              <Paper sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        {branch.branch_name}
                      </Typography>
                      <Chip
                        label={branch.is_active ? "ACTIVE" : "INACTIVE"}
                        color={branch.is_active ? "success" : "default"}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Address: {branch.address || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      City: {branch.city} | Pincode: {branch.pincode}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => openBranchEdit(branch)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    Statutory details applicable to this branch:
                  </Typography>
                  {identifiersForBranch(branch.id).length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "#999", ml: 1, display: "block" }}
                    >
                      - None recorded
                    </Typography>
                  ) : (
                    identifiersForBranch(branch.id).map((identifier) => (
                      <Stack
                        key={identifier.id}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ ml: 1 }}
                      >
                        <Typography variant="body2">
                          - {getIdentifierTypeLabel(identifier.identifier_type)}{" "}
                          {identifier.identifier_value}
                          {identifier.is_primary ? " (Primary)" : ""}
                          {!identifier.is_active ? " (Inactive)" : ""}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                          onClick={() => openIdentifierEdit(identifier)}
                          sx={{ minWidth: "auto", textTransform: "none" }}
                        >
                          Manage Branches
                        </Button>
                      </Stack>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Branch */}
      <Popup
        maxWidth="sm"
        title="Add Branch"
        openPopup={openBranchCreate}
        setOpenPopup={setOpenBranchCreate}
      >
        <TransportBranchCreate
          transporterId={transporter.id}
          transporterName={transporter.transporter_name}
          getBranchData={refreshBranchData}
          setOpenPopup={setOpenBranchCreate}
        />
      </Popup>

      {/* Update Branch */}
      <Popup
        maxWidth="sm"
        title="Update Branch"
        openPopup={openBranchUpdate}
        setOpenPopup={setOpenBranchUpdate}
      >
        <TransportBranchUpdate
          recordForEdit={recordForEdit}
          transporterId={transporter.id}
          getBranchData={refreshBranchData}
          setOpenPopup={setOpenBranchUpdate}
        />
      </Popup>

      {/* Add Identifier */}
      <Popup
        maxWidth="sm"
        title="Add Statutory Details"
        openPopup={openIdentifierCreate}
        setOpenPopup={setOpenIdentifierCreate}
      >
        <TransportIdentifierCreate
          transporterId={transporter.id}
          transporterName={transporter.transporter_name}
          branchOptions={branches}
          getIdentifierData={refreshIdentifierData}
          setOpenPopup={setOpenIdentifierCreate}
        />
      </Popup>

      {/* Update Identifier */}
      <Popup
        maxWidth="sm"
        title="Update Statutory Details"
        openPopup={openIdentifierUpdate}
        setOpenPopup={setOpenIdentifierUpdate}
      >
        <TransportIdentifierUpdate
          key={
            recordForEdit && recordForEdit.id
              ? "statutory-" + String(recordForEdit.id)
              : "statutory-empty"
          }
          recordForEdit={recordForEdit}
          transporterId={transporter.id}
          branchOptions={branches}
          getIdentifierData={refreshIdentifierData}
          setOpenPopup={setOpenIdentifierUpdate}
        />
      </Popup>
    </Box>
  );
};

export default TransporterBranchesIdsTab;
