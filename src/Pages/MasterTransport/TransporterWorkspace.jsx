import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { CustomTabs } from "../../Components/CustomTabs";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import MasterService from "../../services/MasterService";

import TransPortMapping from "./TransPortMapping/TransPortMapping";
import ContactTransportView from "./TransportContact/ContactTransportView";
import ContactTransportCreate from "./TransportContact/ContactTransportCreate";
import TransportMappingCreate from "./TransPortMapping/TransportMappingCreate";
import TransporterBranchesIdsTab from "./TransportBranchesIds/TransporterBranchesIdsTab";
import {
  canEditTransporterBranches,
  canEditTransporterContacts,
  canEditTransporterMappings,
  canViewTransporterMappings,
  canViewTransporterMaster,
} from "../../utility/masterAccess";

// =============================================================================
// DATA SOURCE NOTICE - updated after Branch/Identifier/Contact APIs went live.
//
// REAL, wired to actual APIs:
//   - Transporter Name / Active-Inactive / Type            -> transporter-master
//   - Branches count                                        -> transporter-branch
//   - Primary Tax Identifier (type + value)                 -> transporter-identifier (is_primary=true)
//   - Active Contacts count                                 -> transporter-contact
//   - Primary Address                                       -> DERIVED (see note below - not a
//                                                               real backend field, read this)
//
// STILL NOT POSSIBLE - no API/field exists anywhere for these, so they are
// left as an honest "Not available" message rather than invented data:
//   - Company Contact Numbers (a single company-level number - only
//     per-person contact numbers exist, see Contacts tab)
//   - Default Payment Terms
//   - Account Manager
//   - General Notes
// If any of these get a real API later, search "STILL MOCK" below.
// =============================================================================

// ---------------------------------------------------------------------------
// Overview UI helpers
// ---------------------------------------------------------------------------
const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

const formatCount = (value, loading) => {
  if (loading) return "...";
  return typeof value === "number" ? String(value) : "—";
};

