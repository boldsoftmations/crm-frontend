import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import "../../CommonStyle.css";
import logo from " ../../../public/images.ico";
import LeadServices from "../../../services/LeadService";
import { CustomerConfirmationPayment } from "./CustomerConfirmationPayment";
import { Popup } from "./../../../Components/Popup";

const typographyStyling = {
  fontWeight: "bold",
};

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, "Aerosol Spray Paint", 6.0, 24, 4.0),
  createData(2, "Anti Skid Tape", 2, 9.0, 37, 4.3),
  createData(3, "Cotton Cloth Tape", 16.0, 24, 6.0),
];

const commonStyles = {
  bgcolor: "background.paper",
  m: 1,
  borderColor: "text.primary",
  minWidth: "90%",
  minHeight: "10rem",
};

export const CustomerProformaInvoice = (props) => {
  const { idForEdit, setOpenPopup, getCustomerPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [open, setOpen] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await LeadServices.getProfile();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllProformaInvoiceDetails();
  }, []);

  const getAllProformaInvoiceDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getCompanyPerformaInvoiceByIDData(
        idForEdit
      );
      console.log("object :>> ", response.data);
      setInvoiceData(response.data);
      setProductData(response.data.products);
      setPaymentTerms(response.data.payment_terms.split("_").join(" "));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllSellerAccountData();
      setSellerData(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const SendForApprovalStatus = async (e) => {
    try {
      e.preventDefault();
      const req = {
        type: invoiceData.type,
        raised_by: users.email,
        seller_account: invoiceData.seller_account,
        company: invoiceData.company,
        address: invoiceData.address,
        pincode: invoiceData.pincode,
        state: invoiceData.state,
        city: invoiceData.city,
        buyer_order_no: invoiceData.buyer_order_no,
        contact: invoiceData.contact,
        alternate_contact: invoiceData.alternate_contact,
        payment_terms: invoiceData.payment_terms,
        delivery_terms: invoiceData.delivery_terms,
        generation_date: invoiceData.generation_date,
        validity: invoiceData.validity,
        status: "approved",
        amount: invoiceData.amount,
        sgst: invoiceData.sgst ? invoiceData.sgst : null,
        cgst: invoiceData.cgst ? invoiceData.cgst : null,
        igst: invoiceData.igst ? invoiceData.igst : null,
        total: invoiceData.total,
        amount_recieved: invoiceData.amount_recieved,
        balance_amount: invoiceData.balance_amount,
        gst_number: invoiceData.gst_number,
        pan_number: invoiceData.pan_number ? invoiceData.pan_number : null,
      };

      setOpen(true);
      await InvoiceServices.sendForApprovalCompanyData(
        invoiceData.pi_number,
        req
      );
      setOpenPopup(false);
      setOpen(false);
      getCustomerPIDetails();
    } catch (err) {
      setOpen(false);
    }
  };

  const SendForApprovalPI = async (e) => {
    try {
      e.preventDefault();
      const req = {
        proformainvoice: invoiceData.pi_number,
        approved_by: users.email,
        status: "approved",
      };
      await InvoiceServices.sendForApprovalData(req);
      setOpenPopup(false);
      setOpen(false);
      getCustomerPIDetails();
    } catch (err) {
      setOpen(false);
    }
  };

  return (
    <Box component={Paper} noValidate sx={{ m: "2em", p: "2em" }}>
      <Grid container spacing={2} sx={{ border: 2 }}>
        <Grid item xs={12} sm={2}>
          <img
            style={{ marginLeft: "2em", marginTop: "2em" }}
            src={logo}
            alt="Glutape India Pvt Ltd"
          />
          <Typography sx={{ fontSize: "10px", marginTop: "1em" }}>
            AN ISO 9001-2009 Certified Company
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography
            align="center"
            variant="h4"
            sx={{ ...typographyStyling, mb: "2em", mt: "1em" }}
          >
            PROFORMA INVOICE
          </Typography>
        </Grid>
        {/* seller Details */}
        {sellerData.map((row, i) => {
          return (
            <>
              <Grid item xs={12} sm={6} sx={{ pl: "2em", border: 1 }}>
                <Typography sx={{ ...typographyStyling }}>Seller :-</Typography>
                <Typography>{row.name}</Typography>
                <Typography>
                  {row.address},{row.state}
                </Typography>
              </Grid>
            </>
          );
        })}
        {/* PI Details */}
        <Grid item xs={12} sm={4} sx={{ border: 1 }}>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              PI Number :-{" "}
            </Box>{" "}
            {invoiceData.pi_number}
          </Typography>
          <Typography>
            <Box sx={{ ...typographyStyling }}>Payment Terms :- </Box>
            {paymentTerms}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ border: 1 }}>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Date :-{" "}
            </Box>
            {invoiceData.generation_date}
          </Typography>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Advance :-{" "}
            </Box>
            {invoiceData.amount_recieved}
          </Typography>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Balance :-{" "}
            </Box>
            {invoiceData.balance_amount}
          </Typography>
        </Grid>
        {/* Buyer Details */}
        <Grid item xs={12} sm={6} sx={{ border: 1 }}>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Buyer :-{" "}
            </Box>
            {invoiceData.company}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ border: 1 }}>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              {" "}
              Buyer Order No. :-{" "}
            </Box>
            {invoiceData.buyer_order_no}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ border: 1 }}>
          <Typography>{invoiceData.address}</Typography>
          <Typography>
            {invoiceData.city},{invoiceData.state}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ border: 1 }}>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Delivery Terms :-{" "}
            </Box>
            {invoiceData.delivery_terms}
          </Typography>
          <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Sales Person :-{" "}
            </Box>
            {invoiceData.raised_by}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ p: "2em", border: 1 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ ...typographyStyling }}
                    align="center"
                    colSpan={3}
                  >
                    Details
                  </TableCell>
                  <TableCell
                    sx={{ ...typographyStyling }}
                    colSpan={3}
                    align="center"
                  >
                    Price
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ ...typographyStyling }}>
                    Descrription of Goods
                  </TableCell>
                  <TableCell sx={{ ...typographyStyling }} align="right">
                    QTY.
                  </TableCell>
                  <TableCell sx={{ ...typographyStyling }} align="right">
                    RATE
                  </TableCell>
                  <TableCell sx={{ ...typographyStyling }} align="right">
                    AMOUNT
                  </TableCell>
                  <TableCell sx={{ ...typographyStyling }} align="right">
                    GST
                  </TableCell>
                  <TableCell sx={{ ...typographyStyling }} align="right">
                    TOTAL
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData.map((row) => (
                  <TableRow key={row.proformainvoice}>
                    <TableCell>{row.product}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{row.rate}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.gst}</TableCell>
                    <TableCell align="right">{row.total}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={1} />
                  <TableCell colSpan={2} align="right"></TableCell>
                  <TableCell colSpan={1} align="right">
                    {invoiceData.amount}
                  </TableCell>
                  {invoiceData.igst && (
                    <TableCell colSpan={1} align="right">
                      {invoiceData.igst}
                    </TableCell>
                  )}
                  {invoiceData.sgst && invoiceData.cgst && (
                    <TableCell colSpan={1} align="right">
                      {invoiceData.sgst + invoiceData.cgst}
                    </TableCell>
                  )}
                  <TableCell colSpan={1} align="right">
                    {invoiceData.total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {sellerData.map((bankdata, i) => {
          return (
            <>
              <Grid item xs={12} sx={{ border: 1 }}>
                <Typography sx={{ ...typographyStyling, ml: "2em" }}>
                  Bank Details :-
                </Typography>
                <Typography sx={{ ml: "2em" }}>{bankdata.bank_name}</Typography>
                <Typography sx={{ ml: "2em" }}>
                  <Box sx={{ ...typographyStyling }} display="inline">
                    Account No.{" "}
                  </Box>{" "}
                  {bankdata.current_account_no}
                </Typography>
                <Typography sx={{ ml: "2em" }}>
                  <Box sx={{ ...typographyStyling }} display="inline">
                    IFSC Code :{" "}
                  </Box>{" "}
                  {bankdata.ifsc_code}
                </Typography>
                <Typography sx={{ ml: "2em" }}>
                  <Box sx={{ ...typographyStyling }} display="inline">
                    BRANCH :{" "}
                  </Box>{" "}
                  {bankdata.branch}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ border: 1 }}>
                <Typography sx={{ ml: "2em" }}>
                  <Box sx={{ ...typographyStyling }} display="inline">
                    Company GST No :-{" "}
                  </Box>
                  {bankdata.gst_number}
                </Typography>
                <Typography sx={{ ml: "2em" }}>
                  <Box sx={{ ...typographyStyling }} display="inline">
                    {" "}
                    Buyer GST No :-{" "}
                  </Box>{" "}
                  {invoiceData.gst_number}
                </Typography>
              </Grid>
            </>
          );
        })}
        <Grid item xs={12} sm={6} sx={{ border: 1 }}>
          <Typography align={"center"}>Glutape India Pvt. Ltd.</Typography>
          <Typography align={"center"}>
            <Box sx={{ ...typographyStyling }} display="inline">
              ATHORISED SIGNATORY
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ m: "2em" }} align={"right"}>
          {users.is_staff === true &&
            invoiceData.status === "pending_approval" && (
              <Grid item xs={12} sx={{ m: "2em" }} align={"right"}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    SendForApprovalPI(e);
                    SendForApprovalStatus(e);
                  }}
                >
                  Approve
                </Button>
              </Grid>
            )}
          {invoiceData.status === "approved" &&
            users.groups[0] === "Accounts" && (
              <Grid item xs={12} sx={{ m: "2em" }} align={"right"}>
                <Button variant="contained" onClick={() => setOpenPopup2(true)}>
                  Confirmation Payment
                </Button>
              </Grid>
            )}
        </Grid>
      </Grid>
      <Popup
        maxWidth={"md"}
        title={"Customer Confirmation of payment detail"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CustomerConfirmationPayment
          users={users}
          invoiceData={invoiceData}
          setOpenPopup={setOpenPopup2}
          getAllProformaInvoiceDetails={getAllProformaInvoiceDetails}
        />
      </Popup>
    </Box>
  );
};
