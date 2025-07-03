import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Popup } from "../../../Components/Popup";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomDate from "../../../Components/CustomDate";

export const ViewMRFProduct = () => {
  const [open, setOpen] = useState(false);
  const [mrfData, setMRFData] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const [filterByDays, setFilterByDays] = useState("today");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV file downloaded successfully");
    } catch (error) {
      handleError(error);
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "DATE", key: "date" },
    { label: "PRODUCT", key: "product" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "BRANCH", key: "branch" },
  ];

  const handleExport = async () => {
    try {
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      setOpen(true);
      const response = await InventoryServices.getAllMrfProducts(
        filterByDays,
        StartDate,
        EndDate
      );

      const data = response.data.map((row) => {
        return {
          id: row.mrf,
          date: row.date,
          product: row.product,
          unit: row.unit,
          quantity: row.quantity,
          branch: row.branch,
        };
      });
      setOpen(false);
      handleSuccess("Exported successfully");
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const getAllMrfProducts = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InventoryServices.getAllMrfProducts(
        filterByDays,
        StartDate,
        EndDate
      );

      setMRFData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [filterByDays, startDate, endDate]);

  useEffect(() => {
    getAllMrfProducts();
  }, [filterByDays, startDate, endDate]);

  const handleChange = (value) => {
    if (value === "custom_date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setFilterByDays("");
      setCustomDataPopup(true);
    } else {
      setFilterByDays(value);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Filter and Search */}
              <Grid item xs={12} sm={4} display="flex" alignItems="center">
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, newValue) =>
                    handleChange(newValue ? newValue.value : "")
                  }
                  options={filterDays}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  label="Filter By Date"
                />
              </Grid>
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  MRF Products
                </h3>
              </Grid>

              {/* Center Section: Title */}

              {/* Right Section: Add and Download Buttons */}
              <Grid
                item
                xs={12}
                sm={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="MRF Products csv"
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
          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">Branch</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mrfData.map((mtnData) => (
                  <React.Fragment key={mtnData.id}>
                    <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <StyledTableCell align="center">
                        {mtnData.mrf}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.branch}
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Popup
            openPopup={customDataPopup}
            setOpenPopup={setCustomDataPopup}
            title="Date Filter"
            maxWidth="md"
          >
            <CustomDate
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              maxDate={maxDate}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              resetDate={getResetDate}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

const filterDays = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Month", value: "this_month" },
  { label: "Custom Date", value: "custom_date" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
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
