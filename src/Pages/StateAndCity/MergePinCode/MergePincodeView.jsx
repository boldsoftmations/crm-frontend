import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";

import CustomSnackbar from "../../../Components/CustomerSnackbar";
import MasterService from "../../../services/MasterService";

// import MergePincodeCreate from "../Pincode/MergePincodeCreate";

export const MergePincodeView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pincode, setPincode] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getMasterPincode = async () => {
    try {
      setIsLoading(true);
      const response = await MasterService.getMergePincodeList(
        currentPage,
        searchQuery,
      );
      setPincode(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getMasterPincode();
  }, [currentPage, searchQuery]);

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
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="center">
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    Merge PinCode List
                  </h3>
                </Box>
              </Grid>
            </Grid>
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
                    Conical Pincode{" "}
                  </StyledTableCell>
                  <StyledTableCell align="center">Old Pincode </StyledTableCell>
                  <StyledTableCell align="center">Country </StyledTableCell>
                  <StyledTableCell align="center">State </StyledTableCell>
                  <StyledTableCell align="center">City</StyledTableCell>
                  <StyledTableCell align="center">Approved BY</StyledTableCell>
                  <StyledTableCell align="center">
                    Migration Batch ID
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  {/* <StyledTableCell align="center">Reason</StyledTableCell> */}
                  <StyledTableCell align="center">Approved At</StyledTableCell>
                  <StyledTableCell align="center">Applied At</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pincode.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">
                      {row.canonical_pincode_value}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.old_pincode_value}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.country}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.approved_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.migration_batch_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.action}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">{row.reason}</StyledTableCell> */}
                    <StyledTableCell align="center">
                      {row.approved_at}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.applied_at}
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
