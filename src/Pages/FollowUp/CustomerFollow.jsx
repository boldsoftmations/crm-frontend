import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { UpdateCompanyDetails } from "../Cutomers/CompanyDetails/UpdateCompanyDetails";
import LeadServices from "../../services/LeadService";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import CustomDate from "../../Components/CustomDate";

export const CustomerFollowup = () => {
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [open, setOpen] = useState(false);
  // const [pendingFollowUpByID, setPendingFollowUpByID] = useState("");
  // const [openModal, setOpenModal] = useState(false);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [filterFollowup, setFilterFollowup] = useState();
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.active_sales_user || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setPendingFollowUp([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getFollowUp();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  useEffect(() => {
    getFollowUp();
  }, [currentPage, filterSelectedQuery, filterFollowup, startDate, endDate]);

  const getFollowUp = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await LeadServices.getCustomerFollowup(
        filterFollowup ? filterFollowup : "today_followup",
        currentPage,
        filterSelectedQuery,
        StartDate,
        EndDate
      );
      setPendingFollowUp(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSelectedQuery, filterFollowup, startDate, endDate]);

  const handleFilterChange = (filterSelectedValue) => {
    setFilterSelectedQuery(filterSelectedValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const openInPopup = (item) => {
    setCustomerId(item.id); // Set lead data
    setSelectedCustomers(item);
    setPopupCustomer(true); // Open the leads popup
  };

  const Tabledata = Array.isArray(pendingFollowUp)
    ? pendingFollowUp.map((row, i) => ({
        id: row.company_id,
        company: row.company,
        created_by_email: row.created_by_email,
        activity_name: row.activity_name,
        status: row.status,
        duration: row.duration,
        current_date: moment(
          row.creation_date ? row.creation_date : "-"
        ).format("DD/MM/YYYY h:mm:ss"),
        next_followup_date: moment(
          row.next_followup_date ? row.next_followup_date : "-"
        ).format("DD/MM/YYYY h:mm:ss"),
        notes: row.notes,
      }))
    : [];

  const Tableheaders = [
    "ID",
    "COMPANY",
    "NAME",
    "ACTIVITY",
    "CALL STATUS",
    "CALL DURATION",
    "CREATION DATE",
    "NEXT FOLLOWUP",
    "NOTE",
    "ACTION",
  ];

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
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

      {/* Pending FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" gap={4} spacing={2}>
            {(userData.groups.includes("Director") ||
              userData.groups.includes("Sales Maneger") ||
              userData.groups.includes("Customer Relationship Manager") ||
              userData.groups.includes("Business Development Manager")) && (
              <Box display="flex" marginBottom="10px">
                <CustomAutocomplete
                  size="small"
                  sx={{ width: 300 }}
                  onChange={(event, value) => handleFilterChange(value)}
                  value={filterSelectedQuery}
                  options={assigned.map((option) => option.email)}
                  getOptionLabel={(option) => option}
                  label="Filter By Sales Person"
                />
              </Box>
            )}
            <Box display="flex" marginBottom="10px">
              <CustomAutocomplete
                size="small"
                sx={{ width: 300 }}
                onChange={(event, data) => {
                  if (data && data.value === "custom_date") {
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setFilterFollowup("");
                    setCustomDataPopup(true);
                  } else {
                    setFilterFollowup(data ? data.value : null);
                    setStartDate(null);
                    setEndDate(null);
                  }
                }}
                value={
                  followupOptions.find(
                    (option) => option.value === filterFollowup
                  ) || "today_followup"
                } // Match the value with options
                options={followupOptions}
                getOptionLabel={(option) => option.label || "Today Followup"}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value || "Today Followup"
                } // Ensure equality check works
                label="Filter By Follow-up"
              />
            </Box>
          </Box>
          <Box display="flex" justifyContent={"center"}>
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Customer Followup
            </h3>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        openPopup={customDataPopup}
        setOpenPopup={setCustomDataPopup}
        title="Date Filter"
        maxWidth="md"
      >
        <CustomDate
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          resetDate={getResetDate}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update customer"}
        openPopup={popupCustomer}
        setOpenPopup={setPopupCustomer}
      >
        <UpdateCompanyDetails
          setOpenPopup={setPopupCustomer}
          getAllCompanyDetails={getFollowUp}
          recordForEdit={customerId}
          selectedCustomers={selectedCustomers}
        />
      </Popup>
    </>
  );
};

const followupOptions = [
  {
    value: "today_followup",
    label: "Today Followup",
  },
  {
    value: "overdue_followup",
    label: "Overdue Followup",
  },
  {
    value: "upcoming_followup",
    label: "Upcoming Followup",
  },
  {
    value: "all_followup",
    label: "All Followup",
  },
  { label: "Custom Date", value: "custom_date" },
];
