import React, { useState, useRef, useEffect, useCallback } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "./../../../Components/CustomLoader";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { SalesInvoiceCreate } from "./SalesInvoiceCreate";
import { Popup } from "../../../Components/Popup";
import { SalesInvoice } from "./SalesInvoice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { CancelSalesInvoice } from "./CancelSalesInvoice";
import { CSVLink } from "react-csv";
import CustomTextField from "../../../Components/CustomTextField";
import BranchInvoicesCreate from "../BranchInvoices/BranchInvoicesCreate";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { SourceViewList } from "./SourceViewList";
import UploadSalesInvoice from "./uploadSaleInvoice";

export const SalesInvoiceView = () => {
  const [open, setOpen] = useState(false);
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [openModalBI, setOpenModalBI] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [openPopup4, setOpenPopup4] = useState(false);
  const [openSalesPopUpFile, setOpenSalesPopUpFile] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [filterInvoiceType, setFilterInvoiceType] = useState("customer");
  const [sellerUnitOption, setSellerUnitOption] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const headers = [
    { label: "Date", key: "date" },
    { label: "Invoice No", key: "invoice_no" },
    { label: "Unit", key: "seller_unit" },
    { label: "Customer", key: "customer" },
    { label: "Taxable Amount", key: "taxabale_amount" },
    { label: "GST", key: "gst" },
    { label: "Total Amount", key: "total_amount" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getSalesInvoiceData(
        filterInvoiceType,
        StartDate,
        EndDate,
        "all",
        filterSelectedQuery,
        searchQuery
      );
      // Filter out items with 'cancelled' as true from the response
      const filteredData = response.data.filter(
        (item) => item.cancelled !== true
      );

      // Initialize the data array
      const data = [];

      // Map the filtered data to the desired export format
      filteredData.forEach((item) => {
        const exportData = {
          date: item.generation_date,
          invoice_no: item.invoice_no,
          seller_unit: item.seller_unit,
          customer: item.company,
          taxabale_amount: item.amount,
          gst: item.gst,
          total_amount: item.total,
        };

        // Check if item.cancelled is not true and then add data
        data.push(exportData);
      });

      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
    setTimeout(() => {
      csvLinkRef.current.link.click();
    });
  };

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleChange = (value) => {
    const selectedValue = value;

    if (selectedValue === "Today") {
      const today = new Date();
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setEndDate(yesterday);
      setStartDate(yesterday);
    } else if (selectedValue === "Last 7 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last 30 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "This Month") {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last Month") {
      const endDate = new Date();
      endDate.setDate(0);
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Custom Date") {
      // Handle custom date logic, for example:
      setStartDate(new Date());
      setEndDate(new Date());
      setOpenPopup4(true);
    }
  };

  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerUnitOption(response.data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getSalesInvoiceDetails = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getSalesInvoiceData(
        filterInvoiceType,
        StartDate,
        EndDate,
        currentPage,
        filterSelectedQuery,
        searchQuery
      );
      setSalesInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [
    filterInvoiceType,
    startDate,
    endDate,
    currentPage,
    filterSelectedQuery,
    searchQuery,
  ]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getSalesInvoiceDetails();
  }, [
    filterInvoiceType,
    startDate,
    endDate,
    currentPage,
    filterSelectedQuery,
    searchQuery,
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleFilter = (value) => {
    console.log("value", value);
    setFilterSelectedQuery(value);
  };

  //fuction for filter invoice
  const handleFilterInvoiceType = (value) => {
    console.log("value", value);
    setFilterInvoiceType(value);
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  const openInPopup2 = (item) => {
    setIDForEdit(item);
    setOpenPopup3(true);
  };

  const setOpenSalesFile = (row) => {
    setIDForEdit(row);
    setOpenSalesPopUpFile(true);
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
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              {/* Filters and Search - First Row */}
              <Grid item xs={12} sm={6} md={3}>
                <CustomAutocomplete
                  size="small"
                  onChange={(event, newValue) => handleChange(newValue)}
                  options={DateOptions.map((option) => option.value)}
                  getOptionLabel={(option) => option}
                  label="Filter By Date" // Passed directly to CustomAutocomplete
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomAutocomplete
                  size="small"
                  value={filterInvoiceType}
                  onChange={(event, newValue) =>
                    handleFilterInvoiceType(newValue)
                  }
                  options={Invoice_Type_Options.map((option) => option)}
                  getOptionLabel={(option) => option}
                  label="Filter By Invoice Type" // Passed directly to CustomAutocomplete
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CustomAutocomplete
                  size="small"
                  value={filterSelectedQuery}
                  onChange={(event, newValue) => handleFilter(newValue)}
                  options={sellerUnitOption.map((option) => option.unit)}
                  getOptionLabel={(option) => option}
                  label="Filter By State" // Passed directly to CustomAutocomplete
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              {/* Title and Buttons - Second Row */}
              <Grid item xs={12} md={5}>
                <Button
                  onClick={() => setOpenModalBI(true)}
                  variant="contained"
                >
                  Branch Invoice
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Sales Invoice
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  onClick={() => setOpenPopup(true)}
                  variant="contained"
                  color="success"
                >
                  Sales Invoice
                </Button>

                <Button
                  sx={{ marginLeft: "5px" }}
                  onClick={handleDownload}
                  variant="contained"
                >
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    headers={headers}
                    data={exportData}
                    ref={csvLinkRef}
                    filename="Sales Invoice.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
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
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">INVOICE TYPE</StyledTableCell>
                  {/* <StyledTableCell align="center">company</StyledTableCell> */}
                  <StyledTableCell align="center">
                    SALES INVOICE NUMBER
                  </StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">
                    TAXABLE AMOUNT
                  </StyledTableCell>
                  <StyledTableCell align="center">GST</StyledTableCell>
                  <StyledTableCell align="center">TOTAL</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">
                    PROFORMA INVOICE LIST
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    PROFIT/LOSS %
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesInvoiceData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    openInPopup={openInPopup}
                    openInPopup2={openInPopup2}
                    setOpenSalesFile={setOpenSalesFile}
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
      <Popup
        fullScreen={true}
        title={"Create Branch Invoice"}
        openPopup={openModalBI}
        setOpenPopup={setOpenModalBI}
      >
        <BranchInvoicesCreate
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenModalBI}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Create Sales Invoice"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesInvoiceCreate
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenPopup}
          handleError={handleError}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"View Sales Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <SalesInvoice
          idForEdit={idForEdit}
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"Cancel Sales Invoice"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <CancelSalesInvoice
          idForEdit={idForEdit}
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenPopup3}
        />
      </Popup>
      <Popup
        title={"Upload Sales Invoice "}
        openPopup={openSalesPopUpFile}
        setOpenPopup={setOpenSalesPopUpFile}
      >
        <UploadSalesInvoice
          setOpenSalesPopUpFile={setOpenSalesPopUpFile}
          getProduct={getSalesInvoiceDetails}
          idForEdit={idForEdit}
        ></UploadSalesInvoice>
      </Popup>
      <Popup
        openPopup={openPopup4}
        setOpenPopup={setOpenPopup4}
        title="Date Filter"
        maxWidth="md"
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            padding: "20px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                min={minDate}
                max={maxDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                min={
                  startDate ? startDate.toISOString().split("T")[0] : minDate
                }
                max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetDate}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popup>
    </>
  );
};

