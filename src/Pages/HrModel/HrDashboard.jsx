import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Box, Paper } from "@mui/material";
import { Chart } from "react-google-charts";
import CustomAxios from "../../services/api";

export const HrDashboard = () => {
  const [jobOpeningSummary, setJobOpeningSummary] = useState({});
  const [pipelineSummary, setPipelineSummary] = useState({});
  const [applicationSourcesData, setApplicationSourcesData] = useState([]);
  const [averageDaysToHire, setAverageDaysToHire] = useState(0);
  const [placementRate, setPlacementRate] = useState(0);
  const [rejectionReasons, setRejectionReasons] = useState([]);

  useEffect(() => {
    CustomAxios.get("/api/hr/dashboard/")
      .then((response) => {
        const data = response.data;
        transformData(data);
      })
      .catch((error) => {
        console.error("Error fetching HR dashboard data:", error);
      });
  }, []);

  const transformData = (data) => {
    setJobOpeningSummary({
      TotalJobOpenings: data.jobopening,
      OpenJobOpenings: data.open_job,
      ClosedJobOpenings: data.close_job,
      NewJobOpenings: data.new_jobopening,
    });

    setPipelineSummary({
      TotalApplicants: data.total_applicants,
      Shortlisted: data.shortlisted_applicants,
      Interviewed: data.interviewed_candidates,
      Offered: data.offered_candidates,
      ActiveCandidates: data.active_candidates,
      Joined: data.applicant_joined,
    });

    setAverageDaysToHire(data.average_days_to_hire.avg_days_to_hire);
    setPlacementRate(data.placement_rate);
    setRejectionReasons(data.rejection_reasons);

    const appSources = [["Source", "Total"]];
    data.application_sources.forEach((source) => {
      appSources.push([source.source__name, source.total]);
    });
    setApplicationSourcesData(appSources);
  };

  const getRejectionReasonsChartData = () => {
    const chartData = [["Rejection Reason", "Number of Candidates"]];
    rejectionReasons.forEach((reason) => {
      chartData.push([reason.rejection_reason, reason.num_candidates]);
    });
    return chartData;
  };

  const getBarChartData = (data) => {
    const chartData = [["Metric", "Count"]];
    for (const [key, value] of Object.entries(data)) {
      chartData.push([key.replace(/([A-Z])/g, " $1").trim(), value]);
    }
    return chartData;
  };

  return (
    <Container>
      {/* Summary Panels */}
      <Box>
        <Grid container spacing={3}>
          {Object.entries(jobOpeningSummary).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <SummaryPanel
                title={key.replace(/([A-Z])/g, " $1").trim()}
                value={value}
              />
            </Grid>
          ))}

          {Object.entries(pipelineSummary).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <SummaryPanel
                title={key.replace(/([A-Z])/g, " $1").trim()}
                value={value}
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={3}>
            <SummaryPanel
              title="Average Days to Hire"
              value={averageDaysToHire.toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryPanel
              title="Placement Rate"
              value={`${placementRate.toFixed(2)}%`}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Charts */}
      <Box mt={5}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <Box boxShadow={3} p={2} component={Paper}>
              <Chart
                chartType="PieChart"
                data={applicationSourcesData}
                options={{ title: "Application Sources" }}
                width="100%"
                height="400px"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box boxShadow={3} p={2} component={Paper}>
              <Chart
                chartType="BarChart"
                data={getBarChartData(pipelineSummary)}
                options={{ title: "Recruitment Pipeline" }}
                width="100%"
                height="400px"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box boxShadow={3} p={2} component={Paper}>
              <Chart
                chartType="ColumnChart"
                data={getRejectionReasonsChartData()}
                options={{ title: "Rejection Reasons" }}
                width="100%"
                height="400px"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const SummaryPanel = ({ title, value }) => (
  <Box boxShadow={3} p={2} component={Paper} style={{ textAlign: "center" }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{value || "-"}</Typography>
  </Box>
);
