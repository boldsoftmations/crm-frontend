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

export const NewCustomerListView = () => {
  const [open, setOpen] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [filterByDays, setFilterByDays] = useState("last 30 days");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
      const response = await CustomerServices.getNewCustomers(
        "all",
        filterValue,
        filterByDays
      );

      const data = response.data.map((row) => {
        return {
          name: row.name,
          status: row.status,
          assigned_to: row.assigned_to.join(" , "),
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
    { label: "Assigned To", key: "assigned_to" },
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
      const response = await CustomerServices.getNewCustomers(
        currentPage,
        filterValue,
        filterByDays
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
  }, [currentPage, filterValue, filterByDays]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterPerson = (event, value) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleFilterDays = (event, value) => {
    setFilterByDays(value);
    setCurrentPage(1);
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
                    options={["last 30 days", "last 60 days", "last 90 days"]}
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
                  {["Company", "Status", "Assigned", "Creation Date"].map(
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
                        {row.assigned_to.join(" , ")}
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
