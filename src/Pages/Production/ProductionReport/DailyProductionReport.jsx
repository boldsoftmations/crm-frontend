import React, { useCallback, useEffect, useRef, useState } from "react";
import InventoryServices from "./../../../services/InventoryService";
import { CSVLink } from "react-csv";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Box, Button, Grid, Paper } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const DailyProductionReport = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dailyProductionReport, setDailyProductionReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // Headers for CSV export
  const headers = [
    { label: "Date", key: "created_on" },
    { label: "Seller Account", key: "seller_account" },
    { label: "BOM", key: "bom" },
    { label: "Product", key: "product" },
    { label: "Description", key: "description" },
    { label: "Brand", key: "brand" },
    { label: "Unit", key: "unit" },
    { label: "Quantity", key: "quantity" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
  ];

  // Fetch data for CSV download
  const handleExport = async () => {
    setOpen(true);
    try {
      const response = await InventoryServices.getAllDailyProductionReport(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        "all",
        searchQuery
      );
      const data = response.data.map((row) => ({
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
      setExportData(data);
      setTimeout(() => csvLinkRef.current.link.click(), 0);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = () => handleExport();

  const getDailyProductionReport = useCallback(
    async (page = currentPage, search = searchQuery) => {
      setOpen(true);
      try {
        const response = await InventoryServices.getAllDailyProductionReport(
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0],
          page,
          search
        );
        setDailyProductionReport(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [searchQuery, startDate, endDate, currentPage]
  );

  useEffect(() => {
    getDailyProductionReport(currentPage, searchQuery);
  }, [startDate, endDate, currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleStartDateChange = (event) =>
    setStartDate(new Date(event.target.value));

  const handleEndDateChange = (event) =>
    setEndDate(new Date(event.target.value));

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
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, width: "100%" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Date Filters and Search */}
              <Grid
                item
                xs={12}
                sm={6}
                display="flex"
                alignItems="center"
                gap={2}
              >
                {/* Grid item for the start date */}
                <Grid item>
                  <CustomTextField
                    label="Start Date"
                    variant="outlined"
                    size="small"
                    type="date"
                    id="start-date"
                    value={
                      startDate ? startDate.toISOString().split("T")[0] : ""
                    }
                    min={minDate}
                    max={maxDate}
                    onChange={handleStartDateChange}
                    sx={{ width: "120px" }}
                  />
                </Grid>

                {/* Grid item for the end date */}
                <Grid item>
                  <CustomTextField
                    label="End Date"
                    variant="outlined"
                    size="small"
                    type="date"
                    id="end-date"
                    value={endDate ? endDate.toISOString().split("T")[0] : ""}
                    min={
                      startDate
                        ? startDate.toISOString().split("T")[0]
                        : minDate
                    }
                    max={maxDate}
                    onChange={handleEndDateChange}
                    disabled={!startDate}
                    sx={{ width: "120px" }}
                  />
                </Grid>

                {/* Grid item for the SearchComponent */}
                <Grid item>
                  <SearchComponent
                    onSearch={handleSearch}
                    onReset={handleReset}
                  />
                </Grid>
              </Grid>

              {/* Center Section: Title */}
              <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Daily Production Report
                </h3>
              </Grid>

              {/* Right Section: Download Button */}
              <Grid
                item
                xs={12}
                sm={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Daily Production Report.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
              </Grid>
            </Grid>
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
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
    </>
  );
};
