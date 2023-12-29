import React, { useState, useEffect, useRef } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { Button, Box, Paper, Grid } from "@mui/material";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { Popup } from "../../Components/Popup";
import {
  OrderBookPeningQuantityUpdate,
  OrderBookUpdate,
} from "./OrderBookUpdate";
import { CustomTable } from "../../Components/CustomTable";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const CustomerOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  const openInPopup = (item) => {
    try {
      const matchedODBData = orderBookData.find(
        (ODBData) => ODBData.id === item.id
      );
      setRecordForEdit(matchedODBData);
      if (userData.groups.includes("Accounts")) {
        setOpenModal2(true);
      }
      if (
        userData.groups.includes("Production") ||
        userData.groups.includes("Production Delhi")
      ) {
        setOpenModal(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleMainFilterChange = (event, newValue) => {
    if (newValue) {
      setFilterQuery(newValue.value);
    } else {
      setFilterQuery(""); // or any default value you'd like to set when the filter is cleared
    }
  };

  const selectedOption = filterOption.find(
    (option) => option.value === filterQuery
  );

  const handleStateFilterChange = (event, newValue) => {
    setFilterSelectedQuery(newValue);
    getSearchData(newValue, searchQuery);
  };

  const handleSalesPersonFilterChange = (event, newValue) => {
    setFilterSelectedQuery(newValue);
    getSearchData(newValue, searchQuery);
  };

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
              type: "customer",
              page: "all",
              filterType: filterQuery,
              filterValue: filterSelectedQuery,
              searchValue: searchQuery,
            })
          : await InvoiceServices.getOrderBookData({
              type: "customer",
              page: "all",
            });
      let data = response.data.map((item) => {
        if (
          userData.groups.includes("Factory-Mumbai-OrderBook") ||
          userData.groups.includes("Factory-Delhi-OrderBook")
        ) {
          return {
            company: item.company,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            product: item.product,
            quantity: item.quantity,
            // amount: item.amount,
            pending_quantity: item.pending_quantity,
            pending_amount: item.pending_amount,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        } else if (userData.groups.includes("Customer Service")) {
          return {
            company: item.company,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            product: item.product,
            quantity: item.quantity,
            rate: item.rate,
            pending_quantity: item.pending_quantity,
            seller_state: item.seller_state,
            billing_address: item.billing_address,
            billing_pincode: item.billing_pincode,
            shipping_address: item.shipping_address,
            shipping_pincode: item.shipping_pincode,
            payment_terms: item.payment_terms,
            delivery_terms: item.delivery_terms,
            transporter_name: item.transporter_name,
            place_of_supply: item.place_of_supply,
            buyer_order_no: item.buyer_order_no,
            buyer_order_date: item.buyer_order_date,
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        } else {
          return {
            company: item.company,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            billing_pincode: item.billing_pincode,
            shipping_pincode: item.shipping_pincode,
            product: item.product,
            quantity: item.quantity,
            amount: item.amount,
            pending_quantity: item.pending_quantity,
            seller_state: item.seller_state,
            pending_amount: item.pending_amount,
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
        getAllCustomerWiseOrderBook();
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
    getAllCustomerWiseOrderBook();
  }, []);

  const getAllCustomerWiseOrderBook = async () => {
    await fetchData({
      type: "customer",
      page: currentPage,
      filterType: filterQuery,
      filterValue: filterSelectedQuery,
      searchValue: searchQuery,
    });
  };

  const getSearchData = async (FilterValue, SearchValue) => {
    await fetchData({
      type: "customer",
      filterType: filterQuery,
      filterValue: FilterValue,
      searchValue: SearchValue,
    });
  };

  const handlePageClick = async (event, value) => {
    const page = value;
    setCurrentPage(page);
    await fetchData({
      type: "customer",
      page: page,
      filterType: filterQuery,
      filterValue: filterSelectedQuery,
      searchValue: searchQuery,
    });
  };

  const Tableheaders = [
    "ID",
    "Company",
    "Raised By",
    "Billing City",
    "Shipping City",
    "Pi Date",
    "Pi No",
    "Product",
    "Quantity",
    "Pending Quantity",
    "Amount",
    "Pending Amount",
    "EST DATE",
    "Special Instructions",
    "Revision",
    "ACTION",
  ];

  const Tabledata = orderBookData.map((row, i) => ({
    id: row.id,
    company: row.company,
    raised_by: row.raised_by,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    pi_date: row.pi_date,
    pi_no: row.proforma_invoice,
    product: row.product,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    amount: row.amount,
    pending_amount: row.pending_amount,
    est_date: row.est_date,
    special_instruction: row.special_instruction,
    revision: row.revision,
  }));

  const Tableheaders2 = [
    "ID",
    "Company",
    "Raised By",
    "Billing City",
    "Shipping City",
    "Pi Date",
    "Pi No",
    "Product",
    "Quantity",
    "Pending Quantity",
    "Pending Amount",
    "EST DATE",
    "Special Instructions",
    "Revision",
    "ACTION",
  ];

  const Tabledata2 = orderBookData.map((row, i) => ({
    id: row.id,
    company: row.company,
    raised_by: row.raised_by,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    pi_date: row.pi_date,
    pi_no: row.proforma_invoice,
    product: row.product,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    pending_amount: row.pending_amount,
    est_date: row.est_date,
    special_instruction: row.special_instruction,
    revision: row.revision,
  }));
  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <CustomAutocomplete
              size="small"
              sx={{ width: 300 }}
              value={selectedOption} // Pass the entire option object here
              onChange={handleMainFilterChange}
              options={filterOption}
              getOptionLabel={(option) => option.label}
              label="Filter By"
            />
            {filterQuery ===
              "orderbook__proforma_invoice__seller_account__state" && (
              <CustomAutocomplete
                size="small"
                sx={{ width: 300, marginLeft: "10px" }}
                value={filterSelectedQuery}
                onChange={handleStateFilterChange}
                options={StateOption.map((option) => option)}
                getOptionLabel={(option) => option}
                label="Filter By State"
              />
            )}

            {filterQuery.includes(
              "orderbook__proforma_invoice__raised_by__email"
            ) && (
              <CustomAutocomplete
                size="small"
                sx={{ width: 300, marginLeft: "10px" }}
                value={filterSelectedQuery}
                onChange={handleSalesPersonFilterChange}
                options={assigned.map((option) => option.email)}
                getOptionLabel={(option) => option}
                label="Filter By Sales Person"
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
                    ? headers
                    : headers2
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
              Customer Order Book Details
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
        title={"Update Customer OrderBook"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <OrderBookUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenModal}
          getAllOrderBook={getAllCustomerWiseOrderBook}
        />
      </Popup>
      <Popup
        title={"Update Customer OrderBook"}
        openPopup={openModal2}
        setOpenPopup={setOpenModal2}
      >
        <OrderBookPeningQuantityUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenModal2}
          getAllOrderBook={getAllCustomerWiseOrderBook}
        />
      </Popup>
    </div>
  );
};

const StateOption = ["Delhi", "Maharashtra"];
const headers = [
  {
    label: "Seller State",
    key: "seller_state",
  },
  { label: "PI Date", key: "pi_date" },
  { label: "PI Number", key: "proforma_invoice" },
  { label: "Customer", key: "company" },

  { label: "Billing City", key: "billing_city" },
  { label: "Billing Address", key: "billing_address" },
  { label: "Billing Pincode", key: "billing_pincode" },
  { label: "Shipping City", key: "shipping_city" },
  { label: "Shipping Address", key: "shipping_address" },
  { label: "Shipping Pincode", key: "shipping_pincode" },
  {
    label: "Product",
    key: "product",
  },
  {
    label: "Pending Quantity",
    key: "pending_quantity",
  },

  {
    label: "Invoice Quantity",
    key: "",
  },
  {
    label: "Rate",
    key: "rate",
  },
  {
    label: "Amount",
    key: "",
  },
  { label: "Payment Terms", key: "payment_terms" },
  {
    label: "Delivery Terms",
    key: "delivery_terms",
  },
  {
    label: "Transporter Name",
    key: "transporter_name",
  },
  {
    label: "Place Of Supply",
    key: "place_of_supply",
  },
  {
    label: "Buyer Order No",
    key: "buyer_order_no",
  },
  {
    label: "Buyer Order Date",
    key: "buyer_order_date",
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

const headers2 = [
  { label: "Customer", key: "company" },
  { label: "PI Date", key: "pi_date" },
  { label: "PI Number", key: "proforma_invoice" },
  { label: "Billing City", key: "billing_city" },
  { label: "Shipping City", key: "shipping_city" },
  { label: "Shipping Pincode", key: "shipping_pincode" },
  { label: "Billing Pincode", key: "billing_pincode" },
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
