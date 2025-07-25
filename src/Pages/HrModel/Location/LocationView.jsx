import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "../../../services/Hr";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import { LocationCreate } from "./LocationCreate";
import { UpdateLocation } from "./UpdateLocation";
import { CustomPagination } from "../../../Components/CustomPagination";

export const LocationView = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [locationName, setLocationName] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(false);

  const fetchLocation = async () => {
    try {
      setOpen(true);
      const response = await Hr.getLocation(currentPage, searchQuery);
      setLocationName(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      console.error("Failed to fetch locationName", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleReset = () => {
    setSearchQuery("");
    fetchLocation();
  };

  const handleEdit = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const TableHeader = ["ID", "Location", "Action"];
  const TableData = locationName.map((location) => ({
    id: location.id,
    name: location.name,
  }));

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
                  onClick={() => fetchLocation(searchQuery)}
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleReset}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  onClick={() => setOpenCreatePopup(true)}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center">
            <h3
              style={{
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Location
            </h3>
          </Box>
          <Paper sx={{ p: 2 }}>
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={handleEdit}
            />
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </Paper>
          <Popup
            title="Add New Location"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <LocationCreate
              fetchLocation={fetchLocation}
              setOpenCreatePopup={setOpenCreatePopup}
            />
          </Popup>

          <Popup
            title="Edit location"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <UpdateLocation
              LocationId={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              fetchLocation={fetchLocation}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
