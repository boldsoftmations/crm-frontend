import React, { useState, useEffect, useRef } from "react";
import InvoiceServices from "../../services/InvoiceService";
import {
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
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { CustomSearch } from "../../Components/CustomSearch";
import {
  OrderBookPeningQuantityUpdate,
  OrderBookUpdate,
} from "./OrderBookUpdate";
import { TotalPendingQuantity } from "./TotalPendingQuantity";
import { CustomTable } from "../../Components/CustomTable";

export const ProductOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const [filterQuery, setFilterQuery] = useState("search");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const csvLinkRef = useRef(null);
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
    setTimeout(() => {
      csvLinkRef.current.link.click();
    });
  };

  const handleExport = async () => {
    try {
      setOpen(true);
      const response =
        filterSelectedQuery || searchQuery
          ? await InvoiceServices.getOrderBookData({
              type: "product",
              page: "all",
              searchType: filterQuery,
              searchValue: searchQuery || filterSelectedQuery,
            })
          : await InvoiceServices.getOrderBookData({
              type: "product",
              page: "all",
            });
      let data = response.data.map((item) => {
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
            pending_amount: item.pending_amount,
            company: item.company,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        } else if (userData.groups.toString() === "Customer Service") {
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
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        } else {
          return {
            product: item.product,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            quantity: item.quantity,
            amount: item.amount,
            pending_quantity: item.pending_quantity,
            pending_amount: item.pending_amount,
            company: item.company,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        }
      });
      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const openInPopup = (item) => {
    try {
      const matchedODBData = orderBookData.find(
        (ODBData) => ODBData.id === item.id
      );
      setRecordForEdit(matchedODBData);
      if (userData.groups.includes("Accounts")) {
        setOpenModal3(true);
      }
      if (
        userData.groups.includes("Production") ||
        userData.groups.includes("Production Delhi")
      ) {
        setOpenModal2(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");
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
      let response;
      if (currentPage) {
        response = await InvoiceServices.getOrderBookData({
          type: "product",
          page: currentPage,
        });
      } else {
        response = await InvoiceServices.getOrderBookData({
          type: "product",
          page: currentPage,
        });
      }
      setOrderBookData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
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
      const response = await InvoiceServices.getOrderBookData({
        type: "product",
        page: currentPage,
        searchType: filterQuery,
        searchValue: filterSearch,
      });
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
      let response;
      if (searchQuery || filterSelectedQuery) {
        response = await InvoiceServices.getOrderBookData({
          type: "product",
          page: page,
          searchType: filterQuery,
          searchValue: searchQuery || filterSelectedQuery,
        });
      } else {
        response = await InvoiceServices.getOrderBookData({
          type: "product",
          page: page,
        });
      }
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
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tableheaders = [
    "ID",
    "Product",
    "Pi Date",
    "Pi No",
    "Quantity",
    "Pending Quantity",
    "Amount",
    "Pending Amount",
    "EST DATE",
    "Special Instructions",
    "Company",
    "Billing City",
    "Shipping City",
    "Revision",
    "ACTION",
  ];

  const Tabledata = orderBookData.map((row, i) => ({
    id: row.id,
    product: row.product,
    pi_date: row.pi_date,
    pi_no: row.proforma_invoice,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    amount: row.amount,
    pending_amount: row.pending_amount,
    est_date: row.est_date,
    special_instruction: row.special_instruction,
    company: row.company,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    revision: row.revision,
  }));

  const Tableheaders2 = [
    "ID",
    "Product",
    "Pi Date",
    "Pi No",
    "Quantity",
    "Pending Quantity",
    "Pending Amount",
    "EST DATE",
    "Special Instructions",
    "Company",
    "Billing City",
    "Shipping City",
    "Revision",
    "ACTION",
  ];

  const Tabledata2 = orderBookData.map((row, i) => ({
    id: row.id,
    product: row.product,
    pi_date: row.pi_date,
    pi_no: row.proforma_invoice,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,

    pending_amount: row.pending_amount,
    est_date: row.est_date,
    special_instruction: row.special_instruction,
    company: row.company,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    revision: row.revision,
  }));
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
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={
                    userData.groups.toString() === "Customer Service"
                      ? Customerheaders
                      : headers
                  }
                  ref={csvLinkRef}
                  filename="Product Order Book.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
            </Box>
          </Box>
          <CustomTable
            headers={
              userData.groups.toString() !== "Factory-Mumbai-OrderBook" &&
              userData.groups.toString() !== "Factory-Delhi-OrderBook"
                ? Tableheaders
                : Tableheaders2
            }
            data={
              userData.groups.toString() !== "Factory-Mumbai-OrderBook" &&
              userData.groups.toString() !== "Factory-Delhi-OrderBook"
                ? Tabledata
                : Tabledata2
            }
            openInPopup={
              (userData.groups.includes("Production") ||
                userData.groups.includes("Production Delhi") ||
                userData.groups.includes("Accounts")) &&
              openInPopup
            }
            openInPopup2={null}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"lg"}
        title={"View Total Pending Quantity"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <TotalPendingQuantity />
      </Popup>
      <Popup
        title={"Update Product OrderBook"}
        openPopup={openModal2}
        setOpenPopup={setOpenModal2}
      >
        <OrderBookUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenModal2}
          getAllOrderBook={getAllProductDataOrderBook}
        />
      </Popup>
      <Popup
        title={"Update Customer OrderBook"}
        openPopup={openModal3}
        setOpenPopup={setOpenModal3}
      >
        <OrderBookPeningQuantityUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenModal3}
          getAllOrderBook={getAllProductDataOrderBook}
        />
      </Popup>
    </div>
  );
};

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
  {
    label: "Pending Amount",
    key: "pending_amount",
  },
  {
    label: "Estimated Date",
    key: "estimated_date",
  },
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
];

const Customerheaders = [
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
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
];
