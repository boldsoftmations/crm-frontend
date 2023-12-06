import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { ApplicantListCreate } from "./ApplicantListCreate";
import { ApplicantListUpdate } from "./ApplicantListUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";

export const ApplicantListView = () => {
  const [applicants, setApplicants] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const fetchApplicants = async () => {
    try {
      const response = await Hr.getApplicants();
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const addNewApplicant = async (newApplicant) => {
    try {
      await Hr.addApplicant(newApplicant);
      fetchApplicants();
      setOpenCreatePopup(false);
    } catch (error) {
      console.error("Error adding applicant:", error);
    }
  };

  const updateApplicant = async (id, updates) => {
    try {
      await Hr.updateApplicant(id, updates);
      fetchApplicants();
      setOpenUpdatePopup(false);
    } catch (error) {
      console.error("Error updating applicant:", error);
    }
  };

  const handleApplicantAdded = () => {
    fetchApplicants();
    setOpenCreatePopup(false);
  };
  const handleApplicantUpdated = () => {
    fetchApplicants();
    setOpenUpdatePopup(false);
  };

  const TableHeader = [
    "ID",
    "Candidate Name",
    "Phone Number",
    "Email",
    "Designation",
    "Source",
    "Shortlisted",
    "Action",
  ];
  const TableData = applicants.map((applicant) => ({
    id: applicant.id,
    name: applicant.name,
    contact: applicant.contact,
    email: applicant.email,
    designation: applicant.designation,
    source: applicant.source,
    shortlisted: applicant.shortlisted,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Applicant List
            </h3>
          </Box>
          {/* <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddApplicantClick}
              >
                Add
              </Button>
            </Grid>
          </Grid> */}
          <Paper sx={{ p: 2, m: 3 }}>
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={openInPopup}
            />
          </Paper>
          <Popup
            title="Add New Applicant"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <ApplicantListCreate
              addNewApplicant={addNewApplicant}
              onApplicantAdded={handleApplicantAdded}
            />
          </Popup>
          <Popup
            title="Edit Applicant"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <ApplicantListUpdate
              recordForEdit={recordForEdit}
              updateApplicant={updateApplicant}
              onApplicantUpdated={handleApplicantUpdated}
            />
          </Popup>
        </Box>
      </Paper>
    </Grid>
  );
};
