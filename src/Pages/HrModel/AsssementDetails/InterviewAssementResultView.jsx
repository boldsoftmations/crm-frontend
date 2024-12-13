import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
  Typography,
  Divider,
} from "@mui/material";
import Hr from "./../../../services/Hr";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";

export const InterviewAssessmentResultView = ({ result }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getAssessmentResultDetails = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.getAssessementResultDetails({
        contact: result.contact,
      });
      setAssessmentData(response.data);
    } catch (error) {
      console.error("Error fetching assessment data:", error);
      setAlertMsg({
        message: "Failed to load assessment results.",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result.contact) {
      getAssessmentResultDetails();
    }
  }, [result.contact]);

  return (
    <>
      <CustomLoader open={isLoading} />
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Grid item xs={12}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mx: "auto",
            my: 4,
            backgroundColor: "#f9f9f9",
            borderRadius: 3,
          }}
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Interview Assessment Results
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />

          <TableContainer
            sx={{
              maxHeight: 450,
              "&::-webkit-scrollbar": {
                width: 10,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
                borderRadius: 5,
              },
            }}
          >
            <Table
              sx={{ minWidth: 800 }}
              stickyHeader
              aria-label="Assessment Results"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Question</StyledTableCell>
                  <StyledTableCell align="center">
                    Correct Answer
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Candidate Answer
                  </StyledTableCell>
                  <StyledTableCell align="center">Correctness</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessmentData.q_a && assessmentData.q_a.length > 0 ? (
                  assessmentData.q_a.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.question}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.correct_answer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.answer}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{
                          color: row.status ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {row.status ? "Correct" : "Wrong"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={3}>
                      No assessment data available.
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            mt={3}
            sx={{
              p: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              <strong>Total Questions:</strong>{" "}
              {assessmentData.no_of_question || 0}
            </Typography>
            <Typography variant="body1" align="center">
              <strong>Total Correct Answers:</strong>{" "}
              {assessmentData.no_of_answer || 0}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
