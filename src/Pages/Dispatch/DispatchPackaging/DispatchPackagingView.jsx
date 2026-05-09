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

import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { useRef } from "react";
import { DispatchPackaginigUpdate } from "./DispatchPackaginigUpdate";
import { DispatchPackaginigCreate } from "./DispatchPackaginigCreate";
import InvoiceServices from "../../../services/InvoiceService";
import CustomTextField from "../../../Components/CustomTextField";
import moment from "moment";
import { CSVLink } from "react-csv";
export const DispatchPackagingView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [packagingData, setPackagingData] = useState([]);
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
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentMonthFormatted =
    currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  const initialSearchQuery = `${currentYear}-${currentMonthFormatted}`;
  const currentDates = moment();
  // Get the first day of the current month
  const currentMonthStartDate = currentDates.startOf("month");
  const [searchData, setSearchData] = useState(initialSearchQuery);
  const currentMonths = currentMonthStartDate.format("YYYY-MM");

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

  const getAllPackagingData = async () => {
    try {
      setIsLoading(true);
      const dateString = searchData;
      const dateParts = dateString.split("-");
      const year = dateParts[0];
      const month = dateParts[1];
      const response = await InvoiceServices.getDispatchPackagingData(
        currentPage,
        searchQuery,
        year,
        month,
      );
      setPackagingData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (e) {
      setAlertMsg({
        message:
          e.response.data.message || "Error fetching Packaging Materials",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllPackagingData();
  }, [currentPage, searchQuery]);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const dateString = searchData;
      const dateParts = dateString.split("-");
      const year = dateParts[0];
      const month = dateParts[1];
      const response = await InvoiceServices.getDispatchPackagingData(
        currentPage,
        searchQuery,
        year,
        month,
      );
      const data = response.data.results.map((row, i) => {
        return {
          product_name: row.product_name,
          unit_name: row.unit_name,
          seller_account_name: row.seller_account_name,
          quantity: row.quantity,
          created_date: row.created_date,
          created_by: row.created_by,
        };
      });
      console.log("data", data);
      setIsLoading(false);
      return data;
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching Packaging Material",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const headers = [
    { label: "PRODUCT", key: "product_name" },
    { label: "QUANTITY", key: "quantity" },

    { label: " UNIT", key: "unit_name" },
    { label: "SELLER UNIT", key: "seller_account_name" },
    { label: "CREATED DATE", key: "created_date" },
    { label: "CREATED BY", key: "created_by" },
  ];

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
                    Packaging Material Consumption{" "}
                  </h3>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                style={{
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "30px",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <CustomTextField
                  label="Search"
                  type="month"
                  variant="outlined"
                  size="small"
                  value={searchData}
                  onChange={(event) => setSearchData(event.target.value)}
                  inputProps={{
                    max: currentMonths, // Set the maximum allowed value to the previous month
                  }}
                />
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => setOpenPopup(true)}
                >
                  Add
                </Button>

                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={handleDownload}
                  sx={{ p: "6px 12px" }}
                >
                  {" "}
                  Download
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Customer.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
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

                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">SELLER UNIT</StyledTableCell>

                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  {/* <StyledTableCell align="center">UNIT COST</StyledTableCell>
                  <StyledTableCell align="center">Total Cost</StyledTableCell> */}
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  {/* editable mode is avalable */}
                </TableRow>
                <StyledTableCell align="center" sx={{ display: "none" }}>
                  Action
                </StyledTableCell>
              </TableHead>
              <TableBody>
                {packagingData &&
                  packagingData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>

                      <StyledTableCell align="center">
                        {row.product_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.seller_account_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.quantity}
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        {row.unit_cost}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.total_cost}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        {row.created_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.created_date}
                      </StyledTableCell>
                      {/* editable mode is avalable */}
                      <StyledTableCell align="center" sx={{ display: "none" }}>
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
            <DispatchPackaginigCreate
              setOpenPopup={setOpenPopup}
              getAllPackagingData={getAllPackagingData}
            />
          </Popup>
          <Popup
            title="Update Packaging"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <DispatchPackaginigUpdate
              recordForEdit={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              getAllPackagingData={getAllPackagingData}
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
