import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Box,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CSVLink } from "react-csv";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomPagination } from "../../Components/CustomPagination";

import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomSearchWithButton } from "./../../Components/CustomSearchWithButton";

const filterOption = [
  { label: "Search", value: "search" },
  { label: "Sales Person", value: "assigned_to__email" },
];

export const DeadCustomerView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterQuery, setFilterQuery] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [deadCustomer, setDeadCustomer] = useState([]);
  const [exportDeadCustomer, setExportDeadCustomer] = useState([]);

  useEffect(() => {
    getLAssignedData();
  }, []);

  const getLAssignedData = async () => {
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
    getAllProductionForecastDetails();
  }, []);

  const getAllProductionForecastDetails = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response =
          await ProductForecastService.getDeadCustomerPaginateData(currentPage);
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductForecastService.getDeadCustomer();
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductForecastService.getAllSearchDeadCustomer(
        filterQuery,
        filterSearch
      );
      if (response) {
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllProductionForecastDetails();
        setSearchQuery("");
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

      if (searchQuery) {
        const response =
          await ProductForecastService.getAllDeadCustomerPaginate(
            page,
            filterQuery,
            searchQuery
          );
        if (response) {
          setDeadCustomer(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getAllProductionForecastDetails();
          setSearchQuery("");
        }
      } else {
        const response =
          await ProductForecastService.getDeadCustomerPaginateData(page);
        setDeadCustomer(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");

    getAllProductionForecastDetails();
  };

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(searchQuery);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllCustomerWiseOrderBookExport();
  }, [searchQuery]);

  const getAllCustomerWiseOrderBookExport = async () => {
    try {
      setOpen(true);
      if (searchQuery) {
        const response =
          await ProductForecastService.getAllPaginateDeadCustomerWithSearch(
            "all",
            filterQuery,
            searchQuery
          );
        setExportDeadCustomer(response.data);
        //   const total = response.data.count;
        //   setpageCount(Math.ceil(total / 25));
      } else {
        const response =
          await ProductForecastService.getAllPaginateDeadCustomer("all");
        setExportDeadCustomer(response.data);
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

  const headers = [
    { label: "Company", key: "company" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Sales Person", key: "assigned_to" },
    { label: "Contact Person Name", key: "contact_person_name" },
    { label: "Contact", key: "contact" },
  ];

  const data = exportDeadCustomer.map((row) => {
    const obj = {
      company: row.name,
      city: row.city,
      state: row.state,
      sales_person: row.assigned_to,
      contact_person_name:
        row.contacts && row.contacts[0] ? row.contacts[0].name : "",
      contact: row.contacts && row.contacts[0] ? row.contacts[0].contact : "",
    };
    return obj;
  });

  return (
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
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
                  {filterOption.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box flexGrow={1}>
              {filterQuery === "assigned_to__email" ? (
                <FormControl
                  sx={{ minWidth: "200px", marginLeft: "1em" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-label">
                    Filter By Sales Person
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="values"
                    label="Filter By State"
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
              ) : (
                <CustomSearchWithButton
                  filterSelectedQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
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
                Dead Customer
              </h3>
            </Box>
            <Box flexGrow={0.5}>
              <CSVLink
                data={data}
                headers={headers}
                filename={"product_forecast.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button variant="contained" color="success">
                  Export to Excel
                </Button>
              </CSVLink>
            </Box>
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
            component={Paper}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">CITY</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">SALES PERSON</StyledTableCell>
                  <StyledTableCell align="center">
                    CONTACT PERSON
                  </StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {deadCustomer.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to.map((assignedTo) => {
                        return (
                          row.assigned_to &&
                          row.assigned_to.length > 0 && (
                            <div
                              style={{
                                border: "1px solid #4caf50",
                                borderRadius: "20px",
                                padding: "4px 8px",
                                color: "#4caf50",
                              }}
                            >
                              {assignedTo}
                            </div>
                          )
                        );
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contacts && row.contacts[0]
                        ? row.contacts[0].name
                        : ""}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.contacts && row.contacts[0]
                        ? row.contacts[0].contact
                        : ""}
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
    </div>
  );
};

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
