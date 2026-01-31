import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
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
import { getSellerAccountData } from "../../../Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { AllProformaInvoiceView } from "./AllProformaInvoiceView";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSelect from "../../../Components/CustomSelect";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import UpdateProformaInvoice from "./UpdateProformaInvoice";

export const AllProformaInvoice = () => {
  const dispatch = useDispatch();
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
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
  const assigned = users.active_sales_user || [];
  const [endDate, setEndDate] = useState(new Date()); // set endDate as one week ahead of startDate
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  const [startDate, setStartDate] = useState(getFirstDayOfMonth(new Date()));
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
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

  const userData = useSelector((state) => state.auth.profile);
  const isInGroups = (...groups) => {
    return groups.some((group) => userData.groups.includes(group));
  };

  const AssignedOptions = assigned.map((user) => ({
    label: user.name,
    value: user.email,
  }));

  const handleSelectChange = (value) => {
    const today = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();
    setSelectedTimeRange(value);
    switch (value) {
      case "yearly":
        newStartDate = new Date(today.getFullYear(), 0, 1);
        newEndDate = new Date(today.getFullYear(), 11, 31);
        break;
      case "monthly":
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "weekly":
        const firstDayOfWeek = today.getDate() - today.getDay();
        newStartDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          firstDayOfWeek,
        );
        newEndDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          firstDayOfWeek + 6,
        );
        break;
      case "today":
        newStartDate = new Date();
        newEndDate = new Date();
        break;
      case "last year":
        newStartDate = new Date(today.getFullYear() - 1, 0, 1);
        newEndDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        newStartDate = new Date();
        newEndDate = new Date();
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };
  const openInPopup2 = (item) => {
    setIDForEdit(item);
    setOpenPopup3(true);
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response =
        await InvoiceServices.getAllPaginateSellerAccountData("all");
      dispatch(getSellerAccountData(response.data));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getProformaInvoiceData = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await InvoiceServices.getAllPIWithDateRange(
        StartDate,
        EndDate,
        "all",
        currentPage,
        filterType,
        filterValue,
        searchValue,
      );
      setInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [startDate, currentPage, filterType, filterValue, searchValue]);

  useEffect(() => {
    getProformaInvoiceData();
  }, [startDate, currentPage, filterType, filterValue, searchValue]);

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
    raised_by: row.raised_by,
    customer: row.name_of_party,
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
  const allowedGroups = [
    "Sales Manager(Retailer)",
    "Director",
    "Sales Manager",
  ];
  console.log(userData);

  const isAllowed = allowedGroups.some(isInGroups);
  console.log(isAllowed);
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
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  options={[
                    "yearly",
                    "monthly",
                    "weekly",
                    "today",
                    "last year",
                  ]}
                  value={selectedTimeRange}
                  onChange={(event, value) => handleSelectChange(value)}
                  label="Sort By"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomSelect
                  label="Filter By"
                  options={FilterOptions}
                  value={filterType}
                  onChange={handleFilterType}
                  onClear={clearFilterType}
                />
              </Grid>
              {filterType === "status" && (
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
                  <CustomSelect
                    label="Type"
                    options={TypeOptions}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    onClear={clearFilterValue}
                  />
                </Grid>
              )}
              {filterType === "raised_by__email" &&
                !users.groups.includes("Sales Executive") && (
                  <Grid item xs={12} sm={3}>
                    <CustomSelect
                      label="Sales Person"
                      options={AssignedOptions}
                      value={filterValue}
                      onChange={handleFilterValueChange}
                      onClear={clearFilterValue}
                    />
                  </Grid>
                )}
              <Grid item xs={12} sm={3}>
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
              All PI
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
                      {row.raised_by}
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

                        <Button
                          style={{ fontSize: "12px" }}
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => openInPopup2(row)}
                          disabled={!isAllowed}
                        >
                          Update
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
        fullScreen={true}
        title={"View Proforma Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <AllProformaInvoiceView
          idForEdit={idForEdit}
          getProformaInvoiceData={getProformaInvoiceData}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Proforma Invoice"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <UpdateProformaInvoice
          idForEdit={idForEdit}
          getProformaInvoiceData={getProformaInvoiceData}
          setOpenPopup={setOpenPopup3}
        />
      </Popup>
    </>
  );
};
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

const StatusOptions = [
  { label: "Raised", value: "raised" },
  { label: "Price Approval", value: "price_approval" },
  { label: "Pending Approval", value: "pending_approval" },
  { label: "Approved", value: "approved" },
  { label: "Partially Paid", value: "partially_paid" },
  { label: "Fully Paid", value: "fully_paid" },
  { label: "Credit", value: "credit" },
  { label: "Dropped", value: "dropped" },
];

const TypeOptions = [
  { label: "Customer", value: "customer" },
  { label: "Lead", value: "lead" },
];
