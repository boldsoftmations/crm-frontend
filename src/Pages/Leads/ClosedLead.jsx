import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
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
import { PotentialCreate } from "../Potential/PotentialCreate";
import CustomTextField from "../../Components/CustomTextField";

export const ClosedLead = () => {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
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
  const assigned = users.sales_users || [];
  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(filterQuery, filterSelectedQuery, searchQuery);
  };

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

  const getResetSearchData = () => {
    setSearchQuery("");
    getSearchData(filterQuery, filterSelectedQuery, null); // Pass an empty string as the second parameter
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
    <Autocomplete
      sx={{ minWidth: "200px", marginLeft: "1em" }}
      size="small"
      onChange={(event, value) => onChange(value)}
      options={options}
      getOptionLabel={(option) => option}
      renderInput={(params) => <CustomTextField {...params} label={label} />}
    />
  );

  useEffect(() => {
    getleads();
  }, []);

  const getleads = async () => {
    try {
      setOpen(true);

      const filterValue = filterSelectedQuery || null;
      const searchValue = searchQuery || null;
      const isFiltered =
        filterQuery !== "" && filterValue !== null && searchValue !== null;

      let response;
      if (isFiltered) {
        response = await LeadServices.getAllSearchWithFilteredLeads(
          "close",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );
      } else if (currentPage) {
        response = await LeadServices.getFilterPaginateLeads(
          currentPage,
          "close",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );
      } else {
        response = await LeadServices.getAllLeads("close", "-lead_id");
      }

      if (response) {
        // // Assuming response.data.references_list is the array you are referring to
        // const references_list = response.data.references_list;

        // // Filter out null values from references_list
        // const filteredReferences = references_list.filter((ref) => ref != null);

        // // Only update state if filteredReferences is not empty
        // if (filteredReferences.length > 0) {
        //   setReferenceData(filteredReferences); // Assuming you have a state variable called references
        // }
        setLeads(response.data.results);
        setpageCount(Math.ceil(response.data.count / 25));
      }

      setOpen(false);
    } catch (err) {
      setOpen(false);

      if (!err.response) {
        setErrMsg(
          "Sorry, You Are Not Allowed to Access This Page. Please contact the admin."
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name ||
            err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }

      errRef.current.focus();
    }
  };

  const getSearchData = async (
    filterQuery,
    filterSelectedQuery,
    searchQuery
  ) => {
    try {
      setOpen(true);

      let response;
      if (filterQuery && filterSelectedQuery !== null) {
        if (searchQuery !== null) {
          response = await LeadServices.getAllSearchWithFilteredLeads(
            "close",
            "-lead_id",
            filterQuery,
            filterSelectedQuery,
            searchQuery
          );
        } else {
          response = await LeadServices.getFilteredLeads(
            "close",
            "-lead_id",
            filterQuery,
            filterSelectedQuery
          );
        }
      } else if (searchQuery) {
        response = await LeadServices.getSearchLeads(
          "close",
          "-lead_id",
          searchQuery
        );
      } else {
        setFilterQuery("");
        setFilterSelectedQuery(null);
        setSearchQuery(null);
        await getleads();
      }

      if (response) {
        setLeads(response.data.results);
        setpageCount(Math.ceil(response.data.count / 25));
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
      const filterValue = filterSelectedQuery ? filterSelectedQuery : null;
      const searchValue = searchQuery ? searchQuery : null;
      if (filterQuery && filterValue !== null && searchValue !== null) {
        const response = await LeadServices.getFilterWithSearchPaginateLeads(
          page,
          "close",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );

        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (filterQuery && filterValue) {
        const response = await LeadServices.getFilterPaginateLeads(
          page,
          "close",
          "-lead_id",
          filterQuery,
          filterValue
        );

        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (searchValue) {
        const response = await LeadServices.getSearchPaginateLeads(
          page,
          "close",
          "-lead_id",
          searchValue
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await LeadServices.getAllPaginateLeads(
          page,
          "close",
          "-lead_id"
        );
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
            <FormControl fullWidth sx={{ maxWidth: "200px" }} size="small">
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
                  ? assigned.map((option) => option)
                  : filterQuery === "references__source"
                  ? referenceData.map((option) => option.source)
                  : filterQuery === "stage"
                  ? StageOptions.map((option) => option.value)
                  : filterQuery === "description__name"
                  ? descriptionMenuData.map((option) => option.name)
                  : [],
                (value) => {
                  setFilterSelectedQuery(value);
                  getSearchData(filterQuery, value, searchQuery); // Pass filterQuery and filterSelectedQuery as parameters
                }
              )}

            <CustomSearchWithButton
              filterSelectedQuery={searchQuery}
              setFilterSelectedQuery={setSearchQuery}
              handleInputChange={handleInputChange}
              getResetData={getResetSearchData}
            />

            {(users.groups.toString() === "Sales Manager" ||
              users.groups.toString() === "Sales Deputy Manager") && (
              <Button
                onClick={() => setOpenModal(true)}
                variant="contained"
                sx={{ marginLeft: "1em", marginRight: "1em" }}
              >
                Assign Bulk Lead
              </Button>
            )}
            <Button
              onClick={() => setOpenPopup2(true)}
              variant="contained"
              color="success"
            >
              Add
            </Button>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Dropped Leads
            </h3>
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
        <PotentialCreate
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
