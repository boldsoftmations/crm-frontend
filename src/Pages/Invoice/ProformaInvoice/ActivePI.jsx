import React, { useState, useEffect, useCallback } from "react";

import {
  Box,
  Grid,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import InvoiceServices from "../../../services/InvoiceService";
import { Popup } from "../../../Components/Popup";
import { ProformaInvoiceView } from "./ProformaInvoiceView";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { UpdateCustomerProformaInvoice } from "./UpdateCustomerProformaInvoice";
import { CustomPagination } from "../../../Components/CustomPagination";
import { UpdateLeadsProformaInvoice } from "./UpdateLeadsProformaInvoice";
import { Helmet } from "react-helmet";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import CustomSelect from "../../../Components/CustomSelect";
import { MessageAlert } from "../../../Components/MessageAlert";

export const ActivePI = () => {
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
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.sales_users || [];
  const [isPrinting, setIsPrinting] = useState(false);
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
    label: user.email,
    value: user.email,
  }));

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setInvoiceData([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getProformaInvoiceData();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  const openInPopup2 = (item) => {
    setIDForEdit(item);
    if (item.type === "Customer") {
      setOpenPopup(true);
    } else {
      setOpenPopup1(true);
    }
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
        "active",
        currentPage,
        filterType,
        filterValue,
        searchValue
      );
      setInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterType, filterValue, searchValue]);

  useEffect(() => {
    getProformaInvoiceData();
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

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <Helmet>
        <style>
          {`
            @media print {
              html, body {
                filter: ${isPrinting ? "blur(10px)" : "none"} !important;
              }
            }
          `}
        </style>
      </Helmet>
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
              Active PI
            </h3>
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
                  <StyledTableCell align="center">TYPE</StyledTableCell>
                  <StyledTableCell align="center">PI NUMBER</StyledTableCell>
                  <StyledTableCell align="center">PI DATE</StyledTableCell>
                  <StyledTableCell align="center">RAISED BY</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">BILLING CITY</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">STATUS</StyledTableCell>
                  <StyledTableCell align="center">PI AMOUNT</StyledTableCell>
                  <StyledTableCell align="center">BALANCE</StyledTableCell>
                  <StyledTableCell align="center">
                    PAYMENT TERMS
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pi_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.generation_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.raised_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company_name}
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
                        <Button variant="text" onClick={() => openInPopup(row)}>
                          View
                        </Button>
                        {(users.groups.toString() === "Sales Manager" ||
                          users.groups.toString() === "Sales Deputy Manager" ||
                          users.groups.toString() ===
                            "Sales Assistant Deputy Manager" ||
                          users.groups.toString() === "Sales Executive" ||
                          users.groups.toString() ===
                            "Sales Manager without Leads" ||
                          users.groups.toString() === "Customer Service") &&
                          row.status === "Raised" && (
                            <Button
                              variant="text"
                              color="success"
                              onClick={() => openInPopup2(row)}
                            >
                              PI Edit
                            </Button>
                          )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: "1px", // Adjust the padding value to reduce space
    marginLeft: "10px", // Add margin to the left
    marginRight: "10px", // Add margin to the right
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "1px", // Adjust the padding value to reduce space
    marginLeft: "10px", // Add margin to the left
    marginRight: "10px", // Add margin to the right
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
  "& td": {
    padding: "1px", // Adjust the padding value to reduce space
    marginLeft: "10px", // Add margin to the left
    marginRight: "10px", // Add margin to the right
  },
}));
