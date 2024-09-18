import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { DesignationCreate } from "./DesignationCreate";
import { DesignationUpdate } from "./DesignationUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomTextField from "../../../Components/CustomTextField";

export const DesignationView = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [designations, setDesignations] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    getDesignationsDetails(currentPage);
  }, [currentPage, getDesignationsDetails]);

  const getDesignationsDetails = useCallback(
    async (page, query = searchQuery) => {
      try {
        setOpen(true);
        const response = await Hr.getDesignationsData(page, query);
        setDesignations(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching scripts", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const TableHeader = ["ID", "Department", "Designation", "Action"];
  let TableData = [];

  if (Array.isArray(designations)) {
    TableData = designations.map((designation) => ({
      id: designation.id,
      department: designation.department,
      name: designation.designation,
    }));
  }

  return (
    <>
      <CustomLoader open={open} />
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
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    getDesignationsDetails(currentPage, searchQuery)
                  }
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getDesignationsDetails(1, "");
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  onClick={() => setOpenCreatePopup(true)}
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Add
                </Button>
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
              Designations
            </h3>
          </Box>

          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleEdit}
          />

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <Popup
            title="Add New Designation"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <DesignationCreate
              setOpenCreatePopup={setOpenCreatePopup}
              getDesignationsDetails={getDesignationsDetails}
            />
          </Popup>
          <Popup
            title="Edit Designation"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <DesignationUpdate
              designationId={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              getDesignationsDetails={getDesignationsDetails}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
