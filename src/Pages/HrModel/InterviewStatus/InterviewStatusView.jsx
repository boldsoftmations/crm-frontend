import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
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
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Stage</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviews.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.location}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleClickOpen(row)}
                      >
                        View
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
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Schedule Interview</DialogTitle>
            <DialogContent>
              <InterviewStatusCreate
                row={selectedRow}
                closeDialog={handleClose}
                getInterviewData={getInterviewData}
              />
            </DialogContent>
          </Dialog>
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
