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
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { CustomPagination } from "../../../Components/CustomPagination";
import MasterService from "../../../services/MasterService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import LeaveForm from "./CreateLeaveApplication";
import { Popup } from "../../../Components/Popup";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomTextField from "../../../Components/CustomTextField";
import { useSelector } from "react-redux";

export const LeaveApplicationForm = () => {
  const [open, setOpen] = useState(false);
  const [leaveFormData, setleaveFormData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openLeaveRequest, setOpenLeaveRequest] = useState(false);
  const [formData, setFormData] = useState({});
  const [leaveStatusUpdate, setLeaveStatusUpdate] = useState(false);
  const [filterValue, setFilterValue] = useState("");
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
  const giveAccess = ["Director", "HR"];
  const isAccess =
    profile && profile.groups.some((group) => giveAccess.includes(group));

  // Function to get product base customer data
  const getEmployeesLeaveForm = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getEmployeesLeaveForm(
        currentPage,
        filterValue
      );
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setleaveFormData(response.data.results);
      setOpen(false);
    } catch (err) {
      handleError("Failed to get product base customer data" || err);
      setOpen(false);
    }
  };

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getEmployeesLeaveForm();
  }, [currentPage, filterValue]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.decision) {
      setAlertMsg({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
      return;
    }

    if (formData.decision === "Rejected" && !formData.remarks) {
      setAlertMsg({
        open: true,
        message: "Please add the reason for rejection",
        severity: "warning",
      });
      return;
    }
    const formDataWithRecordId = { ...formData };

    try {
      setOpen(true);
      const res = await MasterService.leaveApproval(formDataWithRecordId);

      if (res.status === 201) {
        setAlertMsg({
          open: true,
          message: res.data.message || "Leave update submitted successfully",
          severity: "success",
        });

        setTimeout(() => {
          setLeaveStatusUpdate(false);
          getEmployeesLeaveForm();
        }, 500);

        setFormData({
          decision: "",
          remarks: "",
        });
      }
    } catch (err) {
      console.error("Error submitting leave request:", err);
      setAlertMsg({
        open: true,
        message: err.response.data.error || "Failed to submit leave request",
        severity: "error",
      });
    } finally {
      setOpen(false);
    }
  };
  const handleUpdateLeaveStatus = (data) => {
    setLeaveStatusUpdate(true);
    setFormData((prev) => {
      return {
        ...prev,
        leave: data.id,
      };
    });
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
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
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
                    Leave Application
                  </h3>
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
                    "Employee Name",
                    "Designation",
                    "Leave Type",
                    "Period",
                    "Status",
                    "Reason for leave",
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
                      <StyledTableCell
                        align="center"
                        sx={{ backgroundColor: "#fff3e0", fontStyle: "italic" }}
                      >
                        {row.reason}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.created_at}
                      </StyledTableCell>

                      {isAccess && (
                        <StyledTableCell align="center">
                          <Button
                            variant="text"
                            color="primary"
                            size="small"
                            disabled={
                              row.status === "Approved" ||
                              row.status === "Rejected"
                            }
                            onClick={() => handleUpdateLeaveStatus(row)}
                          >
                            View
                          </Button>
                        </StyledTableCell>
                      )}
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
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 500, mx: "auto" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  disablePortal
                  id="combo-box-description"
                  options={leaveStatusOptions2}
                  value={formData.leave_type}
                  onChange={(e, value) =>
                    setFormData({
                      ...formData,
                      decision: value ? value.value : "",
                    })
                  }
                  getOptionLabel={(option) => option.label}
                  label="Leave Approval"
                />
              </Grid>

              {formData.decision === "rejected" && (
                <Grid item xs={12}>
                  <CustomTextField
                    label="Reason for rejection"
                    name="remarks"
                    size="small"
                    value={formData.remarks}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
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

const leaveStatusOptions2 = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
