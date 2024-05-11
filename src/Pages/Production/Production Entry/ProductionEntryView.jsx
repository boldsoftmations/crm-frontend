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
      const response = await ProductService.getAllFinishGoods("all");
      var arr = response.data.map((ProductData) => ({
        product: ProductData.name,
      }));
      dispatch(getFinishGoodProduct(arr));
      setOpen(false);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllProductionEntryDetails(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getAllProductionEntryDetails = useCallback(
    async (page, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllProductionEntryData(
          page,
          search
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
    [searchQuery]
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

  // const openInPopup = (item) => {
  //   setIDForEdit(item);
  //   setOpenPopup(true);
  // };

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
              <Grid item xs={12} sm={4} display="flex" alignItems="center">
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Center Section: Title */}
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
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
