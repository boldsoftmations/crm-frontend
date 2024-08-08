import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { JobOpeningCreate } from "./JobOpeningCreate";
import { JobOpeningUpdate } from "./JobOpeningUpdate";
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
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [jobId, setJobId] = useState(null);
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

  const handleAddApplicantClick = (data) => {
    setJobId(data);
    setOpenApplicantListPopup(true);
  };

  const handleOpenUpdate = (data) => {
    setRecordForEdit(data);
    setOpenUpdatePopup(true);
  };

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

          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Job ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Date of Opening
                  </StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Salary Range</StyledTableCell>
                  <StyledTableCell align="center">
                    Date of Closing
                  </StyledTableCell>
                  <StyledTableCell align="center">Days Open</StyledTableCell>
                  <StyledTableCell align="center">
                    No Of Vacancies
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Pending Vacancies{" "}
                  </StyledTableCell>
                  <StyledTableCell align="center">Action </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobOpenings.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.job_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.opening_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.location}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.salary_ranges}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.closing_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.days_open}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.no_of_openings}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pending_openings}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        color="success"
                        size="small"
                        onClick={() => handleOpenUpdate(row)}
                      >
                        View
                      </Button>
                      <Button
                        color="info"
                        size="small"
                        onClick={() => handleAddApplicantClick(row)}
                      >
                        Add New Applicant
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              <ApplicantListCreate
                jobOpeningId={jobId}
                setOpenApplicantListPopup={setOpenApplicantListPopup}
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
