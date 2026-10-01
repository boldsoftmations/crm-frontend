import React from "react";
import { Box, Chip, Divider, Grid, Paper, Typography } from "@mui/material";

const getValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    if (value.name) {
      return value.name;
    }

    if (value.email) {
      return value.email;
    }

    if (value.username) {
      return value.username;
    }

    return "-";
  }

  return value;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const InfoItem = ({ label, value }) => {
  return (
    <Box sx={{ py: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#777",
          fontWeight: 600,
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "#333",
          wordBreak: "break-word",
        }}
      >
        {getValue(value)}
      </Typography>
    </Box>
  );
};

const SummaryCard = ({ label, value }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "#777",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 0.5,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
};

const TransporterOverview = ({ transporter, headerStats, statsLoading }) => {
  if (!transporter) {
    return null;
  }

  const stats = headerStats || {};

  const branchCount =
    stats.branchCount !== null && stats.branchCount !== undefined
      ? stats.branchCount
      : 0;

  const contactCount =
    stats.contactCount !== null && stats.contactCount !== undefined
      ? stats.contactCount
      : 0;

  const primaryIdentifier = stats.primaryIdentifier || null;

  const primaryBranch = stats.primaryBranch || null;

  const isActive = !transporter.is_inactive;

  const getPrimaryIdentifier = () => {
    if (!primaryIdentifier) {
      return "-";
    }

    const type = primaryIdentifier.identifier_type || "";

    const value = primaryIdentifier.identifier_value || "";

    if (type && value) {
      return type + ": " + value;
    }

    return value || type || "-";
  };

  const getPrimaryAddress = () => {
    if (!primaryBranch) {
      return "-";
    }

    const addressParts = [];

    if (primaryBranch.address) {
      addressParts.push(primaryBranch.address);
    }

    if (primaryBranch.city) {
      addressParts.push(primaryBranch.city);
    }

    if (primaryBranch.pincode) {
      addressParts.push(primaryBranch.pincode);
    }

    return addressParts.length > 0 ? addressParts.join(", ") : "-";
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ============================
          SUMMARY
      ============================ */}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            label="Branches"
            value={statsLoading ? "..." : branchCount}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <SummaryCard
            label="Active Contacts"
            value={statsLoading ? "..." : contactCount}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <SummaryCard
            label="Primary Identifier"
            value={
              statsLoading
                ? "..."
                : primaryIdentifier
                  ? primaryIdentifier.identifier_type
                  : "-"
            }
          />
        </Grid>
      </Grid>

      {/* ============================
          BASIC INFORMATION
      ============================ */}

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mt: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Basic Information
          </Typography>

          <Chip
            label={isActive ? "ACTIVE" : "INACTIVE"}
            color={isActive ? "success" : "default"}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              label="Transporter Name"
              value={transporter.transporter_name}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              label="Transporter Type"
              value={transporter.transporter_type}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoItem label="Status" value={isActive ? "Active" : "Inactive"} />
          </Grid>
        </Grid>
      </Paper>

      {/* ============================
          OPERATIONAL INFORMATION
      ============================ */}

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mt: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Operational Information
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Primary Identifier"
              value={statsLoading ? "Loading..." : getPrimaryIdentifier()}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Primary Address"
              value={statsLoading ? "Loading..." : getPrimaryAddress()}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Branches"
              value={statsLoading ? "Loading..." : branchCount}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Active Contacts"
              value={statsLoading ? "Loading..." : contactCount}
            />
          </Grid>
        </Grid>

        {!statsLoading && !primaryIdentifier ? (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 1,
              color: "#999",
            }}
          >
            No primary identifier has been configured yet.
          </Typography>
        ) : null}
      </Paper>

      {/* ============================
          RECORD INFORMATION
      ============================ */}

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mt: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Record Information
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Created By" value={transporter.created_by} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InfoItem
              label="Created Date"
              value={formatDate(transporter.creation_date)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InfoItem label="Updated By" value={transporter.updated_by} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <InfoItem
              label="Updated Date"
              value={formatDate(transporter.updated_date)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransporterOverview;
