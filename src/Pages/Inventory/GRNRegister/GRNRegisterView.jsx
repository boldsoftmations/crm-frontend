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
import { useSelector } from "react-redux";
import CustomTextField from "../../../Components/CustomTextField";
import { GRNPDFDownload } from "./GRNPDFDownload";

export const GRNRegisterView = () => {
  const [open, setOpen] = useState(false);
  const [grnRegisterData, setGRNRegisterData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const currentYearMonth = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const [selectedYearMonth, setSelectedYearMonth] = useState(currentYearMonth);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
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
        "all"
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
      link.download = `${data.vendor}- ${data.invoice_no}.pdf`;
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

  useEffect(() => {
    getAllGRNRegisterDetails();
  }, []);

  useEffect(() => {
    getAllGRNRegisterDetails(currentPage);
  }, [currentPage, selectedYearMonth, getAllGRNRegisterDetails]);

  const getAllGRNRegisterDetails = useCallback(
    async (page) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllGRNRegisterDetails(
          selectedYearMonth,
          page
        );
        setGRNRegisterData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      } finally {
        setOpen(false);
      }
    },
    [selectedYearMonth]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const Tableheaders = [
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
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box display="flex" marginBottom="10px">
          <Grid container alignItems="center" spacing={2} sx={{ mb: 2, mx: 3 }}>
            <Grid item xs={12} sm={4} md={4}>
              <CustomTextField
                size="small"
                type="month"
                label="Filter By Month and Year"
                value={selectedYearMonth}
                onChange={(e) => setSelectedYearMonth(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Typography in the Center */}
            <Grid item xs={12} sm={4} md={4}>
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
                        handlePrint(row);
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
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
      </Paper>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
