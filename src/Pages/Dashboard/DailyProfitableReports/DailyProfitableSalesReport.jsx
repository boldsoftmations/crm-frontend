import React, { useEffect, useRef, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";

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

  const Tableheaders = ["Unit", "Date", "Invoice No", "Company", "Total"];

  const Tabledata = dailyProfitableReportsData.map((row, i) => ({
    unit: row.sales_invoice__order_book__proforma_invoice__seller_account__unit,
    date: row.sales_invoice__generation_date,
    invoice_no: row.sales_invoice,
    company: row.sales_invoice__order_book__company__name,
    total: row.total,
  }));

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
        </Paper>
      </Grid>
    </div>
  );
};
