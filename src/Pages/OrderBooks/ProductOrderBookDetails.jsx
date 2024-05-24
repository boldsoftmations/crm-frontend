import React, { useState, useEffect, useRef, useCallback } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { Button, Box, Paper, Grid } from "@mui/material";
import { CSVLink } from "react-csv";
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
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const ProductOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [filterSellerUnit, setFilterSellerUnit] = useState("");
  const [filterRaisedByEmail, setFilterRaisedByEmail] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const csvLinkRef = useRef(null);
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;
  const assigned = userData.sales_users || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
      const response = await InvoiceServices.getOrderBookData(
        "product",
        "all",
        filterSellerUnit,
        filterRaisedByEmail,
        searchQuery
      );
      let data = response.data.map((item) => {
        if (
          userData.groups.includes("Factory-Mumbai-OrderBook") ||
          userData.groups.includes("Factory-Delhi-OrderBook")
        ) {
          return {
            product: item.product,
            order_book_date: item.order_book_date,
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
            order_book_date: item.order_book_date,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            quantity: item.quantity,
            amount: item.amount,
            pending_quantity: item.pending_quantity,
            company: item.company,
            billing_address: item.billing_address,
            billing_pincode: item.billing_pincode,
            shipping_address: item.shipping_address,
            shipping_pincode: item.shipping_pincode,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            special_instructions: item.special_instructions,
          };
        } else {
          return {
            product: item.product,
            order_book_date: item.order_book_date,
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

  const getAllProductDataOrderBook = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData(
        "product",
        currentPage,
        filterSellerUnit,
        filterRaisedByEmail,
        searchQuery
      );
      setOrderBookData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSellerUnit, filterRaisedByEmail, searchQuery]);

  useEffect(() => {
    getAllProductDataOrderBook();
  }, [currentPage, filterSellerUnit, filterRaisedByEmail, searchQuery]);

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

  const Tableheaders = [
    "ID",
    "Approval Date",
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
    approval_data: row.order_book_date,
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
    "Approval Date",
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
    approval_data: row.order_book_date,
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
          <Box marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  value={filterSellerUnit}
                  onChange={(event, value) => setFilterSellerUnit(value)}
                  options={StateOption.map((option) => option)}
                  getOptionLabel={(option) => option}
                  label="Filter By State"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  value={filterRaisedByEmail}
                  onChange={(event, value) => setFilterRaisedByEmail(value)}
                  options={assigned.map((option) => option.email)}
                  getOptionLabel={(option) => option}
                  label="Filter By Sales Person"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
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
                    filename="Product Order Book.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
              </Grid>
            </Grid>
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
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
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
    </>
  );
};

const StateOption = ["Delhi", "Maharashtra"];

const headers = [
  {
    label: "Product",
    key: "product",
  },
  { label: "Approval Date", key: "order_book_date" },
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
  { label: "Approval Date", key: "order_book_date" },
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
  { label: "Billing Pincode", key: "billing_pincode" },
  { label: "Shipping Address", key: "shipping_address" },
  { label: "Shipping City", key: "shipping_city" },
  { label: "Shipping Pincode", key: "shipping_pincode" },
  {
    label: "Seller State",
    key: "seller_state",
  },
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
];
