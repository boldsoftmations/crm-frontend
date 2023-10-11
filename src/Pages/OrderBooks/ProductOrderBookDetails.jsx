import React, { useState, useEffect, useRef } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { Button, Box, Paper, Grid, Autocomplete } from "@mui/material";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import {
  OrderBookPeningQuantityUpdate,
  OrderBookUpdate,
} from "./OrderBookUpdate";
import { TotalPendingQuantity } from "./TotalPendingQuantity";
import { CustomTable } from "../../Components/CustomTable";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import CustomTextField from "../../Components/CustomTextField";

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
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const csvLinkRef = useRef(null);
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;
  const assigned = userData.sales_users || [];

  const filterOption = [
    {
      label: "Search By State",
      value: "orderbook__proforma_invoice__seller_account__state",
    },
    ...(!userData.groups.includes("Sales Executive")
      ? [
          {
            label: "Sales Person",
            value: "orderbook__proforma_invoice__raised_by__email",
          },
        ]
      : []),
  ];

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
          userData.groups.includes("Factory-Mumbai-OrderBook") ||
          userData.groups.includes("Factory-Delhi-OrderBook")
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
        } else if (userData.groups.includes("Customer Service")) {
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
            billing_pincode: item.billing_pincode,
            shipping_pincode: item.shipping_pincode,
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

  const handleMainFilterChange = (event, newValue) => {
    if (newValue) {
      setFilterQuery(newValue.value);
    } else {
      setFilterQuery(""); // or any default value you'd like to set when the filter is cleared
    }
  };

  const handleStateFilterChange = (event, newValue) => {
    setFilterSelectedQuery(newValue);
    getSearchData(newValue, searchQuery);
  };

  const handleSalesPersonFilterChange = (event, newValue) => {
    setFilterSelectedQuery(newValue);
    getSearchData(newValue, searchQuery);
  };

  // Common function to fetch data
  const fetchData = async (params) => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData(params);
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
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    setOpen(false);
    let errorMessage = "Server Error";
    if (!error.response) {
      errorMessage =
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin";
    } else {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.errors.name
            ? error.response.data.errors.name
            : error.response.data.errors.non_field_errors;
          break;
        case 401:
          errorMessage = error.response.data.errors.code;
          break;
        default:
          errorMessage = "Server Error";
      }
    }
    setErrMsg(errorMessage);
    errRef.current.focus();
  };

  useEffect(() => {
    getAllProductDataOrderBook();
  }, []);

  const getAllProductDataOrderBook = async () => {
    await fetchData({
      type: "product",
      page: currentPage,
      filterType: filterQuery,
      filterValue: filterSelectedQuery,
      searchValue: searchQuery,
    });
  };

  const getSearchData = async (FilterValue, SearchValue) => {
    await fetchData({
      type: "product",
      filterType: filterQuery,
      filterValue: FilterValue,
      searchValue: SearchValue,
    });
  };

  const handlePageClick = async (event, value) => {
    const page = value;
    setCurrentPage(page);
    await fetchData({
      type: "product",
      page: page,
      filterType: filterQuery,
      filterValue: filterSelectedQuery,
      searchValue: searchQuery,
    });
  };

  const Tableheaders = [
    "ID",
    "Product",
    "Raised By",
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
    raised_by: row.raised_by,
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
    "Raised By",
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
    raised_by: row.raised_by,
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
          <Box display="flex" marginBottom="10px">
            <FilterAutocomplete
              label="Filter By"
              options={filterOption}
              // value={filterQuery}
              onChange={handleMainFilterChange}
            />

            {filterQuery ===
              "orderbook__proforma_invoice__seller_account__state" && (
              <FilterAutocomplete
                label="Filter By State"
                options={StateOption}
                value={filterSelectedQuery}
                onChange={handleStateFilterChange}
              />
            )}

            {filterQuery.includes(
              "orderbook__proforma_invoice__raised_by__email"
            ) && (
              <FilterAutocomplete
                label="Filter By Sales Person"
                options={assigned}
                value={filterSelectedQuery}
                onChange={handleSalesPersonFilterChange}
              />
            )}

            <CustomSearchWithButton
              filterSelectedQuery={searchQuery}
              setFilterSelectedQuery={setSearchQuery}
              handleInputChange={(e) => {
                setSearchQuery(searchQuery);
                getSearchData(filterSelectedQuery, searchQuery);
              }}
              getResetData={() => {
                setSearchQuery("");
                getSearchData(filterSelectedQuery, null);
              }}
            />

            <Button
              sx={{ marginLeft: "10px" }}
              variant="contained"
              onClick={handleDownload}
            >
              Download CSV
            </Button>

            {exportData.length > 0 && (
              <CSVLink
                headers={
                  userData.groups.includes("Customer Service")
                    ? Customerheaders
                    : headers
                }
                data={exportData}
                ref={csvLinkRef}
                filename="Customer Order Book.csv"
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              />
            )}
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
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
          <CustomTable
            headers={
              userData.groups.includes("Factory-Mumbai-OrderBook") &&
              userData.groups.includes("Factory-Delhi-OrderBook")
                ? Tableheaders
                : Tableheaders2
            }
            data={
              userData.groups.includes("Factory-Mumbai-OrderBook") &&
              userData.groups.includes("Factory-Delhi-OrderBook")
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

const StateOption = ["Delhi", "Maharashtra"];

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
  { label: "Shipping Pincode", key: "shipping_pincode" },
  { label: "Billing Pincode", key: "billing_pincode" },
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

const FilterAutocomplete = ({ label, options, value, onChange }) => (
  <Autocomplete
    size="small"
    sx={{ width: 300, marginLeft: "10px" }}
    value={value}
    onChange={onChange}
    options={options}
    getOptionLabel={(option) => option.label || option}
    renderInput={(params) => <CustomTextField {...params} label={label} />}
  />
);
