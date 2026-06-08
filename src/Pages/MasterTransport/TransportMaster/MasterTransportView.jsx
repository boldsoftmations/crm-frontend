import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useSelector } from "react-redux";

import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";

import MasterService from "../../../services/MasterService";
import MasterTransportCreate from "./MasterTransportCreate";
import MasterTransportUpdate from "./MasterTransportUpdate";

export const MasterTransportView = () => {
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // false = Active records, true = Inactive records
  const [isInactiveFilter, setIsInactiveFilter] = useState(false);

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) => {
    if (!userData || !userData.groups || !Array.isArray(userData.groups)) {
      return false;
    }
    return groups.some((group) => userData.groups.includes(group));
  };

  const tableHeader = [
    "ID",
    "CREATED BY",
    "UPDATED BY",
    "TRANSPORTER TYPE",
    "TRANSPORTER NAME",
    "CREATION DATE",
    "UPDATED DATE",
    "IS INACTIVE",
    "ACTION",
  ];

  const getTransportData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await MasterService.getAllTransportMaster(
        currentPage,

        isInactiveFilter, // pass filter to service
        searchQuery, // pass search query to service
      );

      if (response && response.data && response.data.results) {
        setTransportData(response.data.results);
        console.log("Data:", response.data.results);
      } else {
        setTransportData([]);
      }

      if (response && response.data && response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 25));
      } else {
        setTotalPages(0);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, isInactiveFilter, handleError]);

  useEffect(() => {
    getTransportData();
  }, [getTransportData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event, newValue) => {
    // Prevent deselecting both buttons — keep at least one active
    if (newValue !== null) {
      // newValue is boolean: false = Active, true = Inactive
      setIsInactiveFilter(newValue);
      setCurrentPage(1);
    }
  };

  const openInPopup = (item) => {
    const selectedData = transportData.find((data) => data.id === item.id);
    setRecordForEdit(selectedData || null);
    setOpenUpdatePopup(true);
  };

  const tableData = transportData.map((value) => ({
    id: value.id,
    created_by: value.created_by,
    updated_by: value.updated_by,
    transporter_type: value.transporter_type,
    transporter_name: value.transporter_name,
    creation_date: value.creation_date,
    updated_date: value.updated_date,
    is_inactive: value.is_inactive ? "Yes" : "No",
  }));

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <CustomLoader open={loading} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              p: 2,
              gap: 2,
            }}
          >
            <Box sx={{ flexGrow: 1, flexBasis: "20%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Transporter Names
              </h3>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                flexBasis: "20%",
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenCreatePopup(true)}
                disabled={isInGroups("Operations & Supply Chain Manager")}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", px: 2, pb: 1 }}
          >
            <ToggleButtonGroup
              value={isInactiveFilter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              color="primary"
            >
              <ToggleButton value={false}>Active</ToggleButton>
              <ToggleButton value={true}>Inactive</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <CustomTable
            headers={tableHeader}
            data={tableData}
            openInPopup={openInPopup}
          />

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      <Popup
        maxWidth="xl"
        title="Create Transporter"
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <MasterTransportCreate
          getTransportData={getTransportData}
          setOpenPopup={setOpenCreatePopup}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>

      <Popup
        maxWidth="xl"
        title="Update Transporter"
        openPopup={openUpdatePopup}
        setOpenPopup={setOpenUpdatePopup}
      >
        <MasterTransportUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenUpdatePopup}
          getTransportData={getTransportData}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
