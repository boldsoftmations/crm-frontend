import React, { useState, useRef, useEffect } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "./../../../Components/CustomLoader";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
  TableFooter,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { SalesInvoiceCreate } from "./SalesInvoiceCreate";
import { Popup } from "../../../Components/Popup";
import AddIcon from "@mui/icons-material/Add";
import { SalesInvoice } from "./SalesInvoice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomSearch } from "../../../Components/CustomSearch";

export const SalesInvoiceView = () => {
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getSalesInvoiceDetails();
  }, []);

  const getSalesInvoiceDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPagination(currentPage);
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getSalesInvoiceData();
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await InvoiceServices.getSalesInvoiceDataWithSearch(
        filterSearch
      );
      if (response) {
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getSalesInvoiceDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search sales invoice", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (searchQuery) {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPaginationAndSearch(
            page,
            searchQuery
          );
        if (response) {
          setSalesInvoiceData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getSalesInvoiceDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await InvoiceServices.getSalesInvoiceDataWithPagination(page);
        setSalesInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getSalesInvoiceDetails();
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1.6}>
              {" "}
              <CustomSearch
                filterSelectedQuery={searchQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </Box>
            <Box flexGrow={1}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Sales Invoice
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Create SalesInvoice
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  {/* <StyledTableCell align="center">company</StyledTableCell> */}
                  <StyledTableCell align="center">
                    SALES INVOICE NUMBER
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    TAXABLE AMOUNT
                  </StyledTableCell>
                  <StyledTableCell align="center">IGST</StyledTableCell>
                  <StyledTableCell align="center">TOTAL</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {salesInvoiceData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.invoice_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.igst}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.amount}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.total}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => openInPopup(row.invoice_no)}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })} */}
                {salesInvoiceData.map((row) => (
                  <Row key={row.id} row={row} openInPopup={openInPopup} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Create Sales Invoice"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesInvoiceCreate
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"View Sales Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <SalesInvoice
          idForEdit={idForEdit}
          getSalesInvoiceDetails={getSalesInvoiceDetails}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </>
  );
};

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

function Row(props) {
  const { row, openInPopup } = props;
  const [tableExpand, setTableExpand] = useState(false);

  return (
    <>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand(!tableExpand)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.generation_date}</StyledTableCell>
        <StyledTableCell align="center">{row.invoice_no}</StyledTableCell>
        <StyledTableCell align="center">{row.amount}</StyledTableCell>
        <StyledTableCell align="center">{row.igst}</StyledTableCell>
        <StyledTableCell align="center">{row.total}</StyledTableCell>
        <StyledTableCell align="center">{row.company}</StyledTableCell>
        <StyledTableCell align="center">
          <Button
            variant="contained"
            onClick={() => openInPopup(row.invoice_no)}
          >
            View
          </Button>
        </StyledTableCell>
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
                    <TableCell>PRODUCT CODE</TableCell>
                    <TableCell>QUANTITY</TableCell>
                    <TableCell align="right">AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.product}
                      </TableCell>
                      <TableCell>{historyRow.quantity}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
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
