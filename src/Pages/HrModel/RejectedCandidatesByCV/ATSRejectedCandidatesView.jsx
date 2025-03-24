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
  Checkbox,
} from "@mui/material";
import { CustomPagination } from "../../../Components/CustomPagination";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomAxios from "../../../services/api";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const ATSRejectedCandidatesView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectDesignation, setSelectDesignation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [designations, setDesignations] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const [filters, setFilters] = useState({
    designations: "Sales Executive",
  });

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.bulkATScandidates(
        currentPage,
        filters.designations
      );
      setApplicants(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };
  const handleCheckboxChange = (data) => {
    setSelectedRows((prevSelectedRows) => {
      const isSelected = prevSelectedRows.includes(data.id);

      let newSelectedRows;
      if (isSelected) {
        // Remove the row if already selected
        newSelectedRows = prevSelectedRows.filter((item) => item !== data.id);

        // Reset designation if no rows are selected
        if (newSelectedRows.length === 0) {
          setSelectDesignation(null);
        }
      } else {
        // Add the row if not already selected
        newSelectedRows = [...prevSelectedRows, data.id];

        // Set designation if this is the only selected row
        if (newSelectedRows.length === 1) {
          setSelectDesignation(data.designation);
        }
      }

      return newSelectedRows;
    });
  };

  const handleBulkEmail = async () => {
    // Send bulk email to selected candidates
    try {
      const payload = {
        designation: selectDesignation,
        applicants: selectedRows,
      };
      setIsLoading(true);
      const response = await Hr.SendbulkEamilTocandidates(payload);
      if (response.status === 200) {
        setAlertMsg({
          message: "Bulk email has been sent successfully",
          severity: "success",
          open: true,
        });
        fetchApplicants();
        setSelectedRows([]);
        setSelectDesignation("");
      }
    } catch (e) {
      console.error("Error sending bulk email:", e);
      const errorMessage = e.response.data.message;
      setAlertMsg({
        message: errorMessage || "Error sending bulk email. Please try again.",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [currentPage, filters.designations]);

  const handleFilterChange = (event, value, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
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
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    name="designations"
                    size="small"
                    disablePortal
                    value={filters.designations}
                    id="combo-box-stage"
                    onChange={(e, value) =>
                      handleFilterChange(e, value, "designations")
                    }
                    options={designations.map((option) => option.designation)}
                    getOptionLabel={(option) => option}
                    label="Filter By Designation"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {selectedRows.length > 0 && (
                  <Button variant="contained" onClick={handleBulkEmail}>
                    Send Email
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" marginBottom="10px">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  ATS Candidates
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
            {filters.designations && (
              <Table
                sx={{ minWidth: 1200 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Select</StyledTableCell>
                    <StyledTableCell align="center">Name</StyledTableCell>
                    <StyledTableCell align="center">
                      Designation
                    </StyledTableCell>
                    <StyledTableCell align="center">Phone</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">
                      Last Connecation Date
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicants.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleCheckboxChange(row)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
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
                        {row.creation_date}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
