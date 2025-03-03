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
import ProductService from "../../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { getFinishGoodProduct } from "../../../Redux/Action/Action";
import { ProductionEntryCreate } from "./ProductionEntryCreate";
import InvoiceServices from "../../../services/InvoiceService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomDate from "../../../Components/CustomDate";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CSVLink } from "react-csv";

export const ProductionEntryView = () => {
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [productionEntry, setProductionEntry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellerOption, setSellerOption] = useState(null);
  const users = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const [filterByDays, setFilterByDays] = useState("today");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getAllSellerAccountsDetails();
    getFinishGoods();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const data = users.groups.includes("Production Delhi")
        ? "Delhi"
        : "Maharashtra";
      const response = await InvoiceServices.getfilterSellerAccountData(data);
      setSellerOption(response.data.results);
      setOpen(false);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllFinishGoodsProducts();
      dispatch(getFinishGoodProduct(response.data.data));
      setOpen(false);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllProductionEntryDetails(currentPage, searchQuery);
  }, [currentPage, searchQuery, startDate, endDate, filterByDays]);

  const handleExport = async () => {
    try {
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      setOpen(true);
      const response = await InventoryServices.getAllProductionEntryData(
        "all",
        searchQuery,
        StartDate,
        EndDate,
        filterByDays
      );
      const data = response.data.map((row) => {
        return {
          id: row.id,
          bom: row.bom,
          seller_account: row.seller_account,
          product: row.product,
          quantity: row.quantity,
          user: row.user,
          created_on: row.created_on,
        };
      });
      console.log("data", data);
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading Price list", error);
    } finally {
      setOpen(false);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Bom", key: "bom" },
    { label: "Seller Account ", key: "seller_account" },
    { label: "Product", key: "product" },
    { label: "Quantity", key: "quantity" },
    { label: "User", key: "user" },
    { label: "Created Date", key: "created_on" },
  ];

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const getAllProductionEntryDetails = useCallback(
    async (page, search = searchQuery) => {
      try {
        const StartDate = startDate
          ? startDate.toISOString().split("T")[0]
          : "";
        const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
        setOpen(true);
        const response = await InventoryServices.getAllProductionEntryData(
          page,
          search,
          StartDate,
          EndDate,
          filterByDays
        );
        setProductionEntry(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [currentPage, searchQuery, startDate, endDate, filterByDays]
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };
  const handleChange = (value) => {
    if (value === "custom_date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setFilterByDays("");
      setCustomDataPopup(true);
    } else {
      setFilterByDays(value);
      setStartDate(null);
      setEndDate(null);
    }
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
              {/* Left Section: Search Component */}
              <Grid
                item
                xs={12}
                sm={5}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, newValue) =>
                    handleChange(newValue ? newValue.value : "")
                  }
                  options={filterDays}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  label="Filter By Date"
                />
              </Grid>

              {/* Center Section: Title */}
              <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Production Entry
                </h3>
              </Grid>

              {/* Right Section: Add Button */}
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  className="mx-3"
                  onClick={handleDownload}
                >
                  DownLoad CSV
                </Button>

                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Productin Entry.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
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
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">BOMID</StyledTableCell>
                  <StyledTableCell align="center">SELLER STATE</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">CREATED BY</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {productionEntry.map((row, i) => (
                  <Row key={i} row={row} />
                ))}
              </TableBody>{" "}
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
        title={"Create Production Entry Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProductionEntryCreate
          currentPage={currentPage}
          searchQuery={searchQuery}
          getAllProductionEntryDetails={getAllProductionEntryDetails}
          setOpenPopup={setOpenPopup2}
          sellerOption={sellerOption}
        />
      </Popup>
      <Popup
        openPopup={customDataPopup}
        setOpenPopup={setCustomDataPopup}
        title="Date Filter"
        maxWidth="md"
      >
        <CustomDate
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          resetDate={getResetDate}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <CustomLoader open={open} /> */}
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.id}</StyledTableCell>
        <StyledTableCell align="center">{row.bom}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>
        <StyledTableCell align="center">{row.product}</StyledTableCell>
        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
        <StyledTableCell align="center">{row.user}</StyledTableCell>
        <StyledTableCell align="center">{row.created_on}</StyledTableCell>
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
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">BATCH</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((historyRow, i) => (
                    <StyledTableRow key={i}>
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
                        {historyRow.batch_no}
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
const filterDays = [
  { label: "Today", value: "today" },
  { label: "Custom Date", value: "custom_date" },
];
