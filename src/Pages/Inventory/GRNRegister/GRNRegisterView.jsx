import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import jsPDF from "jspdf";
import { pdf } from "@react-pdf/renderer";
import { CSVLink } from "react-csv";
import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomTextField from "../../../Components/CustomTextField";
import { GRNPDFDownload } from "./GRNPDFDownload";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import InvoiceServices from "../../../services/InvoiceService";
import { Popup } from "../../../Components/Popup";

export const GRNRegisterView = () => {
  const [open, setOpen] = useState(false);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  // set default value as current date
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const [isToday, setIsToday] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  // const [StartDate, setStartDate] = useState("");
  // const [EndDate, setEndDate] = useState("");
  const [exportData, setExportData] = useState([]);
  const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
  const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
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
      console.log("CSVLink Download error", error);
    }
  };
  const [grnRegisterData, setGRNRegisterData] = useState([]);

  const headers = [
    { label: "Date", key: "invoice_date" },
    { label: "Vendor", key: "vendor" },
    { label: "Invoice No", key: "invoice_no" },
    { label: "Description", key: "description" },
    { label: "Product", key: "products" },
    { label: "Order Quantity", key: "invoice_quantity" },
    { label: "QA Rejected Quantity", key: "qa_rejected" },
    { label: "Received Quantity", key: "qa_recieved" },
  ];
  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllGRNRegisterDetails(
        StartDate,
        EndDate,
        "all",
        searchQuery
      );
      const formattedData = response.data.map((row) => ({
        invoice_date: row.invoice_date,
        vendor: row.vendor,
        invoice_no: row.invoice_no,
        description: row.description,
        products: row.products,
        invoice_quantity: row.invoice_quantity,
        qa_rejected: row.qa_rejected,
        qa_recieved: row.qa_recieved,
      }));
      console.log("formattedData", formattedData);
      return formattedData;
    } catch (error) {
      console.error("CSVLink Download error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleChange = (value) => {
    const selectedValue = value;
    if (selectedValue === "Today") {
      const today = new Date();
      setIsToday(!isToday);
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Custom Date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setCustomDataPopup(true);
    }
  };

  const fetchGRNData = async (data) => {
    try {
      setOpen(true);

      const response = await InventoryServices.getGRNDataById(data.grn_no);
      handlePrint(response.data);
    } catch (error) {
      console.error("Error fetching GRN data", error);
    } finally {
      setOpen(false);
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

  const handlePrint = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <GRNPDFDownload grnRegisterPDFData={data} />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `${data.vendor} - ${data.grn_no}.pdf`;
      document.body.appendChild(link);

      // trigger the download
      link.click();

      // clean up the temporary link element
      document.body.removeChild(link);

      setOpen(false);
    } catch (error) {
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
    }
  };

  const getAllGRNRegisterDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllGRNRegisterDetails(
        StartDate,
        EndDate,

        currentPage,
        searchQuery
      );
      setGRNRegisterData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [customDataPopup, currentPage, searchQuery, isToday]);

  useEffect(() => {
    getAllGRNRegisterDetails();
  }, [
    customDataPopup,
    currentPage,
    searchQuery,
    getAllGRNRegisterDetails,
    isToday,
  ]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };
  const getSubmitDate = () => {
    setCustomDataPopup(false);
  };

  const Tableheaders = [
    "Grn NO",
    "Date",
    "Vendor",
    "Invoce No",
    "Description",
    "Product",
    "unit",
    "Order Quantity",
    "QA Rejected Quantity",
    "Received Quantity",
    "Action",
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
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box display="flex" marginBottom="10px">
          <Grid container alignItems="center" spacing={2} sx={{ mb: 2, mx: 3 }}>
            <Grid item xs={12} sm={3}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <CustomAutocomplete
                fullWidth
                size="small"
                onChange={(event, newValue) => handleChange(newValue)}
                options={DateOptions.map((option) => option.value)}
                getOptionLabel={(option) => option}
                label="Filter By Date" // Passed directly to CustomAutocomplete
              />
            </Grid>

            {/* Typography in the Center */}
            <Grid item xs={12} sm={3} md={3}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "rgb(34, 34, 34)",
                  textAlign: "center",
                }}
              >
                GRN Registers
              </Typography>
            </Grid>

            {/* Download CSV Button on the Right */}
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={handleDownload} variant="contained">
                Download CSV
              </Button>
            </Grid>

            {exportData.length > 0 && (
              <CSVLink
                data={exportData}
                headers={headers}
                ref={csvLinkRef}
                filename="GRN Register.csv"
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
            )}
          </Grid>
        </Box>
        <TableContainer
          sx={{
            maxHeight: 440,
          }}
        >
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                {Tableheaders.map((header) => (
                  <StyledTableCell key={header} align="center">
                    {header}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {grnRegisterData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align="center">
                    {row.grn_number}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.invoice_date}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.vendor}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.invoice_no}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.products}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.seller_account}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.invoice_quantity}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.qa_rejected}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.qa_recieved}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      onClick={() => {
                        fetchGRNData(row);
                      }}
                    >
                      Download
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Paper>

      <Popup
        openPopup={customDataPopup}
        setOpenPopup={setCustomDataPopup}
        title="Date Filter"
        maxWidth="md"
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            padding: "20px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                min={minDate}
                max={maxDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <CustomTextField
                fullWidth
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                min={startDate ? startDate : minDate}
                max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getSubmitDate}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetDate}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popup>
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

const DateOptions = [
  {
    value: "Today",
  },

  {
    value: "Custom Date",
  },
];
