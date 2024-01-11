import React, { useCallback, useEffect, useRef, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { PurchaseOrderUpdate } from "./PurchaseOrderUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { useDispatch } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import CustomTextField from "../../../Components/CustomTextField";
import { PackingListCreate } from "../PackingList/PackingListCreate";
import { PurchaseOrderPDF } from "./PurchaseOrderPDF";
import jsPDF from "jspdf";
import { pdf } from "@react-pdf/renderer";
import { PackingListMergeCreate } from "../PackingList/PackingListMergeCreate";

export const PurchaseOrderView = () => {
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [contactNameOption, setContactNameOption] = useState("");
  const [openCreatePLPopup, setOpenCreatePLPopup] = useState(false);
  const [openMergePLPopup, setOpenMergePLPopup] = useState(false);
  const dispatch = useDispatch();

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

      setOpen(false);
    } catch (error) {
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setAcceptedFilter(value);
    getAllPurchaseOrderDetails(currentPage, value, searchQuery);
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

  useEffect(() => {
    getAllPurchaseOrderDetails(currentPage);
  }, [currentPage, getAllPurchaseOrderDetails]);

  const getAllPurchaseOrderDetails = useCallback(
    async (page, filter = acceptedFilter, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllPurchaseOrderData(
          page,
          filter,
          search
        );
        setPurchaseOrderData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [acceptedFilter, searchQuery]
  );

  const handleOpenCreatePLPopup = (row) => {
    setOpenCreatePLPopup(true);
    setSelectedRow(row);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl sx={{ minWidth: "100px" }} fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Filter By Accepted
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    label="Filter By Accepted"
                    value={acceptedFilter}
                    onChange={handleFilterChange}
                  >
                    {AcceptedOption.map((option, i) => (
                      <MenuItem key={i} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {acceptedFilter && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setAcceptedFilter("");
                        getAllPurchaseOrderDetails(1, false, searchQuery);
                      }}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </FormControl>
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
                  onClick={() =>
                    getAllPurchaseOrderDetails(
                      currentPage,
                      acceptedFilter,
                      searchQuery
                    )
                  } // Call `handleSearch` when the button is clicked
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
                    getAllPurchaseOrderDetails(1, acceptedFilter, "");
                  }}
                >
                  Reset
                </Button>
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
        title={"Purchase Order Update"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <PurchaseOrderUpdate
          setOpenPopup={setOpenPopupUpdate}
          getAllPurchaseOrderDetails={getAllPurchaseOrderDetails}
          selectedRow={selectedRow}
          contactNameOption={contactNameOption}
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
