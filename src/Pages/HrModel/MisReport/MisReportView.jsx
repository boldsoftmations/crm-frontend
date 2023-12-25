import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import CustomAxios from "../../../services/api";
import { CustomChart } from "../../../Components/CustomChart";

const GridItemCard = ({ title, children, xs, sm, lg }) => (
  <Grid item xs={xs} sm={sm} lg={lg}>
    <Card raised>
      <CardContent>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <Divider light />
        {children}
      </CardContent>
    </Card>
  </Grid>
);

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

  const currentYearMonth = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const [selectedYearMonth, setSelectedYearMonth] = useState(currentYearMonth);
  useEffect(() => {
    getMisReport(selectedYearMonth)
      .then((response) => {
        const data = response.data;
        transformData(data);
        transformRejectionReasonsData(data.rejection_reasons);
      })
      .catch((error) => {
        console.error("Error fetching MIS report data:", error);
      });
  }, [selectedYearMonth]);

  const getMisReport = async (year_month) => {
    return CustomAxios.get(`/api/hr/mis-report/?year_month=${year_month}`);
  };

  const transformData = (data) => {
    const jobData = [
      ["Category", "Count"],
      ["Total Job Openings", data.jobopening],
      ["Open Job Count", data.open_job],
      ["Closed Job Count", data.close_job],
      ["New Job Openings", data.new_jobopening],
    ];
    setJobOpeningData(jobData);

    const pipeline = [
      ["Stage", "Value", { role: "style" }, { role: "annotation" }],
      [
        "Applicants Joined",
        data.applicant_joined,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 2; fill-color: #4374E0; fill-opacity: 0.2",
        "",
      ],
      [
        "Offered Candidates",
        data.offered_candidates,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 4; fill-color: #4374E0; fill-opacity: 0.4",
        "",
      ],
      [
        "Interviewed Candidates",
        data.interviewed_candidates,
        "stroke-color: #4374E0; stroke-opacity: 0.6; stroke-width: 6; fill-color: #4374E0; fill-opacity: 0.6",
        "",
      ],
      [
        "Active Candidates",
        data.active_candidates,
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
      [
        "Average Days to Hire",
        data.average_days_to_hire.avg_days_to_hire / 84600,
      ],
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
    if (data.length === 0) {
      setRejectionReasonsData([]);
      return;
    }
    data.forEach((item) => {
      chartData.push([item.rejection_reason, item.num_candidates]);
    });
    setRejectionReasonsData(chartData);
  };

  return (
    <Container>
      <Box marginBottom={2}>
        <TextField
          size="small"
          type="month"
          label="Filter By Month and Year"
          value={selectedYearMonth}
          onChange={(e) => setSelectedYearMonth(e.target.value)}
          sx={{ width: 200, marginRight: "15rem" }}
        />
      </Box>
      <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
        {/* Job Opening Data Chart */}
        <GridItemCard title="Job Opening Overview" xs={12} sm={8} lg={6}>
          <CustomChart
            chartType="ColumnChart"
            data={jobOpeningData}
            options={{
              hAxis: { title: "Category" },
              vAxis: { title: "Count" },
              legend: "none",
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>

        {/* Recruitment Pipeline Data Chart */}
        <GridItemCard
          title="Recruitment Pipeline Overview"
          xs={12}
          sm={8}
          lg={6}
        >
          <CustomChart
            chartType="BarChart"
            data={funnelChartData()}
            options={{
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
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>
        {/* Application Sources Data Chart */}
        <GridItemCard
          title="Application Sources Overview"
          xs={12}
          sm={8}
          lg={6}
        >
          <CustomChart
            chartType="PieChart"
            data={applicationSourcesData}
            options={{
              hAxis: { title: "Total Applications" },
              vAxis: { title: "Source" },
              chartArea: { width: "50%", height: "80%" },
              legend: { position: "none" },
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>
        {/* Placement Rate Chart */}
        <GridItemCard title="Placement Rate Overview" xs={12} sm={8} lg={6}>
          <CustomChart
            chartType="Gauge"
            data={placementRate}
            options={{
              // title: "Placement Rate",
              redFrom: 0,
              redTo: 25,
              yellowFrom: 25,
              yellowTo: 50,
              greenFrom: 50,
              greenTo: 100,
              minorTicks: 5,
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>

        {/* CTC Chart */}
        <GridItemCard title="CTC Comparison Overview" xs={12} sm={8} lg={6}>
          <CustomChart
            chartType="ColumnChart"
            data={ctcChartData}
            options={{
              // title: "CTC Comparison",
              vAxis: { title: "Count" },
              legend: "none",
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>
        {/* Cost Analysis Chart */}
        <GridItemCard title="Cost Analysis Overview" xs={12} sm={8} lg={6}>
          <CustomChart
            chartType="ColumnChart"
            data={costAnalysisData}
            options={{
              // title: "Cost Analysis",
              vAxis: { title: "Amount" },
              legend: "none",
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>

        <GridItemCard title="Rejection Reasons Overview" xs={12} sm={8} lg={6}>
          {rejectionReasonsData.length > 1 && (
            <CustomChart
              chartType="ColumnChart"
              data={rejectionReasonsData}
              options={{
                // title: "Rejection Reasons",
                is3D: true,
              }}
              widthStyle="100%"
              heightStyle="300px"
            />
          )}
        </GridItemCard>

        {/* Average Days to Hire Chart */}
        <GridItemCard
          title="Average Days to Hire Overview"
          xs={12}
          sm={8}
          lg={6}
        >
          <CustomChart
            chartType="LineChart"
            data={avgDaysToHire}
            options={{
              redFrom: 0,
              redTo: 5,
              yellowFrom: 5,
              yellowTo: 10,
              greenFrom: 10,
              greenTo: 20,
              minorTicks: 1,
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </GridItemCard>
      </Grid>
    </Container>
  );
};
