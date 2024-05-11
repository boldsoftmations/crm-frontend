import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { JobOpeningCreate } from "./JobOpeningCreate";
import { JobOpeningUpdate } from "./JobOpeningUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { ApplicantListCreate } from "../ApplicantList/ApplicantListCreate";
import { useSelector } from "react-redux";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";

export const JobOpeningView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(false);
  const [openApplicantListPopup, setOpenApplicantListPopup] = useState(false);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const isSalesManager = users.groups.includes("Sales Manager");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };
  const openInPopup7 = (item) => {
    handleAddApplicantClick(item);
  };

  const fetchJobOpenings = useCallback(
    async (page, query = searchQuery) => {
      try {
        setIsLoading(true);
        const response = await Hr.getJobOpening(page, query);
        console.log(response.data);
        setJobOpenings(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
        setIsLoading(false);
      } catch (error) {
        handleError(error);
        console.error("Error fetching job openings:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    fetchJobOpenings(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchJobOpenings]);

  const addNewJobOpening = async (newJob) => {
    try {
      setIsLoading(true);
      await Hr.addJobOpening(newJob);
      fetchJobOpenings();
      handleSuccess("Job Opening added successfully");
      setTimeout(() => {
        setOpenCreatePopup(false);
      }, 300);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
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
      handleSuccess("Job Opening Updated successfully");
      setTimeout(() => {
        setOpenCreatePopup(false);
      }, 300);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
      console.error("Error updating job opening:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleAddJobOpeningClick = () => setOpenCreatePopup(true);

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
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={6}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
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
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />

          {!isSalesManager && (
            <Popup
              title="Add New Applicant"
              openPopup={openApplicantListPopup}
              setOpenPopup={setOpenApplicantListPopup}
            >
              <ApplicantListCreate jobOpeningId={recordForEdit.job} />
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
