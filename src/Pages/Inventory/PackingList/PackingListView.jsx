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
import { PackingListUpdate } from "./PackingListUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { useDispatch, useSelector } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomPagination } from "../../../Components/CustomPagination";
import { GRNCreate } from "../../Purchase/GRN/GRNCreate";

export const PackingListView = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.profile);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupCreateGrn, setOpenPopupCreateGrn] = useState(false);
  const [open, setOpen] = useState(false);
  const [packingListData, setPackingListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState(false);
  const [idForEdit, setIDForEdit] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
    getAllPackingListDetails(currentPage, acceptedFilter, searchQuery);
  }, [currentPage, acceptedFilter, searchQuery]);

  const getAllPackingListDetails = useCallback(async (page, filter, query) => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllPackingListData(
        page,
        filter,
        query
      );
      setPackingListData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

  const handleFilter = (query) => {
    if (query) {
      const value = query.value === "true"; // Convert string to boolean
      setAcceptedFilter(value);
    } else {
      setAcceptedFilter(false); // Set it back to false instead of null
      setCurrentPage(0);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to the first page
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Assuming `value` is already adjusted for 0-based indexing in CustomPagination
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
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Filter and Search */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <CustomAutocomplete
                  sx={{ width: "200px" }}
                  size="small"
                  value={AcceptedOption.find(
                    (option) => option.value === acceptedFilter.toString()
                  )}
                  onChange={(event, newValue) => handleFilter(newValue)}
                  options={AcceptedOption}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Accepted"
                />

                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              {/* Center Section: Title */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                display="flex"
                justifyContent="center"
              >
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Pending GRN
                </h3>
              </Grid>
              {/* Right Section: Add Button */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                display="flex"
                justifyContent="flex-end"
              ></Grid>
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
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
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
          currentPage={currentPage}
          searchQuery={searchQuery}
          acceptedFilter={acceptedFilter}
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
              userData.groups.includes("Accounts") ||
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
