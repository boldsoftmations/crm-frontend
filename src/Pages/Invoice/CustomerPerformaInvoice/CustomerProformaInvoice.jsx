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
import React, { useEffect, useState, useRef } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import "../../CommonStyle.css";
import logo from " ../../../public/images.ico";
import { CustomerConfirmationPayment } from "./CustomerConfirmationPayment";
import { Popup } from "./../../../Components/Popup";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
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


export const CustomerProformaInvoice = (props) => {
  const { idForEdit, setOpenPopup, getCustomerPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [open, setOpen] = useState(false);
  const [approve, setApprove] = useState("");
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const sellerData = data.sellerAccount;
  useEffect(() => {
    getAllProformaInvoiceDetails();
  }, []);

  const getAllProformaInvoiceDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getCompanyPerformaInvoiceByIDData(
        idForEdit
      );
      setInvoiceData(response.data);
      setProductData(response.data.products);
      setApprove(response.data.approval);
      setOpen(false);
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
        status: "Approved",
      };
      await InvoiceServices.sendForApprovalData(req);
      setOpenPopup(false);
      setOpen(false);
      getCustomerPIDetails();
    } catch (err) {
      setOpen(false);
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:  `PI Number ${invoiceData.pi_number}`,
  });

  return (
    <Box>
      <Box noValidate sx={{ m: "2em", p: "2em" }} ref={componentRef}>
        <Grid container spacing={2} sx={{ border: 2 }}>
          <Grid item xs={12} sm={2} >
            <img
              src={logo}
              alt="Glutape India Pvt Ltd"
            />
            <p style={{ fontSize: "10px" }}>
              AN ISO 9001-2009 Certified Company
            </p>
          </Grid>
          <Grid item xs={12} sm={10}>
            <h5
              style={{ ...typographyStyling, mb: "2em", mt: "1em",display:'flex',justifyContent:'center' }}
            >
              PROFORMA INVOICE
            </h5>
          </Grid>
          {/* seller Details */}
          {sellerData.map((row, i) => {
            return (
              <>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ pl: "2em",borderBottom: 2,borderRight:2, borderTop:2 }}
                >
                  <div style={{ ...typographyStyling }}>
                    Seller :-
                  </div>
                  <div >
                    {row.name}, <br /> {row.address}, <br />
                    {row.city},{row.state}
                  </div>
                </Grid>
              </>
            );
          })}
          {/* PI Details */}
          <Grid item xs={12} sm={4} sx={{ borderBottom: 2,borderRight:2, borderTop:2 }}>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                PI Number :-{" "}
              </Box>{" "}
              {invoiceData.pi_number}
            </div>
            <div>
              <Box sx={{ ...typographyStyling }}>Payment Terms :- </Box>
              {invoiceData.payment_terms}
            </div>
          </Grid>
          <Grid item xs={12} sm={2} sx={{borderBottom: 2, borderTop:2 }}>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                Date :-{" "}
              </Box>
              {invoiceData.generation_date}
            </div>
            {/* <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Advance :-
            </Box>
            {invoiceData.amount_recieved}
          </Typography> */}
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                Balance :-{" "}
              </Box>
              {invoiceData.balance_amount}
            </div>
          </Grid>
          {/* Buyer Details */}
          <Grid item xs={12} sm={6} sx={{  borderBottom: 2,borderRight:2}}>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                Buyer :-{" "}
              </Box>
              {invoiceData.company}
            </div>
          </Grid>
          <Grid item xs={12} sm={6} sx={{  borderBottom: 2}}>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                {" "}
                Buyer Order No. :-{" "}
              </Box>
              {invoiceData.buyer_order_no}
            </div>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ borderBottom: 2,borderRight:2 }}>
            <div>{invoiceData.address}</div>
            <div>
              {invoiceData.city},{invoiceData.state}
            </div>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ borderBottom: 2 }}>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                Delivery Terms :-{" "}
              </Box>
              {invoiceData.delivery_terms}
            </div>
            <div>
              <Box sx={{ ...typographyStyling }} display="inline">
                Sales Person :-{" "}
              </Box>
              {invoiceData.raised_by}
            </div>
          </Grid>
          <Grid item xs={12} sx={{ p: "2em" }}>
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
                <Grid item xs={12} sx={{ borderBottom: 2, borderTop:2}}>
                  <div style={{ ...typographyStyling, ml: "2em" }}>
                    Bank Details :-
                  </div>
                  <div style={{ ml: "2em" }}>
                    {bankdata.bank_name}
                  </div>
                  <div style={{ ml: "2em" }}>
                    <Box sx={{ ...typographyStyling }} display="inline">
                      Account No.{" "}
                    </Box>{" "}
                    {bankdata.current_account_no}
                  </div>
                  <div style={{ ml: "2em" }}>
                    <Box sx={{ ...typographyStyling }} display="inline">
                      IFSC Code :{" "}
                    </Box>{" "}
                    {bankdata.ifsc_code}
                  </div>
                  <div style={{ ml: "2em" }}>
                    <Box sx={{ ...typographyStyling }} display="inline">
                      BRANCH :{" "}
                    </Box>{" "}
                    {bankdata.branch}
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} sx={{ borderRight:2}}>
                  <div style={{ ml: "2em" }}>
                    <Box sx={{ ...typographyStyling }} display="inline">
                      Company GST No :-{" "}
                    </Box>
                    {bankdata.gst_number}
                  </div>
                  <div style={{ ml: "2em" }}>
                    <Box sx={{ ...typographyStyling }} display="inline">
                      {" "}
                      Buyer GST No :-{" "}
                    </Box>{" "}
                    {invoiceData.gst_number}
                  </div>
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} sm={6} >
            <div align={"center"}>
              {approve !== null ? approve.approved_by : "Pending Approval"}
            </div>
            <div align={"center"}>
              {approve !== null ? approve.approval_date : ""}
            </div>
            <div align={"center"}>
              <Box sx={{ ...typographyStyling }} display="inline">
                ATHORISED SIGNATORY
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>
      {/* </PDFExport> */}
      <Box sx={{ border: 2, m: "2em", p: "2em" }}>
        <Grid container spacing={2}>
          {invoiceData.status !== "Pending Approval" && (
            <Grid item xs={12} sm={6}>
              <Button variant="contained" onClick={handlePrint}>
                Export
              </Button>
            </Grid>
          )}

          {users.is_staff === true &&
            invoiceData.status === "Pending Approval" && (
              <Grid item xs={12} sm={6} align={"right"}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    SendForApprovalPI(e);
                    // SendForApprovalStatus(e);
                  }}
                >
                  Approve
                </Button>
              </Grid>
            )}
          {invoiceData.status === "Approved" &&
            users.groups[0] === "Accounts" && (
              <Grid item xs={12} sm={6} align={"right"}>
                <Button variant="contained" onClick={() => setOpenPopup2(true)}>
                  Confirmation Payment
                </Button>
              </Grid>
            )}
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
    </Box>
  );
};
