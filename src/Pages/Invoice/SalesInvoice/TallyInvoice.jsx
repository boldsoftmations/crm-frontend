import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomerServices from "../../../services/CustomerService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CSVLink } from "react-csv";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { Popup } from "../../../Components/Popup";
import CustomTextField from "../../../Components/CustomTextField";
import InvoiceServices from "../../../services/InvoiceService";

export const TallyInvoice = () => {
  const [open, setOpen] = useState(false);
  const [tallyData, setTallyData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0]; // set default value as current date
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const csvLinkRef = useRef(null);
  const [sellerAccountOption, setSellerAccountOption] = useState([]);
  const [filterByUnit, setFilterByUnit] = useState("");

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // Function to get product base customer data
  const getSalesInvoiceDetails = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getTallyInvoiceData(
        StartDate,
        EndDate,
        filterByUnit
      );
      setTallyData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [startDate, endDate, filterByUnit]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getSalesInvoiceDetails();
  }, [startDate, endDate, filterByUnit]);

  const handleChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Today") {
      const today = new Date();
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Custom Date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setCustomDataPopup(true);
    }
  };
  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };
  const TableHeaders = [
    "INVOICE NO",
    "INVOICE DT",
    "PI NO",
    "UNIT",
    "CUSTOMER NAME",
    "PRODUCT CODE",
    "QTY",
    "RATE",
  ];
  const DownloadData = () => {
    const CSVDATA = tallyData.map((row) => ({
      VCH_TYPE: "GST SALES",
      invoice_no: row.invoice_no,
      invoice_date: row.invoice_date,
      pi_no: row.pi_no,
      pi_date: row.pi_date,
      customer: row.customer,
      transport: row.transport,
      destination: row.destination,
      order_no: row.order_no,
      payment_term: row.payment_term,
      delivery_term: row.delivery_term,
      shipping_customer: row.shipping_customer,
      address1: row.address.address1,
      address2: row.address.address2,
      address3: row.address.address3,
      shipping_state: row.shipping_state,
      shipping_pincode: row.shipping_pincode,
      product: row.product,
      quantity: row.quantity,
      rate: row.rate,
      amount: row.amount,
      sgst: row.sgst || "",
      cgst: row.cgst || "",
      igst: row.igst || "",
      total: row.total,
      sgst: row.sgst || "",
      sales_invoice: row.sales_invoice,
      billing_state: row.billing_state,
      shipping_city: row.shipping_city,
      sales_ledger: "GST Sales",
    }));
    return CSVDATA;
  };

  const headers = [
    { label: "VCH TYPE", key: "VCH_TYPE" },
    { label: "INVOICE NO", key: "invoice_no" },
    { label: "INVOICE DT", key: "invoice_date" },
    { label: "PI NO", key: "pi_no" },
    { label: "PI DT", key: "pi_date" },
    { label: "CUSTOMER NAME", key: "customer" },
    { label: "TRANSPORT", key: "transport" },
    { label: "DESTINATION", key: "destination" },
    { label: "ORDER NO", key: "order_no" },
    { label: "PAYMENT TERMS", key: "payment_term" },
    { label: "TERMS OF DELIVERY", key: "delivery_term" },
    { label: "SHIP TO", key: "shipping_customer" },
    { label: "ADDRESS 1", key: "address1" },
    { label: "ADDRESS 2", key: "address2" },
    { label: "ADDRESS 3", key: "address3" },
    { label: "SHIP STATE", key: "shipping_state" },
    { label: "SHIP PIN CODE", key: "shipping_pincode" },
    { label: "PRODUCT CODE", key: "product" },
    { label: "QTY", key: "quantity" },
    { label: "RATE", key: "rate" },
    { label: "TAXABLE VALUE", key: "amount" },
    { label: "SGST - Output", key: "sgst" },
    { label: "CGST - Output", key: "cgst" },
    { label: "IGST - Output", key: "igst" },
    { label: "TOTAL AMT", key: "total" },
    { label: "REF NO", key: "sales_invoice" },
    { label: "BILL TO PLACE", key: "billing_state" },
    { label: "SHIP TO PLACE", key: "shipping_city" },
    { label: "Sales Ledger", key: "sales_ledger" },
  ];

  const handleDownload = () => {
    try {
      setOpen(true);
      const data = DownloadData();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    } finally {
      setOpen(false);
    }
  };
  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerAccountOption(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

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
              <Grid item xs={12} sm={4} md={2}>
                <CustomAutocomplete
                  size="small"
                  onChange={(event, newValue) => handleChange(newValue)}
                  options={DateOptions.map((option) => option.value)}
                  getOptionLabel={(option) => option}
                  label="Filter By Date" // Passed directly to CustomAutocomplete
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <CustomAutocomplete
                  name="seller_unit"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  value={filterByUnit}
                  onChange={(event, value) => setFilterByUnit(value)}
                  options={sellerAccountOption.map((option) => option.unit)}
                  getOptionLabel={(option) => option}
                  fullWidth
                  label="Filter By Seller Unit"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Box display="flex" justifyContent="center" marginBottom="10px">
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    Tally Invoice
                  </h3>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} style={{ textAlign: "end" }}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleDownload}
                >
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="tally.csv"
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
                  {TableHeaders.map((header, i) => {
                    return (
                      <StyledTableCell key={i} align="center">
                        {header}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tallyData.length > 0 &&
                  tallyData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.invoice_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.invoice_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pi_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.customer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.rate}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                {tallyData.length === 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No Data Available
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Popup
          openPopup={customDataPopup}
          setOpenPopup={setCustomDataPopup}
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
      </Grid>
    </>
  );
};
const DateOptions = [
  {
    value: "Today",
  },

  {
    value: "Custom Date",
  },
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
