import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Button,
  Paper,
  TextField,
  Box,
  IconButton,
  Autocomplete,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import ClearIcon from "@mui/icons-material/Clear";
import "../CommonStyle.css";
import { Popup } from "./../../Components/Popup";
import { UpdateLeads } from "./UpdateLeads";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../Components/CustomSearch";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomTable } from "../../Components/CustomTable";
import ProductService from "../../services/ProductService";

export const AssignTo = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [assign, setAssign] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [product, setProduct] = useState([]);
  const [leadsByID, setLeadsByID] = useState(null);
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const openInPopup = (item) => {
    const matchedLead = leads.find((lead) => lead.lead_id === item.id);
    setLeadsByID(matchedLead);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    setRecordForEdit(item);
    setModalOpen(true);
  };

  const getResetData = () => {
    setFilterSelectedQuery("");
    getUnassigned();
  };

  useEffect(() => {
    getReference();
    getProduct();
    getDescriptionNoData();
    getAssignedData();
    getUnassigned();
  }, []);

  const getReference = async () => {
    try {
      const res = await LeadServices.getAllRefernces();

      setReferenceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAssignedData = async (id) => {
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

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
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
  const getUnassigned = async () => {
    try {
      if (currentPage) {
        const response = await LeadServices.getAllPaginateUnassigned(
          currentPage,
          filterSelectedQuery
        );
        setLeads(response.data.results);
      } else {
        setOpen(true);
        let response = await LeadServices.getAllUnassignedData();
        if (response) {
          setLeads(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));

          setOpen(false);
        }
      }
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
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
      } else {
        const response = await LeadServices.getAllPaginateUnassigned(page);
        setLeads(response.data.results);
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
        description: recordForEdit.description,
        interested: recordForEdit.interested ? recordForEdit.interested : "Yes",
        assigned_to: assign ? assign : recordForEdit.assigned_to,
        references: recordForEdit.references
          ? recordForEdit.references
          : "Indiamart",
      };

      const res = await LeadServices.updateLeads(recordForEdit.lead_id, data);
      setModalOpen(false);
      getUnassigned();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
      console.log("error");
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
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.6}>
              <FormControl fullWidth size="small">
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
                Assigned to
              </h3>
            </Box>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            openInPopup3={null}
            openInPopup4={null}
            ButtonText={"Assign"}
          />
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
          assigned={assigned}
          descriptionMenuData={descriptionMenuData}
          setOpenPopup={setOpenPopup}
          getUnassigned={getUnassigned}
          product={product}
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
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={recordForEdit ? recordForEdit.assigned_to : "-"}
              onChange={(e, value) => setAssign(value)}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} name={"assign"} label={"Assign To"} />
              )}
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
