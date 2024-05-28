import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Switch,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import InventoryServices from "../../../services/InventoryService";
import { ReworkInvoiceProduct } from "./ReworkInvoiceProduct";
import { Popup } from "../../../Components/Popup";

export const ReworkInvoiceView = () => {
  const [open, setOpen] = useState(false);
  const [reworkInvoiceData, setReworkInvoiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getReworkEntryData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getReworkinvoiceData(
        currentPage,
        searchQuery
      );
      console.log("rework Data", response.data.results);
      setReworkInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getReworkEntryData();
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
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
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
                  Rework Entry
                </h3>
              </Grid>

              {/* Add Button on the right */}
              {/* <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => setOpenPopupSalesReturn(true)}
                >
                  Sales Return
                </Button>
              </Grid> */}
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
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">
                    SELLER ACCOUNT
                  </StyledTableCell>
                  <StyledTableCell align="center">BATCH_NO</StyledTableCell>
                  <StyledTableCell align="center">CREATED BY</StyledTableCell>
                  <StyledTableCell align="center">ACCEPTED</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reworkInvoiceData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    getReworkEntryData={getReworkEntryData}
                  />
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
    </>
  );
};

function Row(props) {
  const { row, getReworkEntryData } = props;
  const [tableExpand, setTableExpand] = useState(false);
  const [openPopProduct, setOpenPopProduct] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleUpdateReworkInvoice = async (data) => {
    console.log("data", data);
    try {
      setOpen(true);
      const req = {
        is_accepted: true,
      };
      const response = await InventoryServices.updateReworkInvoiceData(
        data.id,
        req
      );
      handleSuccess("Product Accepted Successfully");
      getReworkEntryData();
    } catch (error) {
      handleError(error);
      console.log("error Store Accepting", error);
    } finally {
      setOpen(false);
    }
  };

  const handleOpenPop = (data) => {
    setSelectedRowData(data);
    setOpenPopProduct(true);
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

      <StyledTableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          textDecoration: row.cancelled ? "line-through" : "none",
        }}
      >
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand(!tableExpand)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.creation_date}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>
        <StyledTableCell align="center">{row.batch_no}</StyledTableCell>
        <StyledTableCell align="center">{row.created_by}</StyledTableCell>
        <StyledTableCell align="center">
          <Switch
            checked={row.is_accepted}
            inputProps={{ "aria-label": "controlled" }}
          />
        </StyledTableCell>
        {row.is_accepted ? (
          <StyledTableCell align="center">
            <Button variant="text" color="primary" disabled>
              Accepted
            </Button>
          </StyledTableCell>
        ) : (
          <StyledTableCell align="center">
            <Button
              variant="text"
              color="success"
              onClick={() => handleUpdateReworkInvoice(row)}
            >
              Accept
            </Button>
          </StyledTableCell>
        )}
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">RATE</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">AMOUNT</TableCell>
                    <TableCell align="center">ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((product) => (
                    <TableRow key={product.date}>
                      <TableCell component="th" scope="row" align="center">
                        {product.product}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {product.rate}
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">{product.amount}</TableCell>
                      <TableCell align="center">
                        <Button
                          color="info"
                          variant="outlined"
                          onClick={() => handleOpenPop(product)}
                        >
                          Raw Material
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popup
        maxWidth="md"
        title={"Raw Materials"}
        openPopup={openPopProduct}
        setOpenPopup={setOpenPopProduct}
      >
        <ReworkInvoiceProduct
          selectedRow={selectedRowData}
          setOpenPopup={setOpenPopProduct}
        />
      </Popup>
    </>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
