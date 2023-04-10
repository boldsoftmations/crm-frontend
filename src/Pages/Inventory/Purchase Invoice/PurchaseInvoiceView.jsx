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
import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { PurchaseInvoiceCreate } from "./PurchaseInvoiceCreate";
import { PurchaseInvoice } from "./PurchaseInvoice";

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

export const PurchaseInvoiceView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllPurchaseInvoiceDetails();
  }, []);

  const getAllPurchaseInvoiceDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getPurchaseInvoicePaginateData(currentPage)
        : await InventoryServices.getAllPurchaseInvoiceData();
      setPurchaseInvoiceData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name ||
            err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else if (err.response.status === 404 || !err.response.data) {
        setErrMsg("Data not found or request was null/empty");
      } else {
        setErrMsg("Server Error");
      }
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response =
          await InventoryServices.getAllSearchPurchaseInvoiceData(filterSearch);
        setPurchaseInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllPurchaseInvoiceDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await InventoryServices.getAllPurchaseInvoiceDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getPurchaseInvoicePaginateData(page);

      if (response) {
        setPurchaseInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllPurchaseInvoiceDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = async () => {
    setFilterSelectedQuery("");
    await getAllPurchaseInvoiceDetails();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={filterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
                HelperText={"Search By Invoice"}
              />
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Purchase Invoice Details
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                // startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">INVOICE</StyledTableCell>
                  <StyledTableCell align="center">GRN</StyledTableCell>
                  <StyledTableCell align="center">VENDOR</StyledTableCell>
                  <StyledTableCell align="center">
                    PURCHASE VOUCHER
                  </StyledTableCell>
                  <StyledTableCell align="center">ORDER DATE</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
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
        title={"Create Purchase Invoice Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <PurchaseInvoiceCreate
          getAllPurchaseInvoiceDetails={getAllPurchaseInvoiceDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Purchase Invoice Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <PurchaseInvoice
          setOpenPopup={setOpenPopup}
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
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.invoice_no}</TableCell>
        <TableCell align="center">{row.grn}</TableCell>
        <TableCell align="center">{row.supplier_name}</TableCell>
        <TableCell align="center">{row.packing_list_no}</TableCell>
        <TableCell align="center">{row.order_date}</TableCell>
        <TableCell align="center">
          <Button
            onClick={() => {
              openInPopup(row.id);
            }}
            variant="contained"
            color="success"
          >
            View
          </Button>
        </TableCell>
      </TableRow>
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
                    <TableRow key={i}>
                      <TableCell align="center">{i + 1}</TableCell>
                      <TableCell align="center">
                        {ProductsData.product}
                      </TableCell>
                      <TableCell align="center">
                        {ProductsData.description}
                      </TableCell>
                      <TableCell align="center">{ProductsData.unit}</TableCell>
                      <TableCell align="center">
                        {ProductsData.quantity}
                      </TableCell>
                      <TableCell align="center">{ProductsData.rate}</TableCell>
                      <TableCell align="center">
                        {ProductsData.amount}
                      </TableCell>
                    </TableRow>
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
