import React, { useCallback, useEffect, useState } from "react";
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
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { CustomPagination } from "../../../Components/CustomPagination";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import LeaveForm from "./CreateLeaveApplication";
import { Popup } from "../../../Components/Popup";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { useSelector } from "react-redux";
import ViewLeavAplicaton from "./ViewLeavAplicaton";

export const LeaveApplicationForm = () => {
  const [open, setOpen] = useState(false);
  const [leaveFormData, setleaveFormData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openLeaveRequest, setOpenLeaveRequest] = useState(false);
  const [leaveStatusUpdate, setLeaveStatusUpdate] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [searchValue, setsearchValue] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const { profile } = useSelector((state) => state.auth);

  //this is for access to deparment
  const giveAccess = ["Director"];
  const isAccess =
    profile && profile.groups.some((group) => giveAccess.includes(group));

  // Function to get product base customer data
  const getEmployeesLeaveForm = useCallback(async () => {
    try {
      setOpen(true);
      const response = await MasterService.getEmployeesLeaveForm(
        currentPage,
        filterValue,
        searchValue
      );
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setleaveFormData(response.data.results);

      setOpen(false);
    } catch (err) {
      handleError("Failed to get product base customer data" || err);
      setOpen(false);
    }
  }, [currentPage, filterValue, searchValue]);

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getEmployeesLeaveForm();
  }, [getEmployeesLeaveForm, selectedData]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleUpdateLeaveStatus = (data) => {
    setLeaveStatusUpdate(true);
    setSelectedData(data);
  };
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
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
              <Grid item xs={12} sm={2.5}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    onChange={(event, value) =>
                      setsearchValue(value ? value.user : "")
                    }
                    onInputChange={(event, newInputValue) =>
                      setsearchValue(newInputValue)
                    }
                    options={
                      leaveFormData
                        ? Array.from(
                            new Map(
                              leaveFormData.map((item) => [item.user, item])
                            ).values()
                          )
                        : []
                    }
                    getOptionLabel={(option) => option.user}
                    label="Filter By Name"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={5.5}>
                <Box display="flex">
                  <CustomAutocomplete
                    sx={{ width: "45%" }}
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    onChange={(event, value) =>
                      setFilterValue(value && value.value)
                    }
                    options={leaveStatusOptions}
                    getOptionLabel={(option) => option.label}
                    label="Filter By Leave Status"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                style={{
                  textAlign: "end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenLeaveRequest(true);
                  }}
                >
                  Leave Request
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="center" marginBottom="10px">
              <h3
                style={{
                  fontSize: "20px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Leave Application
              </h3>
            </Box>
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
                  {[
                    "SR NO",
                    "Employee Name",
                    "Designation",
                    "Leave Type",
                    "Period",
                    "Status",

                    "Leave Date",
                    isAccess ? "Action" : "",
                  ].map((header) => (
                    <StyledTableCell align="center">{header}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveFormData.length > 0 &&
                  leaveFormData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.user}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.designation}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.leave_type}
                      </StyledTableCell>

                      {/* Highlighted Period */}
                      <StyledTableCell
                        align="center"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          fontWeight: 600,
                          fontStyle: "italic",
                          color: "#37474f",

                          fontSize: "0.875rem",
                        }}
                      >
                        From {row.start_date}{" "}
                        <span style={{ fontWeight: 600, margin: "0 px" }}>
                          To
                        </span>{" "}
                        {row.end_date}
                      </StyledTableCell>

                      {/* Highlighted Status */}
                      <StyledTableCell
                        align="center"
                        sx={{
                          backgroundColor:
                            row.status === "Approved"
                              ? "#c8e6c9"
                              : row.status === "Rejected"
                              ? "#ffcdd2"
                              : "#fff9c4",
                          fontWeight: 600,
                          color: "#37474f",
                        }}
                      >
                        {row.status}
                      </StyledTableCell>

                      {/* Highlighted Reason */}

                      <StyledTableCell align="center">
                        {row.created_at}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          // disabled={row.is_view || isAccess ? false : true}
                          onClick={() => handleUpdateLeaveStatus(row)}
                        >
                          View
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

        <Popup
          maxWidth="md"
          title={"Leave Application Form"}
          setOpenPopup={setOpenLeaveRequest}
          openPopup={openLeaveRequest}
        >
          <LeaveForm
            setOpenLeaveRequest={setOpenLeaveRequest}
            getEmployeesLeaveForm={getEmployeesLeaveForm}
          />
        </Popup>
        <Popup
          title={"Update Leave Application Form"}
          setOpenPopup={setLeaveStatusUpdate}
          openPopup={leaveStatusUpdate}
          fullScreen={true}
        >
          <ViewLeavAplicaton
            getEmployeesLeaveForm={getEmployeesLeaveForm}
            setLeaveStatusUpdate={setLeaveStatusUpdate}
            selectedRow={selectedData}
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

const leaveStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
