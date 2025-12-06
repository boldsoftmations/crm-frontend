import React, { useState, useEffect, useRef, useCallback } from "react";
import InvoiceServices from "../../services/InvoiceService";
import {
  Button,
  Box,
  Paper,
  Grid,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  styled,
  Table,
  tableCellClasses,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { Popup } from "../../Components/Popup";
import {
  OrderBookPeningQuantityUpdate,
  OrderBookUpdate,
} from "./OrderBookUpdate";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const CustomerOrderBookDetails = () => {
  const [orderBookData, setOrderBookData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [filterSellerUnit, setFilterSellerUnit] = useState("");
  const [filterRaisedByEmail, setFilterRaisedByEmail] = useState("");
  const [filterReadyDate, setFilterReadyDate] = useState("");
  const [filterEstimateData, setFilterEstimateData] = useState("");
  const [recordForEdit, setRecordForEdit] = useState(null);
  const csvLinkRef = useRef(null);
  const dataList = useSelector((state) => state.auth);
  const userData = dataList.profile;
  const assigned = userData.active_sales_user || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
        userData.groups.includes("Production Delhi") ||
        userData.groups.includes("Director")
      ) {
        setOpenModal(true);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
    setTimeout(() => {
      csvLinkRef.current.link.click();
    });
  };
  console.log(filterReadyDate);

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData(
        "customer",
        "all",
        filterSellerUnit,
        filterRaisedByEmail,
        searchQuery,
        filterReadyDate,
        filterEstimateData
      );
      let data = response.data.map((item) => {
        if (
          userData.groups.includes("Factory-Mumbai-OrderBook") ||
          userData.groups.includes("Factory-Delhi-OrderBook")
        ) {
          return {
            company: item.company,
            order_book_date: item.order_book_date,
            pi_date: item.pi_date,
            proforma_invoice: item.proforma_invoice,
            billing_city: item.billing_city,
            shipping_city: item.shipping_city,
            product: item.product,
            quantity: item.quantity,
            pending_quantity: item.pending_quantity,
            pending_amount: item.pending_amount,
            seller_state: item.seller_state,
            estimated_date: item.estimated_date,
            ready_date: item.ready_date,
            requested_date: item.requested_date,
            special_instructions: item.special_instructions,

            remark: item.remark,
          };
        } else if (
          userData.groups.includes("Customer Service") ||
          userData.groups.includes("Sales Executive")
        ) {
          return {
            company: item.company,
            order_book_date: item.order_book_date,
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
            ready_date: item.ready_date,
            requested_date: item.requested_date,
            special_instructions: item.special_instructions,
            remark: item.remark,
          };
        } else {
          return {
            company: item.company,
            order_book_date: item.order_book_date,
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
            ready_date: item.ready_date,
            requested_date: item.requested_date,
            special_instructions: item.special_instructions,
            remark: item.remark,
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

  const getAllCustomerWiseOrderBook = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getOrderBookData(
        "customer",
        currentPage,
        filterSellerUnit,
        filterRaisedByEmail,
        searchQuery,
        filterReadyDate,
        filterEstimateData
      );
      setOrderBookData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [
    currentPage,
    filterSellerUnit,
    filterRaisedByEmail,
    searchQuery,
    filterReadyDate,
    filterEstimateData,
  ]);

  useEffect(() => {
    getAllCustomerWiseOrderBook();
  }, [getAllCustomerWiseOrderBook]);

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

  const Tableheaders2 = [
    "Pi No",
    "Pi Date",
    "Approval Date",
    "Company",
    "Sales Person",
    "Billing City",
    "Shipping City",
    "Product",
    "Quantity",
    "Pending Quantity",
    "EST DATE",
    "Ready Date",
    "Request Date",
    "Special Instructions",
    "Revision",
    "ACTION",
  ];

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
                  value={
                    readyDateOption.find(
                      (option) => option.value === filterReadyDate
                    ) || null
                  }
                  onChange={(event, value) =>
                    setFilterReadyDate(value ? value.value : null)
                  }
                  options={readyDateOption}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Ready Date"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  value={assigned.find(
                    (option) => option.email === filterRaisedByEmail
                  )}
                  onChange={(event, value) =>
                    setFilterRaisedByEmail(value ? value.email : null)
                  }
                  options={assigned}
                  getOptionLabel={(option) => option.name}
                  label="Filter By Sales Person"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  value={
                    EstimatedDateOption.find(
                      (option) => option.value === filterEstimateData
                    ) || null
                  }
                  onChange={(event, value) =>
                    setFilterEstimateData(value ? value.value : null)
                  }
                  options={EstimatedDateOption}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Estimated Date"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>

                {exportData.length > 0 && (
                  <CSVLink
                    headers={
                      userData.groups.includes("Customer Service") ||
                      userData.groups.includes("Sales Executive")
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
              </Grid>

              <Grid item xs={12} sm={5}>
                <h3
                  style={{
                    textAlign: "left",

                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Order Book Details
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
            </Grid>
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
                  {Tableheaders2.map((header, i) => {
                    return (
                      <StyledTableCell key={i} align="center">
                        {header}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
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
                      {row.order_book_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.sales_person}
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
                      {row.type_of_unit === "decimal"
                        ? row.quantity
                        : Math.floor(row.quantity)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.type_of_unit === "decimal"
                        ? row.pending_quantity
                        : Math.floor(row.pending_quantity)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.estimated_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ready_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.requested_date}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.special_instructions}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.revision}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="text"
                        color="info"
                        size="small"
                        onClick={() => openInPopup(row)}
                        disabled={userData.groups.includes(
                          "Operations & Supply Chain Manager"
                        )}
                      >
                        Production View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
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
    </>
  );
};

const StateOption = ["Delhi", "Maharashtra"];
const readyDateOption = [
  {
    label: "Ready",
    value: true,
  },
  {
    label: "Not Ready",
    value: false,
  },
];
const EstimatedDateOption = [
  {
    label: "Esimated",
    value: true,
  },
  {
    label: "Not Esimated",
    value: false,
  },
];
const headers = [
  {
    label: "Seller State",
    key: "seller_state",
  },
  { label: "Approval Date", key: "order_book_date" },
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
  { label: "Ready Date", key: "ready_date" },

  { label: "Requested Date", key: "requested_date" },
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
  {
    label: "Remarks",
    key: "remark",
  },
];

const headers2 = [
  { label: "Customer", key: "company" },
  { label: "Approval Date", key: "order_book_date" },
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
  { label: "Ready Date", key: "ready_date" },

  { label: "Requested Date", key: "requested_date" },
  {
    label: "Special Instruction",
    key: "special_instructions",
  },
  {
    label: "Remarks",
    key: "remark",
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
