import React, { useState, useEffect } from "react";
import { Box, Paper, Grid } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";

export const RejectedCandidate = () => {
  const [rejectedCandidates, setRejectedCandidates] = useState([]);

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

  const TableHeader = [
    "Candidate Name",
    "Contact",
    "Email",
    "Designation",
    "Rejection Reason",
  ];

  const TableData = rejectedCandidates.map((candidate) => ({
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
            <CustomTable headers={TableHeader} data={TableData} />
          </Paper>
        </Box>
      </Paper>
    </Grid>
  );
};
