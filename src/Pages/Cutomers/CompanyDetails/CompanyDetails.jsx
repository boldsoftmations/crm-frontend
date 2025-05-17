import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { UpdateAllCompanyDetails } from "./UpdateAllCompanyDetails";
import { CreateCompanyDetails } from "./CreateCompanyDetails";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { BulkCustomerAssign } from "./BulkCustomerAssign";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CreateCustomerProformaInvoice } from "./../../Invoice/ProformaInvoice/CreateCustomerProformaInvoice";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet";
import { CustomerPotentialCreate } from "../CustomerPotential/CustomerPotentialCreate";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CreateSRF } from "../SRF/CreateSRF";

export const CompanyDetails = () => {
  const [openPopupOfUpdateCustomer, setOpenPopupOfUpdateCustomer] =
    useState(false);
  const [openPopupOfCreateCustomer, setOpenPopupOfCreateCustomer] =
    useState(false);
  const [openPopupInvoice, setOpenPopupInvoice] = useState(false);
  const [openSRF, setOpenSRF] = useState(false);
  const [openPopupPotential, setOpenPopupPotential] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [rowData, setRowData] = useState();
  const [selectedCustomers, setSelectedCustomers] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.active_sales_user || [];
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Active");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setCompanyData([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllCompanyDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

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
    { label: "ID", key: "id" },
    { label: "NAME", key: "name" },
    { label: "Assigned To", key: "assigned_to" },
    { label: "PAN NUMBER", key: "pan_number" },
    { label: "GST NUMBER", key: "gst_number" },
    { label: "ADDRESS", key: "address" },
    { label: "CITY", key: "city" },
    { label: "STATE", key: "state" },
    { label: "PINCODE", key: "pincode" },
    { label: "BUSINESS TYPE", key: "business_type" },
    { label: "CATEGORY", key: "category" },
    { label: "EST. DATE", key: "est_date" },
    { label: "TOTAL SALES TURNOVER", key: "total_sales_turnover" },
    { label: "TYPE", key: "type" },
    { label: "CONTACT NAME", key: "contact_name" },
    { label: "CONTACT", key: "contact" },
    { label: "ALTERNATE CONTACT", key: "alternate_contact" },
    { label: "EMAIL", key: "email" },
    { label: "ALTERNATE EMAIL", key: "alternate_email" },
    { label: "STATUS", key: "status" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response = await CustomerServices.getAllCustomerData(
        statusFilter,
        "all",
        filterSelectedQuery,
        searchQuery
      );
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          assigned_to: row.assigned_to,
          pan_number: row.pan_number,
          gst_number: row.gst_number,
          address: row.address,
          city: row.city,
          state: row.state,
          pincode: row.pincode,
          business_type: row.business_type,
          category: row.category,
          est_date: row.est_date,
          total_sales_turnover: row.total_sales_turnover,
          type: row.type,
          status: row.status,
        };
      });
      console.log("data", data);
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading company details", error);
    } finally {
      setOpen(false);
    }
  };

  const openInPopupOfUpdateCustomer = (item) => {
    setRecordForEdit(item.id);
    setSelectedCustomers(item);
    setOpenPopupOfUpdateCustomer(true);
  };

  const openInPopupInvoice = (item) => {
    setRecordForEdit(item.id);
    setRowData(item);
    setOpenPopupInvoice(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const getAllCompanyDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCustomerData(
        statusFilter,
        currentPage,
        filterSelectedQuery,
        searchQuery
      );
      setCompanyData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("while getting company details", error);
    } finally {
      setOpen(false);
    }
  }, [statusFilter, currentPage, filterSelectedQuery, searchQuery]);

  useEffect(() => {
    getAllCompanyDetails();
  }, [getAllCompanyDetails]);

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

  //open popup for SRF(Sample Requist Form)
  const handleOpenSRF = (data) => {
    setRecordForEdit(data);
    setOpenSRF(true);
  };

  const Tableheaders = [
    "NAME",
    "Assigned To",
    "PAN NO.",
    "GST NO.",
    "CITY",
    "STATE",
    "STATUS",
    "ACTION",
  ];

  const isStatusFilterEnabled =
    userData.groups.includes("Director") ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Sales Manager");

  return (
    <>
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
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <div>
        <div
          style={{
            padding: "16px",
            margin: "16px",
            boxShadow: "0px 3px 6px #00000029",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
          }}
        >
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  disabled={!isStatusFilterEnabled} // Disable based on user group
                  size="small"
                  sx={{ minWidth: 200 }}
                  options={["Active", "Closed", "Blacklist"]}
                  getOptionLabel={(option) => option}
                  value={statusFilter}
                  onChange={(event, newValue) => {
                    setStatusFilter(newValue);
                  }}
                  label="Filter By Status" // Passed directly to CustomAutocomplete
                />
              </Grid>
              {!userData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={3}>
                  <CustomAutocomplete
                    size="small"
                    sx={{ minWidth: 200 }}
                    onChange={(event, newValue) => {
                      setFilterSelectedQuery(newValue && newValue.email);
                    }}
                    options={assigned}
                    getOptionLabel={(option) => option.name}
                    label="Filter By Sales Person" // Passed directly to CustomAutocomplete
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Add Button */}
              {(userData.groups.includes("Accounts") ||
                userData.groups.includes("Director")) && (
                <Grid item xs={12} sm={1}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenPopupOfCreateCustomer(true)}
                  >
                    Add
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              {/* Bulk Assign Button */}
              <Grid item xs={12} sm={5}>
                {(userData.groups.includes("Director") ||
                  userData.groups.includes("Sales Manager")) && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                  >
                    Assign Bulk Customer
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Company
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}>
                {/* Download CSV Button */}
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>

                {/* Hidden CSVLink for downloading the CSV */}
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Customer.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              borderRadius: "4px",
              display: openSnackbar ? "block" : "none",
              zIndex: 9999,
            }}
          >
            <span style={{ marginRight: "10px" }}>
              Bulk Customer Assigned Successfully!
            </span>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "0",
              }}
              onClick={handleSnackbarClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 7.293l2.146-2.147a.5.5 0 11.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"
                />
              </svg>
            </button>
          </div>
          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  {Tableheaders.map((header) => (
                    <StyledTableCell key={header} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {companyData.map((row, i) => (
                  <StyledTableRow key={row.i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to.map((assignee, index) => (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #4caf50",
                            borderRadius: "20px",
                            color: "#4caf50",
                          }}
                        >
                          {assignee}
                        </div>
                      ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pan_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.gst_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        sx={{ color: "#1976d2" }}
                        onClick={() => openInPopupOfUpdateCustomer(row)}
                      >
                        View
                      </Button>
                      {!userData.groups.includes(
                        "Accounts Billing Department"
                      ) &&
                        row.status === "Active" && (
                          <Button
                            sx={{ color: "#28a745" }}
                            onClick={() => openInPopupInvoice(row)}
                          >
                            PI
                          </Button>
                        )}
                      {!userData.groups.includes(
                        "Accounts Billing Department"
                      ) && (
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => handleOpenSRF(row)}
                        >
                          SRF
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // marginTop: "2em",
            }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <Popup
        fullScreen={true}
        title={"Create Customer Details"}
        openPopup={openPopupOfCreateCustomer}
        setOpenPopup={setOpenPopupOfCreateCustomer}
      >
        <CreateCompanyDetails
          setOpenPopup={setOpenPopupOfCreateCustomer}
          getAllCompanyDetails={getAllCompanyDetails}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Customer"}
        openPopup={openPopupOfUpdateCustomer}
        setOpenPopup={setOpenPopupOfUpdateCustomer}
      >
        <UpdateAllCompanyDetails
          setOpenPopup={setOpenPopupOfUpdateCustomer}
          getAllCompanyDetails={getAllCompanyDetails}
          recordForEdit={recordForEdit}
          selectedCustomers={selectedCustomers}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Create Customer Proforma Invoice"}
        openPopup={openPopupInvoice}
        setOpenPopup={setOpenPopupInvoice}
      >
        <CreateCustomerProformaInvoice
          recordForEdit={recordForEdit}
          rowData={rowData}
          setOpenPopup={setOpenPopupInvoice}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Assign Bulk Lead to another Employee"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <BulkCustomerAssign
          setOpenPopup={setOpenModal}
          setOpenSnackbar={setOpenSnackbar}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Create Potential"}
        openPopup={openPopupPotential}
        setOpenPopup={setOpenPopupPotential}
      >
        <CustomerPotentialCreate
          getCompanyDetailsByID={getAllCompanyDetails}
          recordForEdit={recordForEdit}
          setOpenModal={setOpenPopupPotential}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Create Sample Request Form"}
        openPopup={openSRF}
        setOpenPopup={setOpenSRF}
      >
        <CreateSRF
          type="customer"
          recordForEdit={recordForEdit}
          setOpenModal={setOpenSRF}
        />
      </Popup>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    padding: 5,
    fontSize: 12,
    backgroundColor: "#006BA1", // Remove padding from header cells
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 0, // Remove padding from body cells
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
