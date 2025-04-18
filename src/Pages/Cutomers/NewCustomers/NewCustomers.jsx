import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomerServices from "../../../services/CustomerService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { Popup } from "../../../Components/Popup";
import CustomDate from "../../../Components/CustomDate";

export const NewCustomerListView = () => {
  const [open, setOpen] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [openCustomDate, setOpenCustomDate] = useState(false);
  const [filterByDays, setFilterByDays] = useState("last 30 days");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.active_sales_user || [];
  const csvLinkRef = useRef(null);
  const [exportData, setExportData] = useState([]);
  const roles = [
    "Business Development Executive",
    "Business Development Manager",
    "Sales Executive",
  ];

  const filterBDEPerson = assigned.filter((group) =>
    roles.includes(group.groups__name)
  );

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  //export data

  const handleExport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await CustomerServices.getNewCustomers(
        "all",
        filterValue,
        filterByDays,
        StartDate,
        EndDate
      );

      const data = response.data.map((row) => {
        return {
          name: row.name,
          status: row.status,
          created_by: row.created_by,
          creation_date: row.creation_date,
        };
      });
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Status", key: "status" },
    { label: "Converted By", key: "created_by" },
    { label: "Creation Date", key: "creation_date" },
  ];
  //handle export function

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  // Function to get product base customer data
  const getNewCustomers = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await CustomerServices.getNewCustomers(
        currentPage,
        filterValue,
        filterByDays,
        StartDate,
        EndDate
      );
      setCustomerList(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setOpen(false);
    } catch (err) {
      handleError("Failed to get product base customer data" || err);
      setOpen(false);
    }
  };

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getNewCustomers();
  }, [currentPage, filterValue, filterByDays, endDate, startDate]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterPerson = (event, value) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleFilterDays = (event, value) => {
    if (value === "Custom Date") {
      setOpenCustomDate(true);
      setStartDate(new Date());
      setEndDate(new Date());
      setFilterByDays("");
      setCurrentPage(1);
    } else {
      setFilterByDays(value);
      setCurrentPage(1);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleStartDateChange = (e) => {
    let date = new Date(e.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (e) => {
    let date = new Date(e.target.value);
    setEndDate(date);
  };

  const resetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    onChange={handleFilterPerson}
                    value={filterValue}
                    options={filterBDEPerson.map((option) => option.name)}
                    getOptionLabel={(option) => option}
                    label="Filter By Sales Person"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    value={filterByDays}
                    onChange={handleFilterDays}
                    options={[
                      "last 30 days",
                      "last 60 days",
                      "last 90 days",
                      "Custom Date",
                    ]}
                    getOptionLabel={(option) => option}
                    label="Filter by days"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  className="mx-3"
                  onClick={handleDownload}
                >
                  DownLoad CSV
                </Button>

                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="New Customer.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" marginBottom="10px">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  New Customer List
                </h3>
              </Box>
            </Grid>
          </Grid>

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
                  {["Company", "Status", "Converted By", "Creation Date"].map(
                    (header) => (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {customerList.length > 0 &&
                  customerList.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.status}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.created_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.creation_date}
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
        <Popup
          maxWidth="md"
          setOpenPopup={setOpenCustomDate}
          openPopup={openCustomDate}
        >
          <CustomDate
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            resetDate={resetDate}
          />
        </Popup>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
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
