import React, { useCallback, useEffect, useRef, useState } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { styled } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Collapse,
  Typography,
  Grid,
} from "@mui/material";
import FileSaver from "file-saver";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomPagination } from "./../../Components/CustomPagination";
import { CustomLoader } from "./../../Components/CustomLoader";
import moment from "moment";
import { CSVLink } from "react-csv";
import CustomTextField from "../../Components/CustomTextField";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import UserProfileService from "../../services/UserProfileService";
import { useSelector } from "react-redux";

export const SalesRegisterView = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesRegisterData, setsalesRegisterData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [userList, setUserList] = useState([]);
  const [unitFilter, setUnitFilter] = useState("");
  const [endDate, setEndDate] = useState(new Date()); // set endDate as one week ahead of startDate
  const [startDate, setStartDate] = useState(
    new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  ); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
  };
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const handleExport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getAllSaleRegisterData(
        StartDate,
        EndDate,
        "all",
        searchQuery,
        unitFilter
      );
      const data = response.data.map((item) => {
        return {
          date: moment(item.date).format("DD-MM-YYYY"),
          sales_invoice: item.sales_invoice,
          customer: item.customer,
          transporter: item.transporter,
          dispatch_location: item.dispatch_location,
          lr_copy: item.lr_copy,
          pod_copy: item.pod_copy,
        };
      });
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading Price list", error);
    } finally {
      setOpen(false);
    }
  };
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

  const getSalesRegisterData = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getAllSaleRegisterData(
        StartDate,
        EndDate,
        currentPage,
        searchQuery,
        unitFilter
      );
      setsalesRegisterData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [startDate, currentPage, searchQuery, unitFilter]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getSalesRegisterData();
  }, [startDate, currentPage, searchQuery, unitFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Start Date"
                  variant="outlined"
                  size="small"
                  type="date"
                  id="start-date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  min={minDate}
                  max={
                    endDate
                      ? new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      : maxDate
                  }
                  onChange={handleStartDateChange}
                />
                <CustomTextField
                  label="End Date"
                  variant="outlined"
                  size="small"
                  // type="date"
                  id="end-date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  min={
                    startDate ? startDate.toISOString().split("T")[0] : minDate
                  }
                  max={
                    startDate
                      ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      : maxDate
                  }
                  disabled={!startDate}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} sm={7}>
                <h3
                  style={{
                    textAlign: "right",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Sales Register
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5}
                style={{
                  textAlign: "right",
                }}
              >
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Sales_Register.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownload}
                >
                  Export to Excel
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">User</StyledTableCell>
                  <StyledTableCell align="center">PI No</StyledTableCell>
                  <StyledTableCell align="center">
                    transport Name
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    Sales Invoice
                  </StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  {isInGroups(
                    "Operations & Supply Chain Manager",
                    "Director"
                  ) && (
                    <StyledTableCell align="center">
                      Type Of Customer
                    </StyledTableCell>
                  )}

                  <StyledTableCell align="center">
                    Dispatch Location
                  </StyledTableCell>
                  <StyledTableCell align="center">LR COPY</StyledTableCell>

                  <StyledTableCell align="center">POD COPY</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {" "}
                {salesRegisterData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    getSalesRegisterData={getSalesRegisterData}
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
  const { row } = props;
  const [open, setOpen] = useState(false);
  // const [checked, setChecked] = useState(row.dispatched);
  // const [openModal, setOpenModal] = useState(false);
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));
  const handleClickLRCOPY = async (data) => {
    let url = data.lr_copy ? data.lr_copy : "";
    FileSaver.saveAs(url, "image");
  };

  const handleClickPODCOPY = async (data) => {
    let url = data.pod_copy ? data.pod_copy : "";
    FileSaver.saveAs(url, "image");
  };

  return (
    <>
      <CustomLoader opn={open} />
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
        <TableCell align="center">
          {moment(row.date).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell align="center">{row.user}</TableCell>
        <TableCell align="center">
          {row.pi_list && row.pi_list.length > 0
            ? row.pi_list.join(", ")
            : "NA"}
        </TableCell>
        <TableCell align="center">{row.transporter}</TableCell>
        <TableCell align="center">{row.sales_invoice}</TableCell>
        <TableCell align="center">{row.customer}</TableCell>
        {isInGroups("Operations & Supply Chain Manager", "Director") && (
          <TableCell align="center">{row.type_of_customer}</TableCell>
        )}
        <TableCell align="center">{row.dispatch_location}</TableCell>
        <TableCell align="center">
          {row.lr_copy !== null && (
            <Button
              color="success"
              variant="outlined"
              onClick={() => handleClickLRCOPY(row)}
            >
              Download
            </Button>
          )}
        </TableCell>

        <TableCell align="center">
          {row.pod_copy !== null && (
            <Button
              color="success"
              variant="outlined"
              onClick={() => handleClickPODCOPY(row)}
            >
              Download
            </Button>
          )}
        </TableCell>
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
                    <TableCell align="center">RATE</TableCell>
                    <TableCell align="center">AMOUNT</TableCell>
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
                      <TableCell align="center">{historyRow.rate}</TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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

const headers = [
  {
    label: "Date",
    key: "date",
  },
  { label: "Sales Invoice", key: "sales_invoice" },
  { label: "Customer", key: "customer" },
  { label: "Transporter Name", key: "transporter" },
  { label: "Dispatch Location", key: "dispatch_location" },
  { label: "LR Copy", key: "lr_copy" },
  { label: "POD Copy", key: "pod_copy" },
];
