import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import InventoryServices from "./../../../services/InventoryService";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { CSVDownload } from "react-csv";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../../Components/CustomLoader";

export const DailyProductionReport = () => {
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [dailyProductionReport, setDailyProductionReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const [endDate, setEndDate] = useState(new Date()); // set endDate as one week ahead of startDate
  const [startDate, setStartDate] = useState(
    new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  ); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];

  const getResetData = () => {
    setSearchQuery("");
    getDailyProductionReport();
  };

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(searchQuery);
  };

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDailyProductionReport();
  }, [startDate]);

  const getDailyProductionReport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      if (currentPage) {
        const response =
          await InventoryServices.getDailyProductionReportWithPagination(
            StartDate,
            EndDate,
            currentPage
          );
        setDailyProductionReport(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        let response = await InventoryServices.getAllDailyProductionReport(
          StartDate,
          EndDate
        );
        if (response) {
          setDailyProductionReport(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        }
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response =
        await InventoryServices.getDailyProductionReportWithSearch(
          StartDate,
          EndDate,
          filterSearch
        );
      if (response) {
        setDailyProductionReport(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getDailyProductionReport();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search sale register", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response =
          await InventoryServices.getDailyProductionReportWithPaginationAndSearch(
            StartDate,
            EndDate,
            page,
            searchQuery
          );
        if (response) {
          setDailyProductionReport(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getDailyProductionReport();
          setSearchQuery("");
        }
      } else {
        const response =
          await InventoryServices.getDailyProductionReportWithPagination(
            StartDate,
            EndDate,
            page
          );
        setDailyProductionReport(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const headers = [
    { label: "Date", key: "created_on" },
    { label: "Seller Account", key: "seller_account" },
    { label: "Bom", key: "bom" },
    { label: "Product", key: "product" },
    { label: "Description", key: "description" },
    { label: "Brand", key: "brand" },
    { label: "Unit", key: "unit" },
    { label: "Quantity", key: "quantity" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      let response;
      if (searchQuery) {
        response =
          await InventoryServices.getDailyProductionReportWithPaginationAndSearch(
            StartDate,
            EndDate,
            "all",
            searchQuery
          );
      } else {
        response =
          await InventoryServices.getDailyProductionReportWithPagination(
            StartDate,
            EndDate,
            "all"
          );
      }
      const data = response.data.map((row) => {
        return {
          created_on: row.created_on,
          seller_account: row.seller_account,
          bom: row.bom,
          product: row.product,
          description: row.description,
          brand: row.brand,
          unit: row.unit,
          quantity: row.quantity,
          rate: row.rate.toFixed(2),
          amount: row.amount,
        };
      });
      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const Tabledata = dailyProductionReport.map((row) => ({
    created_on: row.created_on,
    seller_account: row.seller_account,
    bom: row.bom,
    product: row.product,
    description: row.description,
    brand: row.brand,
    unit: row.unit,
    quantity: row.quantity,
    rate: row.rate.toFixed(2),
    amount: row.amount,
  }));

  const Tableheaders = [
    "Date",
    "Seller Account",
    "BOM",
    "Product",
    "Description",
    "Brand",
    "Unit",
    "Quantity",
    "Rate",
    "Amount",
  ];

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}>
              <Box flexGrow={2}>
                <TextField
                  label="Start Date"
                  variant="outlined"
                  size="small"
                  type="date"
                  id="start-date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  min={minDate}
                  max={
                    endDate
                      ? new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      : maxDate
                  }
                  onChange={handleStartDateChange}
                />
                <TextField
                  label="End Date"
                  variant="outlined"
                  size="small"
                  // type="date"
                  id="end-date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  min={
                    startDate ? startDate.toISOString().split("T")[0] : minDate
                  }
                  max={
                    startDate
                      ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      : maxDate
                  }
                  disabled={!startDate}
                />
                <CustomSearchWithButton
                  filterSelectedQuery={searchQuery}
                  setFilterSelectedQuery={setSearchQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              </Box>
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
                Daily Production Report
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVDownload
                  data={exportData}
                  headers={headers}
                  target="_blank"
                />
              )}
            </Box>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </div>
  );
};
