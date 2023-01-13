import React, { useState, useEffect, useRef } from "react";
import InvoiceServices from "../../services/InvoiceService";
import {
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";

export const CustomerOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    getAllCustomerWiseOrderBook();
  }, []);

  const getAllCustomerWiseOrderBook = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData("customer");
      setOrderBookData(response.data.results);
      //   const total = response.data.count;
      //   setpageCount(Math.ceil(total / 25));
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

  const data = orderBookData.map((item) => ({
    company: item.company,
    pi_date: item.pi_date,
    proforma_invoice: item.proforma_invoice,
    billing_city: item.billing_city,
    shipping_city: item.shipping_city,
    product: item.product,
    quantity: item.quantity,
    amount: item.amount,
    pending_quantity: item.pending_quantity,
  }));

  console.log(data);

  console.log("data :>> ", data);
  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}></Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Customer Order Book Details
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <CSVLink
                data={data}
                headers={headers}
                filename={"my-file.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button variant="contained" color="success">
                  Export to Excel
                </Button>
              </CSVLink>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="collapsible table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">PI DATE</StyledTableCell>
                  <StyledTableCell align="center">PI NUMBER</StyledTableCell>
                  <StyledTableCell align="center">BILLING CITY</StyledTableCell>
                  <StyledTableCell align="center">
                    SHIPPING CITY
                  </StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">
                    PENDING QUANTITY
                  </StyledTableCell>
                  <StyledTableCell align="center">AMOUNT</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {orderBookData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pi_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.proforma_invoice}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.billing_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.shipping_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pending_quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.amount}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </div>
  );
};

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

const headers = [
  { label: "Customer", key: "company" },
  { label: "PI Date", key: "pi_date" },
  { label: "PI Numner", key: "proforma_invoice" },
  { label: "Billing City", key: "billing_city" },
  { label: "Shipping City", key: "shipping_city" },
  {
    label: "Product",
    key: "product",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Amount",
    key: "amount",
  },
  {
    label: "Pending Quantity",
    key: "pending_quantity",
  },
];
