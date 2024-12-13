import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import Hr from "../../../services/Hr";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const ViewCompetitorCandidates = () => {
  const [competitorData, setCompetitorData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getCompetitorCandidates = async (page = 0) => {
    try {
      setIsLoading(true);
      const response = await Hr.getCompetitorCandidates();
      setCompetitorData(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching competitorData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (candidate) => {
    if (!candidate.cv) {
      setAlertMsg({
        message: "CV is not uploaded for this candidate",
        open: true,
        severity: "error",
      });
      return;
    }
    const url = candidate.cv;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${candidate.name}${candidate.id}.resume`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    getCompetitorCandidates(currentPage);
  }, [currentPage]);

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
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
              Competitor Candidates
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
                  <StyledTableCell align="center">
                    Candidate Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Phone Number</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">
                    Is Competitor
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {competitorData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.location}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.is_competitor ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload(row)}
                      >
                        View CV
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
