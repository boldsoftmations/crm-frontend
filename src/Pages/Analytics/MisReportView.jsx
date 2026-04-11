import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";

// import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomLoader } from "../../Components/CustomLoader";
// import SearchComponent from "../../../Components/SearchComponent ";

import CustomSnackbar from "../../Components/CustomerSnackbar";
import { useRef } from "react";

import InvoiceServices from "../../services/InvoiceService";
import CustomTextField from "../../Components/CustomTextField";
import moment from "moment";
import { CSVLink } from "react-csv";

export const MisReportView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState([]);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentMonthFormatted =
    currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  const initialSearchQuery = `${currentYear}-${currentMonthFormatted}`;
  const currentDates = moment();
  // Get the first day of the current month
  const currentMonthStartDate = currentDates.startOf("month");
  const [searchData, setSearchData] = useState(initialSearchQuery);
  const currentMonths = currentMonthStartDate.format("YYYY-MM");

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getAllMasterCountries = async () => {
    try {
      setIsLoading(true);
      const dateString = searchData;
      const dateParts = dateString.split("-");
      const year = dateParts[0];
      const month = dateParts[1];
      const response = await InvoiceServices.getMisPackagingData(
        "all",
        "",
        year,
        month,
      );
      setCountry(response.data || []);
      console.log("reponse is :", response);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllMasterCountries();
  }, []);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const dateString = searchData;
      const dateParts = dateString.split("-");
      const year = dateParts[0];
      const month = dateParts[1];
      const response = await InvoiceServices.getMisPackagingData(
        "all",
        "",
        year,
        month,
      );
      console.log(response.data);
      const apiData = response.data || [];

      const data = apiData
        .filter((item) => item.month <= new Date(searchData).getMonth() + 1)
        .map((row) => ({
          month_name: row.month_name,
          year: row.year,
          total_packaging_revenue: row.total_packaging_revenue,
          total_packaging_cost: row.total_packaging_cost,
          created_date: row.created_date,
          net_profit_or_loss: row.net_profit_or_loss,
        }));
      console.log("data", data);
      setIsLoading(false);
      return data;
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching countries",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);

      setTimeout(() => {
        if (csvLinkRef.current) {
          csvLinkRef.current.link.click();
        }
      }, 100);
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };
  const headers = [
    { label: "MONTH", key: "month_name" },
    { label: "YEAR", key: "year" },

    { label: "PACKAGING REVENUE", key: "total_packaging_revenue" },
    { label: "PACKAGING COST", key: "total_packaging_cost" },
    { label: "PROFIT/LOSS", key: "net_profit_or_loss" },
  ];

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Search"
                  type="month"
                  variant="outlined"
                  size="small"
                  value={searchData}
                  onChange={(event) => setSearchData(event.target.value)}
                  inputProps={{
                    max: currentMonths, // Set the maximum allowed value to the previous month
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="center">
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                  >
                    MIS Packaging Report{" "}
                  </h3>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                sx={{ display: "flex", justifyContent: "end" }}
              >
                <Button
                  variant="contained"
                  color="info"
                  // size="small"
                  onClick={handleDownload}
                >
                  {" "}
                  Download
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Customer.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>

                  <StyledTableCell align="center">MONTH</StyledTableCell>
                  <StyledTableCell align="center">YEAR</StyledTableCell>
                  <StyledTableCell align="center">
                    {" "}
                    PACKAGING REVENUE
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    PACKAGING COST
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {" "}
                    PROFIT /LOSS
                  </StyledTableCell>

                  {/* editable mode is avalable */}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  //country &&
                  country
                    .filter(
                      (data) =>
                        data.month <= new Date(searchData).getMonth() + 1,
                    )

                    .map((row, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell align="center">
                          {i + 1}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {row.month_name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.year}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.total_packaging_revenue}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.total_packaging_cost}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {row.net_profit_or_loss}
                        </StyledTableCell>

                        {/* editable mode is avalable */}
                      </StyledTableRow>
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
