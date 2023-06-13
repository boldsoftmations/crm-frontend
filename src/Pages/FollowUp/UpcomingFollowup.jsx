import React, { useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import moment from "moment";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { UpdateCompanyDetails } from "../Cutomers/CompanyDetails/UpdateCompanyDetails";
import { FollowupDone } from "./FollowupDone";

export const UpcomingFollowup = (props) => {
  const {
    assigned,
    descriptionMenuData,
    product,
    upcomingFollowUp,
    getFollowUp,
  } = props;

  const [open, setOpen] = useState(false);
  const [upcomingFollowUpByID, setUpcomingFollowUpByID] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [popupLead, setPopupLead] = useState(false);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);

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
    const matchedFollowup = upcomingFollowUp.find(
      (followup) => followup.leads === item.lead
    );
    setUpcomingFollowUpByID(matchedFollowup);
    setOpenModal(true);
  };

  const Tabledata = upcomingFollowUp.map((row, i) => ({
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
      <CustomLoader open={open} />

      {/* Upcoming FollowUp */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
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
              Upcoming Followup
            </h3>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            openInPopup4={null}
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
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          leadsByID={leadsByID}
          product={product}
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
          product={product}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Followup Done"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <FollowupDone
          DoneFollowup={upcomingFollowUpByID}
          getFollowUp={getFollowUp}
          setOpenModal={setOpenModal}
        />
      </Popup>
    </>
  );
};
