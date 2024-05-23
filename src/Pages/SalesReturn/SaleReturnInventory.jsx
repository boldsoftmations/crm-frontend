import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import InventoryServices from "../../services/InventoryService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { SalesReturnInventoryUpdate } from "./SalesReturnInventoryUpdate";

export const SaleReturnInventory = () => {
  const [open, setOpen] = useState(false);
  const [salesReturnInventoryData, setSalesReturnInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getSalesReturnInventoryDetails = useCallback(async (page, query) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getSalesReturnInventoryData(
        page,
        query
      );
      setSalesReturnInventoryData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []); // Ensure dependencies are correctly listed

  useEffect(() => {
    getSalesReturnInventoryDetails(currentPage, searchQuery);
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

  const openInPopup = (item) => {
    setSelectedRow(item);
    setOpenPopup(true);
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
                  Sales Return Inventory
                </h3>
              </Grid>

              {/* Add Button on the right */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              ></Grid>
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
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">BATCH_NO</StyledTableCell>
                  <StyledTableCell align="center">INVOICE TYPE</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">RATE</StyledTableCell>
                  <StyledTableCell align="center">AMOUNT</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesReturnInventoryData.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.batch_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.inv_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.rate}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => openInPopup(row)}>View</Button>
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
      </Grid>
      <Popup
        title={"Update Sales Return Inventory"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesReturnInventoryUpdate
          selectedRow={selectedRow}
          setOpenPopup={setOpenPopup}
          getSalesReturnInventoryDetails={getSalesReturnInventoryDetails}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
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
