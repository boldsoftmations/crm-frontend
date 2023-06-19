import React, { useState, useRef, useEffect } from "react";
import { UpdateAllCompanyDetails } from "./UpdateAllCompanyDetails";
import { CreateCompanyDetails } from "./CreateCompanyDetails";
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
import { CustomerActivityCreate } from "../../FollowUp/CustomerActivityCreate";
import ProductService from "../../../services/ProductService";
import { CustomerPotentialCreate } from "../../Potential/CustomerPotentialCreate";
import { CreateCustomerProformaInvoice } from "./../../Invoice/ProformaInvoice/CreateCustomerProformaInvoice";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

export const CompanyDetails = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [openPopupActivity, setOpenPopupActivity] = useState(false);
  const [openPopupPotential, setOpenPopupPotential] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [product, setProduct] = useState([]);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

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
      let response;
      if (filterSelectedQuery) {
        response = await CustomerServices.getAllCompanyDataPaginate(
          "all",
          filterSelectedQuery
        );
      } else {
        response = await CustomerServices.getCompanyPaginateData("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
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
    setFilterSelectedQuery("");
    getAllCompanyDetails();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup3(true);
  };

  const openInPopup3 = (item) => {
    setRecordForEdit(item.id);
    setOpenPopupActivity(true);
  };

  const openInPopup4 = (item) => {
    setRecordForEdit(item.id);
    setOpenPopupPotential(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = () => {
    setFilterSelectedQuery(filterSelectedQuery);
    getSearchData(filterSelectedQuery);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getAllCompanyDetails();
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

  const getAllCompanyDetails = async () => {
    try {
      setOpen(true);
      if (filterSelectedQuery !== "" && currentPage) {
        const response = await CustomerServices.getAllCompanyDataPaginate(
          currentPage,
          filterSelectedQuery
        );
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (currentPage) {
        const response = await CustomerServices.getCompanyPaginateData(
          currentPage
        );
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await CustomerServices.getAllCompanyData();
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
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

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response = await CustomerServices.getAllSearchCompanyData(
          filterSearch
        );
        setCompanyData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllCompanyDetails();
        setFilterSelectedQuery("");
      }
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

      if (filterSelectedQuery) {
        const response = await CustomerServices.getAllCompanyDataPaginate(
          page,
          filterSelectedQuery
        );
        if (response) {
          setCompanyData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllCompanyDetails();
          setFilterSelectedQuery("");
        }
      } else {
        const response = await CustomerServices.getCompanyPaginateData(page);
        setCompanyData(response.data.results);
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tableheaders = [
    "ID",
    "NAME",
    "PAN NO.",
    "GST NO.",
    "CITY",
    "STATE",
    "ACTION",
  ];

  const Tabledata = companyData.map((value) => ({
    id: value.id,
    name: value.name,
    pan_number: value.pan_number,
    gst_number: value.gst_number,
    city: value.city,
    state: value.state,
  }));
  return (
    <>
      <CustomLoader open={open} />

      <div>
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
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 0.9 }}>
              <CustomSearchWithButton
                filterSelectedQuery={filterSelectedQuery}
                setFilterSelectedQuery={setFilterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </div>
            <div style={{ flexGrow: 2 }}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Customer
              </h3>
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              {userData.is_staff === true && (
                <button
                  onClick={() => setOpenModal(true)}
                  className="btn btn-primary me-2"
                  size="small"
                >
                  Assign Bulk Customer
                </button>
              )}
              {userData.groups.toString() !== "Sales" && (
                <button
                  onClick={() => setOpenPopup2(true)}
                  className="btn btn-success"
                  size="small"
                >
                  Add
                </button>
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
            </div>
          </div>
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
            openInPopup2={openInPopup2}
            openInPopup3={openInPopup3}
            openInPopup4={openInPopup4}
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
      </div>

      <Popup
        fullScreen={true}
        title={"Create Customer Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateCompanyDetails
          setOpenPopup={setOpenPopup2}
          getAllCompanyDetails={getAllCompanyDetails}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Customer"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateAllCompanyDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetails={getAllCompanyDetails}
          recordForEdit={recordForEdit}
          product={product}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Create Customer Proforma Invoice"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <CreateCustomerProformaInvoice
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup3}
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
        maxWidth={"xl"}
        title={"Create Activity"}
        openPopup={openPopupActivity}
        setOpenPopup={setOpenPopupActivity}
      >
        <CustomerActivityCreate
          recordForEdit={recordForEdit}
          setOpenModal={setOpenPopupActivity}
          getFollowUp={getAllCompanyDetails}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Create Potential"}
        openPopup={openPopupPotential}
        setOpenPopup={setOpenPopupPotential}
      >
        <CustomerPotentialCreate
          recordForEdit={recordForEdit}
          product={product}
          setOpenModal={setOpenPopupPotential}
        />
      </Popup>
    </>
  );
};
