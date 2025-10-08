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
import { GRNUpdate } from "./GRNUpdate";
import { useSelector } from "react-redux";
import { PurchaseInvoiceCreate } from "../Purchase Invoice/PurchaseInvoiceCreate";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomPagination } from "../../../Components/CustomPagination";

export const GRNView = () => {
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [openPopupCreatePI, setOpenPopupCreatePI] = useState(false);
  const [open, setOpen] = useState(false);
  const [grnData, setGRNData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState();
  const [recordForEdit, setRecordForEdit] = useState();
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const userData = useSelector((state) => state.auth.profile);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getAllGRNDetails(currentPage, acceptedFilter, searchQuery);
  }, [currentPage, acceptedFilter, searchQuery]);

  const getAllGRNDetails = useCallback(async (page, filter, query) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllGRNData(
        page,
        filter,
        query
      );
      setGRNData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

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

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopupUpdate(true);
  };

  const handlePurchaseInvoice = (item) => {
    setRecordForEdit(item);
    setOpenPopupCreatePI(true);
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
            </Grid>
          </Box>
          <Box
            sx={{
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}></Grid>

              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Purchase Invoice
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}></Grid>
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
                  <StyledTableCell align="center">SELLER</StyledTableCell>
                  <StyledTableCell align="center">GRN DATE</StyledTableCell>
                  <StyledTableCell align="center">GRN NO</StyledTableCell>
                  <StyledTableCell align="center">INVOICE NO</StyledTableCell>
                  <StyledTableCell align="center">VENDOR</StyledTableCell>
                  <StyledTableCell align="center">PACKING LIST</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {grnData.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    openInPopup={openInPopup}
                    handlePurchaseInvoice={handlePurchaseInvoice}
                    userData={userData}
                  />
                ))}
              </TableBody>{" "}
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
        title={"Update GRN Details"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <GRNUpdate
          setOpenPopup={setOpenPopupUpdate}
          getAllGRNDetails={getAllGRNDetails}
          idForEdit={idForEdit}
          currentPage={currentPage}
          acceptedFilter={acceptedFilter}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Purchase Invoice Create"}
        openPopup={openPopupCreatePI}
        setOpenPopup={setOpenPopupCreatePI}
      >
        <PurchaseInvoiceCreate
          setOpenPopup={setOpenPopupCreatePI}
          recordForEdit={recordForEdit}
          getAllGRNDetails={getAllGRNDetails}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row, userData, handlePurchaseInvoice } = props;
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
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>
        <StyledTableCell align="center">{row.created_on}</StyledTableCell>
        <StyledTableCell align="center">{row.grn_no}</StyledTableCell>
        <StyledTableCell align="center">{row.packing_list_no}</StyledTableCell>
        <StyledTableCell align="center">{row.vendor}</StyledTableCell>
        <StyledTableCell align="center">{row.packing_list}</StyledTableCell>
        <StyledTableCell align="center">
          {/* <Button onClick={() => openInPopup(row.grn_no)}>Edit</Button> */}
          {(userData.groups.includes("Accounts Executive") ||
            userData.groups.includes("Director") ||
            userData.groups.includes("Accounts")) && (
            <Button
              onClick={() => handlePurchaseInvoice(row)}
              disabled={userData.groups.includes(
                "Operations & Supply Chain Manager"
              )}
            >
              Create PI
            </Button>
          )}
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
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">DESCRIPTION</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">QA REJECTED</TableCell>
                    <TableCell align="center">QA ACCEPTED</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((ProductsData, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {ProductsData.products}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.order_quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.qa_rejected}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {ProductsData.qa_accepted}
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
  { label: "Accepted", value: "true" },
  { label: "Not Accepted", value: "false" },
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
