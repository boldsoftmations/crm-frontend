import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Autocomplete,
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
import { useDispatch, useSelector } from "react-redux";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { BulkCustomerAssign } from "./BulkCustomerAssign";
import { CustomTable } from "./../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomerActivityCreate } from "../../FollowUp/CustomerActivityCreate";
import ProductService from "../../../services/ProductService";
import { CreateCustomerProformaInvoice } from "./../../Invoice/ProformaInvoice/CreateCustomerProformaInvoice";
import { CSVLink } from "react-csv";
import { Helmet } from "react-helmet";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomerPotentialCreate } from "../CustomerPotential/CustomerPotentialCreate";

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
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [product, setProduct] = useState([]);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.sales_users || [];
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Active");
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
          // contact_name: row.contacts.map((contact) => contact.name).join(", "),
          // contact: row.contacts.map((contact) => contact.contact).join(", "),
          // alternate_contact: row.contacts
          //   .map((contact) => contact.alternate_contact)
          //   .join(", "),
          // email: row.contacts.map((contact) => contact.email).join(", "),
          // alternate_email: row.contacts
          //   .map((contact) => contact.alternate_email)
          //   .join(", "),
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

  useEffect(() => {
    getAllSellerAccountsDetails();
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

  useEffect(() => {
    getAllCompanyDetails(currentPage, statusFilter, filterSelectedQuery);
  }, [currentPage, statusFilter, filterSelectedQuery, getAllCompanyDetails]);

  const getAllCompanyDetails = useCallback(
    async (
      page,
      statusValue = statusFilter,
      assignToValue = filterSelectedQuery,
      searchValue = searchQuery
    ) => {
      try {
        setOpen(true);

        const response = await CustomerServices.getAllCustomerData(
          statusValue,
          page,
          assignToValue,
          searchValue
        );

        setCompanyData(response.data.results);
        setpageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.log("error", error);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    getAllCompanyDetails(
      currentPage,
      statusFilter,
      filterSelectedQuery,
      searchQuery
    );
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
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

  const Tabledata = companyData.map((value) => ({
    id: value.id,
    name: value.name,
    assigned_to: value.assigned_to,
    pan_number: value.pan_number,
    gst_number: value.gst_number,
    city: value.city,
    state: value.state,
    status: value.status,
  }));

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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Autocomplete
                  disabled={!isStatusFilterEnabled} // Disable based on user group
                  size="small"
                  sx={{ minWidth: 300 }}
                  options={["Active", "Closed", "Blacklist"]}
                  getOptionLabel={(option) => option}
                  value={statusFilter}
                  onChange={(event, newValue) => {
                    setStatusFilter(newValue);
                    getAllCompanyDetails(
                      currentPage,
                      newValue,
                      filterSelectedQuery,
                      searchQuery
                    );
                  }}
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Filter By Status" />
                  )}
                />
              </Grid>
              {!userData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    size="small"
                    sx={{ minWidth: 300 }}
                    value={filterSelectedQuery}
                    onChange={(event, newValue) => {
                      setFilterSelectedQuery(newValue);
                      getAllCompanyDetails(
                        currentPage,
                        statusFilter,
                        newValue,
                        searchQuery
                      );
                    }}
                    options={assigned.map((option) => option.email)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Filter By Sales Person"
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch} // Call `handleSearch` when the button is clicked
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    getAllCompanyDetails(
                      1,
                      statusFilter,
                      filterSelectedQuery,
                      ""
                    );
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                {/* Bulk Assign Button */}
                {userData.is_staff === true && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                  >
                    Assign Bulk Customer
                  </Button>
                )}
                {/* Add Button */}
                {userData.groups.includes("Accounts") && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenPopup2(true)}
                  >
                    Add
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} sm={3}>
                {/* Customer Header */}
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer
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
                        onClick={() => openInPopup(row)}
                      >
                        View,
                      </Button>
                      {!userData.groups.includes(
                        "Accounts Billing Department"
                      ) && (
                        <Button
                          sx={{ color: "#28a745" }}
                          onClick={() => openInPopup2(row)}
                        >
                          PI,
                        </Button>
                      )}
                      <Button
                        sx={{ color: "#5e35b1" }}
                        onClick={() => openInPopup3(row)}
                      >
                        Activity,
                      </Button>
                      {row.is_potential_completed === false && (
                        <Button
                          sx={{ color: "#eb5042" }}
                          onClick={() => openInPopup4(row)}
                        >
                          Potential
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 1, // adjust padding as needed
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 1, // adjust padding as needed
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& > td, & > th": {
    padding: 0, // adjust padding as needed
  },
}));
