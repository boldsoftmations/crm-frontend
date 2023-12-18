import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { RejectedCandidateUpdate } from "./RejectedCandidateUpdate";

export const RejectedCandidate = () => {
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchRejectedCandidates = async () => {
    try {
      const response = await Hr.getRejectedCandidates();
      setRejectedCandidates(response.data);
    } catch (error) {
      console.error("Error fetching rejected candidates:", error);
    }
  };

  useEffect(() => {
    fetchRejectedCandidates();
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
    "Contact",
    "Email",
    "Designation",
    "Rejection Reason",
    "Action",
  ];

  const TableData = rejectedCandidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    contact: candidate.contact,
    email: candidate.applicant,
    designation: candidate.designation,
    rejection_reason: candidate.rejection_reason,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 4 }}>
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Rejected Candidate List
          </h3>

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
              Reschedule Interview
            </DialogTitle>
            <DialogContent>
              <RejectedCandidateUpdate
                row={selectedRow}
                closeDialog={handleClose}
                fetchRejectedCandidates={fetchRejectedCandidates}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Paper>
    </Grid>
  );
};
