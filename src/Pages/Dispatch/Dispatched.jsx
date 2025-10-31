import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  styled,
  Box,
  TableContainer,
  IconButton,
  Collapse,
  Button,
  Grid,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FileSaver from "file-saver";
import { tableCellClasses } from "@mui/material/TableCell";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";
import { Popup } from "./../../Components/Popup";
import { UpdateDispatch } from "./UpdateDispatch";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import moment from "moment";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import UserProfileService from "../../services/UserProfileService";

export const Dispatched = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [userList, setUserList] = useState([]);
  const [unitFilter, setUnitFilter] = useState("");
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getuserProfile = async () => {
    try {
      setOpen(true);
      const response = await UserProfileService.getProfile();
      setUserList(response.data.sales_users);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getuserProfile();
  }, []);
  const getAllDispatchDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getDispatchData(
        true,
        currentPage,
        searchQuery,
        unitFilter
      );
      setDispatchData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery, unitFilter]);

  useEffect(() => {
    getAllDispatchDetails();
  }, [currentPage, searchQuery, unitFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  sx={{ flexGrow: 1, mr: 1 }}
                  size="small"
                  value={unitFilter}
                  onChange={(event, newValue) => setUnitFilter(newValue)}
                  options={userList.map((option) => option.email)}
                  getOptionLabel={(option) => option}
                  label="Filter By Person"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  {userData.groups.includes("Customer Service")
                    ? "Dispatch-POD Pending"
                    : userData.groups.includes("Factory-Mumbai-Dispatch") ||
                      userData.groups.includes("Factory-Delhi-Dispatch")
                    ? "Dispatch-LR Pending"
                    : "Dispatch"}
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">
                    Sales Invoice
                  </StyledTableCell>
                  <StyledTableCell align="center">User</StyledTableCell>
                  <StyledTableCell align="center">PI No</StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">
                    Dispatch Location
                  </StyledTableCell>
                  {userData.groups.toString() === "Customer Service" ||
                    (userData.groups.toString() ===
                      "Operations & Supply Chain Manager" && (
                      <StyledTableCell align="center">LR COPY</StyledTableCell>
                    ))}
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {dispatchData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    getAllDispatchDetails={getAllDispatchDetails}
                    userData={userData}
                    handleError={handleError}
                  />
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

function Row(props) {
  const { row, getAllDispatchDetails, userData, handleError } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idData, setIdData] = useState("");

  const handleChange = (row) => {
    setIdData(row);
    setOpenModal(true);
  };

  const handleClickLRCOPY = async (data) => {
    let url = data.lr_copy ? data.lr_copy : "";
    FileSaver.saveAs(url, "image");
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.sales_invoice}</TableCell>
        <TableCell align="center">{row.user}</TableCell>
        <TableCell align="center">
          {row.pi_list && row.pi_list.length > 0
            ? row.pi_list.join(", ")
            : "NA"}
        </TableCell>
        <TableCell align="center">{row.customer}</TableCell>
        <TableCell align="center">
          {moment(row.date).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell align="center">{row.dispatch_location}</TableCell>
        {userData.groups.toString() === "Customer Service" ||
          (userData.groups.toString() ===
            "Operations & Supply Chain Manager" && (
            <TableCell align="center">
              <Button
                color="success"
                variant="outlined"
                onClick={() => handleClickLRCOPY(row)}
              >
                Download
              </Button>
            </TableCell>
          ))}
        {(userData.groups.includes("Factory-Delhi-Dispatch") ||
          userData.groups.includes("Factory-Mumbai-Dispatch") ||
          userData.groups.includes("Director") ||
          userData.groups.includes("Customer Service") ||
          userData.groups.includes("Operations & Supply Chain Manager") ||
          userData.groups.includes("Accounts")) && (
          <TableCell align="center">
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => handleChange(row)}
            >
              View
            </button>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Products
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">DISPATCH ID</TableCell>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((historyRow) => (
                    <TableRow key={historyRow.dispatch_book}>
                      <TableCell align="center">
                        {historyRow.dispatch_book}
                      </TableCell>
                      <TableCell align="center">{historyRow.product}</TableCell>
                      <TableCell align="center">
                        {historyRow.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popup
        maxWidth={"md"}
        title={"Update Dispatch"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <UpdateDispatch
          idData={idData}
          getAllDispatchDetails={getAllDispatchDetails}
          setOpenPopup={setOpenModal}
          userData={userData}
          handleError={handleError}
        />
      </Popup>
    </>
  );
}

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
