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
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import LeadServices from "../../services/LeadService";
import "../CommonStyle.css";
import { CreateLeads } from "./CreateLeads";
import { UpdateLeads } from "./UpdateLeads";
import { Popup } from "../../Components/Popup";
import ProductService from "../../services/ProductService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { BulkLeadAssign } from "./BulkLeadAssign";
import { useSelector } from "react-redux";
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import { CreateLeadsProformaInvoice } from "../Invoice/ProformaInvoice/CreateLeadsProformaInvoice";
import { Helmet } from "react-helmet";
import { LeadPotentialCreate } from "./LeadPotential/LeadPotentialCreate";
import { LeadForecastCreate } from "./LeadForecast/LeadForecastCreate";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";

export const NewLeads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openModalFollowup, setOpenModalFollowup] = useState(false);
  const [openModalPotential, setOpenModalPotential] = useState(false);
  const [pinnedRows, setPinnedRows] = useState([]);
  const [openModalPI, setOpenModalPI] = useState(false);
  const [openModalForecast, setOpenModalForecast] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;
  const [isPrinting, setIsPrinting] = useState(false);
  const assigned = users.sales_users || [];
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const FilterOptions = [
    { label: "References", value: "references__source" },
    { label: "Description", value: "description__name" },
    ...(!users.groups.includes("Sales Executive")
      ? [{ label: "Assigned To", value: "assigned_to__email" }]
      : []),
  ];
  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setLeads([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getleads();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

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

  const openInPopup4 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalPI(true);
  };
  const openInPopup5 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalForecast(true);
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

  const handlePin = async (e, row) => {
    e.preventDefault();
    // Check if the row is already pinned
    const isPinned = pinnedRows.includes(row.lead_id);
    if (isPinned) {
      // If already pinned, remove it from the pinned rows
      setPinnedRows((prevPinnedRows) =>
        prevPinnedRows.filter((rowId) => rowId !== row.lead_id)
      );
    } else {
      // If not pinned, add it to the pinned rows
      setPinnedRows((prevPinnedRows) => [...prevPinnedRows, row.lead_id]);
    }

    // Call the API to update the pin status
    try {
      setOpen(true);

      const data = {
        pinned: !isPinned, // Toggle the pin status
        description: row.description || [],
      };

      await LeadServices.updateLeads(row.lead_id, data);
      getleads();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };

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
          "new",
          "-lead_id",
          filter,
          filterValue,
          search
        );
        setLeads(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        console.log("New leads get api", error);
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

  const Tableheaders = [
    "COMPANY",
    "NAME",
    "CONTACT",
    "ALTERNATE CONTACT",
    "CITY",
    "STATE",
    "PRIORITY",
    "STAGE",
    "ASSIGNED TO",
    "PIN",
    "ACTION",
  ];

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
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
      <Helmet>
        <style>
          {`
            @media print {
              html, body {
                filter: ${isPrinting ? "blur(10px)" : "none"} !important;
              }
            }
          `}
        </style>
      </Helmet>
      <CustomLoader open={open} />
      <Grid item xs={12}>
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

              {/* Dynamic Autocomplete Component */}
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
                        getleads(0, filterQuery, value, searchQuery); // Pass filterQuery and filterSelectedQuery as parameters
                      }
                    )}
                </Grid>
              )}

              {/* Search Field */}
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

              {/* Search and Reset Buttons */}
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
              <Grid item xs={12} sm={3}>
                {(userData.groups.includes("Director") ||
                  userData.groups.includes("Sales Manager")) && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                  >
                    Assign Bulk Lead
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            {/* Second Box with Title and Optional Buttons */}
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
              {/* New Leads Text - Center */}
              <Grid item xs={4} style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  New Leads
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
                <StyledTableRow>
                  {Tableheaders.map((header) => (
                    <StyledTableCell key={header} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {leads.map((row, i) => (
                  <StyledTableRow
                    key={row.i}
                    style={{
                      backgroundColor:
                        (PriorityColor[i] && PriorityColor[i].priority) || "",
                      cursor: "pointer", // Add cursor style to indicate it's clickable
                      "&:hover": {
                        backgroundColor: "#f5f5f5", // Add background color on hover
                      },
                      "&.pinned-row": {
                        backgroundColor: "#e0e0e0", // Set your desired background color for pinned rows
                      },
                    }}
                    className={
                      pinnedRows.includes(row.lead_id) ? "pinned-row" : ""
                    }
                  >
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.alternate_contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.priority}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton
                        onClick={(e) => handlePin(e, row)}
                        style={{ transform: "rotate(45deg)" }}
                      >
                        {row.pinned ? (
                          <PushPinIcon /> // Render this icon if the row is pinned
                        ) : (
                          <PushPinOutlinedIcon /> // Render this icon if the row is not pinned
                        )}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => openInPopup(row)}>View</Button>,
                      <Button onClick={() => openInPopup2(row)}>
                        Activity
                      </Button>
                      ,
                      <Button onClick={() => openInPopup3(row)}>
                        Potential
                      </Button>
                      ,<Button onClick={() => openInPopup4(row)}>PI</Button>,
                      <Button onClick={() => openInPopup5(row)}>
                        Forecast
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
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
      <Popup
        fullScreen={true}
        title={"Create Leads Proforma Invoice"}
        openPopup={openModalPI}
        setOpenPopup={setOpenModalPI}
      >
        <CreateLeadsProformaInvoice
          leadsByID={leadsByID}
          setOpenPopup={setOpenModalPI}
        />
      </Popup>
      <Popup
        // fullScreen={true}
        title={"Create Lead Forecast"}
        openPopup={openModalForecast}
        setOpenPopup={setOpenModalForecast}
      >
        <LeadForecastCreate
          leadsByID={leadsByID}
          setOpenPopup={setOpenModalForecast}
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
  // remove space between rows
  "& > td, & > th": {
    padding: 4,
  },
  // Add padding and margin styles
  // padding: 0,
  // paddingLeft: 4,
  // paddingRight: 4,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  // remove space between rows
  "& > td, & > th": {
    padding: 4,
  },
  // remove margin on left and right sides
  "& > td:first-child, & > th:first-child": {
    paddingLeft: 4,
  },
  "& > td:last-child, & > th:last-child": {
    paddingRight: 4,
  },
  // hover effect
  "&:hover": {
    backgroundColor: "lightgray !important", // Replace with your desired hover color
  },
}));
