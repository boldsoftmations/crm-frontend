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
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { CustomSearch } from "../../Components/CustomSearch";

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

const filterOption = [
  {
    label: "Search By State",
    value: "orderbook__proforma_invoice__seller_account__state",
  },
  { label: "Search", value: "search" },
];
const headers = [
  {
    label: "Product",
    key: "product",
  },
  { label: "PI Date", key: "pi_date" },
  { label: "PI Number", key: "proforma_invoice" },
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
  { label: "Customer", key: "company" },
  { label: "Billing City", key: "billing_city" },
  { label: "Shipping City", key: "shipping_city" },
  {
    label: "Seller State",
    key: "seller_state",
  },
];

export const ProductOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const [totalPendingQuantity, settotalPendingQuantity] = useState([]);
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportOrderBookData, setExportOrderBookData] = useState([]);
  const [filterQuery, setFilterQuery] = useState("search");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;

  useEffect(() => {
    getTotalPendingQuantityDetails();
  }, []);

  const getTotalPendingQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOTotalPendingQuantity();
      settotalPendingQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");
    setFilterQuery("");
    getAllProductDataOrderBook();
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
    getAllProductDataOrderBook();
  }, []);

  const getAllProductDataOrderBook = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await InvoiceServices.getProductOrderBookDatawithPage(
          "product",
          currentPage
        );
        setOrderBookData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getOrderBookData("product");
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
        "product",
        filterQuery,
        filterSearch
      );
      if (response) {
        setOrderBookData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllProductDataOrderBook();
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
            "product",
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setOrderBookData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductDataOrderBook();
          setSearchQuery("");
        }
      } else if (filterSelectedQuery) {
        const response =
          await InvoiceServices.getAllOrderBookDatawithSearchWithPagination(
            "product",
            page,
            filterQuery,
            filterSelectedQuery
          );
        if (response) {
          setOrderBookData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductDataOrderBook();
          setSearchQuery("");
        }
      } else {
        const response = await InvoiceServices.getProductOrderBookDatawithPage(
          "product",
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

  useEffect(() => {
    getAllCustomerWiseOrderBookExport();
  }, [searchQuery]);

  const getAllCustomerWiseOrderBookExport = async () => {
    try {
      setOpen(true);
      if (filterSelectedQuery) {
        const response =
          await InvoiceServices.getAllOrderBookDatawithSearchWithPagination(
            "product",
            "all",
            filterSelectedQuery
          );
        setExportOrderBookData(response.data);
        //   const total = response.data.count;
        //   setpageCount(Math.ceil(total / 25));
      } else {
        const response = await InvoiceServices.getAllOrderBookData(
          "all",
          "product"
        );
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
        product: item.product,
        pi_date: item.pi_date,
        proforma_invoice: item.proforma_invoice,
        quantity: item.quantity,
        // amount: item.amount,
        pending_quantity: item.pending_quantity,
        company: item.company,
        billing_city: item.billing_city,
        shipping_city: item.shipping_city,
        seller_state: item.seller_state,
      };
    } else {
      return {
        product: item.product,
        pi_date: item.pi_date,
        proforma_invoice: item.proforma_invoice,
        quantity: item.quantity,
        amount: item.amount,
        pending_quantity: item.pending_quantity,
        company: item.company,
        billing_city: item.billing_city,
        shipping_city: item.shipping_city,
        seller_state: item.seller_state,
      };
    }
  });

  // const data = exportOrderBookData.map((item) => ({
  //   product: item.product,
  //   pi_date: item.pi_date,
  //   proforma_invoice: item.proforma_invoice,
  //   quantity: item.quantity,
  //   amount: item.amount,
  //   pending_quantity: item.pending_quantity,
  //   company: item.company,
  //   billing_city: item.billing_city,
  //   shipping_city: item.shipping_city,
  // }));

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
                Product Order Book Details
              </h3>
            </Box>

            <Box flexGrow={0.5}>
              <Button variant="contained" onClick={() => setOpenModal(true)}>
                Pending Quantity
              </Button>
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
                <Button color="success" variant="contained">
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
                <TableRow>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">PI DATE</StyledTableCell>
                  <StyledTableCell align="center">PI NUMBER</StyledTableCell>
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
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">BILLING CITY</StyledTableCell>
                  <StyledTableCell align="center">
                    SHIPPING CITY
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderBookData.map((row) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ "& > *": { borderBottom: "unset" } }}
                  >
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pi_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.proforma_invoice}
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
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.billing_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.shipping_city}
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
      <Popup
        maxWidth={"lg"}
        title={"View Product Wise Pending Quantity"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
          <Table
            sx={{ minWidth: 800 }}
            stickyHeader
            aria-label="collapsible table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">PRODUCT</StyledTableCell>
                <StyledTableCell align="left">TOTAL</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {totalPendingQuantity.map((row, i) => (
                <StyledTableRow
                  key={i}
                  sx={{ "& > *": { borderBottom: "unset" } }}
                >
                  <StyledTableCell align="left">
                    {row.product__name}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.total}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Popup>
    </div>
  );
};
