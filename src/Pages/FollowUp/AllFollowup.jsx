import React, { useState, useEffect, useCallback } from "react";
import { Grid, Paper, Box, Button } from "@mui/material";
import LeadServices from "../../services/LeadService";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomTextField from "../../Components/CustomTextField";
import { UpdateCompanyDetails } from "../Cutomers/CompanyDetails/UpdateCompanyDetails";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const AllFollowup = () => {
  const [open, setOpen] = useState(false);
  const [allFollowupData, setAllFollowupData] = useState([]);
  const [popupLead, setPopupLead] = useState(false);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // Get the current date
  const currentDate = new Date();
  // Set the initial startDate to the first day of the current month
  const initialStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  // Set the initial endDate to the last day of the current month
  const initialEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const [selectedDate, setSelectedDate] = useState("This Month");
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startDate, setStartDate] = useState(initialStartDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [filterBySalesperson, setFilterBySalesperson] = useState("");
  const [filterByActivity, setFilterByActivity] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.sales_users || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const openInPopup = async (item) => {
    try {
      setOpen(true);
      if (item.lead !== null) {
        setLeadsByID(item.lead);
        setPopupLead(true);
      }
      if (item.company !== null) {
        setLeadsByID(item.company);
        setPopupCustomer(true);
      }
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const handleStartDateChange = (event) => {
    try {
      setOpen(true);
      const date = new Date(event.target.value);
      setStartDate(date);
      setEndDate(new Date());
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const handleEndDateChange = (event) => {
    try {
      setOpen(true);
      const date = new Date(event.target.value);
      setEndDate(date);
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleChange = (value) => {
    const selectedValue = value;

    setSelectedDate(selectedValue);
    setCurrentPage(1);
    if (selectedValue === "Today") {
      const today = new Date();
      setEndDate(today);
      setStartDate(today);
    } else if (selectedValue === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setEndDate(yesterday);
      setStartDate(yesterday);
    } else if (selectedValue === "Last 7 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last 30 Days") {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "This Month") {
      const endDate = new Date();
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last Month") {
      const endDate = new Date();
      endDate.setDate(0);
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Custom Date") {
      // Handle custom date logic, for example:
      setStartDate(new Date());
      setEndDate(new Date());
      setOpenPopup2(true);
    }
  };

  useEffect(() => {
    getFollowUp();
  }, [currentPage, filterBySalesperson, filterByActivity]);

  const getFollowUp = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await LeadServices.getAllFollowUp(
        StartDate,
        EndDate,
        currentPage,
        filterBySalesperson,
        filterByActivity
      );
      setAllFollowupData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterBySalesperson, filterByActivity]);

  const handleSalesPersonFilterChange = (filterSelectedValue) => {
    setFilterBySalesperson(filterSelectedValue);
    setCurrentPage(1);
  };

  const handleActivityFilterChange = (filterSelectedValue) => {
    setFilterByActivity(filterSelectedValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tabledata = allFollowupData.map((row, i) => ({
    id: row.id,
    lead: row.leads,
    name: row.name,
    company: row.company,
    company_name: row.company_name,
    user: row.email,

    current_date: moment(row.current_date ? row.current_date : "-").format(
      "DD/MM/YYYY h:mm:ss"
    ),
    next_followup_date: moment(
      row.next_followup_date ? row.next_followup_date : "-"
    ).format("DD/MM/YYYY h:mm:ss"),
    notes: row.notes,
  }));

  const Tableheaders = [
    "ID",
    "LEADS",
    "NAME",
    "COMPANY",
    "COMPANY NAME",
    "USER",
    "CURRENT DATE",
    "NEXT FOLLOWUP DATE",
    "NOTE",
    "ACTION",
  ];

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      {/* Overdue FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <CustomAutocomplete
              size="small"
              sx={{ width: 300 }}
              value={selectedDate}
              onChange={(event, value) => handleChange(value)}
              options={DateOptions.map((option) => option.value)}
              getOptionLabel={(option) => option}
              label="Date"
            />

            <CustomAutocomplete
              size="small"
              sx={{ width: 300 }}
              onChange={(event, value) => handleSalesPersonFilterChange(value)}
              value={filterBySalesperson}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              label="Filter By Sales Person"
            />

            <CustomAutocomplete
              size="small"
              sx={{ width: 300 }}
              onChange={(event, value) => handleActivityFilterChange(value)}
              value={filterByActivity}
              options={ActivityOption.map((option) => option.label)}
              getOptionLabel={(option) => option}
              label="Filter By Activity"
            />
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
              All Followup
            </h3>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={popupLead}
        setOpenPopup={setPopupLead}
      >
        <UpdateLeads
          leadsByID={leadsByID}
          setOpenPopup={setPopupLead}
          getAllleadsData={getFollowUp}
          currentPage={currentPage}
          filterQuery={filterBySalesperson}
          filterSelectedQuery={filterByActivity}
          searchQuery={null}
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
          recordForEdit={leadsByID}
        />
      </Popup>
      <Popup
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
        title="Date Filter"
        maxWidth="md"
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            margin: "10px",
            padding: "20px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="Start Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                min={minDate}
                max={maxDate}
                onChange={handleStartDateChange}
              />
            </Grid>
            <Grid item xs={5} sm={5} md={5} lg={5}>
              <CustomTextField
                fullWidth
                label="End Date"
                variant="outlined"
                size="small"
                type="date"
                id="end-date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                min={
                  startDate ? startDate.toISOString().split("T")[0] : minDate
                }
                max={maxDate}
                onChange={handleEndDateChange}
                disabled={!startDate}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetData}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popup>
    </>
  );
};

const ActivityOption = [
  {
    id: 1,
    value: "Not answering/busy/disconnecting",
    label: "Not answering/busy/disconnecting",
  },

  {
    id: 2,
    value: "Having stock",
    label: "Having stock",
  },
  {
    id: 3,
    value: "Rate issue",
    label: "Rate issue",
  },
  {
    id: 4,
    value: "Send detail on whatsapp/sms/email",
    label: "Send detail on whatsapp/sms/email",
  },
  {
    id: 5,
    value: "Not buying from us due to product range",
    label: "Not buying from us due to product range",
  },
  {
    id: 6,
    value: "Dealing in other brand",
    label: "Dealing in other brand",
  },
  {
    id: 7,
    value: "Buying a different product from other company",
    label: "Buying a different product from other company",
  },
  {
    id: 8,
    value: "Size or quantity is unavailabe with us",
    label: "Size or quantity is unavailabe with us",
  },
  {
    id: 9,
    value: "Transportation cost issue",
    label: "Transportation cost issue",
  },
  {
    id: 10,
    value: "Required without bill",
    label: "Required without bill",
  },
  {
    id: 11,
    value: "Call me back",
    label: "Call me back",
  },
  {
    id: 12,
    value: "Send sample",
    label: "Send sample",
  },
  {
    id: 13,
    value: "Not a decision maker",
    label: "Not a decision maker",
  },
  {
    id: 14,
    value: "Require own branding",
    label: "Require own branding",
  },
  {
    id: 15,
    value: "Small buyer, moved to dealer/distributor",
    label: "Small buyer, moved to dealer/distributor",
  },
  {
    id: 16,
    value: "Require exclusive distributorship/dealership",
    label: "Require exclusive distributorship/dealership",
  },
  {
    id: 17,
    value: "Quality issue",
    label: "Quality issue",
  },
  {
    id: 18,
    value: "Small buyer, no dealer/distributor in that area",
    label: "Small buyer, no dealer/distributor in that area",
  },
  {
    id: 19,
    value: "Require credit",
    label: "Require credit",
  },
  {
    id: 20,
    value: "Wrong number",
    label: "Wrong number",
  },
  {
    id: 21,
    value: "Company shut down",
    label: "Company shut down",
  },
  {
    id: 22,
    value: "Order taken",
    label: "Order taken",
  },
  {
    id: 23,
    value: "Stock lot",
    label: "Stock lot",
  },
  {
    id: 24,
    value: "One time requirement",
    label: "One time requirement",
  },
  {
    id: 25,
    value: "Drop the lead",
    label: "Drop the lead",
  },
];

const DateOptions = [
  {
    value: "Today",
  },
  {
    value: "Yesterday",
  },
  {
    value: "Last 7 Days",
  },
  {
    value: "Last 30 Days",
  },
  {
    value: "This Month",
  },
  {
    value: "Last Month",
  },
  {
    value: "Custom Date",
  },
];
