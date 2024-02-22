import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CustomAutocomplete from "../Components/CustomAutocomplete";
import DashboardService from "../services/DashboardService";

export const DashboardLeadData = () => {
  const [leadData, setLeadData] = useState({
    stage_based_leads: [],
    source_based_leads: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("");
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
      setLeadData(data);
      setTotalLeads(data.total_leads);
      const combinedData = [
        ...data.stage_based_leads.map(
          (item) => (
            (item.updated_stage_name = leadStage[item.stage]),
            {
              ...item,
              type: "stage",
            }
          )
        ),
        ...data.source_based_leads.map((item) => ({
          ...item,
          type: "source",
          references__source: item.references__source || "Unknown Source",
        })),
      ];
      setFilteredData(combinedData);
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  const handleFilterChange = (event, value, reason, type) => {
    setFilterType(type);
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
      const combinedData = [
        ...leadData.stage_based_leads.map((item) => ({
          ...item,
          type: "stage",
        })),
        ...leadData.source_based_leads.map((item) => ({
          ...item,
          type: "source",
          references__source: item.references__source || "Unknown Source",
        })),
      ];
      setFilteredData(combinedData);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            options={leadData.stage_based_leads}
            getOptionLabel={(option) => option.updated_stage_name}
            onChange={(event, value, reason) =>
              handleFilterChange(event, value, reason, "stage")
            }
            renderInput={(params) => (
              <TextField
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
            onChange={(event, value, reason) =>
              handleFilterChange(event, value, reason, "source")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Source"
                variant="outlined"
              />
            )}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ textAlign: "centre" }}>
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
