import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Card, CardContent, CardHeader } from "@mui/material";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import DashboardService from "../../services/DashboardService";
import { CustomLoader } from "../../Components/CustomLoader";

export const DashboardLeadData = () => {
  const [leadData, setLeadData] = useState({
    stage_based_leads: [],
    source_based_leads: [],
  });
  const [selectedSource, setSelectedSource] = useState("Accumetric");
  const [totalLeads, setTotalLeads] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchLeadData();
  }, []);

  const data = {
    totalLeads: totalLeads,
    stageBasedLeads: leadData.stage_based_leads,
    sourceBasedLeads: leadData.source_based_leads,
  };

  const fetchLeadData = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getLeadRetailData();
      const data = response.data;
      setLeadData(data);
      setTotalLeads(data.total_leads);
    } catch (error) {
      console.error("Error fetching lead data:", error);
    } finally {
      setOpen(false);
    }
  };

  // Prepare data for stage-based chart
  const stageChartData = [
    ["Stage", "Total Leads"],
    ...data.stageBasedLeads.map((item) => [item.stage, item.total_leads]),
  ];

  const stageChartDataOption = {
    title: "Leads by Stage",
    hAxis: {
      title: "Stages",
      textStyle: { fontSize: 12 },
    },
    vAxis: {
      title: "Total Leads",
      minValue: 0,
      gridlines: { count: 6 },
    },
    legend: { position: "none" },
    bar: { groupWidth: "50%" },
    animation: {
      duration: 500,
      easing: "out",
    },
  };
  // Prepare data for source-based chart
  const filteredSources = selectedSource
    ? data.sourceBasedLeads.filter(
        (item) => item.references__source === selectedSource
      )
    : data.sourceBasedLeads;

  const sourceChartData = [
    ["Source", "Total Leads"],
    ...filteredSources.map((item) => [
      item.references__source || "Unknown",
      item.total_leads,
    ]),
  ];

  const sourceChartOptions = {
    title: "Leads by Source",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Total Leads",
      minValue: 0,
    },
    vAxis: {
      title: "Source",
    },
    animation: {
      duration: 500,
      easing: "out",
    },
  };
  return (
    <>
      <CustomLoader open={open}></CustomLoader>
      <div className="p-4 grid gap-4 mx-auto w-[70%] ">
        <Card className="shadow-lg mb-2">
          <CardContent>
            <h2 className="text-md font-extrabold tracking-tight text-center">
              Total Leads : <span className="mx-2"> {data.totalLeads}</span>
            </h2>
          </CardContent>
        </Card>
        <Card className="shadow-lg mb-2">
          <CardHeader>
            <h2 className="text-xl font-bold">Leads by Stage</h2>
          </CardHeader>
          <CardContent>
            <Chart
              chartType="ColumnChart"
              data={stageChartData}
              options={stageChartDataOption}
              width="100%"
              height="300px"
            />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-bold">Leads by Source</h2>
          </CardHeader>
          <CardContent>
            <CustomAutocomplete
              size="small"
              value={selectedSource}
              disablePortal
              id="combo-box-stage"
              onChange={(e, value) => setSelectedSource(value)}
              options={data.sourceBasedLeads.map(
                (option) => option.references__source
              )}
              getOptionLabel={(option) => option}
              label="Filter By Source"
            />
            <Chart
              chartType="BarChart"
              data={sourceChartData}
              options={sourceChartOptions}
              width="100%"
              height="300px"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
