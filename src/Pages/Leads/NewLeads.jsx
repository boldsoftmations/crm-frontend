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
  Autocomplete,
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
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { BulkLeadAssign } from "./BulkLeadAssign";
import { useDispatch, useSelector } from "react-redux";
import InvoiceServices from "../../services/InvoiceService";
import { getSellerAccountData } from "../../Redux/Action/Action";
import { CustomSearchWithButton } from "../../Components/CustomSearchWithButton";
import { LeadActivityCreate } from "../FollowUp/LeadActivityCreate";
import { PotentialCreate } from "../Potential/PotentialCreate";
import { CreateLeadsProformaInvoice } from "../Invoice/ProformaInvoice/CreateLeadsProformaInvoice";
import { Helmet } from "react-helmet";
import Option from "../../Options/Options";
import CustomTextField from "../../Components/CustomTextField";

export const NewLeads = () => {
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
  const [pinnedRows, setPinnedRows] = useState([]);
  const [openModalPI, setOpenModalPI] = useState(false);
  const [leadsByID, setLeadsByID] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [product, setProduct] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tokenData = useSelector((state) => state.auth);
  const users = tokenData.profile;
  const [isPrinting, setIsPrinting] = useState(false);

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

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(filterQuery, filterSelectedQuery, searchQuery);
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

  const openInPopup4 = (item) => {
    setLeadsByID(item.lead_id);
    setOpenModalPI(true);
  };

  const getResetSearchData = () => {
    setSearchQuery("");
    getSearchData(filterQuery, filterSelectedQuery, null); // Pass an empty string as the second parameter
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

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
    getAssignedData();
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

      const filterValue = filterSelectedQuery || null;
      const searchValue = searchQuery || null;
      const isFiltered =
        filterQuery !== "" && filterValue !== null && searchValue !== null;

      let response;
      if (isFiltered) {
        response = await LeadServices.getAllSearchWithFilteredLeads(
          "new",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );
      } else if (currentPage) {
        response = await LeadServices.getFilterPaginateLeads(
          currentPage,
          "new",
          "-lead_id",
          filterQuery,
          filterValue,
          searchValue
        );
      } else {
        response = await LeadServices.getAllLeads("new", "-lead_id");
      }

      if (response) {
        // Assuming response.data.references_list is the array you are referring to
        const references_list = response.data.references_list;

        // Filter out null values from references_list
        const filteredReferences = references_list.filter((ref) => ref != null);

        // Only update state if filteredReferences is not empty
        if (filteredReferences.length > 0) {
          setReferenceData(filteredReferences); // Assuming you have a state variable called references
        }
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
            "new",
            "-lead_id",
            filterQuery,
            filterSelectedQuery,
            searchQuery
          );
        } else {
          response = await LeadServices.getFilteredLeads(
            "new",
            "-lead_id",
            filterQuery,
            filterSelectedQuery
          );
        }
      } else if (searchQuery) {
        response = await LeadServices.getSearchLeads(
          "new",
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
          "new",
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
          "new",
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
          "new",
          "-lead_id",
          searchValue
        );
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await LeadServices.getAllPaginateLeads(
          page,
          "new",
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

  return (
    <>
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
                  ? referenceData.map((option) => option)
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
              users.groups.toString() === "Sales Deputy Manager" ||
              users.groups.toString() === "Sales Assistant Deputy Manager") && (
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
              New Leads
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
                      ,<Button onClick={() => openInPopup4(row)}>PI</Button>
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
