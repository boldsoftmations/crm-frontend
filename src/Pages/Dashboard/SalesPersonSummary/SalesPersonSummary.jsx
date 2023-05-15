import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";

export const SalesPersonSummary = (props) => {
  const { salesPersonSummary } = props;

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const headers = [
    "Sales Person Name",
    "New Customer",
    "PI Raised",
    "PI Dropped",
    "PI Unpaid",
    "Forecast Achieved %",
    "Unpaid PI Value",
    "Order Book Value",
    "Sales Invoice Value",
  ];

  const totalRow = {
    sales_person_name: "Total",
    new_customer: salesPersonSummary.reduce(
      (sum, { new_customer }) => sum + new_customer,
      0
    ),
    pi_raised: salesPersonSummary.reduce(
      (sum, { pi_raised }) => sum + pi_raised,
      0
    ),
    pi_dropped: salesPersonSummary.reduce(
      (sum, { pi_dropped }) => sum + pi_dropped,
      0
    ),
    pi_unpaid: salesPersonSummary.reduce(
      (sum, { pi_unpaid }) => sum + pi_unpaid,
      0
    ),
    forecast_achieved: "-",

    unpaid_pi_value: numberFormat(
      salesPersonSummary
        .reduce((sum, { unpaid_pi_value }) => sum + unpaid_pi_value, 0)
        .toFixed(2)
    ),
    order_book_value: numberFormat(
      salesPersonSummary
        .reduce((sum, { order_book_value }) => sum + order_book_value, 0)
        .toFixed(2)
    ),
    sales_invoice_value: numberFormat(
      salesPersonSummary
        .reduce((sum, { sales_invoice_value }) => sum + sales_invoice_value, 0)
        .toFixed(2)
    ),
  };

  const rawData = salesPersonSummary.map((value) => ({
    sales_person_name: `${value.first_name} ${value.last_name}`,
    new_customer: value.new_customer,
    pi_raised: value.pi_raised,
    pi_dropped: value.pi_dropped,
    pi_unpaid: value.pi_unpaid,
    forecast_achieved: value.forecast_achieved.toString().substring(0, 2),
    unpaid_pi_value: numberFormat(value.unpaid_pi_value),
    order_book_value: numberFormat(value.order_book_value),
    sales_invoice_value: numberFormat(value.sales_invoice_value),
  }));

  const data = [...rawData, totalRow];

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
                Sales Person Summary
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right"></Box>
          </Box>
          <CustomTable
            headers={headers}
            data={data}
            openInPopup={null} // Set to null or pass in your custom function
          />
        </Paper>
      </Grid>
    </>
  );
};
