import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  styled,
  Box,
  TableContainer,
  IconButton,
  Collapse,
  Checkbox,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { tableCellClasses } from "@mui/material/TableCell";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
export const ViewDispatch = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getAllDispatchDetails();
  }, []);
  const getAllDispatchDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await InvoiceServices.getDispatchDataWithPagination(
          "false",
          currentPage
        );
        setDispatchData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getDispatchData("false");
        setDispatchData(response.data.results);
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

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      const response = await InvoiceServices.getDispatchDataWithPagination(
        "false",
        page
      );
      setDispatchData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
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
          <Box flexGrow={2}></Box>
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
              Pending Dispatch
            </h3>
          </Box>
          <Box flexGrow={0.5}></Box>
        </Box>
        <TableContainer
          sx={{
            maxHeight: 440,
            "&::-webkit-scrollbar": {
              width: 10,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#0d6efd",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#000000",
              borderRadius: 2,
            },
          }}
        >
          <Table sx={{ minWidth: 700 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Sales Invoice</StyledTableCell>
                <StyledTableCell align="center">Customer</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">
                  Dispatch Location
                </StyledTableCell>
                <StyledTableCell align="center">Dispatched</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {" "}
              {dispatchData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  getAllDispatchDetails={getAllDispatchDetails}
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

  const handleChange = (event, row) => {
    setChecked(event.target.checked);
    createLeadsData(event, event.target.checked, row);
  };

  const createLeadsData = async (e, value, row) => {
    try {
      console.log("e", e);
      e.preventDefault();
      setOpen(true);
      console.log("value :>> ", value);

      const data = {
        sales_invoice: row.sales_invoice,
        dispatched: value,
      };
      await InvoiceServices.updateDispatched(row.id, data);
      getAllDispatchDetails();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };
  return (
    <React.Fragment>
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
          {" "}
          <Checkbox
            checked={checked}
            onChange={(e) => handleChange(e, row)}
            inputProps={{ "aria-label": "controlled" }}
          />
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
    </React.Fragment>
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
