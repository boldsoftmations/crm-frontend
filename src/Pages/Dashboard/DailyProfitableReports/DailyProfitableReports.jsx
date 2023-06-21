import React, { useEffect, useRef, useState } from "react";
import DashboardService from "../../../services/DashboardService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { Popup } from "./../../../Components/Popup";
import { DailyProfitableSalesReport } from "./DailyProfitableSalesReport";

export const DailyProfitableReports = () => {
  const [open, setOpen] = useState(false);
  const [dailyProfitableReportsData, setDailyProfitableReportsData] = useState(
    []
  );
  const [idForEdit, setIdForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const openInPopup = (item) => {
    console.log(item);
    setIdForEdit(item);
    setOpenPopup(true);
  };

  useEffect(() => {
    getDailyProfitableReports();
  }, []);

  const getDailyProfitableReports = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getDailyProfitableReportsData();
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
    "Date Range Before",
    "Date Range After",
    "Unit",
    "Total",
    "Action",
  ];

  const Tabledata = dailyProfitableReportsData.map((row, i) => ({
    date_range_before: row.date_range_before,
    date_range_after: row.date_range_after,
    unit: row.sales_invoice__order_book__proforma_invoice__seller_account__unit,
    total: row.total,
  }));

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              DAILY PROFITABILITY REPORTS
            </h3>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth="xl"
        title="View Daily Profitability Sales Reports"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <DailyProfitableSalesReport
          idForEdit={idForEdit}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </div>
  );
};
