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

export const ShortListedCandidateView = () => {
  const [open, setOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchCandidates = async () => {
    try {
      const response = await Hr.getInterviewDate();
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

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
    "Interiew Date",
    "Interview Time",
    "Designation",
    "Interviewer Name",
    "Status",
    "Action",
  ];
  const TableData = candidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    email: candidate.applicant,
    interview_date: candidate.date,
    interview_time: candidate.time,
    designation: candidate.designation,
    interviewer_name: candidate.interviewer_name,
    stage: candidate.stage,
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
            }}
          >
            Interview Status
          </h3>
        </Box>
        <Paper sx={{ p: 2, m: 3 }}>
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleClickOpen}
          />
        </Paper>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Candidate Status Update
          </DialogTitle>
          <DialogContent>
            <ShortListedCandidateUpdate
              row={selectedRow}
              closeDialog={handleClose}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Grid>
  );
};
