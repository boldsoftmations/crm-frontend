import React, { useEffect, useState, useRef } from "react";

import { Grid, Paper, Box } from "@mui/material";
import LeadServices from "../../services/LeadService";
import moment from "moment";
import { Popup } from "./../../Components/Popup";
import { UpdateLeads } from "./../Leads/UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomTable } from "../../Components/CustomTable";
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
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [upcomingFollowUpByID, setUpcomingFollowUpByID] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [followup, setFollowup] = useState(null);

  const openInPopup = async (item) => {
    try {
      setOpen(true);
      const response = await LeadServices.getLeadsById(item.lead);
      setLeadsByID(response.data);
      setFollowup(response.data.followup);
      setOpenPopup(true);
      setOpen(false);
    } catch (err) {
      console.log("err", err);
      setOpen(false);
    }
  };

  const openInPopup2 = (item) => {
    const matchedFollowup = upcomingFollowUp.find(
      (followup) => followup.id === item.id
    );
    setUpcomingFollowUpByID(matchedFollowup);
    setOpenModal(true);
  };

  const Tabledata = upcomingFollowUp.map((row, i) => ({
    id: row.id,
    lead: row.lead,
    name: row.name,
    company: row.company,
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
    "ID",
    "LEADS",
    "NAME",
    "COMPANY",
    "USER",
    "CURRENT DATE",
    "NEXT FOLLOWUP DATE",
    "NOTE",
    "ACTION",
  ];

  return (
    <>
      <CustomLoader open={open} />
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

      {/* Upcoming FollowUp */}
      <Grid item xs={12}>
        <ErrorMessage ref={errRef} errMsg={errMsg} />
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
              Upcoming FollowUp
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
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          followup={followup}
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          leadsByID={leadsByID}
          product={product}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getFollowUp}
        />
      </Popup>
    </>
  );
};
