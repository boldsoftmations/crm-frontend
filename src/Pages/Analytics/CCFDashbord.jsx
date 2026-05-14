import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import DashboardService from "../../services/DashboardService";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import AssignmentNewIcon from "@mui/icons-material/FiberNew";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School"; // 👈 Pending Training
import TaskAltIcon from "@mui/icons-material/TaskAlt"; // 👈 Completed Training
import { useNavigate } from "react-router-dom";

const CARD_CONFIG = [
  {
    key: "today_new_ccf",
    label: "Today New CCF",
    icon: AssignmentNewIcon,
    color: "#1976d2",
    bg: "#e3f0fb",
    tabIndex: 0,
    filterStatus: "",
  },
  {
    key: "pending_verifier_capa",
    label: "Pending Verifier CAPA",
    icon: PendingActionsIcon,
    color: "#ed6c02",
    bg: "#fff3e0",
    tabIndex: 1,
    filterStatus: "Pending",
  },
  {
    key: "pending_accounts",
    label: "Pending Accounts",
    icon: AccountBalanceWalletIcon,
    color: "#9c27b0",
    bg: "#f3e5f5",
    tabIndex: 1,
    filterStatus: "Accept",
  },
  {
    key: "resolved_ccf",
    label: "Resolved CCF",
    icon: CheckCircleIcon,
    color: "#2e7d32",
    bg: "#e8f5e9",
    tabIndex: 2,
    filterStatus: "",
  },
  {
    key: "pending_capa_training", // 👈 new
    label: "Pending CAPA Training",
    icon: SchoolIcon,
    color: "#0288d1",
    bg: "#e1f5fe",
    tabIndex: 3,
    filterStatus: "Pending",
  },
  {
    key: "completed_capa_training", // 👈 new
    label: "Completed CAPA Training",
    icon: TaskAltIcon,
    color: "#558b2f",
    bg: "#f1f8e9",
    tabIndex: 3,
    filterStatus: "Completed",
  },
];

const PIE_COLORS = [
  "#1976d2",
  "#ed6c02",
  "#9c27b0",
  "#2e7d32",
  "#d32f2f",
  "#0288d1",
  "#f57c00",
];

// Extended to cover all 5 status_chart entries
const STATUS_COLORS = [
  "#ed6c02", // Verifier Pending
  "#9c27b0", // Accounts Pending
  "#2e7d32", // Resolved CCF
  "#0288d1", // Pending CAPA Training
  "#558b2f", // Completed CAPA Training
];

