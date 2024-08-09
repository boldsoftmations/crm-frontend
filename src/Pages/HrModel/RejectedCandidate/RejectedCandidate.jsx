import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
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
  Typography,
} from "@mui/material";
import Hr from "./../../../services/Hr";
import { RejectedCandidateUpdate } from "./RejectedCandidateUpdate";
import { CustomPagination } from "../../../Components/CustomPagination";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomAxios from "../../../services/api";

export const RejectedCandidate = () => {
  const [rejectedCandidates, setRejectedCandidates] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState("");

  const fetchRejectedCandidates = async () => {
    try {
      setLoader(true);
      const response = await Hr.getRejectedCandidates(
        currentPage,
        searchQuery,
        filters
      );
      setRejectedCandidates(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching rejected candidates:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await CustomAxios.get(
          "/api/hr/designation/?type=list"
        );
        console.log("API Response:", response.data);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchDesignations();
  }, []);

  useEffect(() => {
    fetchRejectedCandidates();
  }, [currentPage, searchQuery, filters]);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };
  const handleFilterChange = (event, value) => {
    setFilters(value);
  };
  return (
    <Grid item xs={12}>
      <CustomLoader open={loader} />
      <Paper sx={{ m: 3, p: 3, display: "flex", flexDirection: "column" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Rejected Candidates
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              fullWidth
              name="designations"
              size="small"
              disablePortal
              id="combo-box-stage"
              onChange={(e, value) => handleFilterChange(e, value)}
              options={designations.map((option) => option.designation)}
              getOptionLabel={(option) => option}
              label="Filter By Designation"
            />
          </Grid>
        </Grid>
        <Box style={{ marginTop: "20px" }}>
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
                  <StyledTableCell align="center">Contact</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Designation </StyledTableCell>
                  <StyledTableCell align="center">Stage</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">
                    Rejection Reason
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedCandidates.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.rejection_reason}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleClickOpen(row)}>View</Button>
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
