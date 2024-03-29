import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
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
import ClearIcon from "@mui/icons-material/Clear";
import "../CommonStyle.css";
import { Popup } from "../../Components/Popup";
import { UpdateLeads } from "./UpdateLeads";
import { CustomSearch } from "../../Components/CustomSearch";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import Option from "../../Options/Options";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const UnassignedLead = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assign, setAssign] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [leadsByID, setLeadsByID] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

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

  const getResetData = () => {
    setFilterSelectedQuery("");
  };

  const FetchData = async (value) => {
    try {
      setOpen(true);
      setFilterQuery(value);
      if (value.includes("references__source")) {
        const res = await LeadServices.getAllRefernces();
        setReferenceData(res.data);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getUnassigned();
    getAssignedData();
  }, []);

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      // Filter the data based on the ALLOWED_ROLES
      const filteredData = res.data.filter((employee) =>
        employee.groups.some((group) => Option.ALLOWED_ROLES.includes(group))
      );
      setAssigned(filteredData);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  // Main function to get unassigned leads
  const getUnassigned = async () => {
    try {
      setOpen(true);
      let response;

      if (currentPage || filterSelectedQuery) {
        response = await LeadServices.getAllPaginateWithFilterUnassigned(
          currentPage,
          filterQuery,
          filterSelectedQuery
        );
      } else if (currentPage) {
        response = await LeadServices.getAllPaginateUnassigned(currentPage);
      } else {
        response = await LeadServices.getAllUnassignedData();
      }

      if (response) {
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
    } catch (error) {
      setOpen(false);
      // Handle the error as per your requirement
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await LeadServices.getAllFilterByUnassignedData(
        filterQuery,
        filterSearch
      );

      if (response) {
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getUnassigned();
        setFilterSelectedQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (filterSelectedQuery) {
        const response = await LeadServices.getAllPaginateWithFilterUnassigned(
          page,
          filterQuery,
          filterSelectedQuery
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await LeadServices.getAllPaginateUnassigned(page);
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const updateAssigned = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        contact: recordForEdit.contact ? recordForEdit.contact : null,
        business_mismatch: recordForEdit.business_mismatch
          ? recordForEdit.business_mismatch
          : "No",
        description: recordForEdit.description || [],
        interested: recordForEdit.interested ? recordForEdit.interested : "Yes",
        assigned_to: assign ? assign : recordForEdit.assigned_to,
        references: recordForEdit.references
          ? recordForEdit.references
          : "Indiamart",
      };
      const req = {
        lead_id: selectedRows,
        assign_to: assign,
      };
      selectedRows.length > 0
        ? await LeadServices.AssignMultipleLeads(req)
        : await LeadServices.updateLeads(recordForEdit.lead_id, data);
      getUnassigned();
      setOpen(false);
      setModalOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };

  const Tabledata = leads.map((row, i) => ({
    id: row.lead_id,
    name: row.name,
    contact: row.contact,
    product: row.query_product_name,
    assigned_to: row.assigned_to,
    company: row.company,
    references: row.references,
    city: row.city,
    state: row.state,
  }));

  const Tableheaders = [
    "ID",
    "NAME",
    "CONTACT",
    "PRODUCT",
    "ASSIGNED TO",
    "COMPANY",
    "REFERENCE",
    "CITY",
    "STATE",
    "ACTION",
  ];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Fliter By"
                  value={filterQuery}
                  onChange={(event) => FetchData(event.target.value)}
                >
                  {FilterOptions.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box flexGrow={1}>
              {filterQuery === "references__source" && (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Reference
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Reference"
                    value={filterSelectedQuery}
                    onChange={(event) => handleInputChange(event)}
                    sx={{
                      "& .MuiSelect-iconOutlined": {
                        display: filterSelectedQuery ? "none" : "",
                      },
                      "&.Mui-focused .MuiIconButton-root": {
                        color: "primary.main",
                      },
                    }}
                    endAdornment={
                      <IconButton
                        sx={{
                          visibility: filterSelectedQuery
                            ? "visible"
                            : "hidden",
                        }}
                        onClick={getResetData}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                  >
                    {referenceData.map((option) => (
                      <MenuItem key={option.id} value={option.source}>
                        {option.source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filterQuery === "search" && (
                <CustomSearch
                  filterSelectedQuery={filterSelectedQuery}
                  handleInputChange={handleInputChange}
                  getResetData={getResetData}
                />
              )}
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Unassigned Leads
              </h3>
            </Box>
            {selectedRows.length > 0 && (
              <Box flexGrow={0.5}>
                <Button
                  variant="contained"
                  onClick={() => openInPopup2(selectedRows)}
                >
                  Assign
                </Button>
              </Box>
            )}
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
            pageCount={pageCount}
            handlePageClick={handlePageClick}
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
              options={assigned.map((option) => option.email)}
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

const FilterOptions = [
  { label: "References", value: "references__source" },
  { label: "Search", value: "search" },
];

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
