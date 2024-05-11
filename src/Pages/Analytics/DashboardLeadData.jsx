import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import DashboardService from "../../services/DashboardService";
import CustomTextField from "../../Components/CustomTextField";

export const DashboardLeadData = () => {
  const [leadData, setLeadData] = useState({
    stage_based_leads: [],
    source_based_leads: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);

  useEffect(() => {
    fetchLeadData();
  }, []);

  const fetchLeadData = async () => {
    const leadStage = {
      new: "New",
      open: "Open",
      close: "Closed",
      opportunity: "Opportunity",
      potential: "Potential",
      interested: "Interested",
      converted: "Converted",
      "not interested": "Not Interested",
    };

    try {
      const response = await DashboardService.getLeadRetailData();
      const data = response.data;

      // Map and update stage names
      const stageLeads = data.stage_based_leads.map((item) => ({
        ...item,
        updated_stage_name: leadStage[item.stage] || "Unknown Stage",
        type: "stage",
      }));

      // Source-based leads
      const sourceLeads = data.source_based_leads.map((item) => ({
        ...item,
        type: "source",
        references__source: item.references__source || "Unknown Source",
      }));

      // Combine both sets of leads
      const combinedData = [...stageLeads, ...sourceLeads];

      setLeadData(data);
      setTotalLeads(data.total_leads);
      setFilteredData(combinedData);
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  const handleFilterChange = (event, value, type) => {
    if (type === "stage" && value) {
      setFilteredData(
        leadData.stage_based_leads
          .filter((item) => item.stage === value.stage)
          .map((item) => ({ ...item, type: "stage" }))
      );
    } else if (type === "source" && value) {
      setFilteredData(
        leadData.source_based_leads
          .filter(
            (item) => item.references__source === value.references__source
          )
          .map((item) => ({ ...item, type: "source" }))
      );
    } else {
      // If no specific filter is selected, show all leads
      const stageLeads = leadData.stage_based_leads.map((item) => ({
        ...item,
        type: "stage",
      }));
      const sourceLeads = leadData.source_based_leads.map((item) => ({
        ...item,
        type: "source",
        references__source: item.references__source || "Unknown Source",
      }));
      setFilteredData([...stageLeads, ...sourceLeads]);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            options={leadData.stage_based_leads}
            getOptionLabel={(option) => option.updated_stage_name}
            onChange={(event, value) =>
              handleFilterChange(event, value, "stage")
            }
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Filter by Stage"
                variant="outlined"
              />
            )}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            options={leadData.source_based_leads}
            getOptionLabel={(option) =>
              option.references__source || "Unknown Source"
            }
            onChange={(event, value) =>
              handleFilterChange(event, value, "source")
            }
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Filter by Source"
                variant="outlined"
              />
            )}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              fontSize: "1.25rem",
              fontFamily: "Arial, sans-serif",
              color: "#333",
              margin: "10px 0",
            }}
          >
            Total Leads: {totalLeads}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {filteredData.map((data, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {data.type === "stage"
                        ? data.updated_stage_name
                        : data.references__source || "Unknown Source"}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Leads: {data.total_leads}
                    </Typography>
                    {data.type === "source" && (
                      <>
                        <Typography color="text.secondary">
                          New: {data.new}
                        </Typography>
                        <Typography color="text.secondary">
                          Open : {data.open}
                        </Typography>
                        <Typography color="text.secondary">
                          Opportunity : {data.opportunity}
                        </Typography>
                        <Typography color="text.secondary">
                          Potential : {data.potential}
                        </Typography>
                        <Typography color="text.secondary">
                          Interested : {data.interested}
                        </Typography>
                        <Typography color="text.secondary">
                          Converted : {data.converted}
                        </Typography>
                        <Typography color="text.secondary">
                          Not-Interested : {data.not_interested}
                        </Typography>
                        <Typography color="text.secondary">
                          Closed : {data.close}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
