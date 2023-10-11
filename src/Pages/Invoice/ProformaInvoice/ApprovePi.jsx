import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Grid,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import InvoiceServices from "../../../services/InvoiceService";
import { Popup } from "../../../Components/Popup";
import { ProformaInvoiceView } from "./ProformaInvoiceView";
import { getSellerAccountData } from "../../../Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { UpdateCustomerProformaInvoice } from "./UpdateCustomerProformaInvoice";
import { CustomPagination } from "../../../Components/CustomPagination";
import { UpdateLeadsProformaInvoice } from "./UpdateLeadsProformaInvoice";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { CustomTable } from "../../../Components/CustomTable";

export const ApprovePi = () => {
  const dispatch = useDispatch();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [filterType, setFilterType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [assign, setAssign] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.sales_users || [];

  const FilterOptions = [
    { label: "Status", value: "status" },
    { label: "Type", value: "type" },
    ...(!users.groups.includes("Sales Executive")
      ? [{ label: "Sales Person", value: "raised_by__email" }]
      : []),
  ];

  const handleSearchValue = () => {
    setSearchValue(searchValue);
    getSearchData(statusValue || typeValue);
  };

  const handleStatusValue = (event) => {
    setStatusValue(event.target.value);
    getSearchData(event.target.value);
  };

  const handleTypeValue = (event) => {
    setTypeValue(event.target.value);
    getSearchData(event.target.value);
  };

  const handleAssignValue = (event) => {
    setAssign(event.target.value);
    getSearchData(event.target.value);
  };

  const getResetData = () => {
    setSearchValue("");
    setStatusValue("");
    setTypeValue("");
    setFilterType("");
    setAssign("");
    getProformaInvoiceData();
  };

  const getResetSearchData = () => {
    setSearchValue("");
    getProformaInvoiceData();
  };

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

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProformaInvoiceData();
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

  const getProformaInvoiceData = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPIData({
        piType: "unapproved",
        page: currentPage,
        filterType: filterType,
        filterValue: statusValue || typeValue || assign,
        searchValue: searchValue,
      });
      setInvoiceData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
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

  const getSearchData = async (filterValue) => {
    try {
      setOpen(true);
      const Search = searchValue ? "search" : "";
      if (filterValue || searchValue) {
        const response = await InvoiceServices.getAllPIData({
          piType: "unapproved",
          filterType: filterType,
          filterValue: filterValue,
          searchValue: searchValue,
        });
        if (response) {
          setInvoiceData(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getProformaInvoiceData();
          setSearchValue(null);
          setStatusValue(null);
          setTypeValue(null);
        }
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
      let response;
      if (statusValue || typeValue || searchValue) {
        response = await InvoiceServices.getAllPIData({
          piType: "unapproved",
          page: page,
          filterType: filterType,
          filterValue: statusValue || typeValue || assign,
          searchValue: searchValue,
        });
      } else {
        response = await InvoiceServices.getAllPIData({
          piType: "unapproved",
          page: page,
        });
      }
      if (response) {
        setInvoiceData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getProformaInvoiceData();
        setSearchValue(null);
        setStatusValue(null);
        setTypeValue(null);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tabledata = invoiceData.map((row, i) => ({
    type: row.type,
    pi_number: row.pi_number,
    generation_date: row.generation_date,
    raised_by: row.raised_by,
    customer: row.company_name,
    billing_city: row.billing_city,
    contact: row.contact,
    status: row.status,
    total: row.total,
    balance_amount: row.balance_amount,
    payment_terms: row.payment_terms,
  }));

  const Tableheaders = [
    "Type",
    "PI Numer",
    "PI Date",
    "Raised By",
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
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <FormControl fullWidth sx={{ maxWidth: "300px" }} size="small">
              <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="values"
                label="Fliter By"
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
              >
                {FilterOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {filterType === "status" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Status"
                  value={statusValue}
                  onChange={(event) => handleStatusValue(event)}
                >
                  {StatusOptions.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {filterType === "type" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Type"
                  value={typeValue}
                  onChange={(event) => handleTypeValue(event)}
                >
                  {TypeOptions.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {filterType === "raised_by__email" &&
              !users.groups.includes("Sales Executive") && (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By Sales Person
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Filter By Sales Person"
                    value={assign}
                    onChange={(event) => handleAssignValue(event)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {assigned.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            <CustomSearchWithButton
              filterSelectedQuery={searchValue}
              setFilterSelectedQuery={setSearchValue}
              handleInputChange={handleSearchValue}
              getResetData={getResetSearchData}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: "1em" }}
              onClick={getResetData}
            >
              Reset All
            </Button>
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
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
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
