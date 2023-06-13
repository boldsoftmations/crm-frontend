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
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
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

export const UnApprovedPi = () => {
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
  const [currentPage, setCurrentPage] = useState(0);
  const data = useSelector((state) => state.auth);
  const users = data.profile;

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

  const getResetData = () => {
    setSearchValue("");
    setStatusValue("");
    setTypeValue("");
    setFilterType("");
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
      const response = currentPage
        ? await InvoiceServices.getAllPIPagination("unapproved", currentPage)
        : await InvoiceServices.getAllPIData("unapproved");
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
        const response = await InvoiceServices.getAllPISearch(
          "unapproved",
          filterType,
          filterValue,
          Search,
          searchValue
        );
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
      const Search = searchValue ? "search" : "";
      if (statusValue || typeValue || searchValue) {
        const response = await InvoiceServices.getAllPIPaginationWithFilterBy(
          "unapproved",
          "page",
          page,
          filterType,
          statusValue || typeValue,
          Search,
          searchValue
        );
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
      } else {
        const response = await InvoiceServices.getAllPIPagination(
          "unapproved",
          page
        );
        setInvoiceData(response.data.results);
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

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
            <TextField
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              name="search"
              size="small"
              placeholder="search"
              label="Search"
              variant="outlined"
              sx={{ marginLeft: "1em" }}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ marginLeft: "1em" }}
              onClick={handleSearchValue}
            >
              Search
            </Button>
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
              UnApproved PI
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
                        {row.total}
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
                        {(users.groups.toString() === "Sales" ||
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

const FilterOptions = [
  { label: "Status", value: "status" },
  { label: "Type", value: "type" },
];

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
