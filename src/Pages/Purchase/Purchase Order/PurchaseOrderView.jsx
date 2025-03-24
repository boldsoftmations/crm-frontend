import React, { useCallback, useEffect, useState } from "react";
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
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { PurchaseOrderUpdate } from "./PurchaseOrderUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { useDispatch } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import { PurchaseOrderPDF } from "./PurchaseOrderPDF";
import jsPDF from "jspdf";
import { pdf } from "@react-pdf/renderer";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { PackingListCreate } from "./../../Inventory/PackingList/PackingListCreate";
import { PackingListMergeCreate } from "./../../Inventory/PackingList/PackingListMergeCreate";

export const PurchaseOrderView = () => {
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreatePLPopup, setOpenCreatePLPopup] = useState(false);
  const [openMergePLPopup, setOpenMergePLPopup] = useState(false);
  const dispatch = useDispatch();
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <PurchaseOrderPDF
          purchaseOrderData={data}
          // AMOUNT_IN_WORDS={AMOUNT_IN_WORDS}
        />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `PO Number ${data.po_no}.pdf`;
      document.body.appendChild(link);

      // trigger the download
      link.click();

      // clean up the temporary link element
      document.body.removeChild(link);
      handleSuccess("Downloaded successfully");
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
    }
  };

  const handleEdit = async (item) => {
    try {
      setOpen(true);
      setSelectedRow(item);
      setOpenPopupUpdate(true);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const getAllPurchaseOrderDetails = useCallback(
    async (page, filter, query) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllPurchaseOrderData(
          page,
          filter,
          query
        );
        setPurchaseOrderData(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    getAllPurchaseOrderDetails(currentPage, acceptedFilter, searchQuery);
  }, [currentPage, acceptedFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleFilter = (query) => {
    if (query) {
      const value = query.value === "true"; // Convert string to boolean
      setAcceptedFilter(value);
    } else {
      setAcceptedFilter(false); // Set it back to false instead of null
      setCurrentPage(0);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenCreatePLPopup = (row) => {
    setOpenCreatePLPopup(true);
    setSelectedRow(row);
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
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  sx={{ flexGrow: 1, mr: 1 }}
                  size="small"
                  value={AcceptedOption.find(
                    (option) => option.value === acceptedFilter.toString()
                  )}
                  onChange={(event, newValue) => handleFilter(newValue)}
                  options={AcceptedOption}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Accepted"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setOpenMergePLPopup(true);
                  }}
                >
                  Merge PL
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Purchase Order Book
                </h3>
              </Grid>
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
                  <StyledTableCell align="center">
                    Purchase Order Date
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Purchase Order
                  </StyledTableCell>
                  <StyledTableCell align="center">Vendor Type</StyledTableCell>
                  <StyledTableCell align="center">Vendor</StyledTableCell>

                  <StyledTableCell align="center">
                    Buyer Account
                  </StyledTableCell>
                  <StyledTableCell align="center">Buyer State</StyledTableCell>
                  <StyledTableCell align="center">
                    Schedule Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(purchaseOrderData) &&
                  purchaseOrderData.map((row, i) => (
                    <Row
                      key={i}
                      row={row}
                      handleEdit={handleEdit}
                      handleOpenCreatePLPopup={() =>
                        handleOpenCreatePLPopup(row)
                      }
                      handleDownload={handleDownload}
                    />
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
      </Grid>
      <Popup
        fullScreen={true}
        title={"Purchase Order Update"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <PurchaseOrderUpdate
          setOpenPopup={setOpenPopupUpdate}
          getAllPurchaseOrderDetails={getAllPurchaseOrderDetails}
          selectedRow={selectedRow}
          currentPage={currentPage}
          acceptedFilter={acceptedFilter}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Create Packing List"
        openPopup={openCreatePLPopup}
        setOpenPopup={setOpenCreatePLPopup}
      >
        <PackingListCreate
          setOpenPopup={setOpenCreatePLPopup}
          selectedRow={selectedRow}
          getAllPurchaseOrderDetails={getAllPurchaseOrderDetails}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Merge Packing List"
        openPopup={openMergePLPopup}
        setOpenPopup={setOpenMergePLPopup}
      >
        <PackingListMergeCreate
          setOpenPopup={setOpenMergePLPopup}
          purchaseOrderData={purchaseOrderData}
          getAllPurchaseOrderDetails={getAllPurchaseOrderDetails}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row, handleEdit, handleOpenCreatePLPopup, handleDownload } = props;
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
        <StyledTableCell align="center">{row.po_date}</StyledTableCell>
        <StyledTableCell align="center">{row.po_no}</StyledTableCell>
        <StyledTableCell align="center">{row.vendor_type}</StyledTableCell>
        <StyledTableCell align="center">{row.vendor}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_state}</StyledTableCell>
        <StyledTableCell align="center">{row.schedule_date}</StyledTableCell>

        <StyledTableCell align="center">
          <Button onClick={() => handleEdit(row)}>Edit</Button>
          <Button color="success" onClick={handleOpenCreatePLPopup}>
            Create PL
          </Button>
          <Button color="secondary" onClick={() => handleDownload(row)}>
            Download
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
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center"> PENDING QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(row.products) &&
                    row.products.map((historyRow, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell align="center">
                          {i + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {historyRow.product}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {historyRow.unit}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {historyRow.quantity}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.close_short === true
                            ? 0
                            : historyRow.pending_quantity}
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

const AcceptedOption = [
  { label: "Closed", value: "true" },
  { label: "Not Closed", value: "false" },
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
