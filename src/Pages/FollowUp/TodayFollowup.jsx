import React, { useEffect, useState } from "react";
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

export const TodayFollowup = () => {
  const [todayFollowUp, setTodayFollowUp] = useState([]);
  const [open, setOpen] = useState(false);
  const [todayFollowUpById, setTodayFollowUpById] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [popupLead, setPopupLead] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupCustomer, setPopupCustomer] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.sales_users || [];
  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setTodayFollowUp([]);
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
    setCurrentPage(1);
    getFollowUp(1, filterSelectedValue);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
    getFollowUp(value, filterSelectedQuery);
  };

  useEffect(() => {
    getFollowUp(currentPage, filterSelectedQuery);
  }, [currentPage, filterSelectedQuery]);

  const getFollowUp = async (page = 1, filterValue = "") => {
    try {
      setOpen(true);
      const response = await LeadServices.getAllFollowUp({
        typeValue: "today_followup",
        page,
        assignToFilter: filterValue,
      });

      setTodayFollowUp(response.data.results);
      setPageCount(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (err) {
      console.error("Error fetching follow up data:", err);
      setOpen(false);
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
    const matchedFollowup = todayFollowUp.find(
      (followup) => followup.leads === item.lead
    );
    setTodayFollowUpById(matchedFollowup);
    setOpenModal(true);
  };

  const Tabledata = todayFollowUp.map((row, i) => ({
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

      {/* Today FollowUp */}
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
              Today Followup
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
          <CustomPagination
            key={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
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
          DoneFollowup={todayFollowUpById}
          getFollowUp={getFollowUp}
          setOpenModal={setOpenModal}
        />
      </Popup>
    </>
  );
};
