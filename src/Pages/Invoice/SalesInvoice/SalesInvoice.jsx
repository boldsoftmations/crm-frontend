import React, { useEffect, useState, useRef } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import logo from " ../../../public/images.ico";
import { useReactToPrint } from "react-to-print";

export const SalesInvoice = (props) => {
  const { idForEdit, getSalesInvoiceDetails, setOpenPopup } = props;
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getSalesInvoiceByIDDetails();
  }, []);

  const getSalesInvoiceByIDDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getSalesnvoiceDataById(idForEdit);
      setSalesInvoiceData(response.data);
      setProductData(response.data.products);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `PI Number ${salesInvoiceData.order_book}`,
  });

  return (
    <Box>
      <Box noValidate sx={{ m: "2em", p: "2em" }} ref={componentRef}>
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
              variant="h5"
              sx={{ ...typographyStyling, mb: "2em", mt: "1em" }}
            >
              SALES INVOICE
            </Typography>
          </Grid>
          {/* seller Details */}

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ pl: "2em", borderBottom: 2, borderRight: 2, borderTop: 2 }}
          >
            <Typography sx={{ ...typographyStyling }}>Seller :-</Typography>
            <Typography>
              {salesInvoiceData.seller_name}, <br></br>{" "}
              {salesInvoiceData.seller_address},
            </Typography>
            <Typography>
              {salesInvoiceData.seller_city},{salesInvoiceData.seller_state}
            </Typography>
          </Grid>

          {/* PI Details */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ borderBottom: 2, borderRight: 2, borderTop: 2 }}
          >
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                Invoice :-
              </Box>{" "}
              {salesInvoiceData.invoice_no}
            </Typography>
            <Typography>
              <Box sx={{ ...typographyStyling }}>Payment Terms :- </Box>
              {salesInvoiceData.payment_terms}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ borderBottom: 2, borderTop: 2 }}>
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                Date :-{" "}
              </Box>
              {salesInvoiceData.generation_date}
            </Typography>
            {/* <Typography>
            <Box sx={{ ...typographyStyling }} display="inline">
              Advance :-
            </Box>
            {salesInvoiceData.amount_recieved}
          </Typography> */}
            {/* <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                Balance :-{" "}
              </Box>
              {salesInvoiceData.balance_amount}
            </Typography> */}
          </Grid>
          {/* Buyer Details */}
          <Grid item xs={12} sm={6} sx={{ borderBottom: 2, borderRight: 2 }}>
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                Billing :-{" "}
              </Box>
              {salesInvoiceData.billing_address}
              <br />
              {salesInvoiceData.billing_city},{salesInvoiceData.billing_state}
            </Typography>
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                shipping :-{" "}
              </Box>
              {salesInvoiceData.shipping_address}
              <br />
              {salesInvoiceData.shipping_city},{salesInvoiceData.shipping_state}
            </Typography>
            {/* <Typography>{salesInvoiceData.address}</Typography>
          <Typography>
            {salesInvoiceData.city},{salesInvoiceData.state}
          </Typography> */}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ borderBottom: 2 }}>
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                Delivery Terms :-{" "}
              </Box>
              {salesInvoiceData.delivery_terms}
            </Typography>
            <Typography>
              <Box sx={{ ...typographyStyling }} display="inline">
                {" "}
                Buyer Order No. :-{" "}
              </Box>
              {salesInvoiceData.buyer_order_number}
            </Typography>
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
                      {salesInvoiceData.amount}
                    </TableCell>
                    {salesInvoiceData.igst && (
                      <TableCell colSpan={1} align="right">
                        {salesInvoiceData.igst}
                      </TableCell>
                    )}
                    {salesInvoiceData.sgst && salesInvoiceData.cgst && (
                      <TableCell colSpan={1} align="right">
                        {salesInvoiceData.sgst + salesInvoiceData.cgst}
                      </TableCell>
                    )}
                    <TableCell colSpan={1} align="right">
                      {salesInvoiceData.total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ borderTop: 2 }}>
            <Typography sx={{ ml: "2em" }}>
              <Box sx={{ ...typographyStyling }} display="inline">
                Company GST No :-{" "}
              </Box>
              {salesInvoiceData.seller_gst}
            </Typography>
            {salesInvoiceData.buyer_gst && (
              <Typography sx={{ ml: "2em" }}>
                <Box sx={{ ...typographyStyling }} display="inline">
                  {" "}
                  Buyer GST No :-{" "}
                </Box>{" "}
                {salesInvoiceData.buyer_gst}
              </Typography>
            )}
            {salesInvoiceData.buyer_pan && (
              <Typography sx={{ ml: "2em" }}>
                <Box sx={{ ...typographyStyling }} display="inline">
                  {" "}
                  Buyer PAN No :-{" "}
                </Box>{" "}
                {salesInvoiceData.buyer_pan}
              </Typography>
            )}
          </Grid>
          {/* <Grid item xs={12} sm={6} >
            <Typography align={"center"}>
              {approve !== null ? approve.approved_by : "Pending Approval"}
            </Typography>
            <Typography align={"center"}>
              {approve !== null ? approve.approval_date : ""}
            </Typography>
            <Typography align={"center"}>
              <Box sx={{ ...typographyStyling }} display="inline">
                ATHORISED SIGNATORY
              </Box>
            </Typography>
          </Grid> */}
        </Grid>
      </Box>
      {/* </PDFExport> */}
      <Box sx={{ border: 2, m: "2em", p: "2em" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={handlePrint}>
              Export
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const typographyStyling = {
  fontWeight: "bold",
};
