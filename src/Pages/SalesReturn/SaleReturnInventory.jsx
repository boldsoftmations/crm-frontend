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
  Checkbox,
  Alert,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import InventoryServices from "../../services/InventoryService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import SupplierInvoicesCreate from "./../Invoice/SupplierInvoices/SupplierInvoicesCreate";
import ScrapInvoicesCreate from "./../Invoice/ScrapInvoices/ScrapInvoicesCreate";
import { ReworkEntryCreate } from "../Invoice/Rework Entry/ReworkEntryCreate";
import { useSelector } from "react-redux";

export const SaleReturnInventory = () => {
  const [open, setOpen] = useState(false);
  const [salesReturnInventoryData, setSalesReturnInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalSupplierInvoice, setOpenModalSupplierInvoice] =
    useState(false);
  const [openModalScrapInvoice, setOpenModalScrapInvoice] = useState(false);
  const [openModalReworkInvoice, setOpenModalReworkInvoice] = useState(false);
  const { profile: users } = useSelector((state) => state.auth);

  const [selectedRow, setSelectedRow] = useState({
    unit: "",
    batch_no: [],
    products: [],
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

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

  const handleReworkEntry = () => {
    const descriptions = new Set(
      selectedRow.products.map((product) => product.description)
    );
    if (descriptions.size === 1) {
      setOpenModalReworkInvoice(true);
    } else {
      setShowAlert(true);
    }
  };

  const handleCheckboxChange = (row) => {
    const { id, unit, batch_no, product, quantity, rate, description } = row;

    setSelectedRow((prev) => {
      const existingProductIndex = prev.products.findIndex(
        (item) => item.id === id
      );
      let newProducts, newBatchNos;

      if (existingProductIndex > -1) {
        newProducts = prev.products.filter((item) => item.id !== id);
        newBatchNos = prev.batch_no.filter(
          (_, index) => index !== existingProductIndex
        );
      } else {
        newProducts = [
          ...prev.products,
          { id, product, quantity, rate, description },
        ];
        newBatchNos = [...prev.batch_no, batch_no];
      }

      setButtonDisabled(newProducts.length === 0);
      return {
        ...prev,
        unit: unit || prev.unit,
        batch_no: newBatchNos,
        products: newProducts,
      };
    });
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      {showAlert && (
        <Alert severity="error" onClose={() => setShowAlert(false)}>
          All selected items must have the same description to create a rework
          entry.
        </Alert>
      )}
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={5}>
                <Button
                  disabled={buttonDisabled}
                  onClick={() => setOpenModalSupplierInvoice(true)}
                  variant="outlined"
                >
                  Supplier Invoice
                </Button>
                <Button
                  sx={{ marginLeft: "5px" }}
                  disabled={buttonDisabled}
                  onClick={() => setOpenModalScrapInvoice(true)}
                  variant="outlined"
                  color="success"
                >
                  Scrap Invoice
                </Button>
                <Button
                  sx={{ marginLeft: "5px" }}
                  disabled={buttonDisabled}
                  onClick={() => handleReworkEntry()}
                  variant="outlined"
                  color="secondary"
                >
                  Rework Entry
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
                  <StyledTableCell align="center">Checkbox</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">BATCH_NO</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">DESCRIPTION</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  {(users.groups.includes("Director") ||
                    users.groups.includes("Accounts")) && (
                    <StyledTableCell align="center">RATE</StyledTableCell>
                  )}
                  {(users.groups.includes("Director") ||
                    users.groups.includes("Accounts")) && (
                    <StyledTableCell align="center">AMOUNT</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {salesReturnInventoryData.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={selectedRow.products.some(
                          (item) => item.id === row.id
                        )}
                        onChange={() => handleCheckboxChange(row)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.batch_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    {(users.groups.includes("Director") ||
                      users.groups.includes("Accounts")) && (
                      <StyledTableCell align="center">
                        {row.rate}
                      </StyledTableCell>
                    )}
                    {(users.groups.includes("Director") ||
                      users.groups.includes("Accounts")) && (
                      <StyledTableCell align="center">
                        {row.amount}
                      </StyledTableCell>
                    )}
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
        fullScreen={true}
        title={"Create Supplier Invoice"}
        openPopup={openModalSupplierInvoice}
        setOpenPopup={setOpenModalSupplierInvoice}
      >
        <SupplierInvoicesCreate
          getSalesReturnInventoryDetails={getSalesReturnInventoryDetails}
          setOpenPopup={setOpenModalSupplierInvoice}
          selectedRow={selectedRow}
        />
      </Popup>

      <Popup
        fullScreen={true}
        title={"Create Scrap Invoice"}
        openPopup={openModalScrapInvoice}
        setOpenPopup={setOpenModalScrapInvoice}
      >
        <ScrapInvoicesCreate
          getSalesReturnInventoryDetails={getSalesReturnInventoryDetails}
          setOpenPopup={setOpenModalScrapInvoice}
          selectedRow={selectedRow}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Create Rework Entry"}
        openPopup={openModalReworkInvoice}
        setOpenPopup={setOpenModalReworkInvoice}
      >
        <ReworkEntryCreate
          getSalesReturnInventoryDetails={getSalesReturnInventoryDetails}
          setOpenPopup={setOpenModalReworkInvoice}
          selectedRow={selectedRow}
        />
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
