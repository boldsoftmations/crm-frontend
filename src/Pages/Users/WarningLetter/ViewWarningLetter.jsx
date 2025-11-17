import React, { useEffect, useState } from "react";
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
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { viewWarningLetter } from "../../../services/Hr";
import SearchComponent from "../../../Components/SearchComponent ";
import { useSelector } from "react-redux";
import { Popup } from "../../../Components/Popup";

export const ViewWarningLetter = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [leaveFormData, setleaveFormData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const { profile } = useSelector((state) => state.auth);
  const { active_sales_user } = profile;

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [employeeWarningpopup, setEmployeeWarningpopup] = useState(false);
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  // Function to get product base customer data
  const getEmployeesLeaveForm = async () => {
    try {
      setOpen(true);
      const response = await viewWarningLetter(
        currentPage,
        searchQuery,
        filterValue
      );
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setleaveFormData(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getEmployeesLeaveForm();
  }, [currentPage, searchQuery, filterValue]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };
  const handelView = () => {
    setEmployeeWarningpopup(true);
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="center" marginBottom="10px">
                  <h3
                    style={{
                      fontSize: "20px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    Warning letter
                  </h3>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    onChange={(event, value) =>
                      setFilterValue(value && value.email)
                    }
                    options={active_sales_user}
                    getOptionLabel={(option) => option.name}
                    label="Filter By Employee "
                  />
                </Box>
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
                  {[
                    "Employee Id",
                    "Issued By",
                    "Warning Type",
                    "Subject",
                    "Warning Remarks",
                    "Action",
                  ].map((header, id) => (
                    <StyledTableCell key={id} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveFormData.length > 0 &&
                  leaveFormData.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">
                        {row.employee}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.issued_by}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.level}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.subject}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.remarks}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button onClick={handelView}>view</Button>
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
          <Popup
            title={"Update Active Users"}
            openPopup={employeeWarningpopup}
            setOpenPopup={setEmployeeWarningpopup}
          ></Popup>
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
