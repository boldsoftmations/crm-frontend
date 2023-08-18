import React from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";

export const DescriptionWiseTurnover = ({
  descriptionWiseTurnoverFilterData,
  salesData,
}) => {
  const Tableheaders = ["Description", "Brand", "Turnover"];

  const headers = [
    { label: "Date", key: "date" },
    { label: "Customer", key: "customer_name" },
    { label: "Invoice No", key: "invoice_no" },
    { label: "Product", key: "sku" },
    { label: "Description", key: "description" },
    { label: "Quantity", key: "quantity" },
    { label: "Amount", key: "amount" },
  ];

  const data =
    salesData.length > 0 &&
    salesData.map((row, i) => ({
      date: row.date,
      customer_name: row.customer_name,
      invoice_no: row.invoice_no,
      sku: row.sku,
      description: row.description,
      quantity: row.quantity,
      amount: row.amount,
    }));

  const Tabledata =
    descriptionWiseTurnoverFilterData.length > 0 &&
    descriptionWiseTurnoverFilterData.map((row, i) => ({
      description: row.description_name,
      brand: row.brand_name,
      turnover: row.turnover,
    }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h3
            style={{
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
              textAlign: "center", // Center align the h3 text
              flex: 1, // Allow the h3 to take available space
            }}
          >
            DESCRIPTION WISE TURNOVER
          </h3>
          {data.length > 0 && (
            <CSVLink
              data={data}
              headers={headers}
              filename={"Description Wise Turnover.csv"}
              target="_blank"
              style={{
                textDecoration: "none",
                outline: "none",
                height: "5vh",
              }}
            >
              <Button variant="contained" color="success">
                Download CSV
              </Button>
            </CSVLink>
          )}
        </Box>

        {descriptionWiseTurnoverFilterData.length > 0 && (
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
        )}
      </Paper>
    </Grid>
  );
};
