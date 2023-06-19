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
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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
import InvoiceServices from "../../services/InvoiceService";
import { getSellerAccountData } from "../../Redux/Action/Action";
import { CustomTable } from "../../Components/CustomTable";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import { PotentialCreate } from "../Potential/PotentialCreate";

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
  const [assigned, setAssigned] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [product, setProduct] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(filterSelectedQuery, searchQuery);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
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
    getSearchData(filterSelectedQuery, null); // Pass an empty string as the second parameter
  };

  const getResetFilterData = () => {
    setFilterQuery("");
    setFilterSelectedQuery(null);
    getSearchData(null, searchQuery); // Pass an empty string as the second parameter
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
    getAssignedData();
    getReference();
    getDescriptionNoData();
    getleads();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getReference = async () => {
    try {
      const res = await LeadServices.getAllRefernces();

      setReferenceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getleads = async () => {
    try {
      setOpen(true);
      const filterValue = filterSelectedQuery ? filterSelectedQuery : null;
      const searchValue = searchQuery ? searchQuery : null;

      if (filterQuery !== "" && filterValue !== null && searchValue !== null) {
        const response = await LeadServices.getAllSearchWithFilteredLeads(
          "close",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );

        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (filterQuery && filterValue && currentPage) {
        const response = await LeadServices.getAllPaginateLeads(
          currentPage,
          "close",
          "-lead_id",
          filterValue,
          filterSelectedQuery
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (searchValue) {
        const response = await LeadServices.getFilteredLeads(
          "close",
          "-lead_id",
          filterQuery,
          filterValue
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (currentPage) {
        const response = await LeadServices.getAllPaginateLeads(
          currentPage,
          "close",
          "-lead_id"
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await LeadServices.getAllLeads("close", "priority");
        if (response) {
          setLeads(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        }
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
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const getSearchData = async (filterSelectedQuery, searchQuery) => {
    try {
      setOpen(true);
      const filterValue = filterSelectedQuery ? filterSelectedQuery : null;
      const searchValue = searchQuery ? searchQuery : null;
      if (filterQuery && filterValue !== null && searchValue !== null) {
        const response = await LeadServices.getAllSearchWithFilteredLeads(
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
        const response = await LeadServices.getFilteredLeads(
          "close",
          "-lead_id",
          filterQuery,
          filterValue
        );

        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (searchValue) {
        const response = await LeadServices.getSearchLeads(
          "close",
          "-lead_id",
          searchValue
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        setFilterQuery("");
        setFilterSelectedQuery(null);
        setSearchQuery(null);
        await getleads();
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
                onChange={(event) => setFilterQuery(event.target.value)}
              >
                {FilterOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {filterQuery === "assigned_to__email" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  Assigned To
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Assigned To"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
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
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetFilterData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  {assigned.map((option, i) => (
                    <MenuItem key={i} value={option.email}>
                      {option.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {filterQuery === "references__source" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Reference</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Reference"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
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
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetFilterData}
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
            {filterQuery === "stage" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Stage</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Stage"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
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
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetFilterData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  {StageOptions.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {filterQuery === "description__name" && (
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  Description
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Description"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
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
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetFilterData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  {descriptionMenuData.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <CustomSearchWithButton
              filterSelectedQuery={searchQuery}
              setFilterSelectedQuery={setSearchQuery}
              handleInputChange={handleInputChange}
              getResetData={getResetSearchData}
            />

            {users.is_staff === true && (
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
        <CreateLeads
          assigned={assigned}
          referenceData={referenceData}
          descriptionMenuData={descriptionMenuData}
          getleads={getleads}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          leadsByID={leadsByID}
          product={product}
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
          product={product}
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
