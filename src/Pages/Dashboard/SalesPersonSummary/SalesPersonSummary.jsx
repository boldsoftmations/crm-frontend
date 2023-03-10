import React from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

export const SalesPersonSummary = (props) => {
  const { salesPersonSummary } = props;

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  function salesInvoiceValue(items) {
    return items
      .map(({ sales_invoice_value }) => sales_invoice_value)
      .reduce((sum, i) => sum + i, 0);
  }

  const Sale_Invoice_Value_Total = salesInvoiceValue(salesPersonSummary);

  function orderBookValue(items) {
    return items
      .map(({ order_book_value }) => order_book_value)
      .reduce((sum, i) => sum + i, 0);
  }

  const Order_Book_Value_Total = orderBookValue(salesPersonSummary);

  function unpaidPiValue(items) {
    return items
      .map(({ unpaid_pi_value }) => unpaid_pi_value)
      .reduce((sum, i) => sum + i, 0);
  }

  const Unpaid_PI_Value_Total = unpaidPiValue(salesPersonSummary);

  function piUnpaid(items) {
    return items
      .map(({ pi_unpaid }) => pi_unpaid)
      .reduce((sum, i) => sum + i, 0);
  }

  const PI_Unpaid_Total = piUnpaid(salesPersonSummary);

  function piDropped(items) {
    return items
      .map(({ pi_dropped }) => pi_dropped)
      .reduce((sum, i) => sum + i, 0);
  }

  const PI_Dropped_Total = piDropped(salesPersonSummary);

  function piRaised(items) {
    return items
      .map(({ pi_raised }) => pi_raised)
      .reduce((sum, i) => sum + i, 0);
  }

  const PI_Raised_Total = piRaised(salesPersonSummary);

  function newCustomer(items) {
    return items
      .map(({ new_customer }) => new_customer)
      .reduce((sum, i) => sum + i, 0);
  }

  const New_Customer_Total = newCustomer(salesPersonSummary);

  return (
    <>
      {" "}
      {/* <CustomLoader open={open} /> */}
      <Grid item xs={12}>
        {/* <ErrorMessage errRef={errRef} errMsg={errMsg} /> */}
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
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
                Sales Person Summary
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right"></Box>
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
                  <StyledTableCell align="center">
                    Sales Person Name
                  </StyledTableCell>
                  <StyledTableCell align="center">New Customer</StyledTableCell>
                  <StyledTableCell align="center">PI Raised</StyledTableCell>
                  <StyledTableCell align="center">PI Dropped</StyledTableCell>
                  <StyledTableCell align="center">PI Unpaid </StyledTableCell>
                  <StyledTableCell align="center">
                    Unpaid PI Value
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Order Book Value
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Sales Invoice Value
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {salesPersonSummary.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.first_name} {row.last_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.new_customer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pi_raised}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pi_dropped}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pi_unpaid}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormat(row.unpaid_pi_value)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormat(row.order_book_value)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormat(row.sales_invoice_value)}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
                <StyledTableRow>
                  <StyledTableCell align="center">Total</StyledTableCell>
                  <StyledTableCell align="center">
                    {New_Customer_Total}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {PI_Raised_Total}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {PI_Dropped_Total}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {PI_Unpaid_Total}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numberFormat(Unpaid_PI_Value_Total)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numberFormat(Order_Book_Value_Total)}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {numberFormat(Sale_Invoice_Value_Total)}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* <CustomPagination
              pageCount={pageCount}
              handlePageClick={handlePageClick}
            /> */}
        </Paper>
      </Grid>
    </>
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
