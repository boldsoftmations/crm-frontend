import React, { useState, useRef, useEffect } from "react";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { BulkCustomerAssign } from "./BulkCustomerAssign";
import { CustomTable } from "./../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import ProductService from "../../../services/ProductService";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { Autocomplete, Box } from "@mui/material";
import KycUpdate from "../KycDetails/KycUpdate";
import CustomTextField from "../../../Components/CustomTextField";

export const IncompleteKycDetails = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [product, setProduct] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.sales_users || [];
  const [isPrinting, setIsPrinting] = useState(false);

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
      let response = await CustomerServices.getIncompleteKycCustomerData({
        page: "all",
        assignToFilter: filterSelectedQuery,
        searchValue: searchQuery,
      });
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
      console.log("data", data);
      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = () => {
    getSearchData("", "");
    setSearchQuery("");
    setFilterSelectedQuery("");
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(filterSelectedQuery, searchQuery);
  };

  const handleFilterChange = (filterSelectedValue) => {
    setFilterSelectedQuery(filterSelectedValue);
    getSearchData(filterSelectedValue, searchQuery);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getIncompleteKycCustomerData();
    getProduct();
  }, []);

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

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const getIncompleteKycCustomerData = async () => {
    try {
      setOpen(true);
      const filterValue = filterSelectedQuery || null;
      const searchValue = searchQuery || null;

      let response;
      if (filterValue || searchValue) {
        response = await CustomerServices.getIncompleteKycCustomerData({
          page: currentPage,
          assignToFilter: filterValue,
          searchValue: searchValue,
        });
      } else {
        response = await CustomerServices.getIncompleteKycCustomerData({
          page: currentPage,
        });
      }
      setCompanyData(response.data.results);
      setpageCount(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const getSearchData = async (filterValue, searchValue) => {
    try {
      setOpen(true);
      console.log("filterValue", filterValue);
      console.log("searchValue", searchValue);
      console.log("currentPage", currentPage);
      let response;
      if (filterValue || searchValue) {
        response = await CustomerServices.getIncompleteKycCustomerData({
          assignToFilter: filterValue,
          searchValue: searchValue,
          page: currentPage,
        });
      } else {
        response = await CustomerServices.getIncompleteKycCustomerData({
          page: currentPage,
        });
      }
      setCompanyData(response.data.results);
      setpageCount(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };
  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      let response;
      if (filterSelectedQuery || searchQuery) {
        response = await CustomerServices.getIncompleteKycCustomerData({
          page: page,
          assignToFilter: filterSelectedQuery,
          searchValue: searchQuery,
        });
      } else {
        response = await CustomerServices.getIncompleteKycCustomerData({
          page: page,
        });
        setCompanyData(response.data.results);
      }
      setCompanyData(response.data.results);
      setpageCount(Math.ceil(response.data.count / 25));

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
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
      <CustomLoader open={open} />
      <ErrorMessage errRef={errRef} errMsg={errMsg} />
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
        <Box display="flex" alignItems="center">
          {!userData.groups.includes("Sales Executive") && (
            <Autocomplete
              size="small"
              sx={{ width: 300 }}
              onChange={(event, value) => handleFilterChange(value)}
              value={filterSelectedQuery}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <CustomTextField {...params} label="Filter By Sales Person" />
              )}
            />
          )}
          <CustomSearchWithButton
            filterSelectedQuery={searchQuery}
            setFilterSelectedQuery={setSearchQuery}
            handleInputChange={handleSearchChange}
            getResetData={getResetData}
          />

          <Button
            variant="contained"
            onClick={() => getResetData()}
            sx={{ marginLeft: "10px", marginRight: "10px" }}
            size="small"
          >
            Reset
          </Button>

          {userData.is_staff === true && (
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{ marginLeft: "10px", marginRight: "10px" }}
              size="small"
            >
              Assign Bulk Customer
            </Button>
          )}

          <Button variant="contained" onClick={handleDownload}>
            Download CSV
          </Button>
        </Box>

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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // marginTop: "2em",
          }}
        >
          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
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
