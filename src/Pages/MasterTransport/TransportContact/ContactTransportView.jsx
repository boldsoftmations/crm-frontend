import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";

import { useSelector } from "react-redux";

import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

import MasterService from "../../../services/MasterService";
import ContactTransportCreate from "./ContactTransportCreate";
// import ContactTransportUpdate from "./ContactTransportUpdate";

const ContactTransportView = () => {
  const [transportContactData, setTransportContactData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // false = Active, true = Inactive
  const [isInactiveFilter, setIsInactiveFilter] = useState(false);

  // Transporter filter
  const [transporterOptions, setTransporterOptions] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

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

  // Fetch transporter options
  const getTransporterOptions = async () => {
    try {
      const response = await MasterService.getAllTransportMaster();

      if (response && response.data && response.data.results) {
        setTransporterOptions(response.data.results);
      } else {
        setTransporterOptions([]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getTransportContactData = useCallback(async () => {
    try {
      setLoading(true);

      const transporterId = selectedTransporter ? selectedTransporter.id : "";

      const response = await MasterService.getAllTransportConstact(
        // transporterId,
        currentPage,
        // searchQuery,
        isInactiveFilter,
      );

      console.log("Data is:", response);

      if (response && response.data && response.data.results) {
        setTransportContactData(response.data.results);
      } else if (Array.isArray(response.data)) {
        setTransportContactData(response.data.results);
      } else {
        setTransportContactData([]);
      }

      if (response && response.data && response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 25));
        setTotalCount(response.data.count);
      } else {
        setTotalPages(0);
        setTotalCount(0);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [
    selectedTransporter,
    currentPage,
    searchQuery,
    isInactiveFilter,
    handleError,
  ]);

  useEffect(() => {
    getTransporterOptions();
  }, []);

  useEffect(() => {
    getTransportContactData();
  }, [getTransportContactData]);

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

  const openInPopup = (item) => {
    const selectedData = transportContactData.find(
      (data) =>
        data.transporter_id === item.transporter_id &&
        data.unit_id === item.unit_id,
    );

    setRecordForEdit(selectedData || null);
    setOpenUpdatePopup(true);
  };

  const tableData =
    transportContactData &&
    transportContactData.map((value) => ({
      id: value.id,
      created_by: value.created_by,
      updated_by: value.updated_by,
      transporter: value.transporter,
      unit: value.unit,
      city: value.city,
      contact_person: value.contact_person,
      designation_role: value.designation_role,
      mobile_number: value.mobile_number,
      alternate_mobile_number: value.alternate_mobile_number,
      email: value.email,
      office_address: value.office_address,
      updated_date: value.updated_date,
      creation_date: value.creation_date,
    }));

  const tableHeader = [
    "ID",
    "Created By",
    "Updated By",
    "TRANSPORTER",
    "UNIT",
    "CITY",
    "CONTACT PERSON",
    "DESIGNATION ROLE",
    "MOBILE NUMBER",
    "ALTERNATE MOBILE NUMBER",
    "EMAIL",
    "OFFICE ADDRESS",
    "UPDATED DATE",
    "CREATION DATE",
  ];

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
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Bar */}
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
            {/* Search */}
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: "20%",
                minWidth: "300px",
              }}
            >
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            {/* Title */}
            <Box
              sx={{
                flexGrow: 2,
                textAlign: "center",
                minWidth: "150px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Contact Transport
              </h3>
            </Box>

            {/* Add Button */}
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
                onClick={() => {
                  setOpenCreatePopup(true);
                }}
                disabled={isInGroups("Stores")}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Filter Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              px: 2,
              pb: 2,
              gap: 2,
            }}
          >
            {/* Transporter Filter */}
            <Box
              sx={{
                minWidth: "300px",
                flexGrow: 1,
                maxWidth: "400px",
              }}
            >
              <CustomAutocomplete
                fullWidth
                size="small"
                options={transporterOptions}
                value={selectedTransporter}
                getOptionLabel={(option) =>
                  option.transporter_name ? option.transporter_name : option
                }
                onChange={(e, value) => {
                  setSelectedTransporter(value || null);
                  setCurrentPage(1);
                }}
                label="Filter by Transporter"
              />
            </Box>

            {/* Active / Inactive Toggle */}
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

          {/* Table */}
          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 1800 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  {tableHeader.map((header) => (
                    <StyledTableCell key={header} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {tableData &&
                  tableData.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      onClick={() => openInPopup(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell align="center">{row.id}</StyledTableCell>

                      <StyledTableCell align="center">
                        {row.created_by}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.updated_by}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.transporter}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.city}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.contact_person}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.designation_role}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.mobile_number}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.alternate_mobile_number}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.email}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.office_address}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.updated_date}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.creation_date}
                      </StyledTableCell>
                    </StyledTableRow>
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

      {/* Create Popup */}
      <Popup
        maxWidth="xl"
        title="Create Contact Transport"
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <ContactTransportCreate
          getTransportContactData={getTransportContactData}
          setOpenPopup={setOpenCreatePopup}
        />
      </Popup>

      {/* Update Popup */}
      {/* 
      <Popup
        maxWidth="xl"
        title="Update Contact Transport"
        openPopup={openUpdatePopup}
        setOpenPopup={setOpenUpdatePopup}
      >
        <ContactTransportUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenUpdatePopup}
          getTransportContactData={getTransportContactData}
        />
      </Popup> 
      */}
    </>
  );
};

export default ContactTransportView;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },

  "& > td, & > th": {
    padding: 4,
  },

  "& > td:first-child, & > th:first-child": {
    paddingLeft: 4,
  },

  "& > td:last-child, & > th:last-child": {
    paddingRight: 4,
  },

  "&:hover": {
    backgroundColor: "lightgray !important",
  },
}));
