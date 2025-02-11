import React from "react";
import { Chart } from "react-google-charts";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const CallDashboard = ({ callDashboardData }) => {
  console.log("CallDashboard", callDashboardData);
  const callData = { ...callDashboardData };

  // Bar Chart Data
  const barChartData = [
    ["Call Status", "Count"],
    ["Connected", callData.Connected],
    ["Disconnected", callData.Disconnected],
    ["Incoming", callData.Incoming],
    ["Missed", callData.Missed],
  ];

  // Pie Chart Data
  const pieChartData = [
    ["Call Type", "Count"],
    ["Connected", callData.Connected],
    ["Disconnected", callData.Disconnected],
    ["Incoming", callData.Incoming],
    ["Missed", callData.Missed],
  ];

  // Chart Options
  const barChartOptions = {
    title: "Call Status Overview",
    chartArea: { width: "70%" },
    hAxis: { title: "Number of Calls", minValue: 0 },
    vAxis: { title: "Call Status" },
    bars: "horizontal",
    colors: ["#007bff"],
  };

  const pieChartOptions = {
    title: "Call Status Distribution",
    pieHole: 0.4,
    is3D: false,
    colors: ["#007bff", "#dc3545", "#ffc107", "#17a2b8"],
  };

  return (
    <Grid container spacing={2}>
      {/* Statistics Section */}
      <Grid item xs={12} sm={6} md={6}>
        <Card
          sx={{ backgroundColor: "#007bff", color: "#fff", height: "100%" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              📞 Total Calls : <span> {callData.total_followups}</span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
        <Card
          sx={{ backgroundColor: "#28a745", color: "#fff", height: "100%" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ⏳ Total Duration : <span> {callData.total_duration}</span>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Call Status Overview
            </Typography>
            <Chart
              chartType="BarChart"
              data={barChartData}
              options={barChartOptions}
              width="100%"
              height="350px"
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Call Status Distribution
            </Typography>
            <Chart
              chartType="PieChart"
              data={pieChartData}
              options={pieChartOptions}
              width="100%"
              height="350px"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CallDashboard;