function Row(props) {
  const { row, openInPopup, openInPopup2, setOpenSalesFile } = props;
  const [tableExpand, setTableExpand] = useState(false);
  const [openPopupProductViewList, setOpenPopupProductViewList] =
    useState(false);
  const [IDForViewList, setIDForViewList] = useState();
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const handleOpenPopUp = (value) => {
    setIDForViewList(value.source_list);
    setOpenPopupProductViewList(true);
  };
  return (
    <>
      <StyledTableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          textDecoration: row.cancelled ? "line-through" : "none",
        }}
      >
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand(!tableExpand)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.generation_date}</StyledTableCell>
        <StyledTableCell align="center">{row.invoice_type}</StyledTableCell>
        <StyledTableCell align="center">{row.invoice_no}</StyledTableCell>
        <StyledTableCell align="center">
          {row.seller_details.unit}
        </StyledTableCell>
        <StyledTableCell align="center">{row.amount}</StyledTableCell>
        <StyledTableCell align="center">
          {row.seller_details.gst}
        </StyledTableCell>
        <StyledTableCell align="center">{row.total}</StyledTableCell>
        <StyledTableCell align="center">{row.company}</StyledTableCell>

        {row.proforma_invoice_list !== null ? (
          <StyledTableCell align="center">
            {`${row.proforma_invoice_list},`}
          </StyledTableCell>
        ) : (
          <StyledTableCell align="center"></StyledTableCell>
        )}
        <StyledTableCell align="center">
          {row.profit_or_loss_pct}
        </StyledTableCell>
        <StyledTableCell align="center">
          <Button variant="text" onClick={() => openInPopup(row.invoice_no)}>
            View
          </Button>
          {row.is_whatsapp_group === true &&
            row.is_upload === false &&
            (userData.groups.includes("Director") ||
              userData.groups.includes("Accounts") ||
              userData.groups.includes("Accounts Billing Department")) && (
              <Button
                type="button"
                variant="text"
                color="secondary"
                onClick={() => setOpenSalesFile(row)}
              >
                Upload SI
              </Button>
            )}
          {(userData.groups.includes("Accounts") ||
            userData.groups.includes("Accounts Billing Department")) && (
            <Button
              variant="text"
              color="error"
              onClick={() => openInPopup2(row)}
            >
              Cancel
            </Button>
          )}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">PRODUCT CODE</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">AMOUNT</TableCell>
                    <TableCell align="center">PROFIT/LOSS(PER UNIT)</TableCell>
                    <TableCell align="center">ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_si.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.product}
                      </TableCell>
                      <TableCell align="center">
                        {historyRow.type_of_unit === "decimal"
                          ? historyRow.quantity
                          : Math.floor(historyRow.quantity)}
                      </TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                      <TableCell align="center">
                        {historyRow.profit_or_loss}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          style={{ fontSize: "13px" }}
                          variant="outlined"
                          color="success"
                          onClick={() => handleOpenPopUp(historyRow)}
                        >
                          Source View List
                        </Button>
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
        maxWidth="md"
        title={"Source View List"}
        openPopup={openPopupProductViewList}
        setOpenPopup={setOpenPopupProductViewList}
      >
        <SourceViewList maxWidth="md" selectedRow={IDForViewList} />
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

const Invoice_Type_Options = ["unit", "customer", "Scrap", "Supplier"];

const DateOptions = [
  {
    value: "Today",
  },
  {
    value: "Yesterday",
  },
  {
    value: "Last 7 Days",
  },
  {
    value: "Last 30 Days",
  },
  {
    value: "This Month",
  },
  {
    value: "Last Month",
  },
  {
    value: "Custom Date",
  },
];
