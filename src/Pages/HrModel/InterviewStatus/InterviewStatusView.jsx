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
import { InterviewStatusCreate } from "./InterviewStatusUpdate";
import Hr from "../../../services/Hr";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";

export const InterviewStatusView = () => {
  const [open, setOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getInterviewData = async (page = 0) => {
    try {
      setIsLoading(true);
      const response = await Hr.getInterviewStatus({ page });
      setInterviews(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInterviewData(currentPage);
  }, [currentPage]);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const TableHeader = [
    "Id",
    "Candidate Name",
    "Email",
    "Designation",
    "Contact",
    "Location",
    // "Interview Schedule",
    "Interview Schedule",
  ];
  const TableData = Array.isArray(interviews)
    ? interviews.map((interview) => ({
        id: interview.id,
        name: interview.name,
        email: interview.email,
        designation: interview.designation,
        contact: interview.contact,
        location: interview.location,
      }))
    : [];

  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box flexGrow={1} display="flex" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Shortlisted Candidate
            </h3>
          </Box>

          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleClickOpen}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Interview Status Update
            </DialogTitle>
            <DialogContent>
              <InterviewStatusCreate
                row={selectedRow}
                closeDialog={handleClose}
              />
            </DialogContent>
          </Dialog>
        </Paper>
      </Grid>
    </>
  );
};
