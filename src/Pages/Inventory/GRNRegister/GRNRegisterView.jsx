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

export const GRNRegisterView = () => {
  const [open, setOpen] = useState(false);
  const [grnRegisterData, setGRNRegisterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const currentYearMonth = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const [selectedYearMonth, setSelectedYearMonth] = useState(currentYearMonth);
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
        selectedYearMonth,
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
        selectedYearMonth,
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
  }, [selectedYearMonth, currentPage, searchQuery]);

  useEffect(() => {
    getAllGRNRegisterDetails();
  }, [selectedYearMonth, currentPage, searchQuery, getAllGRNRegisterDetails]);

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

  const Tableheaders = [
    "Grn NO",
    "Date",
    "Vendor",
    "Invoce No",
    "Description",
    "Product",
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
            <Grid item xs={12} sm={2} md={2}>
              <CustomTextField
                size="small"
                type="month"
                label="Filter By Month and Year"
                value={selectedYearMonth}
                onChange={(e) => {
                  setCurrentPage(0);
                  setSelectedYearMonth(e.target.value);
                  getAllGRNRegisterDetails(0, e.target.value);
                }}
                fullWidth
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
