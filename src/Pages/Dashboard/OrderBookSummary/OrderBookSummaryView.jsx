import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "./../../../Components/CustomTable";

export const OrderBookSummaryView = (props) => {
  const { orderBookSummary } = props;

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const sums = orderBookSummary.reduce(
    (accumulator, current) => accumulator + current.total_amount,
    0
  );

  const headers = ["SELLER STATE", "AMOUNT"];
  const totalRow = ["Total", numberFormat(sums.toFixed(2))];
  const rowData = orderBookSummary.map((value) => ({
    seller_state: value.orderbook__proforma_invoice__seller_account__state,
    amount: numberFormat(value.total_amount),
  }));
  const data = [...rowData, totalRow];
  return (
    <>
      <Grid item xs={12}>
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
                View Order Book Summary
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right"></Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={headers}
            data={data}
            openInPopup={null} // Set to null or pass in your custom function
          />
          {/* <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          /> */}
        </Paper>
      </Grid>
    </>
  );
};
