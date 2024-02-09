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
  TableFooter,
  Pagination,
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import React, { useCallback, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { PurchaseInvoice } from "./PurchaseInvoice";
import CustomTextField from "../../../Components/CustomTextField";

export const PurchaseInvoiceView = () => {
  const [openPopupView, setOpenPopupView] = useState(false);
  const [open, setOpen] = useState(false);
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const currentYearMonth = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const [selectedYearMonth, setSelectedYearMonth] = useState(currentYearMonth);

  useEffect(() => {
    getAllPurchaseInvoiceDetails(currentPage);
  }, [currentPage, getAllPurchaseInvoiceDetails]);

  const getAllPurchaseInvoiceDetails = useCallback(
    async (page, filter = selectedYearMonth, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllPurchaseInvoiceData(
          filter,
          page,
          search
        );
        setPurchaseInvoiceData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [selectedYearMonth, searchQuery] // Depend on acceptedFilter directly
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };
  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopupView(true);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  type="month"
                  label="Filter By Month and Year"
                  value={selectedYearMonth}
                  onChange={(e) => {
                    setCurrentPage(0);
                    setSelectedYearMonth(e.target.value);
                    getAllPurchaseInvoiceDetails(
                      0,
                      e.target.value,
                      searchQuery
                    );
                  }}
                  // sx={{ width: 200, marginRight: "15rem" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setCurrentPage(0);
                    getAllPurchaseInvoiceDetails(
                      0,
                      selectedYearMonth,
                      searchQuery
                    );
                  }} // Call `handleSearch` when the button is clicked
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(0);
                    getAllPurchaseInvoiceDetails(0, selectedYearMonth, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}></Grid>

              <Grid item xs={12} sm={3}>
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Purchase Register
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 360,
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">GRN NO</StyledTableCell>
                  <StyledTableCell align="center">GRN Date</StyledTableCell>
                  <StyledTableCell align="center">
                    SALES ORDER NO
                  </StyledTableCell>
                  <StyledTableCell align="center">VENDOR</StyledTableCell>
                  <StyledTableCell align="center">INVOICE NO </StyledTableCell>
                  <StyledTableCell align="center">ORDER DATE</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {purchaseInvoiceData.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    getAllPurchaseInvoiceDetails={getAllPurchaseInvoiceDetails}
                    openInPopup={openInPopup}
                  />
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageClick}
              color={"primary"}
              variant="outlined"
              shape="circular"
            />
          </TableFooter>
        </Paper>
      </Grid>

      <Popup
        fullScreen={true}
        title={"Update Purchase Invoice Details"}
        openPopup={openPopupView}
        setOpenPopup={setOpenPopupView}
      >
        <PurchaseInvoice
          setOpenPopup={setOpenPopupView}
          getAllPurchaseInvoiceDetails={getAllPurchaseInvoiceDetails}
          idForEdit={recordForEdit}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row, openInPopup } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <CustomLoader open={open} /> */}
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.grn}</StyledTableCell>
        <StyledTableCell align="center">{row.grn_date}</StyledTableCell>
        <StyledTableCell align="center">{row.po_no}</StyledTableCell>
        <StyledTableCell align="center">{row.supplier_name}</StyledTableCell>
        <StyledTableCell align="center">{row.packing_list_no}</StyledTableCell>
        <StyledTableCell align="center">{row.order_date}</StyledTableCell>
        <StyledTableCell align="center">
          <Button
            onClick={() => {
              openInPopup(row.id);
            }}
            color="success"
          >
            View
          </Button>
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Products
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">SR.NO</TableCell>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">DESCRIPTION</TableCell>
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">RATE</TableCell>
                    <TableCell align="center">AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((ProductsData, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.rate}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.amount}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

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
