import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";

import { Popup } from "../../Components/Popup";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";

import MasterService from "../../services/MasterService";
import MasterTransportCreate from "./TransportMaster/MasterTransportCreate";
import MasterTransportUpdate from "./TransportMaster/MasterTransportUpdate";
import {
  canCreateTransporter,
  canEditTransporterCore,
} from "../../utility/masterAccess";

// Show the transporter name and Open to every role with list access. Editing
// the transporter master record remains limited to core-edit roles.

export const TransporterList = ({ onOpenTransporter }) => {
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isInactiveFilter, setIsInactiveFilter] = useState(false);

  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const userData = useSelector((state) => state.auth.profile);

  const canCreate = canCreateTransporter(userData);
  const canEditCore = canEditTransporterCore(userData);

  const getTransportData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MasterService.getAllTransportMaster(
        currentPage,
        isInactiveFilter,
        searchQuery,
      );

      if (response && response.data && response.data.results) {
        setTransportData(response.data.results);
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
    if (newValue !== null) {
      setIsInactiveFilter(newValue);
      setCurrentPage(1);
    }
  };

  const openUpdateForRow = (item) => {
    const selectedData = transportData.find((data) => data.id === item.id);
    setRecordForEdit(selectedData || null);
    setOpenUpdatePopup(true);
  };

  // Pass the list record along so Overview can show its name even if a role
  // can list transporters but cannot access the detail endpoint.
  const openWorkspaceForRow = (item) => onOpenTransporter && onOpenTransporter(item);

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
                Transporters
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
              {canCreate && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenCreatePopup(true)}
                >
                  + Add Transporter
                </Button>
              )}
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

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="Transporters">
              <TableHead>
                <TableRow>
                  {["ID", "TRANSPORTER TYPE", "TRANSPORTER NAME", "IS INACTIVE", "ACTION"].map((label) => (
                    <TableCell key={label} sx={{ backgroundColor: "#006BA1", color: "white", fontWeight: 700 }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transportData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.transporter_type}</TableCell>
                    <TableCell>
                      <Button onClick={() => openWorkspaceForRow(item)} sx={{ textTransform: "none", textAlign: "left" }}>
                        {item.transporter_name}
                      </Button>
                    </TableCell>
                    <TableCell>{item.is_inactive ? "Yes" : "No"}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Button onClick={() => openWorkspaceForRow(item)}>Open</Button>
                      {canEditCore && (
                        <Button onClick={() => openUpdateForRow(item)}>Update</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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

export default TransporterList;
