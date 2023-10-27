import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Box, Snackbar, Alert } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import CustomTextField from "../../../Components/CustomTextField";

export const SalesHistoryView = ({ recordForEdit }) => {
  const [salesHistory, setSalesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
  );
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  console.log("filterDate", filterDate);
  useEffect(() => {
    fetchSalesHistory();
  }, [filterDate]);

  const fetchSalesHistory = async () => {
    try {
      setIsLoading(true);
      const response = await CustomerServices.getSalesHistoryDataByIdWithType(
        recordForEdit,
        "sales_history",
        filterDate
      );
      // Process and set data here...
      setSalesHistory(response.data.sales_history);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching sales history:", error);
      setErrorMessages(["Error fetching data. Please try again."]);
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex(currentErrorIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0);
    }
  }, [currentErrorIndex, errorMessages.length]);

  const TableHeader = [
    "Date",
    "Sales Invoice",
    "Description",
    "Product",
    "Quantity",
    "Unit",
    "Rate",
    "Amount",
    "Total GST",
    "Total Amount",
  ];

  const TableData =
    salesHistory &&
    salesHistory.map((value) => ({
      date: value.date,
      sales_invoice: value.sales_invoice,
      description: value.description,
      product: value.product,
      quantity: value.quantity,
      unit: value.unit,
      rate: value.rate,
      amount: value.amount,
      total_gst: value.gst,
      total_amount: value.total,

      // ... other fields
    }));

  return (
    <>
      <CustomLoader open={isLoading} />
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="1em"
          >
            <CustomTextField
              size="small"
              type="month"
              label="Filter by Month and Year"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              sx={{ width: 200, mr: 2 }}
            />
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Sales History
            </h3>
            <Box>
              <h5
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "16px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                No of PI Dropped: {salesHistory.drop_pi}
              </h5>
              <h5
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "16px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Total Sales for the Month: {salesHistory.total_sales}
              </h5>
            </Box>
          </Box>
          {TableData && (
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={null}
            />
          )}
        </Paper>
      </Grid>
    </>
  );
};
