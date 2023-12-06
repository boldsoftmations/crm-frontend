import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { JobOpeningCreate } from "./JobOpeningCreate";
import { JobOpeningUpdate } from "./JobOpeningUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { ApplicantListCreate } from "../ApplicantList/ApplicantListCreate";

export const JobOpeningView = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [editJobOpening, setEditJobOpening] = useState({});
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(false);
  const [openUpdatePopup7, setOpenUpdatePopup7] = useState(false);
  const [openApplicantListPopup, setOpenApplicantListPopup] = useState(false);

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };
  const openInPopup7 = (item) => {
    handleAddApplicantClick(item);
  };

  const fetchJobOpenings = async () => {
    try {
      const response = await Hr.getJobOpening();
      setJobOpenings(response.data);
    } catch (error) {
      console.error("Error fetching job openings:", error);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const addNewJobOpening = async (newJob) => {
    try {
      await Hr.addJobOpening(newJob);
      fetchJobOpenings();
      setOpenCreatePopup(false);
    } catch (error) {
      console.error("Error adding job opening:", error);
    }
  };

  const updateJobOpening = async (id, updates) => {
    try {
      await Hr.updateJobOpening(id, updates);
      fetchJobOpenings();
      setOpenEditPopup(false);
    } catch (error) {
      console.error("Error updating job opening:", error);
    }
  };

  const handleAddJobOpeningClick = () => setOpenCreatePopup(true);
  const handleEditJobOpeningClick = (job) => {
    setEditJobOpening(job);
    setOpenUpdatePopup(true);
  };
  const handleAddApplicantClick = (job) => {
    setRecordForEdit(job);
    setOpenApplicantListPopup(true);
  };

  const TableHeader = [
    "ID",
    "Date of Opening",
    // "Created By",
    "Designation",
    // "Department",
    "Location",
    "Salary Range",
    // "Date of Closing",
    "Open Duration",
    // "Position",
    "Action",
  ];

  const handleSuccess = () => {
    setOpenApplicantListPopup(false);
    fetchJobOpenings();
  };
  const TableData = jobOpenings.map((job) => ({
    id: job.id,
    opening_date: job.opening_date,
    // created_by: job.created_by,
    designation: job.designation,
    // department: job.department,
    location: job.location,
    salary_ranges: job.salary_ranges,
    // closing_date: job.closing_date,
    days_open: job.days_open,
    // position: job.position,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Job Opening
            </h3>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddJobOpeningClick}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Paper sx={{ p: 2, m: 3 }}>
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={openInPopup}
              openInPopup7={openInPopup7}
              onEdit={handleEditJobOpeningClick}
            />
          </Paper>
          <Popup
            title="Add New Applicant"
            openPopup={openApplicantListPopup}
            setOpenPopup={setOpenApplicantListPopup}
          >
            <ApplicantListCreate
              jobOpeningId={recordForEdit.id}
              onSuccess={handleSuccess}
            />
          </Popup>

          <Popup
            title="Add New Job Opening"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <JobOpeningCreate addNewJobOpening={addNewJobOpening} />
          </Popup>
          <Popup
            title="Edit Job Opening"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <JobOpeningUpdate
              recordForEdit={recordForEdit}
              updateJobOpening={updateJobOpening}
              setOpenUpdatePopup={setOpenUpdatePopup}
              fetchJobOpenings={fetchJobOpenings}
            />
          </Popup>
        </Box>
      </Paper>
    </Grid>
  );
};
