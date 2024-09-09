import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { UpdateCompanyDetails } from "../Cutomers/CompanyDetails/UpdateCompanyDetails";
import { FollowupDone } from "./FollowupDone";
import LeadServices from "../../services/LeadService";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";

export const PendingFollowup = () => {
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [open, setOpen] = useState(false);
  const [pendingFollowUpByID, setPendingFollowUpByID] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [popupLead, setPopupLead] = useState(false);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.sales_users || [];
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
  }, [currentPage, filterSelectedQuery]);

  const getFollowUp = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getFollowUp(
        "overdue_followup",
        currentPage,
        filterSelectedQuery
      );
      setPendingFollowUp(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSelectedQuery]);

  const handleFilterChange = (filterSelectedValue) => {
    setFilterSelectedQuery(filterSelectedValue);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const openInPopup = async (item) => {
    try {
      setOpen(true);
      if (item.type === "lead" && item.lead) {
        setLeadsByID(item.lead); // Set lead data
        setPopupLead(true); // Open the leads popup
      } else if (item.type === "customer" && item.company) {
        setCustomerId(item.company); // Set company data
        setPopupCustomer(true); // Open the company popup
      } else {
        console.warn("Unhandled item type or missing ID:", item.type);
      }
    } catch (err) {
      console.error("Error in openInPopup:", err);
    } finally {
      setOpen(false);
    }
  };

  const openInPopup2 = (item) => {
    const matchedFollowup = pendingFollowUp.find(
      (followup) => followup.leads === item.lead
    );
    setPendingFollowUpByID(matchedFollowup);
    setOpenModal(true);
  };

  const Tabledata = Array.isArray(pendingFollowUp)
    ? pendingFollowUp.map((row, i) => ({
        type: row.type,
        lead: row.leads,
        company: row.company,
        company_name: row.company_name,
        name: row.name,
        user: row.user,
        current_date: moment(row.current_date ? row.current_date : "-").format(
          "DD/MM/YYYY h:mm:ss"
        ),
        next_followup_date: moment(
          row.next_followup_date ? row.next_followup_date : "-"
        ).format("DD/MM/YYYY h:mm:ss"),
        notes: row.notes,
      }))
    : [];

  const Tableheaders = [
    "TYPE",
    "LEADS",
    "COMPANY",
    "COMPANY NAME",
    "NAME",
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
          {!userData.groups.includes("Sales Executive") && (
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
              Overdue Followup
            </h3>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            ButtonText={"Done"}
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
          filterQuery={null}
          filterSelectedQuery={filterSelectedQuery}
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
          recordForEdit={customerId}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Followup Done"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <FollowupDone
          DoneFollowup={pendingFollowUpByID}
          getFollowUp={getFollowUp}
          setOpenModal={setOpenModal}
        />
      </Popup>
    </>
  );
};
