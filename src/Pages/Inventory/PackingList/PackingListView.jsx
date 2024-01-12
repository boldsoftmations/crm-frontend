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
import React, { useCallback, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { PackingListUpdate } from "./PackingListUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { useDispatch, useSelector } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import CustomTextField from "../../../Components/CustomTextField";
import { GRNCreate } from "../GRN/GRNCreate";

export const PackingListView = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.profile);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupCreateGrn, setOpenPopupCreateGrn] = useState(false);
  const [open, setOpen] = useState(false);
  const [packingListData, setPackingListData] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const [idForEdit, setIDForEdit] = useState("");

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
    getAllPackingListDetails(currentPage);
  }, [currentPage, getAllPackingListDetails]);

  const getAllPackingListDetails = useCallback(
    async (page, filter = acceptedFilter, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllPackingListData(
          page,
          filter,
          search
        );
        setPackingListData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [acceptedFilter, searchQuery] // Depend on acceptedFilter directly
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setAcceptedFilter(value);
    getAllPackingListDetails(currentPage, value, searchQuery);
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  const handleCreateGrn = (item) => {
    setIDForEdit(item);
    setOpenPopupCreateGrn(true);
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
                        getAllPackingListDetails(1, false, searchQuery);
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
                    getAllPackingListDetails(
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
                    getAllPackingListDetails(1, acceptedFilter, "");
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
                  Pending GRN
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
                  <StyledTableCell align="center">INVOICE DATE</StyledTableCell>
                  <StyledTableCell align="center">INVOICE NO</StyledTableCell>
                  <StyledTableCell align="center">
                    PURCHASE ORDER
                  </StyledTableCell>
                  <StyledTableCell align="center">VENDOR</StyledTableCell>
                  <StyledTableCell align="center">BUYER STATE</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {packingListData.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    openInPopup={openInPopup}
                    handleCreateGrn={handleCreateGrn}
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
        title={"PackingList Update"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <PackingListUpdate
          setOpenPopup={setOpenPopup}
          getAllPackingListDetails={getAllPackingListDetails}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"GRN Create"}
        openPopup={openPopupCreateGrn}
        setOpenPopup={setOpenPopupCreateGrn}
      >
        <GRNCreate
          setOpenPopup={setOpenPopupCreateGrn}
          idForEdit={idForEdit}
          getAllPackingListDetails={getAllPackingListDetails}
        />
      </Popup>
    </>
  );
};

function Row({ row, openInPopup, handleCreateGrn, userData }) {
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
        <StyledTableCell align="center">{row.invoice_date}</StyledTableCell>
        <StyledTableCell align="center">{row.packing_list_no}</StyledTableCell>
        <StyledTableCell align="center">
          {row.purchase_order.join(", ")}
        </StyledTableCell>

        <StyledTableCell align="center">{row.vendor}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>

        <StyledTableCell align="center">
          {/* {
            // Show Edit button only if the user is NOT in any of the specified groups
            !userData.groups.includes("Stores Delhi") &&
              !userData.groups.includes("Production Delhi") &&
              !userData.groups.includes("Stores") && (
                <Button onClick={() => openInPopup(row)}>Edit</Button>
              )
          } */}
          {
            // Show Create GRN button if the user is in any of the specified groups
            (userData.groups.includes("Stores Delhi") ||
              userData.groups.includes("Production Delhi") ||
              userData.groups.includes("Stores") ||
              userData.groups.includes("Director")) && (
              <Button onClick={() => handleCreateGrn(row)}>Create GRN</Button>
            )
          }
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((historyRow, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.quantity}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRow>
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
