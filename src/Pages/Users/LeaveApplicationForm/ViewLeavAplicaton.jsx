import React, { useEffect } from "react";
import MasterService from "../../../services/MasterService";
import { useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import { MessageAlert } from "../../../Components/MessageAlert";
import {
  Box,
  Grid,
  Button,
  Paper,
  TextareaAutosize,
  Typography,
  Card,
  Chip,
} from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { Popup } from "../../../Components/Popup";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from "@mui/lab";
import moment from "moment";
import { useSelector } from "react-redux";
import { Cancel, CheckCircle, Pending } from "@mui/icons-material";

const ViewLeavAplicaton = ({
  getEmployeesLeaveForm,
  setLeaveStatusUpdate,
  selectedRow,
}) => {
  const [alertMsg, setAlertMsg] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const userData = useSelector((state) => state.auth.profile);

  const [formData, setFormData] = useState({
    decision: "",
    remarks: "",
    leave: selectedRow.id,
  });
  const [ApprovalData, setApprovalData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const [open, setOpen] = useState(false);
  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));
  const [isdisable, setDisable] = useState(true);

  const getEmployeesApproval = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getLeavapproval();
      const filterId = response.data.results.filter(
        (item) => item.leave === selectedRow.id
      );

      setApprovalData(filterId);
      setOpen(false);
    } catch (err) {
      setAlertMsg({
        open: true,
        message: err.message,
        severity: "error",
      });
      setOpen(false);
    }
  };
  useEffect(() => {
    getEmployeesApproval();
  }, [selectedRow]);

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
      if (formData.decision === "Accepted" && !formData.remarks) {
        setAlertMsg({
          open: true,
          message: "Please add the reason for Acceptance",
          severity: "warning",
        });
      }
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
          leave: "",
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const AdminAccess = isInGroups("Director");

  useEffect(() => {
    if (ApprovalData.some((item) => item.reviewed_by_designation === "HR")) {
      setDisable(false);
    }
  }, [ApprovalData]);

  const canCreateActivity =
    // 1. If flow is at this designation and is_view true
    (selectedRow.is_view && isdisable) || AdminAccess;
  return (
    <>
      <CustomLoader open={open} />

      <MessageAlert
        open={alertMsg.open}
        onClose={handleCloseSnackbar}
        severity={alertMsg.severity}
        message={alertMsg.message}
      />
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box display="flex">
            <Box flexGrow={0.9} align="left"></Box>
            <Box flexGrow={2.5} align="center">
              <h3 className="Auth-form-title">View Activity</h3>
            </Box>
            <Box flexGrow={0.3} align="right">
              {" "}
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenPopup(true)}
                disabled={!canCreateActivity}
              >
                Create Activity
              </Button>
            </Box>
          </Box>
          {selectedRow && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 450,
                overflow: "hidden",
                overflowY: "scroll",
                // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
              }}
            >
              <div key={selectedRow.id}>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ px: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {moment(selectedRow.created_at, "YYYY-MM-DD").format(
                          "DD MMM YYYY"
                        )}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          selectedRow.status === "Pending"
                            ? "warning"
                            : selectedRow.status === "Approved"
                            ? "success"
                            : "error"
                        }
                      >
                        {selectedRow.status === "Pending" ? (
                          <Pending fontSize="small" />
                        ) : selectedRow.status === "Approved" ? (
                          <CheckCircle fontSize="small" />
                        ) : (
                          <Cancel fontSize="small" />
                        )}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ width: "80%", color: "#333" }}>
                      {/* <Typography
                            variant="body1"
                            sx={{ fontFamily: "Verdana", fontSize: "16px" }}
                          >
                            {selectedRow.reviewed_by_designation}
                            {"==>"}
                            {selectedRow.reviewed_by_name}
                          </Typography> */}
                      <Card className="p-4 shadow-md rounded-2xl mb-4">
                        <div className="flex items-center justify-between gap-10  ">
                          <Chip
                            label={selectedRow.designation}
                            color={
                              selectedRow.status === "Pending"
                                ? "warning"
                                : selectedRow.status === "Approved"
                                ? "success"
                                : "error"
                            }
                          />
                        </div>
                        <div className="mt-2 text-gray-800">
                          <strong>Requsted By:</strong> {selectedRow.user}
                        </div>
                        <div className="mt-2 text-gray-600">
                          <strong>Reason:</strong> {selectedRow.reason}
                        </div>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </div>
              {ApprovalData &&
                ApprovalData.slice()
                  .reverse()
                  .map((Approvdata, key) => (
                    <>
                      <div key={key}>
                        <Timeline
                          sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                              flex: 0.2,
                            },
                          }}
                        >
                          <TimelineItem>
                            <TimelineOppositeContent sx={{ px: 2 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {moment(
                                  Approvdata.reviewed_at,
                                  "YYYY-MM-DD hh:mm A"
                                ).format("DD MMM YYYY, h:mm A")}
                              </Typography>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                              <TimelineDot
                                color={
                                  Approvdata.decision === "Approved"
                                    ? "success"
                                    : "error"
                                }
                              >
                                {Approvdata.decision === "Approved" ? (
                                  <CheckCircle fontSize="small" />
                                ) : (
                                  <Cancel fontSize="small" />
                                )}
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent
                              sx={{ width: "80%", color: "#333" }}
                            >
                              {/* <Typography
                            variant="body1"
                            sx={{ fontFamily: "Verdana", fontSize: "16px" }}
                          >
                            {selectedRow.reviewed_by_designation}
                            {"==>"}
                            {selectedRow.reviewed_by_name}
                          </Typography> */}
                              {/* <Card className="p-4 shadow-md rounded-2xl mb-4">
                              <div className="flex items-center justify-between gap-10  ">
                                <Chip
                                  label={selectedRow.designation}
                                  color="warning"
                                />
                              </div>
                              <div className="mt-2 text-gray-800">
                                <strong>Requsted By:</strong> {selectedRow.user}
                              </div>
                              <div className="mt-2 text-gray-600">
                                <strong>Remark:</strong> {selectedRow.reason}
                              </div>
                            </Card> */}

                              <Card className="p-4 shadow-md rounded-2xl mb-4">
                                <div className="flex items-center justify-between gap-10  ">
                                  <Chip
                                    label={Approvdata.reviewed_by_designation.replace(
                                      ",",
                                      " &"
                                    )}
                                    color={
                                      Approvdata.decision === "Approved"
                                        ? "success"
                                        : "error"
                                    }
                                  />
                                </div>
                                <div className="mt-2 text-gray-800">
                                  <strong>
                                    {Approvdata.decision === "Approved"
                                      ? "Approved By:"
                                      : "Rejected By:"}
                                  </strong>{" "}
                                  {Approvdata.reviewed_by}
                                </div>
                                <div className="mt-2 text-gray-600">
                                  <strong>Message:</strong> {Approvdata.remarks}
                                </div>
                              </Card>
                            </TimelineContent>
                          </TimelineItem>
                        </Timeline>
                      </div>
                    </>
                  ))}
            </Box>
          )}
        </Paper>
      </Box>

      <Popup
        maxWidth="md"
        title={"Leave Application Form"}
        setOpenPopup={setOpenPopup}
        openPopup={openPopup}
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

            <Grid item xs={12}>
              <TextareaAutosize
                placeholder={"Remarks"}
                name="remarks"
                size="small"
                value={formData.remarks}
                onChange={handleChange}
                style={{ width: "100%", height: "100px" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                placeholder={"Remarks"}
                name="leave"
                size="small"
                value={formData.leave}
                onChange={handleChange}
                style={{ width: "100%", height: "100px", display: "none" }}
              />
            </Grid>

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
    </>
  );
};

export default ViewLeavAplicaton;

const leaveStatusOptions2 = [
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
