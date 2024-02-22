import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Grid, Paper, TextField } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const Automation = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScheduledFilter, setIsScheduledFilter] = useState("");

  useEffect(() => {
    getAutomationData();
  }, [currentPage, isScheduledFilter]);

  const getAutomationData = async (page = currentPage) => {
    try {
      setOpen(true);
      const res = await CustomerServices.getAutomatioData(
        page,
        isScheduledFilter
      );
      setWhatsappGroupData(res.data.results);
      setPageCount(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event, value) => {
    const filterValue = value ? value.value : "";
    setIsScheduledFilter(filterValue);
  };

  const filterOptions = [
    { label: "All", value: "" },
    { label: "Scheduled", value: "True" },
    { label: "Not Scheduled", value: "False" },
  ];

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        id: row.id,
        ref_id: row.ref_id,
        next_schedule_date: row.next_schedule_date,
        schedular_type: row.schedular_type,
        generation_date: row.generation_date,
      }))
    : [];

  const Tableheaders = [
    "Id",
    "Reference Id ",
    "Next Scheduled Date",
    "Schedular Type",
    "Generation Date",
  ];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  fullWidth
                  options={filterOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Is Scheduled" />
                  )}
                  value={filterOptions.find(
                    (option) => option.value === isScheduledFilter
                  )}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Scheduler Log
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable headers={Tableheaders} data={Tabledata} />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </>
  );
};
