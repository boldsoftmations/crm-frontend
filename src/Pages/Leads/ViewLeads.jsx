import React, { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
  styled,
  TextField,
  Box,
  TableContainer,
  TableFooter,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";
import LeadServices from "./../../services/LeadService";

import SearchIcon from "@mui/icons-material/Search";
import "../CommonStyle.css";
import { CreateLeads } from "./CreateLeads";
import { UpdateLeads } from "./UpdateLeads";
import { Popup } from "./../../Components/Popup";
import ProductService from "../../services/ProductService";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export const Viewleads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };
  console.log("filterSelectedQuery :>> ", filterSelectedQuery);
  console.log("filterQuery :>> ", filterQuery);

  useEffect(() => {
    getAssignedData();
  }, []);

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

  useEffect(() => {
    getReference();
  }, []);

  const getReference = async () => {
    try {
      const res = await LeadServices.getAllRefernces();

      setReferenceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDescriptionNoData();
  }, []);

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
      if (currentPage) {
        const response = await LeadServices.getAllPaginateLeads(currentPage);
        setLeads(response.data.results);
      } else {
        let response = await LeadServices.getAllLeads();
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

  useEffect(() => {
    getleads();
  }, []);
  // console.log("filter", filterQuery.value);

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterQuery) {
        const response = await LeadServices.getAllSearchLeads(
          filterQuery,
          filterSearch
        );
        if (response) {
          setLeads(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getleads();
          setFilterSelectedQuery("");
        }
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setFilterSelectedQuery("");
    setFilterQuery("");
    getleads();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      console.log("page", page);
      setCurrentPage(page);
      setOpen(true);

      if (filterSelectedQuery) {
        console.log("filter starting :>> ");
        const response = await LeadServices.getFilterPaginateLeads(
          page,
          filterQuery,
          filterSelectedQuery
        );
        if (response) {
          setLeads(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getleads();
          setFilterSelectedQuery("");
        }
      } else {
        console.log("starting :>> ");
        const response = await LeadServices.getAllPaginateLeads(page);
        setLeads(response.data.results);
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  console.log("leads", leads.length);
  return (
    <>
      <div className="Auth-form-container">
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>

      <Grid item xs={12}>
        <p
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            backgroundColor: errMsg ? "red" : "offscreen",
            textAlign: "center",
            color: "white",
            textTransform: "capitalize",
          }}
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
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
              {/* <Autocomplete
                noOptionsText={"No Options"}
                disablePortal
                size="small"
                id="combo-box-demo"
                options={FilterOptions}
                onChange={(event, value) => setFilterQuery(value)}
                
                renderInput={(params) => (
                  <TextField {...params} label="Fliter By" />
                )}
              /> */}
            </Box>
            <Box flexGrow={1}>
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
                    {descriptionMenuData.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {filterQuery === "search" && (
                <>
                  <TextField
                    value={filterSelectedQuery}
                    onChange={(event) => handleInputChange(event)}
                    name="search"
                    size="small"
                    label="Search"
                    variant="outlined"
                    sx={{
                      backgroundColor: "#ffffff",
                      marginLeft: "1em",
                      "& .MuiSelect-iconOutlined": {
                        display: filterSelectedQuery ? "none" : "",
                      },
                      "&.Mui-focused .MuiIconButton-root": {
                        color: "primary.main",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
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
                      ),
                    }}
                  />

                  {/* <Button
                    onClick={getSearchData}
                    size="medium"
                    sx={{ marginLeft: "1em" }}
                    variant="contained"
                    startIcon={<SearchIcon />}
                  >
                    Search
                  </Button>
                  <Button
                    onClick={getResetData}
                    sx={{ marginLeft: "1em" }}
                    size="medium"
                    variant="contained"
                  >
                    Reset
                  </Button> */}
                </>
              )}
            </Box>
            <Box flexGrow={1} align="center">
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Leads
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">EMAIL</StyledTableCell>
                  <StyledTableCell align="center">
                    ALTERNATE CONTACT
                  </StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">COMPANY NAME</StyledTableCell>

                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.length > 0 ? (
                  <>
                    {leads.map((row, i) => {
                      return (
                        <StyledTableRow key={i}>
                          <StyledTableCell align="center">
                            {row.lead_id ? row.lead_id : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.name ? row.name : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.contact ? row.contact : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.email ? row.email : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.alternate_contact
                              ? row.alternate_contact
                              : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.assigned_to ? row.assigned_to : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.company ? row.company : "-"}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            <Button
                              variant="contained"
                              onClick={() => openInPopup(row.lead_id)}
                            >
                              View
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </>
                ) : (
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell align="center">
                      No Data Found
                    </StyledTableCell>

                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageClick}
              color={"primary"}
              variant="outlined"
              shape="circular"
            />
          </TableFooter>
        </Paper>
      </Grid>
      <Popup
        maxWidth={"lg"}
        title={"Create Leads"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateLeads getleads={getleads} setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getleads={getleads}
        />
      </Popup>
    </>
  );
};

const FilterOptions = [
  { label: "References", value: "references__source" },
  { label: "Description", value: "description__name" },
  { label: "Stage", value: "stage" },
  { label: "Assigned To", value: "assigned_to__email" },
  { label: "Search", value: "search" },
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
