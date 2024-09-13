import React, { useState, useEffect, useRef, useCallback } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { Button, Box, Paper, Grid } from "@mui/material";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { Popup } from "../../Components/Popup";
import {
  OrderBookPeningQuantityUpdate,
  OrderBookUpdate,
} from "./OrderBookUpdate";
import { CustomTable } from "../../Components/CustomTable";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const PIOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const [filterSellerUnit, setFilterSellerUnit] = useState("");
  const [filterRaisedByEmail, setFilterRaisedByEmail] = useState("");
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
        "pi",
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
            proforma_invoice: item.proforma_invoice,
            order_book_date: item.order_book_date,
            pi_date: item.pi_date,
            company: item.company,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            product: item.product,
            quantity: item.quantity,
            // amount: item.amount,
            pending_amount: item.pending_amount,
            pending_quantity: item.pending_quantity,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            requested_date: item.requested_date,
            special_instructions: item.special_instructions,
          };
        } else {
          return {
            proforma_invoice: item.proforma_invoice,
            order_book_date: item.order_book_date,
            pi_date: item.pi_date,
            company: item.company,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            billing_pincode: item.billing_pincode,
            shipping_pincode: item.shipping_pincode,
            product: item.product,
            quantity: item.quantity,
            amount: item.amount,
            pending_amount: item.pending_amount,
            pending_quantity: item.pending_quantity,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            requested_date: item.requested_date,
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
        setOpenModal2(true);
      }
      if (
        userData.groups.includes("Production") ||
        userData.groups.includes("Production Delhi")
      ) {
        setOpenModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllPIWiseOrderBook = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData(
        "pi",
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
    getAllPIWiseOrderBook();
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
    "Id",
    "Approval Date",
    "Pi No",
    "Pi Date",
    "Company",
    "Raised By",
    "Billing City",
    "Shipping City",
    "Product",
    "Quantity",
    "Pending Quantity",
    "Amount",
    "Pending Amount",
    "EST DATE",
    "Requested Date",
    "Special Instructions",
    "Revision",
    "ACTION",
  ];

  const Tabledata = orderBookData.map((row, i) => ({
    id: row.id,
    approval_data: row.order_book_date,
    pi_no: row.proforma_invoice,
    pi_date: row.pi_date,
    company: row.company,
    raised_by: row.raised_by,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    product: row.product,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    amount: row.amount,
    pending_amount: row.pending_amount,
    estimated_date: row.estimated_date,
    requested_date: row.requested_date,
    special_instruction: row.special_instruction,
    revision: row.revision,
  }));

  const Tableheaders2 = [
    "ID",
    "Approval Date",
    "Pi No",
    "Pi Date",
    "Company",
    "Raised_by",
    "Billing City",
    "Shipping City",
    "Product",
    "Quantity",
    "Pending Quantity",
    "Pending Amount",
    "EST DATE",
    "Requested Date",
    "Special Instructions",
    "Revision",
    "ACTION",
  ];

  const Tabledata2 = orderBookData.map((row, i) => ({
    id: row.id,
    approval_data: row.order_book_date,
    pi_no: row.proforma_invoice,
    pi_date: row.pi_date,
    company: row.company,
    raised_by: row.raised_by,
    billing_city: row.billing_city,
    shipping_city: row.shipping_city,
    product: row.product,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    pending_amount: row.pending_amount,
    estimated_date: row.estimated_date,
    requested_date: row.requested_date,
    special_instruction: row.special_instruction,
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
                    headers={headers}
                    data={exportData}
                    ref={csvLinkRef}
                    filename="PI Order Book.csv"
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
              PI Order Book Details
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
        title={"Update PI OrderBook"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <OrderBookUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenModal}
          getAllOrderBook={getAllPIWiseOrderBook}
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
          getAllOrderBook={getAllPIWiseOrderBook}
        />
      </Popup>
    </>
  );
};

const StateOption = ["Delhi", "Maharashtra"];

const headers = [
  { label: "PI Number", key: "proforma_invoice" },
  { label: "Approval Date", key: "order_book_date" },
  { label: "PI Date", key: "pi_date" },
  { label: "Customer", key: "company" },
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
    label: "Pending Amount",
    key: "pending_amount",
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
    label: "Estimated Date",
    key: "estimated_date",
  },
  {
    label: "Requested Date",
    key: "requested_date",
  },
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
];
