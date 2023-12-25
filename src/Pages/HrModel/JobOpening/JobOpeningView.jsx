import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Button, Paper, Snackbar, Alert } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { JobOpeningCreate } from "./JobOpeningCreate";
import { JobOpeningUpdate } from "./JobOpeningUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { ApplicantListCreate } from "../ApplicantList/ApplicantListCreate";
import { useSelector } from "react-redux";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const JobOpeningView = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };
  const openInPopup7 = (item) => {
    handleAddApplicantClick(item);
  };

  useEffect(() => {
    fetchJobOpenings(currentPage);
  }, [currentPage, fetchJobOpenings]);

  const fetchJobOpenings = useCallback(
    async (page, query = searchQuery) => {
      try {
        setIsLoading(true);
        const response = await Hr.getJobOpening(page, query);
        console.log(response.data);
        setJobOpenings(response.data.results);
        const total = response.data.count;
        setPageCount(Math.ceil(total / 25));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching job openings:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery]
  );

  const addNewJobOpening = async (newJob) => {
    try {
      setIsLoading(true);
      await Hr.addJobOpening(newJob);
      fetchJobOpenings();
      setOpenCreatePopup(false);
      setShowSuccessMessage(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding job opening:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobOpening = async (id, updates) => {
    try {
      setIsLoading(true);
      await Hr.updateJobOpening(id, updates);
      fetchJobOpenings();
      setOpenEditPopup(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating job opening:", error);
    } finally {
      setIsLoading(false);
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
    "No Of Vacancies",
    // "Position",
    "Action",
  ];

  const handleSuccess = () => {
    setOpenApplicantListPopup(false);
    fetchJobOpenings();
  };
  const TableData = Array.isArray(jobOpenings)
    ? jobOpenings.map((job) => ({
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
      }))
    : [];
  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchJobOpenings(currentPage, searchQuery)}
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    fetchJobOpenings(1, "");
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>

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
          </Box>
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
              Job Openings
            </h3>
          </Box>

          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
            openInPopup7={!isSalesManager ? openInPopup7 : null}
            onEdit={handleEditJobOpeningClick}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />

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
    </>
  );
};
