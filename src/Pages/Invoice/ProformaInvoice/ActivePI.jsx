import React, { useState, useEffect, useCallback, useRef } from "react";

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
import { CSVLink } from "react-csv";

export const ActivePI = () => {
  const dispatch = useDispatch();
  const csvLinkRef = useRef(null);
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
  const [exportData, setExportData] = useState([]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.active_sales_user || [];
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
    label: user.name,
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
  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPIData(
        "active",
        "all",
        filterType,
        filterValue,
        searchValue
      );
      const data = response.data.map((row) => {
        return {
          generation_date: row.generation_date,
          pi_number: row.pi_number,
          name_of_party: row.name_of_party,
          raised_by: row.raised_by,
          round_off_total: row.round_off_total,
          balance_amount: row.balance_amount,
          status: row.status,
        };
      });
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading Pi", error);
    } finally {
      setOpen(false);
    }
  };
  // export data
  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "PI DATE", key: "generation_date" },
    { label: "PI NUMBER", key: "pi_number" },
    { label: "COMPANY", key: "name_of_party" },
    { label: "SALES PERSON", key: "raised_by" },
    { label: "PI AMOUNT", key: "round_off_total" },
    { label: "BALANCE AMOUNT", key: "balance_amount" },
    { label: "PI STATUS", key: "status" },
  ];
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
              <Grid item xs={12} sm={3} md={3}>
                <CustomSelect
                  label="Filter By"
                  options={FilterOptions}
                  value={filterType}
                  onChange={handleFilterType}
                  onClear={clearFilterType}
                />
              </Grid>
              {filterType === "status" && (
                <Grid item xs={12} sm={3} md={3}>
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
                <Grid item xs={12} sm={3} md={3}>
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
                <Grid item xs={12} sm={3} md={3}>
                  <CustomSelect
                    label="Sales Person"
                    options={AssignedOptions}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    onClear={clearFilterValue}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Export data*/}
              {(users.groups.includes("Accounts") ||
                users.groups.includes("Director") ||
                users.groups.includes("Customer Service")) && (
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    className="mx-3"
                    onClick={handleDownload}
                  >
                    DownLoad CSV
                  </Button>

                  {exportData.length > 0 && (
                    <CSVLink
                      data={exportData}
                      headers={headers}
                      ref={csvLinkRef}
                      filename="Active Pi List.csv"
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        outline: "none",
                        visibility: "hidden",
                      }}
                    />
                  )}
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
                        {row.name_of_party}
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
                        {row.status === "Raised" && (
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
