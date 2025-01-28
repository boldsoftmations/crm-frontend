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

  const fetchLeadData = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getLeadRetailData();
      if (response.data) {
        setLeadData(response.data);
        setTotalLeads(response.data.total_leads || 0);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    } finally {
      setOpen(false);
    }
  };

  const calculateTotals = (key, filteredData) =>
    filteredData.reduce((sum, item) => sum + (item[key] || 0), 0);

  const filteredSources =
    selectedSource && leadData.source_based_leads.length > 0
      ? leadData.source_based_leads.filter(
          (item) => item.references__source === selectedSource
        )
      : leadData.source_based_leads;

  const stageChartData = [
    ["Stage", "Total Leads"], // Header row
    ...(leadData.stage_based_leads || []).map((item) => [
      `${item.stage.charAt(0).toUpperCase() + item.stage.slice(1)} [${
        item.total_leads || 0
      }]`, // Stage name with total leads in brackets
      item.total_leads || 0, // Numeric total leads
    ]),
  ];

  const sourceChartData = [
    [
      "Source",
      `New [${calculateTotals("new", filteredSources)}]`,
      `Open [${calculateTotals("open", filteredSources)}]`,
      `Opportunity [${calculateTotals("opportunity", filteredSources)}]`,
      `Potential [${calculateTotals("potential", filteredSources)}]`,
      `Interested [${calculateTotals("interested", filteredSources)}]`,
      `Converted [${calculateTotals("converted", filteredSources)}]`,
      `Not Interested [${calculateTotals("not_interested", filteredSources)}]`,
      `Close [${calculateTotals("close", filteredSources)}]`,
    ],
    ...filteredSources.map((item) => [
      item.references__source || "Unknown",
      item.new || 0,
      item.open || 0,
      item.opportunity || 0,
      item.potential || 0,
      item.interested || 0,
      item.converted || 0,
      item.not_interested || 0,
      item.close || 0,
    ]),
  ];

  const chartOptions = {
    stage: {
      title: "Leads by Stage",
      hAxis: { title: "Stages", textStyle: { fontSize: 12 } },
      vAxis: { title: "Total Leads", minValue: 0, gridlines: { count: 8 } },
      legend: { position: "none" },
      bar: { groupWidth: "50%" },
      animation: { duration: 500, easing: "out" },
    },
    source: {
      title: "Leads by Source",
      chartArea: { width: "60%" },
      isStacked: true,
      hAxis: {
        title: "Total Leads",
        minValue: 0,
        gridlines: { count: 12 },
      },
      vAxis: { title: "Source" },
      animation: { duration: 500, easing: "out" },
    },
  };

  return (
    <>
      <CustomLoader open={open} />
      <div className="p-4 grid gap-4 mx-auto w-[70%]">
        <Card className="shadow-lg mb-2">
          <CardContent>
            <h2 className="text-md font-extrabold tracking-tight text-center">
              Total Leads: <span className="mx-2">{totalLeads}</span>
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
              options={chartOptions.stage}
              width="100%"
              height="400px"
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
              options={leadData.source_based_leads.map(
                (option) => option.references__source
              )}
              getOptionLabel={(option) => option}
              label="Filter By Source"
            />
            <Chart
              chartType="BarChart"
              data={sourceChartData}
              options={chartOptions.source}
              width="100%"
              height="400px"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
