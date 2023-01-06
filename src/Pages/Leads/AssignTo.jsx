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
  TextField,
  Box,
  IconButton,
  Autocomplete,
  Typography,
  TableContainer,
  TableFooter,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { tableCellClasses } from "@mui/material/TableCell";
import LeadServices from "../../services/LeadService";
import ClearIcon from "@mui/icons-material/Clear";
import "../CommonStyle.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { styled } from "@mui/material/styles";
import { Popup } from "./../../Components/Popup";
import { UpdateLeads } from "./UpdateLeads";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../Components/CustomSearch";
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const AssignTo = () => {
  const [leads, setLeads] = useState([]);
  const [allDataByID, setAllDataByID] = useState([]);
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

  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
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
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
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
    getUnassigned();
  }, []);

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

  const getResetData = () => {
    setFilterSelectedQuery("");
    getUnassigned();
  };

  const handlePageChange = async (event, value) => {
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

  const handleSubmit = async (id) => {
    try {
      setOpen(true);

      const res = await LeadServices.getLeadsById(id);
      console.log("res :>> ", res);
      setAllDataByID(res.data);
      setModalOpen(true);
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
        contact: allDataByID.contact ? allDataByID.contact : null,
        business_mismatch: allDataByID.business_mismatch
          ? allDataByID.business_mismatch
          : "No",
        description: allDataByID.description,
        interested: allDataByID.interested ? allDataByID.interested : "Yes",
        assigned_to: assign ? assign : allDataByID.assigned_to,
        references: allDataByID.references
          ? allDataByID.references
          : "Indiamart",
      };

      const res = await LeadServices.updateLeads(allDataByID.lead_id, data);
      console.log("res :>> ", res);
      setModalOpen(false);
      getUnassigned();

      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
      console.log("error");
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  // Get current post
  const userEmail = assign ? assign : allDataByID.assigned_to;

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

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
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={modalOpen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Assign To
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography id="modal-modal-description">
            Are you sure you have to assigned to this user{" "}
            <Typography sx={{ color: "blue" }}>{userEmail}</Typography>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={(e) => updateAssigned(e)}
          >
            Ok
          </Button>
        </DialogActions>
      </BootstrapDialog>

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

                  <StyledTableCell align="center">PRODUCT NAME</StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                  <StyledTableCell align="center">REFERENCE</StyledTableCell>
                  <StyledTableCell align="center">CITY</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>

                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
                        {row.query_product_name ? row.query_product_name : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <Autocomplete
                          style={{
                            minWidth: 220,
                          }}
                          size="small"
                          value={row.assigned_to ? row.assigned_to : "-"}
                          onChange={(e, value) => setAssign(value)}
                          options={assigned.map((option) => option.email)}
                          getOptionLabel={(option) => `${option}`}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name={"assign"}
                              label={"Assign To"}
                            />
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company ? row.company : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.references ? row.references : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.city ? row.city : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.state ? row.state : "-"}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        <ul className="pagination ">
                          <li className="page-item">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => openInPopup(row.lead_id)}
                            >
                              View
                            </Button>
                          </li>

                          <li className="page-item">
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              onClick={(e) => handleSubmit(row.lead_id)}
                            >
                              Assign
                            </Button>
                          </li>
                        </ul>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <Pagination
              count={pageCount}
              onChange={handlePageChange}
              color={"primary"}
              variant="outlined"
              shape="circular"
            />
          </TableFooter>
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getUnassigned={getUnassigned}
        />
      </Popup>
    </>
  );
};

const FilterOptions = [
  { label: "References", value: "references__source" },
  { label: "Search", value: "search" },
];
