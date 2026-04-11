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
  Autocomplete,
  TextField,
} from "@mui/material";
// import { CreateCountry } from "./CreateCountry";
import { CustomLoader } from "../../Components/CustomLoader";
import SearchComponent from "../../Components/SearchComponent ";
import { CustomPagination } from "../../Components/CustomPagination";
import { Popup } from "../../Components/Popup";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
// import { UpdateCountry } from "./UpdateCountry";
import { UpdatePackagingMaster } from "./UpdatePackagingMaster";
import { CreatePackingMaster } from "./CreatePackingMaster";
import { useSelector } from "react-redux";

export const ViewPackagingMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const userData = useSelector((state) => state.auth.profile);
  const [isInActive, setIsInactive] = useState(null);
  const a = userData.active_sales_user.map((item) => item.email);
  console.log(a);
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
      const response = await MasterService.getPackagingMaster(
        currentPage,
        searchQuery,
        isInActive && isInActive.value,
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
  }, [currentPage, searchQuery, isInActive]);
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
                    All Pakaging List
                  </h3>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                style={{
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Autocomplete
                  size="small"
                  fullWidth
                  value={isInActive}
                  onChange={(e, newValue) => setIsInactive(newValue)}
                  options={statusOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      label="Select Status"
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={1}
                style={{
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
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
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Charges</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Updated By</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center">Updated Date</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {country &&
                  country.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.is_inactive ? "Inactive" : "Active"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.charges}%
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.created_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.updated_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.creation_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.updated_date}
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
            size="sm"
            title="Add New Pakaging"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <CreatePackingMaster
              setOpenPopup={setOpenPopup}
              getAllMasterCountries={getAllMasterCountries}
            />
          </Popup>
          <Popup
            size="sm"
            title="Update Packaging"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <UpdatePackagingMaster
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

const statusOptions = [
  {
    value: false,
    label: "Active",
  },
  {
    value: true,
    label: "Inactive",
  },
];
