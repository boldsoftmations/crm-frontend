import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Paper, Box, Snackbar, Alert, Button } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import CustomTextField from "../../../Components/CustomTextField";
import { CSVLink } from "react-csv";

export const SalesHistoryView = ({ recordForEdit }) => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [salesSummary, setSalesSummary] = useState({
    drop_pi: 0,
    total_sales: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`
  );
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

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

      setSalesRecords(response.data.sales_history);
      setSalesSummary({
        drop_pi: response.data.drop_pi,
        total_sales: response.data.total_sales,
      });
      const data = response.data.sales_history.map((row) => {
        return {
          date: row.date,
          sales_invoice: row.sales_invoice,
          product: row.product,
          description: row.description,
          quantity: row.quantity,
          unit: row.unit,
          rate: row.rate,
          amount: row.amount,
          gst: row.gst,
          total: row.total,
        };
      });
      console.log("data", data);
      setIsLoading(false);
      return data;
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
    salesRecords &&
    salesRecords.map((value) => ({
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
    }));
  const headers = [
    { label: "Date", key: "date" },
    { label: "Sales Invoice", key: "sales_invoice" },
    { label: "Description", key: "description" },
    { label: "Product", key: "product" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit", key: "unit" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
    { label: "Total GST", key: "gst" },
    { label: "Total Amount", key: "total" },
  ];
  const handleDownload = async () => {
    try {
      const data = await fetchSalesHistory();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

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
                No of PI Dropped: {salesSummary.drop_pi}
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
                Total Sales for the Month: {salesSummary.total_sales}
              </h5>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              className="mx-3"
              onClick={handleDownload}
            >
              DownLoad CSV
            </Button>

            {exportData.length > 0 && (
              <CSVLink
                data={exportData}
                headers={headers}
                ref={csvLinkRef}
                filename="Sales History.csv"
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  visibility: "hidden",
                }}
              />
            )}
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
