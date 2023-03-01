import React, { useEffect, useRef, useState } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { styled } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Collapse,
  Typography,
} from "@mui/material";
import FileSaver from "file-saver";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomPagination } from "./../../Components/CustomPagination";
import { CustomLoader } from "./../../Components/CustomLoader";
import { CustomSearch } from "./../../Components/CustomSearch";
export const SalesRegisterView = () => {
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [salesRegisterData, setsalesRegisterData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getSalesRegisterData();
  }, []);

  const getSalesRegisterData = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await InvoiceServices.getSaleRegisterDataWithPagination(currentPage);
        setsalesRegisterData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        let response = await InvoiceServices.getAllSaleRegisterData();
        if (response) {
          setsalesRegisterData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        }
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
      const response = await InvoiceServices.getSaleRegisterDataWithSearch(
        filterSearch
      );
      if (response) {
        setsalesRegisterData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getSalesRegisterData();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search sale register", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getSalesRegisterData();
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response =
          await InvoiceServices.getSaleRegisterDataWithPaginationAndSearch(
            page,
            searchQuery
          );
        if (response) {
          setsalesRegisterData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getSalesRegisterData();
          setSearchQuery("");
        }
      } else {
        const response =
          await InvoiceServices.getSaleRegisterDataWithPagination(page);
        setsalesRegisterData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      {" "}
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box display="flex">
          <Box flexGrow={2}>
            {" "}
            <CustomSearch
              filterSelectedQuery={searchQuery}
              handleInputChange={handleInputChange}
              getResetData={getResetData}
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
              Sales Register
            </h3>
          </Box>
          <Box flexGrow={0.5}></Box>
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
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Sales Invoice</StyledTableCell>
                <StyledTableCell align="center">Customer</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">
                  Dispatch Location
                </StyledTableCell>
                <StyledTableCell align="center">LR COPY</StyledTableCell>

                <StyledTableCell align="center">POD COPY</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {" "}
              {salesRegisterData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  getSalesRegisterData={getSalesRegisterData}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
      </Paper>
    </div>
  );
};

function Row(props) {
  const { row, getAllDispatchDetails } = props;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(row.dispatched);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState("");
  const [customer, setCustomer] = useState("");

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClickLRCOPY = async (data) => {
    let url = data.lr_copy ? data.lr_copy : "";
    FileSaver.saveAs(url, "image");
  };

  const handleClickPODCOPY = async (data) => {
    let url = data.pod_copy ? data.pod_copy : "";
    FileSaver.saveAs(url, "image");
  };

  console.log("checked", checked);
  const createLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      // const data = {
      //   sales_invoice: id,
      //   dispatched: checked,
      // };
      const data = new FormData();
      data.append("dispatched", checked);

      await InvoiceServices.updateDispatched(row.id, data);
      getAllDispatchDetails();
      setOpen(false);
      setOpenModal(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };
  return (
    <>
      <CustomLoader opn={open} />
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
        <TableCell align="center">{row.sales_invoice}</TableCell>
        <TableCell align="center">{row.customer}</TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">{row.dispatch_location}</TableCell>
        <TableCell align="center">
          <Button
            color="success"
            variant="outlined"
            onClick={() => handleClickLRCOPY(row)}
          >
            Download
          </Button>
        </TableCell>

        <TableCell align="center">
          <Button
            color="success"
            variant="outlined"
            onClick={() => handleClickPODCOPY(row)}
          >
            Download
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
                    <TableCell align="center">DISPATCH ID</TableCell>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((historyRow) => (
                    <TableRow key={historyRow.dispatch_book}>
                      <TableCell align="center">
                        {historyRow.dispatch_book}
                      </TableCell>
                      <TableCell align="center">{historyRow.product}</TableCell>
                      <TableCell align="center">
                        {historyRow.quantity}
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
