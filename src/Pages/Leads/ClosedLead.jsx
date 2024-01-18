import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import "../CommonStyle.css";
import { CreateLeads } from "./CreateLeads";
import { UpdateLeads } from "./UpdateLeads";
import { Popup } from "../../Components/Popup";
import ProductService from "../../services/ProductService";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { BulkLeadAssign } from "./BulkLeadAssign";
import { useDispatch, useSelector } from "react-redux";
import { CustomTable } from "../../Components/CustomTable";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import CustomTextField from "../../Components/CustomTextField";
import { LeadPotentialCreate } from "./LeadPotential/LeadPotentialCreate";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { Helmet } from "react-helmet";

export const ClosedLead = () => {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openModalFollowup, setOpenModalFollowup] = useState(false);
  const [openModalPotential, setOpenModalPotential] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;
  const assigned = users.sales_users || [];

  const openInPopup = (item) => {
    setLeadsByID(item.id);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    setLeadsByID(item.id);
    setOpenModalFollowup(true);
  };

  const openInPopup3 = (item) => {
    setLeadsByID(item.id);
    setOpenModalPotential(true);
  };

  const FetchData = async (value) => {
    try {
      setOpen(true);
      setFilterQuery(value);
      if (value.includes("references__source")) {
        const res = await LeadServices.getAllRefernces();
        setReferenceData(res.data);
      }
      if (value.includes("description__name")) {
        const res = await ProductService.getNoDescription();
        setDescriptionMenuData(res.data);
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };
  const renderAutocomplete = (label, options, onChange) => (
    <CustomAutocomplete
      fullWidth
      sx={{ marginLeft: "1em", marginRight: "2em" }}
      size="small"
      onChange={(event, value) => onChange(value)}
      options={options}
      getOptionLabel={(option) => option}
      label={label}
    />
  );

  const extractErrorMessages = (data) => {
    let messages = [];
    if (data.errors) {
      for (const [key, value] of Object.entries(data.errors)) {
        value.forEach((msg) => {
          messages.push(`${key}: ${msg}`);
        });
      }
    }
    return messages;
  };

  useEffect(() => {
    getleads(currentPage);
  }, [currentPage, getleads]);

  const getleads = useCallback(
    async (
      page,
      filter = filterQuery,
      filterValue = filterSelectedQuery,
      search = searchQuery
    ) => {
      try {
        setOpen(true);
        const response = await LeadServices.getAllLeads(
          page,
          "close",
          "-lead_id",
          filter,
          filterValue,
          search
        );
        setLeads(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        console.log("Close leads get api", error);
        const newErrors = extractErrorMessages(error.response.data);
        setErrorMessages(newErrors);
        setOpenSnackbar(true);
      } finally {
        setOpen(false);
      }
    },
    [filterSelectedQuery, searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const PriorityColor = leads.map((row) => {
    let color = "";
    switch (row.priority) {
      case "High":
        color = "#ffcccc";
        break;
      case "Medium":
        color = "#ccccff";
        break;
      case "Low":
        color = "#ffffcc";
        break;
      default:
        color = "#ffffff";
    }
    return { priority: color };
  });

  const Tabledata = leads.map((row, i) => ({
    id: row.lead_id,
    company: row.company,
    name: row.name,
    contact: row.contact,
    alternate_contact: row.alternate_contact,
    city: row.city,
    state: row.state,
    priority: row.priority,
    stage: row.stage,
    assigned_to: row.assigned_to,
  }));

  const Tableheaders = [
    "ID",
    "COMPANY",
    "NAME",
    "CONTACT",
    "ALTERNATE CONTACT",
    "CITY",
    "STATE",
    "PRIORITY",
    "STAGE",
    "ASSIGNED TO",
    "ACTION",
  ];

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0);
    }
  }, [currentErrorIndex, errorMessages.length]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages.join(", ")}{" "}
          {/* Display all errors as a comma-separated string */}
        </Alert>
      </Snackbar>

      <CustomLoader open={open} />
      <Popup
        maxWidth={"lg"}
        title={"Assign Bulk Lead to another Employee"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <BulkLeadAssign setOpenPopup={setOpenModal} />
      </Popup>
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
              marginBottom="10px"
            >
              {/* Filter By Select */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Fliter By
                  </InputLabel>
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
              </Grid>
              {filterQuery && (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  {filterQuery &&
                    renderAutocomplete(
                      filterQuery === "assigned_to__email"
                        ? "Assigned To"
                        : filterQuery === "references__source"
                        ? "Reference"
                        : filterQuery === "stage"
                        ? "Stage"
                        : filterQuery === "description__name"
                        ? "Description"
                        : "",
                      filterQuery === "assigned_to__email"
                        ? assigned.map((option) => option.email)
                        : filterQuery === "references__source"
                        ? referenceData.map((option) => option.source)
                        : filterQuery === "stage"
                        ? StageOptions.map((option) => option.value)
                        : filterQuery === "description__name"
                        ? descriptionMenuData.map((option) => option.name)
                        : [],
                      (value) => {
                        setFilterSelectedQuery(value);
                        setCurrentPage(0);
                        getleads(0, filterQuery, value, searchQuery);
                      }
                    )}
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                  sx={{ marginLeft: "1em", marginRight: "1em" }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setCurrentPage(0);
                    getleads(0, filterQuery, filterSelectedQuery, searchQuery);
                  }}
                >
                  Search
                </Button>
                <Button
                  sx={{ marginRight: "1em" }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    getleads(1, filterQuery, filterSelectedQuery, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" marginBottom="10px">
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              {/* Invisible Spacer - Only shows if 'Assign Bulk Lead' is not there */}
              {users.groups.includes("Sales Manager") ||
              users.groups.includes("Sales Deputy Manager") ||
              users.groups.includes("Sales Assistant Deputy Manager") ? null : (
                <Grid item lg={3}></Grid>
              )}

              {/* Assign Bulk Lead Button - Conditionally Rendered on the Left */}
              {(users.groups.includes("Sales Manager") ||
                users.groups.includes("Sales Deputy Manager") ||
                users.groups.includes("Sales Assistant Deputy Manager")) && (
                <Grid item xs={4}>
                  <Button
                    onClick={() => setOpenModal(true)}
                    variant="contained"
                  >
                    Assign Bulk Lead
                  </Button>
                </Grid>
              )}
              <Grid item xs={4} style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Dropped Leads
                </h3>
              </Grid>

              {/* Add Button - Right */}
              <Grid item xs={4} style={{ textAlign: "right" }}>
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            openInPopup3={openInPopup3}
            openInPopup4={null}
            ButtonText={"Activity"}
            ButtonText1={"Potential"}
            PriorityColor={PriorityColor}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Create Leads"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateLeads getleads={getleads} setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          leadsByID={leadsByID}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getleads}
        />
      </Popup>

      <Popup
        maxWidth={"xl"}
        title={"Create Activity"}
        openPopup={openModalFollowup}
        setOpenPopup={setOpenModalFollowup}
      >
        <LeadActivityCreate
          leadsByID={leadsByID}
          setOpenModal={setOpenModalFollowup}
          getLeadByID={null}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Create Potential"}
        openPopup={openModalPotential}
        setOpenPopup={setOpenModalPotential}
      >
        <LeadPotentialCreate
          getLeadByID={null}
          leadsByID={leadsByID}
          setOpenModal={setOpenModalPotential}
        />
      </Popup>
    </>
  );
};

const FilterOptions = [
  { label: "References", value: "references__source" },
  { label: "Description", value: "description__name" },
  { label: "Assigned To", value: "assigned_to__email" },
  // { label: "Search", value: "search" },
];

const StageOptions = [
  { label: "New", value: "new" },
  { label: "Open", value: "open" },
  { label: "Opportunity", value: "opportunity" },
  { label: "Potential", value: "potential" },
  { label: "Interested", value: "interested" },
  { label: "Converted", value: "converted" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Close", value: "close" },
];
