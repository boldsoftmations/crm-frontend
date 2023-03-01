import React, { useState, useEffect, useRef } from "react";
import InvoiceServices from "../../services/InvoiceService";
import {
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomSearch } from "./../../Components/CustomSearch";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";

const filterOption = [
  {
    label: "Search By State",
    value: "orderbook__proforma_invoice__seller_account__state",
  },
  { label: "Search", value: "search" },
];
export const PIOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportOrderBookData, setExportOrderBookData] = useState([]);
  const [filterQuery, setFilterQuery] = useState("search");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;
  useEffect(() => {
    getAllPIWiseOrderBook();
  }, []);

  const getAllPIWiseOrderBook = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await InvoiceServices.getAllOrderBookDatawithPage(
          "pi",
          currentPage
        );
        setOrderBookData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getOrderBookData("pi");
        setOrderBookData(response.data.results);
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

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await InvoiceServices.getAllOrderBookDatawithSearch(
        "pi",
        filterQuery,
        filterSearch
      );
      if (response) {
        setOrderBookData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllPIWiseOrderBook();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
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
          await InvoiceServices.getAllOrderBookDatawithSearchWithPagination(
            "pi",
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setOrderBookData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllPIWiseOrderBook();
          setSearchQuery("");
        }
      } else if (filterSelectedQuery) {
        const response =
          await InvoiceServices.getAllOrderBookDatawithSearchWithPagination(
            "pi",
            page,
            filterQuery,
            filterSelectedQuery
          );
        if (response) {
          setOrderBookData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllPIWiseOrderBook();
          setSearchQuery("");
        }
      } else {
        const response = await InvoiceServices.getAllOrderBookDatawithPage(
          "pi",
          page
        );
        setOrderBookData(response.data.results);
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
    setFilterSelectedQuery("");
    setFilterQuery("");
    getAllPIWiseOrderBook();
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllPIWiseOrderBookExport();
  }, [searchQuery]);

  const getAllPIWiseOrderBookExport = async () => {
    try {
      setOpen(true);
      if (filterSelectedQuery) {
        const response =
          await InvoiceServices.getAllOrderBookDatawithSearchWithPagination(
            "pi",
            "all",
            filterSelectedQuery
          );
        setExportOrderBookData(response.data);
        //   const total = response.data.count;
        //   setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getAllOrderBookData("all", "pi");
        setExportOrderBookData(response.data);
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

  let data = exportOrderBookData.map((item) => {
    if (
      userData.groups.toString() === "Factory-Mumbai-OrderBook" ||
      userData.groups.toString() === "Factory-Delhi-OrderBook"
    ) {
      return {
        proforma_invoice: item.proforma_invoice,
        pi_date: item.pi_date,
        company: item.company,
        billing_city: item.billing_city,
        shipping_city: item.shipping_city,
        product: item.product,
        quantity: item.quantity,
        // amount: item.amount,
        pending_quantity: item.pending_quantity,
        seller_state: item.seller_state,
      };
    } else {
      return {
        proforma_invoice: item.proforma_invoice,
        pi_date: item.pi_date,
        company: item.company,
        billing_city: item.billing_city,
        shipping_city: item.shipping_city,
        product: item.product,
        quantity: item.quantity,
        amount: item.amount,
        pending_quantity: item.pending_quantity,
        seller_state: item.seller_state,
      };
    }
  });

  //   const data = exportOrderBookData.map(item =>
  //     if (userData.groups.toString() === "Factory") {
  //     company: item.company,
  //     pi_date: item.pi_date,
  //     proforma_invoice: item.proforma_invoice,
  //     billing_city: item.billing_city,
  //     shipping_city: item.shipping_city,
  //     product: item.product,
  //     quantity: item.quantity,
  //     // amount: item.amount,
  //     pending_quantity: item.pending_quantity,
  //   });
  // }

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Fliter By"
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                >
                  {filterOption.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box flexGrow={1}>
              {filterQuery ===
                "orderbook__proforma_invoice__seller_account__state" && (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By State
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Filter By State"
                    value={filterSelectedQuery}
                    onChange={(event) => handleInputChanges(event)}
                    sx={{
                      "& .MuiSelect-iconOutlined": {
                        display: filterSelectedQuery ? "none" : "",
                      },
                      "&.Mui-focused .MuiIconButton-root": {
                        color: "primary.main",
                      },
                    }}
                    endAdornment={
                      <IconButton
                        sx={{
                          visibility: filterSelectedQuery
                            ? "visible"
                            : "hidden",
                        }}
                        onClick={getResetData}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                  >
                    <MenuItem value={"Delhi"}>Delhi</MenuItem>
                    <MenuItem value={"Maharashtra"}>Maharashtra</MenuItem>
                  </Select>
                </FormControl>
              )}
              {filterQuery === "search" && (
                <CustomSearch
                  filterSelectedQuery={searchQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              )}
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
                PI Order Book Details
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <CSVLink
                data={data}
                headers={headers}
                filename={"my-file.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button variant="contained" color="success">
                  Export to Excel
                </Button>
              </CSVLink>
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
            component={Paper}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="collapsible table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">PI NUMBER</StyledTableCell>
                  <StyledTableCell align="center">PI DATE</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">BILLING CITY</StyledTableCell>
                  <StyledTableCell align="center">
                    SHIPPING CITY
                  </StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">
                    PENDING QUANTITY
                  </StyledTableCell>
                  {userData.groups.toString() !== "Factory-Mumbai-OrderBook" &&
                    (userData.groups.toString() !==
                    "Factory-Delhi-OrderBook" ? (
                      <StyledTableCell align="center">AMOUNT</StyledTableCell>
                    ) : (
                      ""
                    ))}
                  <StyledTableCell align="center">
                    SPECIAL INSTRUCTIONS
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {orderBookData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.proforma_invoice}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pi_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.billing_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.shipping_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pending_quantity}
                    </StyledTableCell>
                    {userData.groups.toString() !==
                      "Factory-Mumbai-OrderBook" &&
                      (userData.groups.toString() !==
                      "Factory-Delhi-OrderBook" ? (
                        <StyledTableCell align="center">
                          {row.amount}
                        </StyledTableCell>
                      ) : (
                        ""
                      ))}
                    <StyledTableCell align="center">
                      {row.special_instructions}
                    </StyledTableCell>
                  </StyledTableRow>
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
    </div>
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

const headers = [
  { label: "PI Number", key: "proforma_invoice" },
  { label: "PI Date", key: "pi_date" },
  { label: "Customer", key: "company" },
  { label: "Billing City", key: "billing_city" },
  { label: "Shipping City", key: "shipping_city" },
  {
    label: "Product",
    key: "product",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Amount",
    key: "amount",
  },
  {
    label: "Pending Quantity",
    key: "pending_quantity",
  },
  {
    label: "Seller State",
    key: "seller_state",
  },
];
