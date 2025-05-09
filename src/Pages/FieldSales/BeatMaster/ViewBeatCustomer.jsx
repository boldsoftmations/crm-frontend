import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Typography,
  tableCellClasses,
} from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import MasterService from "../../../services/MasterService";
import { Popup } from "../../../Components/Popup";
import { ViewCustomerList } from "./BeatCustomerLIst";
import { MasterCustomerVisitList } from "../MasterCustomerVisitList";
import { MasterLeadsData } from "../MasterLeadsData";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const ViewBeatCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [beatCustomers, setbeatCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [leadmodalOpen, setLeadModalOpen] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [customrData, setCustomrData] = useState(null);
  const [beatName, setBeatName] = useState(null);
  const [customerType, setCustomerType] = useState("Customer");
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const getbeatCustomers = async () => {
    try {
      setIsLoading(true);
      const response =
        customerType === "Customer"
          ? await MasterService.getBeatCustomers(currentPage, searchQuery)
          : await MasterService.getBeatLeads(currentPage, searchQuery);
      setbeatCustomers(response.data.results || []);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching beat list",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //open popup and get customer data from props

  const handleOpenPopup = (data) => {
    setModalOpen(true);
    setBeatName(data.beat);
    setCustomrData(data);
  };

  const openCustomerDataToAddInBeat = (data) => {
    const propsId = data.id;
    setRecordId(propsId);
    setModalOpen2(true);
    setBeatName(data.beat);
  };

  useEffect(() => {
    getbeatCustomers();
  }, [currentPage, searchQuery, customerType]);

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={isLoading} />

      <Grid item xs={12}>
        <Paper sx={{ p: 3, m: 3 }}>
          {/* Header Section */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} sm={12} md={3}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
              <CustomAutocomplete
                size="small"
                fullWidth
                value={customerType}
                onChange={(event, value) => setCustomerType(value)}
                options={["Customer", "Lead"]}
                getOptionLabel={(option) => option}
                label="Filter By Customers or Leads"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Beat with {customerType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={3} textAlign="right">
              {customerType === "Customer" && (
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => setModalOpen2(true)}
                  style={{ marginRight: "1rem" }}
                >
                  Add Customers{" "}
                </Button>
              )}
              {customerType === "Lead" && (
                <Button
                  variant="contained"
                  size="medium"
                  color="secondary"
                  onClick={() => setLeadModalOpen(true)}
                >
                  Add Leads{" "}
                </Button>
              )}
            </Grid>
          </Grid>

          {/* Table Section */}
          <TableContainer
            sx={{
              maxHeight: 480,
              mt: 3,
              "&::-webkit-scrollbar": {
                width: 10,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Beat Name", "Created By", "Creation Date", "Action"].map(
                    (header, id) => (
                      <StyledTableCell key={id} align="center">
                        {header}
                      </StyledTableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {beatCustomers.length > 0 ? (
                  beatCustomers.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.beat}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.created_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.creation_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenPopup(row)}
                        >
                          {customerType === "Customer"
                            ? " View Customer"
                            : "View Leads"}
                        </Button>

                        <Button
                          variant="text"
                          color="secondary"
                          size="small"
                          onClick={() => openCustomerDataToAddInBeat(row)}
                        >
                          {customerType === "Customer"
                            ? " Add Customers"
                            : "Add Leads"}
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={3}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={2}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </Box>

          <Popup
            fullScreen={true}
            title={`${beatName}-${customerType}s`}
            openPopup={modalOpen}
            setOpenPopup={setModalOpen}
          >
            <ViewCustomerList
              customer={customrData}
              getbeatCustomers={getbeatCustomers}
              customerType={customerType}
              setCustomerType={setCustomerType}
            />
          </Popup>
          <Popup
            fullScreen={true}
            title={`Add ${customerType}s into the beat`}
            openPopup={modalOpen2}
            setOpenPopup={setModalOpen2}
          >
            {customerType === "Customer" ? (
              <MasterCustomerVisitList
                getbeatCustomers={getbeatCustomers}
                setOpenPopup={setModalOpen2}
                recordId={recordId}
                setRecordId={setRecordId}
              />
            ) : (
              <MasterLeadsData
                getbeatCustomers={getbeatCustomers}
                setOpenPopup={setModalOpen2}
                recordId={recordId}
                setRecordId={setRecordId}
              />
            )}
          </Popup>

          <Popup
            fullScreen={true}
            title={`Add leads into the beat`}
            openPopup={leadmodalOpen}
            setOpenPopup={setLeadModalOpen}
          >
            <MasterLeadsData
              getbeatCustomers={getbeatCustomers}
              setOpenPopup={setLeadModalOpen}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
