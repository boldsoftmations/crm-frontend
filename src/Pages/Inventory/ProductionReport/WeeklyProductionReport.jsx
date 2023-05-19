import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
import { CSVLink } from "react-csv";
import InventoryServices from "../../../services/InventoryService";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentMonthFormatted =
  currentMonth < 10 ? `0${currentMonth}` : currentMonth;
const initialSearchQuery = `${currentYear}-${currentMonthFormatted}`;

export const WeeklyProductionReport = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [weeklyProductionReportData, setWeeklyProductionReportData] = useState(
    []
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    getAllWeeklyProductionReportDetails();
  }, [searchQuery]);

  const getAllWeeklyProductionReportDetails = async () => {
    try {
      setOpen(true);
      const dateString = searchQuery;
      const dateParts = dateString.split("-");
      const year = dateParts[0];
      const month = dateParts[1];
      const response =
        await InventoryServices.getWeeklyProductionReportFilterData(
          month,
          year
        );

      setWeeklyProductionReportData(response.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setOpen(false);
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

  const getWeeksInYearAndMonth = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const weeks = [];

    let weekNumber = 1;
    while (startDate <= endDate) {
      const formattedWeek = `Week ${weekNumber}`;
      weeks.push(formattedWeek);
      startDate.setDate(startDate.getDate() + 7);
      weekNumber++;
    }

    return weeks;
  };
  const [year, month] = searchQuery.split("-");
  const weeks = getWeeksInYearAndMonth(year, month);

  const headers = [
    { label: "Seller Unit", key: "seller_account__unit" },
    { label: "Product", key: "product__name" },
    { label: "Unit", key: "product__unit__name" },
    { label: "Brand", key: "product__brand__name" },
  ];

  const weekNumbers = [1, 2, 3, 4, 5];

  weekNumbers.forEach((weekNumber) => {
    headers.push({ label: `Week ${weekNumber}`, key: `week${weekNumber}` });
  });

  headers.push({ label: "Total", key: "total" });

  //   export to excel data
  let data = weeklyProductionReportData.flatMap((row) => {
    const week1 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 0
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week2 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 1
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week3 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 2
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week4 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 3
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week5 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 4
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );

    const total = week1 + week2 + week3 + week4 + week5;

    return {
      seller_account__unit: row.seller_account__unit,
      product__name: row.product__name,
      product__unit__name: row.product__unit__name,
      product__brand__name: row.product__brand__name,
      week1,
      week2,
      week3,
      week4,
      week5,
      total,
    };
  });

  const TableHeader = [
    "Seller Unit",
    "Product",
    "Unit",
    "Brand",
    ...weeks,
    "Total",
  ];

  const TableData = weeklyProductionReportData.flatMap((row) => {
    const week1 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 0
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week2 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 1
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week3 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 2
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week4 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 3
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );
    const week5 = row.data
      .filter(
        (data) => data.index_position !== null && data.index_position === 4
      )
      .reduce(
        (sum, filteredData) => sum + Number(filteredData.total_quantity),
        0
      );

    const total = week1 + week2 + week3 + week4 + week5;

    return {
      seller_account__unit: row.seller_account__unit,
      product__name: row.product__name,
      product__unit__name: row.product__unit__name,
      product__brand__name: row.product__brand__name,
      week1,
      week2,
      week3,
      week4,
      week5,
      total,
    };
  });

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <TextField
                label="Search"
                type="month"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
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
                Weekly Production Report
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <CSVLink
                data={data}
                headers={headers}
                filename={"Weekly Production Report.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button color="success" variant="contained">
                  Export to Excel
                </Button>
              </CSVLink>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable headers={TableHeader} data={TableData} />
        </Paper>
      </Grid>
    </>
  );
};
