import React, { useState, useRef, useEffect, useCallback } from "react";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { useDispatch, useSelector } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { BulkCustomerAssign } from "./BulkCustomerAssign";
import { CustomTable } from "./../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CSVLink } from "react-csv";
import { Button, Grid, Paper } from "@mui/material";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import KycUpdate from "../KycDetails/KycUpdate";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";

export const IncompleteKycDetails = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.sales_users || [];
  const [isPrinting, setIsPrinting] = useState(false);
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
      getIncompleteKycCustomerData();
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
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response = await CustomerServices.getIncompleteKycCustomerData(
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
          contact_name: row.contacts.map((contact) => contact.name).join(", "),
          contact: row.contacts.map((contact) => contact.contact).join(", "),
          alternate_contact: row.contacts
            .map((contact) => contact.alternate_contact)
            .join(", "),
          email: row.contacts.map((contact) => contact.email).join(", "),
          alternate_email: row.contacts
            .map((contact) => contact.alternate_email)
            .join(", "),
        };
      });
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getIncompleteKycCustomerData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getIncompleteKycCustomerData(
        currentPage,
        filterSelectedQuery,
        searchQuery
      );
      setCompanyData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSelectedQuery, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getIncompleteKycCustomerData();
  }, [currentPage, filterSelectedQuery, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handleFilterChange = (filterSelectedValue) => {
    setFilterSelectedQuery(filterSelectedValue);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tableheaders = [
    "ID",
    "NAME",
    "Assigned To",
    "PAN NO.",
    "GST NO.",
    "CITY",
    "STATE",
    "ACTION",
  ];

  const Tabledata = companyData.map((value) => ({
    id: value.id,
    name: value.name,
    assigned_to: value.assigned_to,
    pan_number: value.pan_number,
    gst_number: value.gst_number,
    city: value.city,
    state: value.state,
  }));

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
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              {!userData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    size="small"
                    fullWidth
                    onChange={(event, value) => handleFilterChange(value)}
                    value={filterSelectedQuery}
                    options={assigned.map((option) => option.email)}
                    getOptionLabel={(option) => option}
                    label="Filter By Sales Person"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                {userData.is_staff === true && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    sx={{ marginLeft: "10px", marginRight: "10px" }}
                  >
                    Assign Bulk Customer
                  </Button>
                )}

                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
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
              Incomplete KYC Details
            </h3>
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

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
            ButtonText={"PI"}
            ButtonText1={"Activity"}
            ButtonText2={"Potential"}
          />

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Update Customer"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <KycUpdate
          setOpenPopup={setOpenPopup}
          getIncompleteKycCustomerData={getIncompleteKycCustomerData}
          recordForEdit={recordForEdit}
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
      );
    </>
  );
};
