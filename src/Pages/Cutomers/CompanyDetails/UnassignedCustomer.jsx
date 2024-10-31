import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Button,
  Chip,
  Paper,
  Box,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { useSelector } from "react-redux";
import { UpdateAllCompanyDetails } from "./UpdateAllCompanyDetails";

export const UnassignedCustomer = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupOfUpdateCustomer, setOpenPopupOfUpdateCustomer] =
    useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState();
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [FilterSearchvalue, setFilterSearchvalue] = useState("");
  const [assign, setAssign] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  //asssign to user
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.active_sales_user;

  const openInPopup = (item) => {
    const matchedCompany = companyData.find(
      (company) => company.id === item.id
    );
    setRecordForEdit(matchedCompany);
    setOpenPopup(true);
  };

  const getUnassignedCompanyDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getUnassignedData(
        currentPage,
        searchQuery,
        FilterSearchvalue
      );
      setCompanyData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery, FilterSearchvalue]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getUnassignedCompanyDetails();
  }, [currentPage, searchQuery, FilterSearchvalue]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type_of_customer: recordForEdit.type_of_customer,
        name: recordForEdit.name,
        address: recordForEdit.address,
        pincode: recordForEdit.pincode,
        state: recordForEdit.state,
        city: recordForEdit.city,
        website: recordForEdit.website,
        estd_date: recordForEdit.estd_date,
        gst_number: recordForEdit.gst_number || null,
        pan_number: recordForEdit.pan_number || null,
        business_type: recordForEdit.business_type,
        origin_type: recordForEdit.origin_type,
        assigned_to: assign ? assign : "",
      };
      const response = await CustomerServices.updateCompanyData(
        recordForEdit.id,
        req
      );
      const successMessage =
        response.data.message || "Company Detail Updated Created successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getUnassignedCompanyDetails();
        setAssign([]);
      }, 300);
    } catch (error) {
      handleError(error);
      console.log("createing Unassigned company detail error", error);
    } finally {
      setOpen(false);
    }
  };
  const Tableheaders = [
    "NAME",
    "PAN NO.",
    "GST NO.",
    "CITY",
    "STATE",
    "ACTION",
  ];

  const openInPopupOfUpdateCustomer = (item) => {
    setRecordForEdit(item.id);
    setSelectedCustomers(item);
    setOpenPopupOfUpdateCustomer(true);
  };

  const handlFilterCustomer = (data) => {
    if (data && data.value) {
      setFilterSearchvalue(data.value);
      setCurrentPage(1); // Reset to first page with new filter
    } else {
      setFilterSearchvalue("");
    }
  };
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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Unassigned Customer
                </h3>
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  disablePortal
                  id="combo-box-status"
                  options={TypeCustomer}
                  onChange={(e, value) => handlFilterCustomer(value)}
                  getOptionLabel={(option) => option.label}
                  label="Filter By Customer"
                />
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
                <TableRow>
                  {Tableheaders.map((header) => {
                    return (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {companyData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pan_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.gst_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        style={{ marginRight: "10px" }}
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => openInPopupOfUpdateCustomer(row)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => openInPopup(row)}
                      >
                        Assign
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      <Popup
        maxWidth={"lg"}
        title={"Assign To Customer"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              value={assign}
              onChange={(event, newValue) => {
                setAssign(newValue);
              }}
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={assigned.map((option) => option.email)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              label="Assign To"
              placeholder="Assign To"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => UpdateCompanyDetails(e)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Customer"}
        openPopup={openPopupOfUpdateCustomer}
        setOpenPopup={setOpenPopupOfUpdateCustomer}
      >
        <UpdateAllCompanyDetails
          setOpenPopup={setOpenPopupOfUpdateCustomer}
          recordForEdit={recordForEdit}
          getAllCompanyDetails={getUnassignedCompanyDetails}
          selectedCustomers={selectedCustomers}
        />
      </Popup>
    </>
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

const TypeCustomer = [
  {
    value: "industrial_customer",
    label: "Industrial Customer",
  },
  {
    value: "distribution_customer",
    label: "Distribution Customer",
  },
  {
    value: "Exclusive Distribution Customer",
    label: "Exclusive Distribution Customer",
  },
];
