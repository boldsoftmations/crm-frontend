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
  TableFooter,
  Pagination,
  Collapse,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
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
import CustomTextField from "../../../Components/CustomTextField";
import ClearIcon from "@mui/icons-material/Clear";

export const GRNView = () => {
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [openPopupCreatePI, setOpenPopupCreatePI] = useState(false);
  const [open, setOpen] = useState(false);
  const [grnData, setGRNData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState();
  const [recordForEdit, setRecordForEdit] = useState();
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const userData = useSelector((state) => state.auth.profile);

  useEffect(() => {
    getAllGRNDetails(currentPage);
  }, [currentPage, getAllGRNDetails]);

  const getAllGRNDetails = useCallback(
    async (page, filter = acceptedFilter, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllGRNData(
          page,
          filter,
          search
        );
        setGRNData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [acceptedFilter, searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    getAllGRNDetails(value);
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopupUpdate(true);
  };

  const handlePurchaseInvoice = (item) => {
    setRecordForEdit(item);
    setOpenPopupCreatePI(true);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setAcceptedFilter(value);
    setCurrentPage(0);
    getAllGRNDetails(0, value, searchQuery);
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
                        setAcceptedFilter(false);
                        getAllGRNDetails(1, false, searchQuery);
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
                  onClick={() => {
                    setCurrentPage(0);
                    getAllGRNDetails(0, acceptedFilter, searchQuery);
                  }}
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
                    getAllGRNDetails(0, acceptedFilter, "");
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
                  Purchase Invoice
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
        title={"Update GRN Details"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <GRNUpdate
          setOpenPopup={setOpenPopupUpdate}
          getAllGRNDetails={getAllGRNDetails}
          idForEdit={idForEdit}
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
  const { row, openInPopup, userData, handlePurchaseInvoice } = props;
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
            <Button onClick={() => handlePurchaseInvoice(row)}>
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
