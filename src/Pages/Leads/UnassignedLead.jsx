import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  Typography,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import LeadServices from "../../services/LeadService";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "./UpdateLeads";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useSelector } from "react-redux";

export const UnassignedLead = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assign, setAssign] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [leadsByID, setLeadsByID] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned_to_users = users.active_sales_user || [];
  const openInPopup = (item) => {
    setLeadsByID(item.lead_id);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    setRecordForEdit(item);
    setModalOpen(true);
  };

  const handleCheckboxChange = (leadId) => {
    setSelectedRows((prevSelectedRows) => {
      const isSelected = prevSelectedRows.some((item) => item === leadId);

      if (isSelected) {
        // Row already exists in selectedRows, remove it
        return prevSelectedRows.filter((item) => item !== leadId);
      } else {
        // Row does not exist in selectedRows, add it
        return [...prevSelectedRows, leadId];
      }
    });
  };

  const FetchData = async (value) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllRefernces();
      setReferenceData(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    getUnassigned();
  }, [currentPage, filterQuery, filterSelectedQuery]);

  const getUnassigned = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getAllUnassignedData(
        currentPage,
        filterQuery,
        filterSelectedQuery
      );
      setLeads(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterQuery, filterSelectedQuery]);

  const handleSearch = (query) => {
    setFilterSelectedQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterSelectedQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const updateAssigned = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          contact: recordForEdit.contact ? recordForEdit.contact : null,
          business_mismatch: recordForEdit.business_mismatch
            ? recordForEdit.business_mismatch
            : "No",
          description: recordForEdit.description || [],
          interested: recordForEdit.interested
            ? recordForEdit.interested
            : "Yes",
          assigned_to: assign ? assign : recordForEdit.assigned_to,
          references: recordForEdit.references
            ? recordForEdit.references
            : "Indiamart",
        };
        const req = {
          lead_id: selectedRows,
          assign_to: assign,
        };
        let response; // Declare response variable here
        if (selectedRows.length > 0) {
          response = await LeadServices.AssignMultipleLeads(req);
        } else {
          response = await LeadServices.updateLeads(
            recordForEdit.lead_id,
            data
          );
        }
        const successMessage =
          response.data.message || "UnAssigned Leads Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setModalOpen(false);
          getUnassigned(currentPage, filterQuery, filterSelectedQuery);
        }, 300);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [recordForEdit, assign, currentPage, filterQuery, filterSelectedQuery]
  );

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
              <Grid item xs={12} sm={6} md={3}>
                <CustomAutocomplete
                  size="small"
                  value={filterQuery}
                  onChange={(event, value) => setFilterQuery(value)}
                  options={referenceData.map((option) => option.source)}
                  getOptionLabel={(option) => option}
                  label="Filter By References"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {selectedRows.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={() => openInPopup2(selectedRows)}
                  >
                    Assign
                  </Button>
                )}
              </Grid>
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
                  UnAssigned Leads
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
                  <StyledTableCell align="center">Checkbox</StyledTableCell>
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">REFERENCE</StyledTableCell>
                  <StyledTableCell align="center">CITY</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedRows.includes(row.lead_id)}
                          onChange={() => handleCheckboxChange(row.lead_id)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.contact}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.query_product_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.assigned_to}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.references}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.city}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.state}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button variant="text" onClick={() => openInPopup(row)}>
                          View
                        </Button>
                        <Button
                          color="success"
                          variant="text"
                          onClick={() => openInPopup2(row)}
                        >
                          Assign
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
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
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          leadsByID={leadsByID}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getUnassigned}
          currentPage={currentPage}
          filterQuery={filterQuery}
          filterSelectedQuery={filterSelectedQuery}
          searchQuery={null}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Assigned To"}
        openPopup={modalOpen}
        setOpenPopup={setModalOpen}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={recordForEdit ? recordForEdit.assigned_to : "-"}
              onChange={(e, value) => setAssign(value)}
              options={assigned_to_users.map((option) => option.email)}
              getOptionLabel={(option) => `${option}`}
              label={"Assign To"}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => updateAssigned(e)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Popup>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
