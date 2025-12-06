import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useSelector } from "react-redux";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomAxios from "../../../services/api";

export const ViewEmployeesAttendance = () => {
  const [open, setOpen] = useState(false);
  const [employeesAttendanceList, setEmployeesAttendanceList] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterByDesignation, setFilterByDesignation] = useState("");
  // const [filterByDays, setFilterByDays] = useState("last 30 days");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //   const [startDate, setStartDate] = useState(null);
  //   const [endDate, setEndDate] = useState(null);
  //   const minDate = new Date().toISOString().split("T")[0];
  //   const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const userData = useSelector((state) => state.auth.profile);
  const employeeList = useMemo(() => {
    return userData.active_sales_user || [];
  }, []);
  //   const csvLinkRef = useRef(null);
  //   const [exportData, setExportData] = useState([]);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  //export data

  //   const handleExport = async () => {
  //     try {
  //       setOpen(true);
  //       const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
  //       const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
  //       const response = await CustomerServices.getEmployeesAttendance(
  //         "all",
  //         filterValue,
  //         filterByDays,
  //         StartDate,
  //         EndDate
  //       );

  //       const data = response.data.map((row) => {
  //         return {
  //           name: row.name,
  //           status: row.status,
  //           created_by: row.created_by,
  //           creation_date: row.creation_date,
  //         };
  //       });
  //       setOpen(false);
  //       return data;
  //     } catch (error) {
  //       handleError(error);
  //     } finally {
  //       setOpen(false);
  //     }
  //   };

  //   const headers = [
  //     { label: "Name", key: "name" },
  //     { label: "Status", key: "status" },
  //     { label: "Converted By", key: "created_by" },
  //     { label: "Creation Date", key: "creation_date" },
  //   ];
  //handle export function

  //   const handleDownload = async () => {
  //     try {
  //       const data = await handleExport();
  //       setExportData(data);
  //       setTimeout(() => {
  //         csvLinkRef.current.link.click();
  //       });
  //     } catch (error) {
  //       console.log("CSVLink Download error", error);
  //     }
  //   };

  // Function to get product base customer data
  const getEmployeesAttendance = async () => {
    try {
      setOpen(true);
      //   const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      //   const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await MasterService.EmployeesAttendance(
        currentPage,
        filterEmployee,
        filterByDesignation
      );
      setEmployeesAttendanceList(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setOpen(false);
    } catch (err) {
      handleError("Failed to get product base customer data" || err);
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await CustomAxios.get("/api/user/groups/");
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchDesignations();
  }, []);

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getEmployeesAttendance();
  }, [currentPage, filterEmployee, filterByDesignation]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleFilterPerson = (value, type) => {
    const FilterValue = value;
    if (type === "employee") {
      setFilterEmployee(FilterValue);
      setCurrentPage(1);
    } else if (type === "designation") {
      setFilterByDesignation(FilterValue);
      setCurrentPage(1);
    }
  };

  //   const handleFilterDays = (event, value) => {
  //     if (value === "Custom Date") {
  //       setOpenCustomDate(true);
  //       setStartDate(new Date());
  //       setEndDate(new Date());
  //       setFilterByDays("");
  //       setCurrentPage(1);
  //     } else {
  //       setFilterByDays(value);
  //       setCurrentPage(1);
  //       setStartDate(null);
  //       setEndDate(null);
  //     }
  //   };

  //   const handleStartDateChange = (e) => {
  //     let date = new Date(e.target.value);
  //     setStartDate(date);
  //     setEndDate(new Date());
  //   };

  //   const handleEndDateChange = (e) => {
  //     let date = new Date(e.target.value);
  //     setEndDate(date);
  //   };

  //   const resetDate = () => {
  //     setStartDate(new Date());
  //     setEndDate(new Date());
  //   };
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
                    onChange={(e, value) =>
                      handleFilterPerson(value, "employee")
                    }
                    options={employeeList.map((option) => option.name)}
                    getOptionLabel={(option) => option}
                    label="Filter By Employee"
                  />
                </Box>
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
                    Employees Attendance
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
                    onChange={(e, value) =>
                      handleFilterPerson(value, "designation")
                    }
                    options={designations.map((option) => option.name)}
                    getOptionLabel={(option) => option}
                    label="Filter By Designation"
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
                    "Name",
                    "Designation",
                    "Attendance Date",
                    "Check-In",
                    "Check-Out",
                  ].map((header) => (
                    <StyledTableCell align="center">{header}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employeesAttendanceList.length > 0 &&
                  employeesAttendanceList.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.user}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.designation}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.attendance_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.check_in_time}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.check_out_time}
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
        {/* <Popup
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
        </Popup> */}
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
