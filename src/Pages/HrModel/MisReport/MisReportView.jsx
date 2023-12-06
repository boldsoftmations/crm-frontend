import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Chart } from "react-google-charts";
import CustomAxios from "../../../services/api";

export const MisReportView = () => {
  const [jobOpeningData, setJobOpeningData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [applicationSourcesData, setApplicationSourcesData] = useState([]);
  const [avgDaysToHire, setAvgDaysToHire] = useState([]);
  const [placementRate, setPlacementRate] = useState([]);
  const [ctcChartData, setCtcChartData] = useState([]);
  const [costAnalysisData, setCostAnalysisData] = useState([]);
  const [rejectionReasonsData, setRejectionReasonsData] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthName = months[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  useEffect(() => {
    let monthNumber = months.indexOf(selectedMonth) + 1;
    getMisReport(monthNumber)
      .then((response) => {
        const data = response.data;
        transformData(data);
        transformRejectionReasonsData(data.rejection_reasons);
      })
      .catch((error) => {
        console.error("Error fetching MIS report data:", error);
      });
  }, [selectedMonth]);

  const getMisReport = async (month) => {
    return CustomAxios.get(`/api/hr/mis-report/?month=${month}`);
  };

  const transformData = (data) => {
    const jobData = [
      ["Category", "Count"],
      ["Total Job Openings", data.jobopening_count],
      ["Open Job Count", data.open_job_count],
      ["Closed Job Count", data.close_job_count],
      ["New Job Openings", data.new_jobopening_count],
    ];
    setJobOpeningData(jobData);

    const pipeline = [
      ["Stage", "Value", { role: "style" }, { role: "annotation" }],
      [
        "Applicants Joined",
        data.applicant_joined_count,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 2; fill-color: #4374E0; fill-opacity: 0.2",
        "",
      ],
      [
        "Offered Candidates",
        data.offered_candidates_count,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 4; fill-color: #4374E0; fill-opacity: 0.4",
        "",
      ],
      [
        "Interviewed Candidates",
        data.interviewed_candidates_count,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 6; fill-color: #4374E0; fill-opacity: 0.6",
        "",
      ],
      [
        "Active Candidates",
        data.active_candidates_count,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 8; fill-color: #4374E0; fill-opacity: 0.8",
        "",
      ],
      [
        "Shortlisted Applicants",
        data.shortlisted_applicants,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 10; fill-color: #4374E0; fill-opacity: 1",
        "Total Applicants",
      ],
      [
        "Total Applicants",
        data.total_applicants,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 12; fill-color: #4374E0; fill-opacity: 1",
        "Shortlisted Applicants",
      ],
    ];
    setPipelineData(pipeline);

    const avgHireData = [
      ["Label", "Value"],
      ["Average Days to Hire", data.average_days_to_hire.avg_days_to_hire],
    ];
    setAvgDaysToHire(avgHireData);

    const ctcData = [
      ["Category", "Count"],
      ["Candidates Hired Below CTC", parseInt(data.candidates_hired_below_ctc)],
      ["Candidates Hired Above CTC", parseInt(data.candidates_hired_above_ctc)],
    ];
    setCtcChartData(ctcData);

    const costAnalysis = [
      ["Type", "Amount"],
      ["Total Saved", parseInt(data.total_saved)],
      ["Total Extra Offered", parseInt(data.total_extra_offered)],
    ];
    setCostAnalysisData(costAnalysis);

    const placementData = [
      ["Label", "Value"],
      ["Placement Rate", data.placement_rate],
    ];
    setPlacementRate(placementData);

    const appSources = [["Source", "Total"]];
    data.application_sources.forEach((source) => {
      appSources.push([source.source__name, source.total]);
    });
    setApplicationSourcesData(appSources);
  };
  const funnelChartData = () => {
    const sortedData = pipelineData.slice(1).sort((a, b) => b[1] - a[1]);
    const funnelData = [
      ["Stage", "Value", { role: "style" }],
      ...sortedData.map((item, index) => [
        item[0],
        item[1],
        `opacity: ${1 - index * 0.1}; color: ${item[2]};`,
      ]),
    ];
    return funnelData;
  };
  const transformRejectionReasonsData = (data) => {
    const chartData = [["Rejection Reason", "Number of Candidates"]];
    data.forEach((item) => {
      chartData.push([item.rejection_reason, item.num_candidates]);
    });
    setRejectionReasonsData(chartData);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        MIS Report
      </Typography>
      <Box marginBottom={2}>
        <Autocomplete
          value={selectedMonth}
          onChange={(event, newValue) => {
            setSelectedMonth(newValue);
          }}
          options={months}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Month"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Box>
      <Grid container spacing={3}>
        {/* Job Opening Data Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="ColumnChart"
              data={jobOpeningData}
              options={{
                title: "Job Opening Details",
                hAxis: { title: "Category" },
                vAxis: { title: "Count" },
                legend: "none",
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>

        {/* Recruitment Pipeline Data Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={funnelChartData()}
              options={{
                title: "Recruitment Pipeline",
                legend: { position: "none" },
                hAxis: { minValue: 0 },
                chartArea: { width: "50%", height: "80%" },
                bar: { groupWidth: "95%" },
                isStacked: true,
                annotations: {
                  textStyle: {
                    fontSize: 14,
                    bold: true,
                    auraColor: "none",
                  },
                  alwaysOutside: true,
                },
              }}
            />
          </Box>
        </Grid>
        {/* Application Sources Data Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="PieChart"
              data={applicationSourcesData}
              options={{
                title: "Application Sources",
                hAxis: { title: "Total Applications" },
                vAxis: { title: "Source" },
                legend: "none",
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>
        {/* Placement Rate Chart */}
        <Grid container justifyContent="center" item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="Gauge"
              data={placementRate}
              options={{
                title: "Placement Rate",
                redFrom: 0,
                redTo: 25,
                yellowFrom: 25,
                yellowTo: 50,
                greenFrom: 50,
                greenTo: 100,
                minorTicks: 5,
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>

        {/* CTC Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="ColumnChart"
              data={ctcChartData}
              options={{
                title: "CTC Comparison",
                vAxis: { title: "Count" },
                legend: "none",
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>
        {/* Cost Analysis Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="ColumnChart"
              data={costAnalysisData}
              options={{
                title: "Cost Analysis",
                vAxis: { title: "Amount" },
                legend: "none",
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="ColumnChart"
              data={rejectionReasonsData}
              options={{
                title: "Rejection Reasons",
                is3D: true,
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>

        {/* Average Days to Hire Chart */}
        <Grid item xs={12} md={6}>
          <Box boxShadow={3}>
            <Chart
              chartType="LineChart"
              data={avgDaysToHire}
              options={{
                title: "Average Days to Hire",
                redFrom: 0,
                redTo: 5,
                yellowFrom: 5,
                yellowTo: 10,
                greenFrom: 10,
                greenTo: 20,
                minorTicks: 1,
              }}
              width="100%"
              height="400px"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
