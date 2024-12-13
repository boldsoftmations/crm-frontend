import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import InvoiceServices from "../../../services/InvoiceService";
import { Popup } from "../../../Components/Popup";
import { ProformaInvoiceView } from "./ProformaInvoiceView";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { UpdateCustomerProformaInvoice } from "./UpdateCustomerProformaInvoice";
import { CustomPagination } from "../../../Components/CustomPagination";
import { UpdateLeadsProformaInvoice } from "./UpdateLeadsProformaInvoice";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomSelect from "../../../Components/CustomSelect";
import SearchComponent from "../../../Components/SearchComponent ";
export const ApprovePi = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPiAmount, setTotalPiAmount] = useState(0);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.active_sales_user || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const clearFilterType = () => setFilterType("");
  const clearFilterValue = () => setFilterValue("");

  const FilterOptions = [
    { label: "Status", value: "status" },
    { label: "Type", value: "type" },
    ...(!users.groups.includes("Sales Executive")
      ? [{ label: "Sales Person", value: "raised_by__email" }]
      : []),
  ];

  const AssignedOptions = assigned.map((user) => ({
    label: user.name,
    value: user.email,
  }));

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getProformaInvoiceData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPIData(
        "unapproved",
        currentPage,
        filterType,
        filterValue,
        searchValue
      );
      setInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setTotalPiAmount(response.data.total_amount);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterType, filterValue, searchValue]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getProformaInvoiceData(currentPage);
  }, [currentPage, filterType, filterValue, searchValue]);

  const handleSearch = (query) => {
    setSearchValue(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchValue("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handleFilterType = (event) => {
    setFilterType(event.target.value);
    setFilterValue(""); // Reset filter value when type changes
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tabledata = invoiceData.map((row, i) => ({
    type: row.type,
    pi_number: row.pi_number,
    generation_date: row.generation_date,
    customer: row.company_name,
    billing_city: row.billing_city,
    contact: row.contact,
    status: row.status,
    round_off_total: row.round_off_total,
    balance_amount: row.balance_amount,
    payment_terms: row.payment_terms,
  }));

  const Tableheaders = [
    "Type",
    "PI Numer",
    "PI Date",
    "Customer",
    "Billing City",
    "Contact",
    "Status",
    "PI Amount",
    "Balance",
    "Payment Terms",
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
              <Grid item xs={12} sm={6} md={4}>
                <CustomSelect
                  label="Filter By"
                  options={FilterOptions}
                  value={filterType}
                  onChange={handleFilterType}
                  onClear={clearFilterType}
                />
              </Grid>
              {filterType === "status" && (
                <Grid item xs={12} sm={6} md={4}>
                  <CustomSelect
                    label="Status"
                    options={StatusOptions}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    onClear={clearFilterValue}
                  />
                </Grid>
              )}
              {filterType === "type" && (
                <Grid item xs={12} sm={6} md={4}>
                  <CustomSelect
                    label="Type"
                    options={TypeOptions}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    onClear={clearFilterValue}
                  />
                </Grid>
              )}
              {filterType === "raised_by__email" && (
                <Grid item xs={12} sm={6} md={4}>
                  <CustomSelect
                    label="Sales Person"
                    options={AssignedOptions}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    onClear={clearFilterValue}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              {totalPiAmount && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography
                      variant="body1"
                      style={{
                        fontWeight: 500,
                        color: "#4CAF50", // Green color for a fresh and appealing look
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                      }}
                    >
                      Total PI Amount:{" "}
                      <strong
                        style={{
                          fontSize: "20px",
                          color: "#FF5722", // Highlighted in a contrasting color
                          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Adds subtle depth
                        }}
                      >
                        {totalPiAmount
                          ? `₹ ${new Intl.NumberFormat("en-IN").format(
                              totalPiAmount
                            )}`
                          : "₹ 0"}
                      </strong>
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Approve Pi
            </h3>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 450,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
                borderRadius: 5,
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
                  {Tableheaders.map((header) => {
                    return (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {Tabledata.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.type}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pi_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.generation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.customer}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.billing_city}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.round_off_total}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.balance_amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.payment_terms}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={4}
                      >
                        <Button
                          style={{ fontSize: "12px" }}
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => openInPopup(row)}
                        >
                          View
                        </Button>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Customer Proforma Invoice"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateCustomerProformaInvoice
          getProformaInvoiceData={getProformaInvoiceData}
          setOpenPopup={setOpenPopup}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Lead Proforma Invoice"}
        openPopup={openPopup1}
        setOpenPopup={setOpenPopup1}
      >
        <UpdateLeadsProformaInvoice
          getAllLeadsPIDetails={getProformaInvoiceData}
          setOpenPopup={setOpenPopup1}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"View Proforma Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProformaInvoiceView
          idForEdit={idForEdit}
          getProformaInvoiceData={getProformaInvoiceData}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </>
  );
};

const StatusOptions = [
  { label: "Raised", value: "raised" },
  { label: "Pending Approval", value: "pending_approval" },
  { label: "Approved", value: "approved" },
  { label: "Partially Paid", value: "partially_paid" },
  { label: "Fully Paid", value: "fully_paid" },
  { label: "Credit", value: "credit" },
];

const TypeOptions = [
  { label: "Customer", value: "customer" },
  { label: "Lead", value: "lead" },
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