const MetricCard = ({ icon, label, value, helper, loading }) => (
  <Paper
    variant="outlined"
    sx={{
      height: "100%",
      p: 2,
      borderRadius: 2,
      borderColor: "divider",
      backgroundColor: "background.paper",
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "action.hover",
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          {label}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, lineHeight: 1.3, wordBreak: "break-word" }}
        >
          {loading ? "..." : value}
        </Typography>
        {helper ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {helper}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  </Paper>
);

const SetupStatusRow = ({ label, complete, completeText, pendingText }) => (
  <Stack
    direction="row"
    alignItems="flex-start"
    justifyContent="space-between"
    spacing={2}
    sx={{ py: 1.25 }}
  >
    <Stack direction="row" spacing={1} alignItems="flex-start">
      {complete ? (
        <CheckCircleOutlineIcon fontSize="small" color="success" />
      ) : (
        <ErrorOutlineIcon fontSize="small" color="warning" />
      )}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {complete ? completeText : pendingText}
        </Typography>
      </Box>
    </Stack>
    <Chip
      size="small"
      variant="outlined"
      color={complete ? "success" : "warning"}
      label={complete ? "Ready" : "Needs setup"}
      sx={{ flexShrink: 0 }}
    />
  </Stack>
);

// ---------------------------------------------------------------------------
// Overview tab
// Shows only real/derived transporter data. Fields that do not exist in the
// backend are intentionally not presented as fake editable information.
// ---------------------------------------------------------------------------
const TransporterOverviewTab = ({
  transporter,
  headerStats,
  statsLoading,
  onAddContact,
  onAddServiceability,
}) => {
  if (!transporter) return null;

  const stats = headerStats || {};
  const primaryIdentifier = stats.primaryIdentifier || null;
  const displayIdentifier =
    stats.displayIdentifier || primaryIdentifier || null;
  const linkedIdentifier = stats.linkedIdentifier || null;
  const linkedBranch = stats.linkedBranch || null;
  const branchCount = stats.branchCount;
  const contactCount = stats.contactCount;
  const activeIdentifierCount = stats.activeIdentifierCount;
  const linkedIdentifierCount = stats.linkedIdentifierCount;

  const branchAddressParts = [];
  if (linkedBranch) {
    if (linkedBranch.address) branchAddressParts.push(linkedBranch.address);
    if (linkedBranch.city) branchAddressParts.push(linkedBranch.city);
    if (linkedBranch.state) branchAddressParts.push(linkedBranch.state);
    if (linkedBranch.pincode) branchAddressParts.push(linkedBranch.pincode);
  }

  const statutoryDetailsText = displayIdentifier
    ? (displayIdentifier.identifier_type || "ID") +
      " · " +
      (displayIdentifier.identifier_value || "—")
    : "Not configured";

  return (
    <Box sx={{ py: 2 }}>
      {(onAddContact || onAddServiceability) && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
          {onAddContact && (
            <Button variant="contained" onClick={onAddContact}>
              Add Contact
            </Button>
          )}
          {onAddServiceability && (
            <Button variant="outlined" onClick={onAddServiceability}>
              Add Serviceability
            </Button>
          )}
        </Stack>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, height: "100%" }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Linked Branch & Address
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Shows the branch linked with an active statutory detail
                </Typography>
              </Box>
              {linkedBranch && linkedBranch.branch_name ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={linkedBranch.branch_name}
                />
              ) : null}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LocationOnOutlinedIcon color="action" />
              </Box>
              <Box>
                {linkedBranch ? (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {linkedBranch.branch_name || "Linked branch"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {branchAddressParts.length > 0
                        ? branchAddressParts.join(", ")
                        : "Address not available"}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Branch not linked
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      Add statutory details and link them with a branch in
                      Branches & IDs.
                    </Typography>
                  </>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Statutory Details
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {statutoryDetailsText}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Transporter Type
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {transporter.transporter_type || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Master Record ID
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {hasValue(transporter.id) ? "#" + transporter.id : "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Contact Details
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                  View in Contacts tab
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            variant="outlined"
            sx={{ p: 2.5, borderRadius: 2, height: "100%" }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <InfoOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Master Setup Status
              </Typography>
            </Stack>

            {statsLoading ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", py: 2 }}
              >
                Loading transporter setup status...
              </Typography>
            ) : (
              <>
                <SetupStatusRow
                  label="Statutory details"
                  complete={
                    typeof activeIdentifierCount === "number" &&
                    activeIdentifierCount > 0
                  }
                  completeText={
                    String(activeIdentifierCount) +
                    " active statutory detail(s) configured"
                  }
                  pendingText="Add statutory details in Branches & IDs"
                />
                <Divider />
                <SetupStatusRow
                  label="Branch linkage"
                  complete={
                    typeof linkedIdentifierCount === "number" &&
                    linkedIdentifierCount > 0
                  }
                  completeText={
                    String(linkedIdentifierCount) +
                    " statutory detail(s) linked to branch(es)"
                  }
                  pendingText="Link statutory details with at least one branch"
                />
                <Divider />
                <SetupStatusRow
                  label="Active contacts"
                  complete={
                    typeof contactCount === "number" && contactCount > 0
                  }
                  completeText={
                    String(contactCount) + " active contact(s) available"
                  }
                  pendingText="No active transporter contact found"
                />
                <Divider />
                <SetupStatusRow
                  label="Branch master"
                  complete={typeof branchCount === "number" && branchCount > 0}
                  completeText={String(branchCount) + " branch(es) configured"}
                  pendingText="No transporter branch configured"
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          backgroundColor: "action.hover",
        }}
      >
        {/* <Stack direction="row" spacing={1} alignItems="flex-start">
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Overview shows only data available from Transporter Master,
            Branches, Identifiers and Contacts. Payment terms, account manager
            and general notes are not shown because those fields are not
            available in the current transporter backend model.
          </Typography>
        </Stack> */}
      </Paper>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const TransporterHeader = ({ transporter, headerStats, statsLoading }) => {
  if (!transporter) return null;

  const isActive = !transporter.is_inactive;
  const stats = headerStats || {};
  const branchCount = stats.branchCount;
  const contactCount = stats.contactCount;
  const primaryIdentifier = stats.primaryIdentifier || null;
  const displayIdentifier =
    stats.displayIdentifier || primaryIdentifier || null;
  const activeIdentifierCount = stats.activeIdentifierCount;

  const statutoryValue = displayIdentifier
    ? (displayIdentifier.identifier_type || "ID") +
      " · " +
      (displayIdentifier.identifier_value || "—")
    : typeof activeIdentifierCount === "number" && activeIdentifierCount > 0
      ? String(activeIdentifierCount) + " configured"
      : "Not configured";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2,
        borderRadius: 2.5,
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              backgroundColor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LocalShippingOutlinedIcon fontSize="medium" color="action" />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, lineHeight: 1.2, wordBreak: "break-word" }}
            >
              {transporter.transporter_name || "Transporter"}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mt: 0.75, rowGap: 0.75 }}
            >
              <Chip
                size="small"
                label={transporter.transporter_type || "Type not set"}
                variant="outlined"
              />
              {hasValue(transporter.id) ? (
                <Chip
                  size="small"
                  label={"ID #" + transporter.id}
                  variant="outlined"
                />
              ) : null}
            </Stack>
          </Box>
        </Stack>

        <Chip
          label={isActive ? "ACTIVE" : "INACTIVE"}
          color={isActive ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={4}>
          <MetricCard
            icon={<BusinessOutlinedIcon fontSize="small" />}
            label="Branches"
            value={formatCount(branchCount, statsLoading)}
            helper="Configured transporter branches"
            loading={false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MetricCard
            icon={<ContactsOutlinedIcon fontSize="small" />}
            label="Active Contacts"
            value={formatCount(contactCount, statsLoading)}
            helper="Currently active contacts"
            loading={false}
          />
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <MetricCard
            icon={<BadgeOutlinedIcon fontSize="small" />}
            label="Statutory Details"
            value={statsLoading ? "..." : statutoryValue}
            helper="GSTIN / TRANSIN / enrolment details"
            loading={false}
          />
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export const TransporterWorkspace = ({ transporterId, initialTransporter = null }) => {
  const userData = useSelector((state) => state.auth.profile);
  const canViewOverview = canViewTransporterMaster(userData);
  const canViewBranches = canEditTransporterBranches(userData);
  const canViewContacts = canEditTransporterContacts(userData);
  const canViewServiceability = canViewTransporterMappings(userData);
  const canAddServiceability = canEditTransporterMappings(userData);

  // ---------------------------------------------------------------------
  // Selected transporter is loaded directly from the backend detail route.
  // TransporterMaster is a ModelViewSet, so /transporter-master/{id}/ is
  // available and there is no need to scan paginated active/inactive lists.
  // ---------------------------------------------------------------------
  const [transporter, setTransporter] = useState(initialTransporter);
  const [loading, setLoading] = useState(false);
  const [openContactCreate, setOpenContactCreate] = useState(false);
  const [openServiceabilityCreate, setOpenServiceabilityCreate] = useState(false);
  const [contactRefresh, setContactRefresh] = useState(0);
  const [serviceabilityRefresh, setServiceabilityRefresh] = useState(0);

  const loadTransporter = useCallback(async (id) => {
    if (!id) {
      setTransporter((current) => current?.id === id ? current : null);
      return;
    }

    try {
      setLoading(true);
      const response = await MasterService.getTransportMasterById(id);
      setTransporter(response && response.data ? response.data : null);
    } catch (error) {
      console.error("Error loading transporter record:", error);
      // The list record still contains the fields needed for the workspace.
      // Keep it visible if a role can list transporters but cannot fetch detail.
      setTransporter((current) => current?.id === id ? current : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransporter(transporterId);
  }, [transporterId, loadTransporter]);

  // ---------------------------------------------------------------------
  // Header / Overview stats - real data pulled from the branch, identifier
  // and contact APIs. This is a SEPARATE fetch from the one inside
  // TransporterBranchesIdsTab (that one drives the tab's own CRUD list).
  // Duplicate network calls when you open both, but keeps the two features
  // decoupled for now rather than a bigger refactor to share state between
  // the workspace shell and the tab. Worth consolidating later via a
  // shared hook (e.g. useTransporterBranchesAndIdentifiers) if this
  // becomes a real cost.
  // ---------------------------------------------------------------------
  const [headerStats, setHeaderStats] = useState({
    branchCount: null,
    contactCount: null,
    primaryIdentifier: null,
    displayIdentifier: null,
    linkedIdentifier: null,
    linkedBranch: null,
    activeIdentifierCount: null,
    linkedIdentifierCount: null,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const loadHeaderStats = useCallback(async (currentTransporter) => {
    if (!currentTransporter || !currentTransporter.id) {
      setHeaderStats({
        branchCount: null,
        contactCount: null,
        primaryIdentifier: null,
        displayIdentifier: null,
        linkedIdentifier: null,
        linkedBranch: null,
        activeIdentifierCount: null,
        linkedIdentifierCount: null,
      });
      return;
    }

    try {
      setStatsLoading(true);

      const [branchRes, identifierRes, contactRes] = await Promise.all([
        MasterService.getAllTransportBranch(currentTransporter.id),
        MasterService.getAllTransportIdentifier(currentTransporter.id),
        // getAllTransportConstact filters by transporter NAME (not id) -
        // same as every other place in this app that calls it.
        MasterService.getAllTransportConstact(
          currentTransporter.transporter_name,
          1,
          false, // is_inactive=false -> only ACTIVE contacts, matching the
          // "Active Contacts" label in the header
          "",
        ),
      ]);

      const branches =
        branchRes && branchRes.data && Array.isArray(branchRes.data.results)
          ? branchRes.data.results
          : [];
      const branchCount =
        branchRes && branchRes.data && typeof branchRes.data.count === "number"
          ? branchRes.data.count
          : branches.length;

      const identifiers =
        identifierRes &&
        identifierRes.data &&
        Array.isArray(identifierRes.data.results)
          ? identifierRes.data.results
          : [];
      const activeIdentifiers = identifiers.filter(
        (identifier) => identifier && identifier.is_active !== false,
      );
      const primaryIdentifier =
        activeIdentifiers.find((identifier) => identifier.is_primary) || null;
      const linkedIdentifiers = activeIdentifiers.filter(
        (identifier) =>
          Array.isArray(identifier.branches) && identifier.branches.length > 0,
      );
      const linkedIdentifier =
        (primaryIdentifier &&
        Array.isArray(primaryIdentifier.branches) &&
        primaryIdentifier.branches.length > 0
          ? primaryIdentifier
          : null) ||
        linkedIdentifiers[0] ||
        null;
      const displayIdentifier =
        primaryIdentifier || activeIdentifiers[0] || null;
      const linkedBranch =
        linkedIdentifier &&
        Array.isArray(linkedIdentifier.branches) &&
        linkedIdentifier.branches.length > 0
          ? branches.find((branch) =>
              linkedIdentifier.branches.some(
                (branchId) => String(branch.id) === String(branchId),
              ),
            ) || null
          : null;
      const activeIdentifierCount = activeIdentifiers.length;
      const linkedIdentifierCount = linkedIdentifiers.length;

      const contactCount =
        contactRes &&
        contactRes.data &&
        typeof contactRes.data.count === "number"
          ? contactRes.data.count
          : null;

      setHeaderStats({
        branchCount,
        contactCount,
        primaryIdentifier,
        displayIdentifier,
        linkedIdentifier,
        linkedBranch,
        activeIdentifierCount,
        linkedIdentifierCount,
      });
    } catch (error) {
      console.error("Error loading header stats:", error);
      setHeaderStats({
        branchCount: null,
        contactCount: null,
        primaryIdentifier: null,
        displayIdentifier: null,
        linkedIdentifier: null,
        linkedBranch: null,
        activeIdentifierCount: null,
        linkedIdentifierCount: null,
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeaderStats(transporter);
  }, [transporter, loadHeaderStats]);

  const subTabs = [
    {
      label: "Overview",
      allowed: canViewOverview,
      component: (
        <TransporterOverviewTab
          transporter={transporter}
          headerStats={headerStats}
          statsLoading={statsLoading}
          onAddContact={canViewContacts ? () => setOpenContactCreate(true) : null}
          onAddServiceability={
            canAddServiceability && transporter?.transporter_type === "Surface Transport"
              ? () => setOpenServiceabilityCreate(true)
              : null
          }
        />
      ),
    },
    {
      label: "Branches & IDs",
      allowed: canViewBranches,
      component: (
        <TransporterBranchesIdsTab
          transporter={transporter}
          onDataChanged={() => loadHeaderStats(transporter)}
        />
      ),
    },
    {
      label: "Contacts",
      allowed: canViewContacts,
      component: (
        <ContactTransportView
          key={contactRefresh}
          lockedTransporter={transporter}
        />
      ),
    },
    {
      label: "Serviceability",
      allowed: canViewServiceability,
      component: (
        <TransPortMapping
          key={serviceabilityRefresh}
          lockedTransporter={transporter}
        />
      ),
    },
  ];

  const visibleSubTabs = subTabs.filter((tab) => tab.allowed);

  const [activeSubTab, setActiveSubTab] = useState(0);

  const showTab = (label) => {
    const index = visibleSubTabs.findIndex((tab) => tab.label === label);
    if (index >= 0) setActiveSubTab(index);
  };

  const onContactCreated = () => {
    setContactRefresh((value) => value + 1);
    loadHeaderStats(transporter);
    showTab("Contacts");
  };

  const onServiceabilityCreated = () => {
    setServiceabilityRefresh((value) => value + 1);
    showTab("Serviceability");
  };

  const onSubTabChange = (newIndex) => {
    setActiveSubTab(newIndex);

    const selectedTab = visibleSubTabs[newIndex];
    if (selectedTab && selectedTab.label === "Overview" && transporter) {
      loadHeaderStats(transporter);
    }
  };

  return (
    <Box>
      <CustomLoader open={loading} />

      {transporter ? (
        <TransporterHeader
          transporter={transporter}
          headerStats={headerStats}
          statsLoading={statsLoading}
        />
      ) : (
        !loading && (
          <Paper sx={{ p: 3, m: 2, textAlign: "center", color: "#999" }}>
            Could not load this transporter record. It may have been deactivated
            or removed since you opened it. Go back and try again.
          </Paper>
        )
      )}

      {transporter && (
        <>
          <CustomTabs
            tabs={visibleSubTabs.map((tab) => ({ label: tab.label }))}
            activeTab={activeSubTab}
            onTabChange={onSubTabChange}
          />
          {visibleSubTabs[activeSubTab] ? (
            <div>{visibleSubTabs[activeSubTab].component}</div>
          ) : null}
        </>
      )}

      <Popup
        maxWidth="xl"
        title="Add Contact"
        openPopup={openContactCreate}
        setOpenPopup={setOpenContactCreate}
      >
        {openContactCreate && (
          <ContactTransportCreate
            lockedTransporter={transporter}
            setOpenPopup={setOpenContactCreate}
            getTransportContactData={onContactCreated}
          />
        )}
      </Popup>

      <Popup
        maxWidth="xl"
        title="Add Serviceability"
        openPopup={openServiceabilityCreate}
        setOpenPopup={setOpenServiceabilityCreate}
      >
        {openServiceabilityCreate && (
          <TransportMappingCreate
            lockedTransporter={transporter}
            setOpenPopup={setOpenServiceabilityCreate}
            getMappingData={onServiceabilityCreated}
          />
        )}
      </Popup>
    </Box>
  );
};

export default TransporterWorkspace;
