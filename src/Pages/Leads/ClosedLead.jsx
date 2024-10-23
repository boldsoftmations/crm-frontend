import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CreateLeads } from "./CreateLeads";
import { UpdateLeads } from "./UpdateLeads";
import { Popup } from "../../Components/Popup";
import ProductService from "../../services/ProductService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { BulkLeadAssign } from "./BulkLeadAssign";
import { CustomTable } from "../../Components/CustomTable";
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import { LeadPotentialCreate } from "./LeadPotential/LeadPotentialCreate";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";
import { useSelector } from "react-redux";

export const ClosedLead = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openModalFollowup, setOpenModalFollowup] = useState(false);
  const [openModalPotential, setOpenModalPotential] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;
  const assigned = users.active_sales_user || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
      size="small"
      onChange={(event, value) => onChange(value)}
      options={options}
      getOptionLabel={(option) => option}
      label={label}
    />
  );

  useEffect(() => {
    getleads();
  }, [currentPage, filterSelectedQuery, searchQuery]);

  const getleads = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getAllLeads(
        currentPage,
        "hot",
        "-lead_id",
        filterQuery,
        filterSelectedQuery,
        searchQuery
      );
      setLeads(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSelectedQuery, searchQuery]);

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

              {/* Dynamic Autocomplete Component */}
              {filterQuery && (
                <Grid item xs={12} sm={6} md={3}>
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
                        setCurrentPage(1);
                      }
                    )}
                </Grid>
              )}

              {/* Search Field */}
              <Grid item xs={12} sm={6} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={1.5}>
                {(users.groups.includes("Director") ||
                  users.groups.includes("Sales Manager") ||
                  users.groups.includes("Sales Deputy Manager") ||
                  users.groups.includes("Sales Assistant Deputy Manager")) && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                  >
                    Assign Bulk
                  </Button>
                )}
              </Grid>

              <Grid item xs={6} sm={3} md={1.5}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenPopup2(true)}
                >
                  Add
                </Button>
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
                  Dropped Leads
                </Typography>
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
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Create Leads"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateLeads
          getleads={getleads}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
          filterQuery={filterQuery}
          filterSelectedQuery={filterSelectedQuery}
          searchQuery={searchQuery}
        />
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
          currentPage={currentPage}
          filterQuery={filterQuery}
          filterSelectedQuery={filterSelectedQuery}
          searchQuery={searchQuery}
        />
      </Popup>

      <Popup
        maxWidth={"xl"}
        title={"Create Activity"}
        openPopup={openModalFollowup}
        setOpenPopup={setOpenModalFollowup}
      >
        <LeadActivityCreate
          getleads={getleads}
          leadsByID={leadsByID}
          setOpenPopup={setOpenModalFollowup}
          getLeadByID={null}
          currentPage={currentPage}
          filterQuery={filterQuery}
          filterSelectedQuery={filterSelectedQuery}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
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
          currentPage={currentPage}
          filterQuery={filterQuery}
          filterSelectedQuery={filterSelectedQuery}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        title={"Assign Bulk Lead to another Employee"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <BulkLeadAssign setOpenPopup={setOpenModal} />
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
