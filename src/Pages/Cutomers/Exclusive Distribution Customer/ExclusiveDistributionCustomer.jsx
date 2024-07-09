import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomerServices from "../../../services/CustomerService";
import { Popup } from "../../../Components/Popup";
import { useSelector } from "react-redux";
import { ViewAssignCustomers } from "./ViewAssignCustomer";
import { ViewLeadCustomer } from "./ViewLeadCustomer";

export const ExclusiveDistributionCustomer = () => {
  const [open, setOpen] = useState(false);
  const [edtData, setEdtData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEDC, setOpenEDC] = useState(false);
  const [openLeadCustomer, setOpenLeadCustomer] = useState(false);
  const [assignCustomerData, setAssignCustomerData] = useState([]);
  const [leadCustomerData, setLeadCustomerData] = useState([]);
  const [assignViewData, setAssignViewData] = useState([]);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllEDC = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllEdc();
      setEdtData(response.data);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const handleLeadCustomer = async (name) => {
    try {
      setOpen(true);
      setAssignCustomerData(name);
      const response = await CustomerServices.AllLeadEDC(name.name);
      setLeadCustomerData(response.data);
      setOpenLeadCustomer(true);
    } catch (e) {
      handleError(e);
    } finally {
      setOpen(false);
    }
  };

  const handleViewAssignCustomer = async (data) => {
    try {
      setOpen(true);
      setAssignCustomerData(data);
      const response = await CustomerServices.AllEdcCustomer(data.name);
      setAssignViewData(response.data);
      setOpenEDC(true);
    } catch (e) {
      handleError(e);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllEDC();
  }, []);
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
                md={5}
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
                  Exclusive Distribution Customers
                </h3>
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
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">PAN NO.</StyledTableCell>
                  <StyledTableCell align="center">GST</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">STATUS</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {edtData.map((row, i) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pan_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.gst_number}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {userData.groups.includes("Accounts") ||
                        (userData.groups.includes("Director") && (
                          <>
                            <Button
                              color="success"
                              variant="contained"
                              className="mx-3"
                              onClick={() => handleViewAssignCustomer(row)}
                            >
                              View Assign Customer
                            </Button>
                            <Button
                              color="secondary"
                              variant="outlined"
                              onClick={() => handleLeadCustomer(row)}
                            >
                              View lead
                            </Button>
                          </>
                        ))}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      <Popup
        fullScreen={true}
        openPopup={openEDC}
        setOpenPopup={setOpenEDC}
        title="View Assign Customer"
      >
        <ViewAssignCustomers
          assignCustomerData={assignCustomerData}
          getAllEDC={getAllEDC}
          closeModal={setOpenEDC}
          assignViewData={assignViewData}
        />
      </Popup>

      <Popup
        fullScreen={true}
        openPopup={openLeadCustomer}
        setOpenPopup={setOpenLeadCustomer}
        title="View Lead Customer"
      >
        <ViewLeadCustomer
          leadCustomerData={leadCustomerData}
          assignCustomerData={assignCustomerData}
          getAllEDC={getAllEDC}
          closeModal={setOpenLeadCustomer}
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
