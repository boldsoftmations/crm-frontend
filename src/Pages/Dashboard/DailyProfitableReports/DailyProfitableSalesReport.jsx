import React, { useEffect, useRef, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";

export const DailyProfitableSalesReport = (props) => {
  const { idForEdit, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [dailyProfitableReportsData, setDailyProfitableReportsData] = useState(
    []
  );
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    getDailyProfitableReports();
  }, []);

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

      setOpen(false);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

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
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />

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
    </div>
  );
};
