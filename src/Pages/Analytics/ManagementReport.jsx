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
  TextField,
  Button,
} from "@mui/material";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PercentIcon from "@mui/icons-material/Percent";
import ReplayIcon from "@mui/icons-material/Replay";

// ── KPI card config ──────────────────────────────────────────────────────────
const KPI_CONFIG = [
  {
    key: "open_complaints",
    label: "Open Complaints",
    icon: AssignmentLateIcon,
    color: "#d32f2f",
    bg: "#ffebee",
    format: "number",
  },
  {
    key: "approved_cases_awaiting_finance_action",
    label: "Awaiting Finance Action",
    icon: HourglassTopIcon,
    color: "#ed6c02",
    bg: "#fff3e0",
    format: "count",
  },
  {
    key: "credit_note_value_mtd",
    label: "Credit Note Value (MTD)",
    icon: ReceiptIcon,
    color: "#1976d2",
    bg: "#e3f0fb",
    format: "currency",
  },
  {
    key: "debit_note_value_mtd",
    label: "Debit Note Value (MTD)",
    icon: RequestQuoteIcon,
    color: "#9c27b0",
    bg: "#f3e5f5",
    format: "currency",
  },
  {
    key: "credit_note_percentage_of_sales",
    label: "Credit Note % of Sales",
    icon: PercentIcon,
    color: "#0288d1",
    bg: "#e1f5fe",
    format: "percent",
  },
  {
    key: "repeat_complaints",
    label: "Repeat Complaints",
    icon: ReplayIcon,
    color: "#2e7d32",
    bg: "#e8f5e9",
    format: "number",
  },
];

const DEPT_COLORS = ["#1976d2", "#ed6c02", "#9c27b0", "#2e7d32", "#d32f2f"];
const AGEING_COLORS = ["#2e7d32", "#0288d1", "#ed6c02", "#f57c00", "#d32f2f"];
const TOP10_COLOR = "#1976d2";

// ── Ageing bucket label map ──────────────────────────────────────────────────
const AGEING_LABELS = {
  "0_2_days": "0–2 Days",
  "3_7_days": "3–7 Days",
  "8_15_days": "8–15 Days",
  "16_30_days": "16–30 Days",
  gt_30_days: ">30 Days",
};

