import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { Popup } from "./../../../Components/Popup";
import { DailyProfitableSalesReport } from "./DailyProfitableSalesReport";

export const DailyProfitableReports = (props) => {
  const { dailyProfitableReportsData } = props;
  const [idForEdit, setIdForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const openInPopup = (item) => {
    console.log(item);
    setIdForEdit(item);
    setOpenPopup(true);
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
      <Grid item xs={12}>
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
