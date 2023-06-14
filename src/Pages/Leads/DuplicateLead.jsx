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
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TextField,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
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
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import { PotentialCreate } from "../Potential/PotentialCreate";

export const DuplicateLead = () => {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("gst_number");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
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
  const [selectedRows, setSelectedRows] = useState([]);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;

  const handleInputChanges = (event) => {
    setFilterQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const openInPopup = (item) => {
    setLeadsByID(item.lead_id);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalFollowup(true);
  };

  const openInPopup3 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalPotential(true);
  };

  const getResetSearchData = () => {
    setFilterSelectedQuery("");
    getSearchData(filterQuery, ""); // Pass an empty string as the second parameter
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prevSelectedRows) => {
      const rowIndex = prevSelectedRows.findIndex(
        (item) => item.lead_id === row.lead_id
      );
      if (rowIndex > -1) {
        // Row already exists in selectedRows, remove it
        const newSelectedRows = [...prevSelectedRows];
        newSelectedRows.splice(rowIndex, 1);
        return newSelectedRows;
      } else {
        // Row does not exist in selectedRows, add it
        const newRowData = {
          lead_id: row.lead_id,
          assigned_to: row.assigned_to,
        };
        return [...prevSelectedRows, newRowData];
      }
    });
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
      if ((filterQuery || filterSelectedQuery) && currentPage > 0) {
        const response = await LeadServices.getFilterPaginateDuplicateLeads(
          currentPage,
          filterQuery,
          filterSelectedQuery
        );

        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else if (currentPage) {
        const response = await LeadServices.getAllPaginateDuplicateLeads(
          currentPage
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        let response = await LeadServices.getAllDuplicateLeads(filterQuery);
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

  const getSearchData = async (filterQuery, filterSelectedQuery) => {
    try {
      setOpen(true);
      const response = await LeadServices.getSearchDuplicateLeads(
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

      if (filterQuery || filterSelectedQuery) {
        const response = await LeadServices.getFilterPaginateDuplicateLeads(
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
        const response = await LeadServices.getAllPaginateDuplicateLeads(page);
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
            <FormControl fullWidth sx={{ maxWidth: "300px" }} size="small">
              <InputLabel id="demo-simple-select-label">Fliter By</InputLabel>
              <Select
                labelId="demso-simple-select-label"
                id="demo-simple-select"
                name="values"
                label="Fliter By"
                value={filterQuery}
                onChange={(event) => handleInputChanges(event)}
              >
                {FilterOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              value={filterSelectedQuery}
              onChange={(event) => setFilterSelectedQuery(event.target.value)}
              name="search"
              size="small"
              placeholder="search"
              label="Search"
              variant="outlined"
              sx={{
                marginRight: "1rem",
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
                  <>
                    <IconButton
                      sx={{
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetSearchData}
                    >
                      <ClearIcon />
                    </IconButton>
                  </>
                ),
              }}
            />
            <Button
              sx={{ marginRight: "1rem" }}
              variant="contained"
              color="primary"
              onClick={() => getSearchData(filterQuery, filterSelectedQuery)}
            >
              Search
            </Button>
            {users.is_staff === true && (
              <button
                onClick={() => setOpenModal(true)}
                className="btn btn-primary me-2"
                size="small"
              >
                Assign Bulk Lead
              </button>
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
              Duplicate Leads
            </h3>
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
                  <StyledTableCell align="center">CITY</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">GST NO.</StyledTableCell>
                  <StyledTableCell align="center">PAN NO.</StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((row, i) => {
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
                        {row.city}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.state}
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
                        <div
                          style={{ color: "blue" }}
                          onClick={() => openInPopup(row)}
                        >
                          View
                        </div>
                        <div
                          style={{ color: "green" }}
                          onClick={() => openInPopup2(row)}
                        >
                          Activity
                        </div>
                        <div
                          style={{ color: "red" }}
                          onClick={() => openInPopup3(row)}
                        >
                          Potential
                        </div>
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
          getAllleadsData={getleads}
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
          getAllleadsData={getleads}
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
  { label: "Gst Number", value: "gst_number" },
  { label: "Contact", value: "contact" },
  { label: "Alt Contact", value: "alternate_contact" },
  { label: "Email", value: "email" },
  { label: "Company", value: "company" },
  { label: "Pan No", value: "pan_number" },
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
