import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { ShortListedCandidateUpdate } from "./ShortListedCandidateUpdate";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomPagination } from "../../../Components/CustomPagination";
import { ScheduleInterview } from "./ScheduleInterView";
import { Popup } from "../../../Components/Popup";

export const ShortListedCandidateView = () => {
  const [open, setOpen] = useState(false);
  const [openScheduleInterviewPopup, setOpenScheduleInterviewPop] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    stage: "Round1",
    status: "Schedule",
  });

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.getInterviewDate(
        currentPage,
        filters.stage,
        filters.status
      );
      setCandidates(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, filters.stage, filters.status]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const ScheduleInterviewPopup = (row) => {
    setSelectedRow(row);
    setOpenScheduleInterviewPop(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenScheduleInterviewPop(false);
  };

  const TableHeader = [
    "Id",
    "Candidate Name",
    "Email",
    "Contact",
    "Interiew Date",
    "Interview Time",
    "Designation",
    "Interviewer Name",
    "Stage",
    "Status",
    "Action",
  ];
  const TableData = candidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    applicant: candidate.applicant,
    interview_date: candidate.date,
    interview_time: candidate.time,
    designation: candidate.designation,
    interviewer_name: candidate.interviewer_name,
    stage: candidate.stage,
    status: candidate.status,
  }));
  const handleFilterChange = (event, value, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };
  return (
    <>
      <CustomLoader open={isLoading} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px" width="600px" gap="2rem">
            <CustomAutocomplete
              fullWidth
              name="stage"
              size="small"
              disablePortal
              id="combo-box-stage"
              onChange={(e, value) => handleFilterChange(e, value, "stage")}
              options={shortList}
              value={filters.stage}
              getOptionLabel={(option) => option}
              label="Filter By Stage"
            />
            <CustomAutocomplete
              fullWidth
              name="status"
              size="small"
              disablePortal
              id="combo-box-status"
              onChange={(e, value) => handleFilterChange(e, value, "status")}
              options={status}
              value={filters.status}
              getOptionLabel={(option) => option}
              label="Filter By Status"
            />
          </Box>

          <Box flexGrow={1} display="flex" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Interview Status
            </h3>
          </Box>

          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleClickOpen}
            ScheduleInterviewPopup={ScheduleInterviewPopup}
          />

          <Dialog
            open={openScheduleInterviewPopup}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Schedule interview for the second round
            </DialogTitle>
            <DialogContent>
              <ScheduleInterview
                row={selectedRow}
                closeDialog={handleClose}
                fetchCandidates={fetchCandidates}
              />
            </DialogContent>
          </Dialog>
          <Popup
            maxWidth="lg"
            title="Update Interview Status"
            openPopup={open}
            setOpenPopup={setOpen}
          >
            <ShortListedCandidateUpdate
              row={selectedRow}
              closeDialog={handleClose}
              fetchCandidates={fetchCandidates}
            />
          </Popup>

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
    </>
  );
};
const shortList = ["Round1", "Round2"];
const status = ["Schedule", "Selected", "Reschedule"];