// ── Format KPI value ─────────────────────────────────────────────────────────
function formatValue(value, format) {
  if (value === undefined || value === null) return "0";

  if (format === "count") {
    var count = value && value.count !== undefined ? value.count : value;
    return String(count !== null && count !== undefined ? count : 0);
  }
  if (format === "currency") {
    var num = Number(value);
    if (isNaN(num)) return "₹0";
    if (num >= 100000) {
      return "₹" + (num / 100000).toFixed(2) + "L";
    }
    return "₹" + num.toLocaleString("en-IN");
  }
  if (format === "percent") {
    return Number(value).toFixed(2) + "%";
  }
  return String(value);
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg, format }) {
  var [hovered, setHovered] = useState(false);

  return (
    <Card
      elevation={hovered ? 6 : 2}
      onMouseEnter={function () {
        setHovered(true);
      }}
      onMouseLeave={function () {
        setHovered(false);
      }}
      style={{
        borderRadius: 12,
        borderTop: "4px solid " + color,
        height: "100%",
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
              variant="h4"
              style={{
                color: color,
                fontWeight: 800,
                lineHeight: 1.2,
                marginTop: 6,
              }}
            >
              {formatValue(value, format)}
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
            <Icon style={{ fontSize: 28, color: color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Chart empty state ────────────────────────────────────────────────────────
function EmptyChart({ height }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height || 280}
    >
      <Typography color="textSecondary" variant="body2">
        No data available.
      </Typography>
    </Box>
  );
}

// ── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
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
      {children}
    </Typography>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
const ManagementReport = () => {
  var today = new Date();
  var firstOfMonth =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-01";
  var todayStr =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  var [startDate, setStartDate] = useState(firstOfMonth);
  var [endDate, setEndDate] = useState(todayStr);
  var [managementData, setManagementData] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);

  var getManagementData = async function (start, end) {
    try {
      setLoading(true);
      setError(null);
      var response = await DashboardService.getManagementComplaintDashboard(
        start,
        end,
      );
      setManagementData(response.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(function () {
    getManagementData(startDate, endDate);
  }, []);

  var handleApply = function () {
    getManagementData(startDate, endDate);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  var kpiCards =
    managementData && managementData.kpi_cards ? managementData.kpi_cards : {};

  var deptChart =
    managementData && managementData.department_responsibility_chart
      ? managementData.department_responsibility_chart
      : [];

  var ageingChart =
    managementData && managementData.ageing_bucket_chart
      ? managementData.ageing_bucket_chart
      : [];

  var top10Customers =
    managementData && managementData.top_10_customers_chart
      ? managementData.top_10_customers_chart
      : [];

  var top10Reasons =
    managementData && managementData.top_10_reason_categories_chart
      ? managementData.top_10_reason_categories_chart
      : [];

  var repeatComplaints =
    managementData && managementData.repeat_complaints !== undefined
      ? managementData.repeat_complaints
      : 0;

  // ── Build chart data ───────────────────────────────────────────────────────

  // Department pie data
  var deptPieData = null;
  if (deptChart.length > 0) {
    var deptRows = deptChart
      .filter(function (d) {
        return d.total_cases > 0;
      })
      .map(function (d) {
        return [d.department, d.total_cases];
      });
    if (deptRows.length > 0) {
      deptPieData = [["Department", "Cases"]].concat(deptRows);
    }
  }

  // Ageing bar data
  var ageingBarData = null;
  if (ageingChart.length > 0) {
    var ageingRows = ageingChart.map(function (d) {
      return [AGEING_LABELS[d.bucket] || d.bucket, d.value];
    });
    ageingBarData = [["Bucket", "Cases"]].concat(ageingRows);
  }

  // Top 10 customers bar data
  var top10CustData = null;
  if (top10Customers.length > 0) {
    var custRows = top10Customers.map(function (d) {
      return [d.customer || d.name || "", d.count || d.value || 0];
    });
    top10CustData = [["Customer", "Complaints"]].concat(custRows);
  }

  // Top 10 reasons bar data
  var top10ReasonData = null;
  if (top10Reasons.length > 0) {
    var reasonRows = top10Reasons.map(function (d) {
      return [d.category || d.name || "", d.count || d.value || 0];
    });
    top10ReasonData = [["Category", "Count"]].concat(reasonRows);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box
      style={{
        padding: "24px",
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <Box mb={3}>
        <Typography
          variant="h5"
          style={{ fontWeight: 800, color: "#1a237e", letterSpacing: 0.5 }}
        >
          Management Report
        </Typography>
        <Typography variant="body2" style={{ color: "#757575", marginTop: 2 }}>
          Customer Complaint — Management Overview
        </Typography>
        <Divider style={{ marginTop: 12 }} />
      </Box>

      {/* ── Date Filter ── */}
      <Card elevation={1} style={{ borderRadius: 12, marginBottom: 24 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={function (e) {
                  setStartDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="End Date"
                type="date"
                value={endDate}
                onChange={function (e) {
                  setEndDate(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleApply}
                disabled={loading}
                style={{
                  borderRadius: 8,
                  fontWeight: 700,
                  textTransform: "none",
                  background: "#1a237e",
                }}
              >
                {loading ? "Loading..." : "Apply"}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" style={{ color: "#9e9e9e" }}>
                Showing data from{" "}
                <strong style={{ color: "#1a237e" }}>{startDate}</strong> to{" "}
                <strong style={{ color: "#1a237e" }}>{endDate}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Loading / Error ── */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && (
        <>
          {/* ── KPI Cards ── */}
          <Box mb={1}>
            <SectionLabel>Key Performance Indicators</SectionLabel>
            <Divider style={{ marginTop: 4, marginBottom: 12 }} />
          </Box>
          <Grid container spacing={3} style={{ marginBottom: 28 }}>
            {KPI_CONFIG.slice(0, 5).map(function (cfg) {
              return (
                <Grid item xs={12} sm={6} md={4} lg={2} key={cfg.key}>
                  <StatCard
                    label={cfg.label}
                    value={kpiCards[cfg.key]}
                    icon={cfg.icon}
                    color={cfg.color}
                    bg={cfg.bg}
                    format={cfg.format}
                  />
                </Grid>
              );
            })}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard
                label="Repeat Complaints"
                value={repeatComplaints}
                icon={ReplayIcon}
                color="#2e7d32"
                bg="#e8f5e9"
                format="number"
              />
            </Grid>
          </Grid>

          {/* ── Row 1: Dept Pie + Ageing Bar ── */}
          <Box mb={1}>
            <SectionLabel>Complaint Analysis</SectionLabel>
            <Divider style={{ marginTop: 4, marginBottom: 12 }} />
          </Box>
          <Grid container spacing={3} style={{ marginBottom: 24 }}>
            {/* Department Responsibility */}
            <Grid item xs={12} md={5}>
              <Card elevation={2} style={{ borderRadius: 12, height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontWeight: 700,
                      color: "#37474f",
                      marginBottom: 4,
                    }}
                  >
                    Department Responsibility
                  </Typography>
                  <Typography variant="caption" style={{ color: "#9e9e9e" }}>
                    Total cases by responsible department
                  </Typography>
                  {deptPieData ? (
                    <Chart
                      chartType="PieChart"
                      data={deptPieData}
                      options={{
                        pieHole: 0.42,
                        colors: DEPT_COLORS,
                        legend: {
                          position: "bottom",
                          textStyle: { fontSize: 12 },
                        },
                        chartArea: { width: "90%", height: "72%" },
                        tooltip: { showColorCode: true },
                        pieSliceTextStyle: { fontSize: 12, bold: true },
                      }}
                      width="100%"
                      height="300px"
                    />
                  ) : (
                    <EmptyChart height={300} />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Ageing Bucket */}
            <Grid item xs={12} md={7}>
              <Card elevation={2} style={{ borderRadius: 12, height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontWeight: 700,
                      color: "#37474f",
                      marginBottom: 4,
                    }}
                  >
                    Ageing Bucket Analysis
                  </Typography>
                  <Typography variant="caption" style={{ color: "#9e9e9e" }}>
                    Open complaints by age range
                  </Typography>
                  {ageingBarData ? (
                    <Chart
                      chartType="ColumnChart"
                      data={ageingBarData}
                      options={{
                        colors: AGEING_COLORS,
                        legend: { position: "none" },
                        chartArea: { width: "82%", height: "68%" },
                        hAxis: { textStyle: { fontSize: 11 } },
                        vAxis: {
                          minValue: 0,
                          gridlines: { count: 4 },
                          textStyle: { fontSize: 11 },
                        },
                        bar: { groupWidth: "52%" },
                        animation: {
                          startup: true,
                          duration: 600,
                          easing: "out",
                        },
                      }}
                      width="100%"
                      height="300px"
                    />
                  ) : (
                    <EmptyChart height={300} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Row 2: Top 10 Customers + Top 10 Reasons ── */}
          <Box mb={1}>
            <SectionLabel>Top 10 Analysis</SectionLabel>
            <Divider style={{ marginTop: 4, marginBottom: 12 }} />
          </Box>
          <Grid container spacing={3} style={{ marginBottom: 24 }}>
            {/* Top 10 Customers */}
            <Grid item xs={12} md={6}>
              <Card elevation={2} style={{ borderRadius: 12 }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontWeight: 700,
                      color: "#37474f",
                      marginBottom: 4,
                    }}
                  >
                    Top 10 Customers by Complaints
                  </Typography>
                  <Typography variant="caption" style={{ color: "#9e9e9e" }}>
                    Customers with the most complaints in selected range
                  </Typography>
                  {top10CustData ? (
                    <Chart
                      chartType="BarChart"
                      data={top10CustData}
                      options={{
                        colors: [TOP10_COLOR],
                        legend: { position: "none" },
                        chartArea: { width: "62%", height: "82%" },
                        hAxis: {
                          minValue: 0,
                          textStyle: { fontSize: 11 },
                          gridlines: { count: 4 },
                        },
                        vAxis: { textStyle: { fontSize: 11 } },
                        bar: { groupWidth: "60%" },
                        animation: {
                          startup: true,
                          duration: 600,
                          easing: "out",
                        },
                      }}
                      width="100%"
                      height="320px"
                    />
                  ) : (
                    <EmptyChart height={320} />
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Top 10 Reason Categories */}
            <Grid item xs={12} md={6}>
              <Card elevation={2} style={{ borderRadius: 12 }}>
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontWeight: 700,
                      color: "#37474f",
                      marginBottom: 4,
                    }}
                  >
                    Top 10 Reason Categories
                  </Typography>
                  <Typography variant="caption" style={{ color: "#9e9e9e" }}>
                    Most frequent complaint reasons
                  </Typography>
                  {top10ReasonData ? (
                    <Chart
                      chartType="BarChart"
                      data={top10ReasonData}
                      options={{
                        colors: ["#9c27b0"],
                        legend: { position: "none" },
                        chartArea: { width: "62%", height: "82%" },
                        hAxis: {
                          minValue: 0,
                          textStyle: { fontSize: 11 },
                          gridlines: { count: 4 },
                        },
                        vAxis: { textStyle: { fontSize: 11 } },
                        bar: { groupWidth: "60%" },
                        animation: {
                          startup: true,
                          duration: 600,
                          easing: "out",
                        },
                      }}
                      width="100%"
                      height="320px"
                    />
                  ) : (
                    <EmptyChart height={320} />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Summary row: department table ── */}
          <Box mb={1}>
            <SectionLabel>Department Summary Table</SectionLabel>
            <Divider style={{ marginTop: 4, marginBottom: 12 }} />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={2} style={{ borderRadius: 12 }}>
                <CardContent>
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {deptChart.length > 0 ? (
                      deptChart.map(function (dept, i) {
                        var color = DEPT_COLORS[i % DEPT_COLORS.length];
                        return (
                          <Box
                            key={dept.department}
                            style={{
                              background: "#f8fafc",
                              borderRadius: 10,
                              padding: "16px 20px",
                              borderLeft: "4px solid " + color,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            }}
                          >
                            <Typography
                              variant="caption"
                              style={{
                                color: "#9e9e9e",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              {dept.department}
                            </Typography>
                            <Typography
                              variant="h4"
                              style={{
                                color: color,
                                fontWeight: 800,
                                marginTop: 4,
                              }}
                            >
                              {dept.total_cases}
                            </Typography>
                            <Typography
                              variant="caption"
                              style={{ color: "#bdbdbd" }}
                            >
                              total cases
                            </Typography>
                          </Box>
                        );
                      })
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ padding: 16 }}
                      >
                        No department data available.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ManagementReport;
