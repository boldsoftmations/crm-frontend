import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { ApplicantListCreate } from "./ApplicantListCreate";
import { ApplicantListUpdate } from "./ApplicantListUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import Hr from "./../../../services/Hr";
import CustomTextField from "../../../Components/CustomTextField";

export const ApplicantListView = () => {
  const [applicants, setApplicants] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const fetchApplicants = async (page = 0, searchValue = "") => {
    try {
      const response = await Hr.getApplicants(page, searchValue);
      setApplicants(response.data.results);
      const total = response.data.count;
      setPageCount(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchApplicants(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchClick = () => {
    setCurrentPage(0);
    fetchApplicants(0, searchQuery);
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const name = applicant.name ? applicant.name.toLowerCase() : "";
    const job = applicant.job ? applicant.job.toLowerCase() : "";
    const email = applicant.email ? applicant.email.toLowerCase() : "";
    const searchLower = searchQuery.toLowerCase();

    return (
      job.includes(searchLower) ||
      email.includes(searchLower) ||
      name.includes(searchLower)
    );
  });

  const addNewApplicant = async (newApplicant) => {
    try {
      await Hr.addApplicant(newApplicant);
      fetchApplicants();
      setOpenCreatePopup(false);
    } catch (error) {
      console.error("Error adding applicant:", error);
    }
  };

  const updateApplicant = async (id, updates) => {
    try {
      await Hr.updateApplicant(id, updates);
      fetchApplicants();
      setOpenUpdatePopup(false);
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
  };

  const handleApplicantAdded = () => {
    fetchApplicants();
    setOpenCreatePopup(false);
  };
  const handleApplicantUpdated = () => {
    fetchApplicants();
    setOpenUpdatePopup(false);
  };

  const TableHeader = [
    "ID",
    "Job ID",
    "Candidate Name",
    "Phone Number",
    "Email",
    "Designation",
    "Source",
    "Shortlisted",
    "Action",
  ];

  const TableData = filteredApplicants.map((applicant) => ({
    id: applicant.id,
    job: applicant.job,
    name: applicant.name,
    contact: applicant.contact,
    email: applicant.email,
    designation: applicant.designation,
    source: applicant.source,
    shortlisted: applicant.shortlisted,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            size="small"
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Grid>
        <Box flexGrow={1} display="flex" justifyContent="center">
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Applicant List
          </h3>
        </Box>

        <Paper sx={{ p: 2, m: 3 }}>
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
        <Popup
          title="Add New Applicant"
          openPopup={openCreatePopup}
          setOpenPopup={setOpenCreatePopup}
        >
          <ApplicantListCreate
            addNewApplicant={addNewApplicant}
            onApplicantAdded={handleApplicantAdded}
          />
        </Popup>
        <Popup
          title="Edit Applicant"
          openPopup={openUpdatePopup}
          setOpenPopup={setOpenUpdatePopup}
        >
          <ApplicantListUpdate
            recordForEdit={recordForEdit}
            updateApplicant={updateApplicant}
            onApplicantUpdated={handleApplicantUpdated}
          />
        </Popup>
      </Paper>
    </Grid>
  );
};
