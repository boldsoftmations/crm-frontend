import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { ApplicantListCreate } from "./ApplicantListCreate";
import { ApplicantListUpdate } from "./ApplicantListUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";

export const ApplicantListView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const fetchApplicants = async (page = 0, searchValue = "") => {
    try {
      const response = await Hr.getApplicants(page, searchValue);
      setApplicants(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchApplicants(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const filteredApplicants = applicants.filter((applicant) => {
    const name = applicant.name ? applicant.name.toLowerCase() : "";
    const job = applicant.job ? applicant.job.toLowerCase() : "";
    const email = applicant.email ? applicant.email.toLowerCase() : "";
    const searchLower = searchQuery.toLowerCase();

    return (
      job.includes(searchLower) ||
      email.includes(searchLower) ||
      name.includes(searchLower)
    );
  });

  const addNewApplicant = async (newApplicant) => {
    try {
      setIsLoading(true);
      await Hr.addApplicant(newApplicant);
      fetchApplicants();
      setOpenCreatePopup(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding applicant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicant = async (id, updates) => {
    try {
      setIsLoading(true);
      await Hr.updateApplicant(id, updates);
      fetchApplicants();
      setOpenUpdatePopup(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating applicant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
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
    "Job ID",
    "Candidate Name",
    "Phone Number",
    "Email",
    "Designation",
    "Source",
    "Shortlisted",
    "Action",
  ];

  const TableData = filteredApplicants.map((applicant) => ({
    id: applicant.id,
    job: applicant.job,
    name: applicant.name,
    contact: applicant.contact,
    email: applicant.email,
    designation: applicant.designation,
    source: applicant.source,
    shortlisted: applicant.shortlisted,
  }));

  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={6}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
            </Grid>
          </Box>
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

          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
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
        </Paper>
      </Grid>
    </>
  );
};
