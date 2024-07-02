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
import InvoiceServices from "../../services/InvoiceService";
import { CreateDebitCreditNote } from "./CreateDebitCreditNote";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import SearchComponent from "../../Components/SearchComponent ";
import { CustomPagination } from "../../Components/CustomPagination";
import { Popup } from "../../Components/Popup";
import { DebitCreditInvoiceNote } from "./DebitCreditInvoiceNote";

export const DebitCreditView = () => {
  const [open, setOpen] = useState(false);
  const [debitCreditNotesData, setDebitCreditNotesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCreateDebitCreditNotePopUp, setOpenCreateDebitCreditNotePopUp] =
    useState(false);
  const [openInvoiceNote, setOpenInvoiceNote] = useState(false);
  const [invoiceNoteData, setInvoiceNoteData] = useState();

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getDebitCreditNotesData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getDebitCreditnotes(
        currentPage,
        searchQuery
      );
      console.log("Debit/credit", response.data);
      setDebitCreditNotesData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getDebitCreditNotesData();
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

  const openPopUp = (data) => {
    setInvoiceNoteData(data);
    setOpenInvoiceNote(true);
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
                  Debit/Credit Notes
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
                  onClick={() => setOpenCreateDebitCreditNotePopUp(true)}
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
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Note Type</StyledTableCell>
                  <StyledTableCell align="center">Voucher No</StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Reason</StyledTableCell>
                  <StyledTableCell align="center">Total Amount</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debitCreditNotesData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.creation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.note_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.note_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.customer}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.reason}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.total_amount}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        color="info"
                        variant="text"
                        onClick={() => openPopUp(row)}
                      >
                        View
                      </Button>
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
          maxWidth="xl"
          title="Create Debit/Credit Notes"
          openPopup={openCreateDebitCreditNotePopUp}
          setOpenPopup={setOpenCreateDebitCreditNotePopUp}
        >
          <CreateDebitCreditNote
            getDebitCreditNotesData={getDebitCreditNotesData}
            setOpenPopup={setOpenCreateDebitCreditNotePopUp}
          />
        </Popup>

        <Popup
          fullScreen={true}
          title="Debit/Credit Note"
          openPopup={openInvoiceNote}
          setOpenPopup={setOpenInvoiceNote}
        >
          <DebitCreditInvoiceNote
            getDebitCreditNotesData={getDebitCreditNotesData}
            setOpenPopup={setOpenInvoiceNote}
            invoiceNoteData={invoiceNoteData}
          />
        </Popup>
      </Grid>
    </>
  );
};

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
