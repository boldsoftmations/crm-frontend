import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import { useDispatch } from "react-redux";

export const AllFollowup = (props) => {
  const { assigned, descriptionMenuData, product } = props;
  const [open, setOpen] = useState(false);
  const [allFollowupData, setAllFollowupData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [searchQuery, setSearchQuery] = useState("");

  const openInPopup = async (item) => {
    try {
      setOpen(true);
      setLeadsByID(item.lead);
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);
    getSearchData(value);
  };

  const getResetData = (value) => {
    setSearchQuery("");
    getFollowup();
  };

  useEffect(() => {
    getFollowup();
  }, [startDate, endDate]);

  const getFollowup = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      if (currentPage) {
        const response = await LeadServices.getFollowupWithPagination(
          StartDate,
          EndDate,
          currentPage
        );
        setAllFollowupData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        let response = await LeadServices.getAllFollowup(StartDate, EndDate);
        if (response) {
          setAllFollowupData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        }
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("error all followup", err);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await LeadServices.getFollowupWithSearch(
        StartDate,
        EndDate,
        "user_email",
        filterSearch
      );
      if (response) {
        setAllFollowupData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getFollowup();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search sale register", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response = await LeadServices.getFollowupWithPaginationAndSearch(
          StartDate,
          EndDate,
          page,
          "user_email",
          searchQuery
        );
        if (response) {
          setAllFollowupData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getFollowup();
          setSearchQuery("");
        }
      } else {
        const response = await LeadServices.getFollowupWithPagination(
          StartDate,
          EndDate,
          page
        );
        setAllFollowupData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tabledata = allFollowupData.map((row, i) => ({
    id: row.id,
    lead: row.leads,
    name: row.name,
    company: row.company,
    user: row.user,

    current_date: moment(row.current_date ? row.current_date : "-").format(
      "DD/MM/YYYY h:mm:ss"
    ),
    next_followup_date: moment(
      row.next_followup_date ? row.next_followup_date : "-"
    ).format("DD/MM/YYYY h:mm:ss"),
    notes: row.notes,
  }));

  const Tableheaders = [
    "ID",
    "LEADS",
    "NAME",
    "COMPANY",
    "USER",
    "CURRENT DATE",
    "NEXT FOLLOWUP DATE",
    "NOTE",
    "ACTION",
  ];

  return (
    <>
      <CustomLoader open={open} />

      {/* Pending FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <TextField
                sx={{ marginRight: 2 }}
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                min={minDate}
                max={maxDate}
                onChange={handleStartDateChange}
              />

              <TextField
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                min={
                  startDate ? startDate.toISOString().split("T")[0] : minDate
                }
                max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Box>
            <Box flexGrow={1}>
              <Autocomplete
                sx={{ maxWidth: 400 }}
                size="small"
                onChange={(event, value) => handleInputChange(value)}
                value={searchQuery}
                options={assigned.map((option) => option.email)}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Filter By Sales Person" />
                )}
              />
            </Box>
            <Box flexGrow={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetData}
              >
                Reset
              </Button>
            </Box>

            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                All Followup
              </h3>
            </Box>
            <Box flexGrow={1}></Box>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          leadsByID={leadsByID}
          product={product}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getFollowup}
        />
      </Popup>
    </>
  );
};
