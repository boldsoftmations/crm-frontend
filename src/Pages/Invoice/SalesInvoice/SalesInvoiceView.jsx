import React, { useState, useRef, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { tableCellClasses } from "@mui/material/TableCell";
import { SalesInvoiceCreate } from "./SalesInvoiceCreate";
import { Popup } from "../../../Components/Popup";
import { SalesInvoice } from "./SalesInvoice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomSearch } from "../../../Components/CustomSearch";
import { useSelector } from "react-redux";
import { CancelSalesInvoice } from "./CancelSalesInvoice";
import { CSVLink } from "react-csv";
import CustomTextField from "../../../Components/CustomTextField";
import BranchInvoicesCreate from "../BranchInvoices/BranchInvoicesCreate";

export const SalesInvoiceView = () => {
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [openModalBI, setOpenModalBI] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [openPopup4, setOpenPopup4] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("search");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [sellerUnitOption, setSellerUnitOption] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
    setTimeout(() => {
      csvLinkRef.current.link.click();
    });
  };

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
      const response =
        filterSelectedQuery || searchQuery
          ? await InvoiceServices.getSalesInvoiceDataWithPaginationAndSearch(
              StartDate,
              EndDate,
              "all",
              filterQuery,
              searchQuery || filterSelectedQuery
            )
          : await InvoiceServices.getSalesInvoiceDataWithPagination(
              StartDate,
              EndDate,
              "all"
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

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;

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

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  useEffect(() => {
    getSalesInvoiceDetails();
  }, [startDate, endDate]);

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

  const getSalesInvoiceDetails = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      if (currentPage) {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPagination(
            StartDate,
            EndDate,
            currentPage
          );
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getSalesInvoiceData(
          StartDate,
          EndDate
        );
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const filterSearch = value;
      const response = await InvoiceServices.getSalesInvoiceDataWithSearch(
        StartDate,
        EndDate,
        filterQuery,
        filterSearch
      );
      if (response) {
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      } else {
        getSalesInvoiceDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search sales invoice", error);
      setOpen(false);
    }
  };

  const handlePageChange = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      if (searchQuery) {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPaginationAndSearch(
            StartDate,
            EndDate,
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setSalesInvoiceData(response.data.results);
          const total = response.data.count;
          setTotalPages(Math.ceil(total / 25));
        } else {
          getSalesInvoiceDetails();
          setSearchQuery("");
        }
      } else if (filterSelectedQuery) {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPaginationAndSearch(
            StartDate,
            EndDate,
            page,
            filterQuery,
            filterSelectedQuery
          );
        if (response) {
          setSalesInvoiceData(response.data.results);
          const total = response.data.count;
          setTotalPages(Math.ceil(total / 25));
        } else {
          getSalesInvoiceDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPagination(
            StartDate,
            EndDate,
            page
          );
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");
    setFilterQuery("");
    getSalesInvoiceDetails();
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  const openInPopup2 = (item) => {
    setIDForEdit(item);
    setOpenPopup3(true);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <FormControl sx={{ width: "200px" }} size="small">
              <InputLabel id="demo-select-small">Date</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="Date"
                onChange={(event) => handleChange(event)}
              >
                {DateOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{ width: "200px", marginLeft: "1em" }}
              size="small"
            >
              <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="values"
                label="Fliter By"
                value={filterQuery}
                onChange={(event) => setFilterQuery(event.target.value)}
              >
                {filterOption.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {filterQuery ===
              "order_book__proforma_invoice__seller_account__unit" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  Filter By State
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Filter By State"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
                  sx={{
                    "& .MuiSelect-iconOutlined": {
                      display: filterSelectedQuery ? "none" : "",
                    },
                    "&.Mui-focused .MuiIconButton-root": {
                      color: "primary.main",
                    },
                  }}
                  endAdornment={
                    <IconButton
                      sx={{
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  {sellerUnitOption.map((option, i) => (
                    <MenuItem key={i} value={option.unit}>
                      {option.unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {filterQuery === "search" && (
              <CustomSearch
                filterSelectedQuery={searchQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            )}
            <Button
              sx={{ marginLeft: "1em", marginRight: "1em" }}
              onClick={() => setOpenModalBI(true)}
              variant="contained"
            >
              BranchInvoice
            </Button>
            <Button
              sx={{ marginLeft: "1em", marginRight: "1em" }}
              onClick={() => setOpenPopup(true)}
              variant="contained"
              color="success"
            >
              SalesInvoice
            </Button>

            <Button variant="contained" onClick={handleDownload}>
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
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Sales Invoice
            </h3>
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
          setOpenPopup={setOpenPopup}
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
  const { row, openInPopup, openInPopup2 } = props;
  const [tableExpand, setTableExpand] = useState(false);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_si.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.product}
                      </TableCell>
                      <TableCell align="center">
                        {historyRow.quantity}
                      </TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                      <TableCell align="center">
                        {historyRow.profit_or_loss}
                      </TableCell>
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

const filterOption = [
  {
    label: "Search By State",
    value: "order_book__proforma_invoice__seller_account__unit",
  },
  { label: "Search", value: "search" },
];

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
