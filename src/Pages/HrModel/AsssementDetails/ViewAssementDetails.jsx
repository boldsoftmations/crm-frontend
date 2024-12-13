import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
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
import { CustomPagination } from "../../../Components/CustomPagination";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { Popup } from "../../../Components/Popup";
import ViewDetailsCandidates from "./ViewDetailsCanditates";
import { InterviewAssessmentResultView } from "./InterviewAssementResultView";

export const ViewAssementDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openCandidatesPopup, setOpenCandidatesPopup] = useState(false);
  const [openResultPopup, setOpenResultPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState({});
  const [assesementData, setAssesementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const getAssessementDetails = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.getAssessementDetails(currentPage);
      setAssesementData(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching assesementData:", error);
    }
  };

  useEffect(() => {
    getAssessementDetails();
  }, [currentPage]);

  const handleOpenPopup = (row) => {
    setOpenCandidatesPopup(true);
    setRecordForEdit(row);
  };

  const handleResultOpenPopup = (row) => {
    setOpenCandidatesPopup(false);
    setRecordForEdit(row);
    setOpenResultPopup(true);
  };

  return (
    <>
      <CustomLoader open={isLoading} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" marginBottom="10px">
                <h3
                  style={{
                    fontSize: "22px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Assesement Details
                </h3>
              </Box>
            </Grid>
          </Grid>

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
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Phone</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assesementData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box
                        display="flex"
                        gap={2}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenPopup(row)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          onClick={() => handleResultOpenPopup(row)}
                        >
                          Assesement Result
                        </Button>
                      </Box>
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
        <Popup
          fullScreen={true}
          title="Assessment Details"
          openPopup={openCandidatesPopup}
          setOpenPopup={setOpenCandidatesPopup}
        >
          <ViewDetailsCandidates data={recordForEdit} />
        </Popup>
        <Popup
          fullScreen={true}
          openPopup={openResultPopup}
          setOpenPopup={setOpenResultPopup}
        >
          <InterviewAssessmentResultView result={recordForEdit} />
        </Popup>
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
