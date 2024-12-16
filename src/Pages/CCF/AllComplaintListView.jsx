import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { Popup } from "../../Components/Popup";
import AddCCFcomplaintsType from "./AddCCFcomplaintsType";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomerServices from "../../services/CustomerService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
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

export const AllComplaintListView = () => {
  const [open, setOpen] = useState(false);
  const [openAddComplainttype, setOpenAddComplainttype] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentData, setDepartmentData] = useState([]);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllComplaintsList = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllComplaintsList(
        currentPage,
        searchQuery
      );
      setTotalPages(Math.ceil(response.data.count / 25));
      setDepartmentData(response.data.results);
    } catch (e) {
      handleError(e);
      console.log(e);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    getAllComplaintsList();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Complaints Choice
                </h3>
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  disablePortal
                  id="combo-box-stage"
                  onChange={(e, value) => setSearchQuery(value)}
                  options={[
                    "Account",
                    "Product",
                    "Dispatch and Logistic",
                    "Sales Person",
                  ]}
                  getOptionLabel={(option) => option}
                  label="Filter By "
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setOpenAddComplainttype(true)}
                >
                  Add
                </Button>
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
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentData.map((row, i) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{row.id}</StyledTableCell>

                    <StyledTableCell align="center">
                      {row.department}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>

        <Popup
          width="lg"
          title="Add a complaint types"
          openPopup={openAddComplainttype}
          setOpenPopup={setOpenAddComplainttype}
        >
          <AddCCFcomplaintsType
            setOpenAddComplainttype={setOpenAddComplainttype}
            getAllComplaintsList={getAllComplaintsList}
          />
        </Popup>
      </Grid>
    </>
  );
};
