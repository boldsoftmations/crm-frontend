import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { CustomPagination } from "../../Components/CustomPagination";
import CreateCCF from "./CreateCCF";
import SearchComponent from "../../Components/SearchComponent ";
import CustomerServices from "../../services/CustomerService";
import ImageView from "./ImageView";
import ComplainPdf from "./ComplaintPdf";
import CreateCapa from "./CAFA/CreateCapa";

export const CCFView = () => {
  const [open, setOpen] = useState(false);
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCCF, setOpenCCF] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [openCapa, setOpenCapa] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [imagesData, setImagesData] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllCCFData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCCFData(
        currentPage,
        searchQuery
      );
      setCCFData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getAllCCFData();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleImageShow = (data) => {
    setImageShow(true);
    setImagesData(data);
  };
  const handledownloadpdf = (data) => {
    setPdfData(data);
    setOpenPdf(true);
  };

  const handledOpenCapa = (data) => {
    setRecordForEdit(data);
    setOpenCapa(true);
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
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Complaint Form{" "}
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setOpenCCF(true)}
                >
                  Add
                </Button>
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
                  <StyledTableCell align="center">
                    Complaint No.
                  </StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">
                    Complaint Type
                  </StyledTableCell>
                  <StyledTableCell align="center">Complaint</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Invoices</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CCFData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.department}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.customer}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.complain_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.complaint}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.invoices.map((invoice, index) => (
                        <span key={index}>
                          {invoice}
                          {index < row.invoices.length - 1 && (
                            <span style={{ margin: "0 5px" }}>|</span>
                          )}
                        </span>
                      ))}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        color="info"
                        variant="text"
                        onClick={() => handleImageShow(row.document)}
                      >
                        Document View
                      </Button>
                      <Button
                        color="secondary"
                        variant="text"
                        onClick={() => handledownloadpdf(row)}
                      >
                        DownLoad
                      </Button>
                      {row.is_closed === false && (
                        <Button
                          color="success"
                          onClick={() => handledOpenCapa(row)}
                        >
                          Create CAPA
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
        <Popup
          fullScreen={true}
          title="Create CCF"
          openPopup={openCCF}
          setOpenPopup={setOpenCCF}
        >
          <CreateCCF getAllCCFData={getAllCCFData} setOpenCCF={setOpenCCF} />
        </Popup>

        <Popup
          fullScreen={true}
          title="Document Preview"
          openPopup={imageShow}
          setOpenPopup={setImageShow}
        >
          <ImageView imagesData={imagesData} setImageShow={setImageShow} />
        </Popup>

        <Popup
          fullScreen={true}
          title="Download Pdf"
          openPopup={openPdf}
          setOpenPopup={setOpenPdf}
        >
          <ComplainPdf pdfData={pdfData} setOpenPdf={setOpenPdf} />
        </Popup>
        <Popup
          fullScreen={true}
          title="Corrective And Preventive Action Form"
          openPopup={openCapa}
          setOpenPopup={setOpenCapa}
        >
          <CreateCapa recordForEdit={recordForEdit} setOpenCapa={setOpenCapa} />
        </Popup>
      </Grid>
    </>
  );
};

const filterValues = [
  { name: "Is closed", value: true },
  { name: "Is open", value: false },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
