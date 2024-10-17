import React, { useEffect, useState } from "react";
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
import { CreateCountry } from "./CreateCountry";
import { CustomLoader } from "../../Components/CustomLoader";
import SearchComponent from "../../Components/SearchComponent ";
import { CustomPagination } from "../../Components/CustomPagination";
import { Popup } from "../../Components/Popup";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { UpdateCountry } from "./UpdateCountry";

export const ViewCountry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

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
  const openInPopup = (data) => {
    setRecordForEdit(data);
    setOpenUpdatePopup(true);
  };

  const getAllMasterCountries = async () => {
    try {
      setIsLoading(true);
      const response = await MasterService.getAllMasterCountries(
        currentPage,
        searchQuery
      );
      setCountry(response.data.results);
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
    getAllMasterCountries();
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
                    All Country List
                  </h3>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} style={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => setOpenPopup(true)}
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
                  <StyledTableCell align="center">County Name</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {country &&
                  country.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => openInPopup(row)}
                        >
                          Edit
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
          <Popup
            title="Add New Country"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <CreateCountry
              setOpenPopup={setOpenPopup}
              getAllMasterCountries={getAllMasterCountries}
            />
          </Popup>
          <Popup
            title="Update Country"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <UpdateCountry
              recordForEdit={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              getAllMasterCountries={getAllMasterCountries}
            />
          </Popup>
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
