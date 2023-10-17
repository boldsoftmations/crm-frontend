import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Autocomplete } from "@mui/material";
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
import CustomTextField from "../../Components/CustomTextField";

export const PendingFollowup = ({ product }) => {
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [open, setOpen] = useState(false);
  const [pendingFollowUpByID, setPendingFollowUpByID] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [popupLead, setPopupLead] = useState(false);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.sales_users || [];
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

  const handleFilterChange = (filterSelectedValue) => {
    setFilterSelectedQuery(filterSelectedValue);
    getFollowUp(filterSelectedValue);
  };

  useEffect(() => {
    getFollowUp();
  }, []);

  const getFollowUp = async (filterValue) => {
    try {
      setOpen(true);
      let response;
      if (filterValue) {
        response = await LeadServices.getAllFollowUp({
          typeValue: "overdue_followup",
          assignToFilter: filterValue,
        });
      } else {
        response = await LeadServices.getAllFollowUp({
          typeValue: "overdue_followup",
        });
      }

      setPendingFollowUp(response.data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("error followup", err);
    }
  };

  const openInPopup = async (item) => {
    try {
      setOpen(true);
      if (item.type === "lead") {
        setLeadsByID(item.lead);
        setPopupLead(true);
      } else {
        setLeadsByID(item.company);
        setPopupCustomer(true);
      }
      setOpen(false);
    } catch (err) {
      console.log("err", err);
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

  const Tabledata = pendingFollowUp.map((row, i) => ({
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
  }));

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

      {/* Pending FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          {!userData.groups.includes("Sales Executive") && (
            <Box display="flex" marginBottom="10px">
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
