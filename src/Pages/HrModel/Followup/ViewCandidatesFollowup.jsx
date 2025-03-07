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
import SearchComponent from "../../../Components/SearchComponent ";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomAxios from "../../../services/api";

export const ViewCandidatesFollowup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [followupData, setFollowupData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [designations, setDesignations] = useState([]);
  const [filterValue, setFilterValue] = useState("");
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

  const getCandidateFollowup = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.getCandidateFollowup(currentPage, searchQuery);
      setFollowupData(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching followupData:", error);
    }
  };

  useEffect(() => {
    getCandidateFollowup();
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await CustomAxios.get(
          "/api/hr/designation/?type=list"
        );
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };
    fetchDesignations();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
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
            <Grid item xs={12} md={4}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Grid>
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
                  Candidates Followup
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                fullWidth
                name="stage"
                size="small"
                disablePortal
                id="combo-box-stage"
                onChange={(e, value) => setFilterValue(value)}
                options={designations.map((option) => option.designation)}
                getOptionLabel={(option) => option}
                label="Filter By Designation"
              />
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
                  <StyledTableCell align="center">
                    Candidate Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Phone</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Stage</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">
                    Follow Status
                  </StyledTableCell>
                  <StyledTableCell align="center">Call Status</StyledTableCell>
                  <StyledTableCell align="center">Notes</StyledTableCell>
                  <StyledTableCell align="center">
                    Next Followup date
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {followupData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.applicant}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.round_status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.call_status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.notes}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.followup_date}
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
                          //   onClick={() => handleOpenPopup(row)}
                        >
                          View
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