function StatCard({ label, value, icon: Icon, color, bg, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      elevation={hovered ? 6 : 2}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        borderTop: "4px solid " + color,
        height: "100%",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              variant="subtitle2"
              style={{ color: "#757575", fontWeight: 600, letterSpacing: 0.5 }}
            >
              {label}
            </Typography>
            <Typography
              variant="h3"
              style={{
                color: color,
                fontWeight: 800,
                lineHeight: 1.2,
                marginTop: 6,
              }}
            >
              {value !== undefined && value !== null ? value : 0}
            </Typography>
          </Box>
          <Box
            style={{
              background: bg,
              borderRadius: "50%",
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ fontSize: 30, color: color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function buildPieData(chartArray) {
  if (!chartArray || chartArray.length === 0) return null;
  var rows = chartArray
    .filter(function (item) {
      return item.value > 0;
    })
    .map(function (item) {
      return [item.name, item.value];
    });
  if (rows.length === 0) return null;
  return [["Category", "Value"]].concat(rows);
}

function CCFDashboard() {
  const [complaintDashboardData, setComplaintDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.getCustomerComplaintDashboard();
      setComplaintDashboardData(response.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const handleCardClick = (tabIndex, filterStatus = "") => {
    navigate(
      `/customer/complaints/ccp-capa?tab=${tabIndex}&status=${filterStatus}`,
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  var cards =
    complaintDashboardData && complaintDashboardData.cards
      ? complaintDashboardData.cards
      : {};
  var complaintCategoryChart =
    complaintDashboardData && complaintDashboardData.complaint_category_chart
      ? complaintDashboardData.complaint_category_chart
      : [];
  var statusChart =
    complaintDashboardData && complaintDashboardData.status_chart
      ? complaintDashboardData.status_chart
      : [];

  var categoryPieData = buildPieData(complaintCategoryChart);
  var statusPieData = buildPieData(statusChart);

  var categoryPieOptions = {
    title: "Complaint Category Distribution",
    titleTextStyle: { fontSize: 15, bold: true, color: "#37474f" },
    pieHole: 0.4,
    colors: PIE_COLORS,
    legend: { position: "bottom", textStyle: { fontSize: 12 } },
    chartArea: { width: "90%", height: "70%" },
    tooltip: { showColorCode: true },
  };

  var statusPieOptions = {
    title: "Status Distribution",
    titleTextStyle: { fontSize: 15, bold: true, color: "#37474f" },
    pieHole: 0.4,
    colors: STATUS_COLORS, // 👈 now covers all 5 slices
    legend: { position: "bottom", textStyle: { fontSize: 12 } },
    chartArea: { width: "90%", height: "70%" },
    tooltip: { showColorCode: true },
  };

  return (
    <Box style={{ padding: "24px", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box mb={3}>
        <Typography
          variant="h5"
          style={{ fontWeight: 800, color: "#1a237e", letterSpacing: 0.5 }}
        >
          CCF Dashboard
        </Typography>
        <Typography variant="body2" style={{ color: "#757575", marginTop: 2 }}>
          Customer Complaint Form — Overview
        </Typography>
        <Divider style={{ marginTop: 12 }} />
      </Box>

      {/* Stat Cards — first row: 4 cards */}
      <Grid container spacing={3} style={{ marginBottom: 20 }}>
        {CARD_CONFIG.slice(0, 4).map(function (cfg) {
          return (
            <Grid item xs={12} sm={6} md={3} key={cfg.key}>
              <StatCard
                label={cfg.label}
                value={cards[cfg.key]}
                icon={cfg.icon}
                color={cfg.color}
                bg={cfg.bg}
                onClick={() => handleCardClick(cfg.tabIndex, cfg.filterStatus)}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Training Cards — second row: 2 cards with section label */}
      <Box mb={1} mt={1}>
        <Typography
          variant="caption"
          style={{
            fontWeight: 700,
            color: "#9e9e9e",
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          CAPA Training
        </Typography>
        <Divider style={{ marginTop: 4, marginBottom: 12 }} />
      </Box>
      <Grid container spacing={3} style={{ marginBottom: 28 }}>
        {CARD_CONFIG.slice(4).map(function (cfg) {
          return (
            <Grid item xs={12} sm={6} md={3} key={cfg.key}>
              <StatCard
                label={cfg.label}
                value={cards[cfg.key]}
                icon={cfg.icon}
                color={cfg.color}
                bg={cfg.bg}
                onClick={() => handleCardClick(cfg.tabIndex, cfg.filterStatus)}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Category Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} style={{ borderRadius: 12 }}>
            <CardContent>
              {categoryPieData ? (
                <Chart
                  chartType="PieChart"
                  data={categoryPieData}
                  options={categoryPieOptions}
                  width="100%"
                  height="340px"
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={340}
                >
                  <Typography color="textSecondary">
                    No complaint category data available.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} style={{ borderRadius: 12 }}>
            <CardContent>
              {statusPieData ? (
                <Chart
                  chartType="PieChart"
                  data={statusPieData}
                  options={statusPieOptions}
                  width="100%"
                  height="340px"
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={340}
                >
                  <Typography color="textSecondary">
                    No status data available.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12}>
          <Card elevation={2} style={{ borderRadius: 12 }}>
            <CardContent>
              {complaintCategoryChart.length > 0 ? (
                <Chart
                  chartType="ColumnChart"
                  data={[["Category", "Count"]].concat(
                    complaintCategoryChart.map(function (item) {
                      return [item.name, item.value];
                    }),
                  )}
                  options={{
                    title: "Complaint Categories — Bar View",
                    titleTextStyle: {
                      fontSize: 15,
                      bold: true,
                      color: "#37474f",
                    },
                    colors: ["#1976d2"],
                    legend: { position: "none" },
                    chartArea: { width: "85%", height: "65%" },
                    hAxis: { textStyle: { fontSize: 12 } },
                    vAxis: {
                      minValue: 0,
                      gridlines: { count: 5 },
                      textStyle: { fontSize: 12 },
                    },
                    bar: { groupWidth: "55%" },
                    animation: { startup: true, duration: 600, easing: "out" },
                  }}
                  width="100%"
                  height="320px"
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height={320}
                >
                  <Typography color="textSecondary">
                    No data available.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CCFDashboard;
