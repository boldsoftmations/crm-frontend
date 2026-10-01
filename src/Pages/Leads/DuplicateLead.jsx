import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Box,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import LeadServices from "../../services/LeadService";
import { Popup } from "../../Components/Popup";
import { CustomLoader } from "../../Components/CustomLoader";
// import { BulkLeadAssign } from "./BulkLeadAssign";
// import { useSelector } from "react-redux";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";

export const DuplicateLead = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  // const [filterQuery, setFilterQuery] = useState("gst_number");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  // const [openPopup, setOpenPopup] = useState(false);
  // const [openPopup2, setOpenPopup2] = useState(false);
  const [openModalFollowup, setOpenModalFollowup] = useState(false);
  // const [openModalPotential, setOpenModalPotential] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [dropLeadReason, setDropLeadReason] = useState("");
  // const [openModal, setOpenModal] = useState(false);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const openInPopup2 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalFollowup(true);
  };

  // const handleCheckboxChange = (row) => {
  //   setSelectedRows((prevSelectedRows) => {
  //     const rowIndex = prevSelectedRows.findIndex(
  //       (item) => item.lead_id === row.lead_id
  //     );
  //     if (rowIndex > -1) {
  //       const newSelectedRows = [...prevSelectedRows];
  //       newSelectedRows.splice(rowIndex, 1);
  //       return newSelectedRows;
  //     } else {
  //       const newRowData = {
  //         lead_id: row.lead_id,
  //         assigned_to: row.assigned_to,
  //       };
  //       return [...prevSelectedRows, newRowData];
  //     }
  //   });
  // };

  const getleads = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getAllDuplicateLeads(
        filterSelectedQuery
      );
      setLeads(response.data);
      // setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [filterSelectedQuery]);

  useEffect(() => {
    if (filterSelectedQuery) {
      getleads();
    }
  }, [filterSelectedQuery]);

  // const handleFilter = (event) => {
  //   setFilterQuery(event.target.value);
  //   setCurrentPage(1);
  // };

  const handleSearch = (query) => {
    setFilterSelectedQuery(query);
  };

  const handleReset = () => {
    setFilterSelectedQuery("");
  };

  //function for drop leads

  const handleDroplead = async () => {
    try {
      setOpen(true);
      const payload = {
        activity: "Drop the lead",
        notes: dropLeadReason,
        leads: leadsByID,
      };
      const response = await LeadServices.createFollowUpLeads(payload);
      if (response.status === 201) {
        handleSuccess(response.data.message || "Lead dropped!");
        setTimeout(() => {
          getleads();
          setOpenModalFollowup(false);
        }, 500);
      }
    } catch (e) {
      console.log(e);
      handleError(e.error);
    } finally {
      setOpen(false);
    }
  };

  // const handlePageChange = (event, value) => {
  //   setCurrentPage(value);
  // };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth sx={{ maxWidth: "300px" }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    Fliter By
                  </InputLabel>
                  <Select
                    labelId="demso-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Fliter By"
                    value={filterQuery}
                    onChange={(event) => handleFilter(event)}
                  >
                    {FilterOptions.map((option, i) => (
                      <MenuItem key={i} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item xs={12} sm={6} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={2}>
                {(users.groups.includes("Director") ||
                  users.groups.includes("Sales Manager") ||
                  users.groups.includes("Sales Deputy Manager")) && (
                  <button
                    onClick={() => setOpenModal(true)}
                    className="btn btn-primary me-2"
                    size="small"
                  >
                    Assign Bulk Lead
                  </button>
                )}
              </Grid> */}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "rgb(34, 34, 34)",
                  }}
                >
                  Duplicates Leads
                </Typography>
              </Grid>
            </Grid>
          </Box>
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell align="center">Checkbox</StyledTableCell> */}
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">ALT. CONTACT</StyledTableCell>

                  <StyledTableCell align="center">GST NO.</StyledTableCell>
                  <StyledTableCell align="center">PAN NO.</StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads &&
                  leads.length > 0 &&
                  leads.map((row, i) => {
                    return (
                      <StyledTableRow key={i}>
                        {/* <StyledTableCell align="center">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(row)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </StyledTableCell> */}
                        <StyledTableCell align="center">
                          {row.company}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.contact}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.alternate_contact}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {row.gst_number}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.pan_number}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.assigned_to}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{ width: "200px" }}
                        >
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => openInPopup2(row)}
                          >
                            Drop
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          /> */}
        </Paper>
      </Grid>
      {/* <Popup
        fullScreen={true}
        title={"Create Leads"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateLeads
          getleads={getleads}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
        />
      </Popup> */}
      {/* <Popup
        fullScreen={true}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          leadsByID={leadsByID}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getleads}
          currentPage={currentPage}
        />
      </Popup> */}

      <Popup
        maxWidth={"xl"}
        title={"Drop lead"}
        openPopup={openModalFollowup}
        setOpenPopup={setOpenModalFollowup}
      >
        <Grid container spacing={2} alignItems="center" minWidth={350}>
          {/* Text Field */}
          <Grid item xs={12} sm={12}>
            <TextField
              label="Reason"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => setDropLeadReason(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleDroplead}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Popup>

      {/* <Popup
        maxWidth={"lg"}
        title={"Create Potential"}
        openPopup={openModalPotential}
        setOpenPopup={setOpenModalPotential}
      >
        <LeadPotentialCreate
          getleads={getleads}
          getLeadByID={null}
          leadsByID={leadsByID}
          setOpenPopup={setOpenModalPotential}
        />
      </Popup> */}
      {/* <Popup
        maxWidth={"lg"}
        title={"Assign Bulk Lead to another Employee"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <BulkLeadAssign setOpenPopup={setOpenModal} />
      </Popup> */}
    </>
  );
};

// const FilterOptions = [
//   { label: "Gst Number", value: "gst_number" },
//   { label: "Contact", value: "contact" },
//   { label: "Alt Contact", value: "alternate_contact" },
//   { label: "Email", value: "email" },
//   { label: "Company", value: "company" },
//   { label: "Pan No", value: "pan_number" },
// ];
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
}));
