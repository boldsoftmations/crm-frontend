import React, { useEffect, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Box, Grid } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const DailyProfitableSalesReport = (props) => {
  const { idForEdit } = props;
  const [open, setOpen] = useState(false);
  const [dailyProfitableReportsData, setDailyProfitableReportsData] = useState(
    []
  );
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getDailyProfitableReports = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getDailyProfitableSalesReportsDataByFilter(
          idForEdit.date_range_before,
          idForEdit.date_range_after,
          idForEdit.unit
        );
      setDailyProfitableReportsData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getDailyProfitableReports();
  }, []);

  const Tableheaders = [
    "Unit",
    "Date",
    "Invoice No",
    "Product",
    "Company",
    "Quantity",
    "Rate",
    "Amount",
    "Cost",
    "Cost Value",
    "Total",
  ];

  const headers = [
    { label: "Unit", key: "unit" },
    { label: "Date", key: "date" },
    { label: "Invoice No", key: "invoice_no" },
    { label: "Product", key: "product" },
    { label: "Company", key: "company" },
    { label: "Quantity", key: "quantity" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
    { label: "Cost", key: "cost" },
    { label: "Cost Value", key: "cost_value" },
    { label: "Total", key: "total" },
  ];

  const Tabledata = dailyProfitableReportsData.map((row, i) => ({
    unit: row.sales_invoice__order_book__proforma_invoice__seller_account__unit,
    date: row.sales_invoice__generation_date,
    invoice_no: row.sales_invoice,
    product: row.product__name,
    company: row.sales_invoice__order_book__company__name,
    quantity: row.quantity,
    rate: row.rate,
    amount: row.amount,
    cost: row.cost,
    cost_value: row.cost_value,
    total: row.total,
  }));

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end" marginBottom={5}>
          <CSVLink
            data={Tabledata}
            headers={headers}
            filename={"Daily Profitability Sales Report.csv"}
            target="_blank"
            style={{
              textDecoration: "none",
              outline: "none",
              height: "5vh",
            }}
          >
            <div
              className="btn btn-primary"
              style={{
                display: "inline-block",
                padding: "6px 16px",
                margin: "10px",
                fontSize: "0.875rem",
                minWidth: "64px",
                fontWeight: 500,
                lineHeight: 1.75,
                borderRadius: "4px",
                letterSpacing: "0.02857em",
                textTransform: "uppercase",
                boxShadow:
                  "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
              }}
            >
              Download CSV
            </div>
          </CSVLink>
        </Box>
        <CustomTable
          headers={Tableheaders}
          data={Tabledata}
          openInPopup={null}
          openInPopup2={null}
          openInPopup3={null}
          openInPopup4={null}
          Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
        />
      </Grid>
    </>
  );
};
