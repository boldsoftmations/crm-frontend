import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Paper, Snackbar, Alert } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { JobOpeningCreate } from "./JobOpeningCreate";
import { JobOpeningUpdate } from "./JobOpeningUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { ApplicantListCreate } from "../ApplicantList/ApplicantListCreate";
import { useSelector } from "react-redux";

export const JobOpeningView = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [editJobOpening, setEditJobOpening] = useState({});
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(false);
  const [openApplicantListPopup, setOpenApplicantListPopup] = useState(false);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const isSalesManager = users.groups.includes("Sales Manager");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      setShowSuccessMessage(true);
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
    "Sr.No",
    "Job Id",
    "Date of Opening",
    "Designation",
    "Location",
    "Salary Range",
    "Date of Closing",
    "Open Duration",
    "No Of Opening",
    // "Position",
    "Action",
  ];

  const handleSuccess = () => {
    setOpenApplicantListPopup(false);
    fetchJobOpenings();
  };
  const TableData = jobOpenings.map((job) => ({
    id: job.id,
    job: job.job_id,
    opening_date: job.opening_date,
    designation: job.designation,
    location: job.location,
    salary_ranges: job.salary_ranges,
    closing_date: job.closing_date,
    days_open: job.days_open,
    no_of_openings: job.no_of_openings,
    // position: job.position,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
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
            Job Opening
          </h3>
        </Box>
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={6000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccessMessage(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Job opening created successfully!
          </Alert>
        </Snackbar>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
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
            openInPopup7={!isSalesManager ? openInPopup7 : null}
            onEdit={handleEditJobOpeningClick}
          />
        </Paper>
        {!isSalesManager && (
          <Popup
            title="Add New Applicant"
            openPopup={openApplicantListPopup}
            setOpenPopup={setOpenApplicantListPopup}
          >
            <ApplicantListCreate
              jobOpeningId={recordForEdit.job}
              onSuccess={handleSuccess}
            />
          </Popup>
        )}

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
      </Paper>
    </Grid>
  );
};