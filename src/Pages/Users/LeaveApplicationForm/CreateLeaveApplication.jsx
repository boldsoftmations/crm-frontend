import React, { useCallback, useState } from "react";
import { Button, Box, Grid } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import MasterService from "../../../services/MasterService";

const LeaveForm = ({ setOpenLeaveRequest, getEmployeesLeaveForm }) => {
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [typeLeaveOptions, setTypeLeaveOptions] = useState([]);

  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //getting leave options from master activity
  const getMasterActivityOptions = useCallback(async () => {
    setOpen(true);
    try {
      const { data } = await MasterService.getMasterActivityOptions("Leave");
      setTypeLeaveOptions(data);
    } catch (error) {
      console.error(error);
      setAlertMsg({
        message: "Failed to fetch warning type options.",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  }, []);
  React.useEffect(() => {
    getMasterActivityOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.leave_type ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.reason
    ) {
      setAlertMsg({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
      return;
    }

    // Date validation
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (start > end) {
      setAlertMsg({
        open: true,
        message: "Start date cannot be after end date",
        severity: "warning",
      });
      return;
    }

    try {
      setOpen(true);
      const res = await MasterService.createLeaveApplication(formData);

      if (res.status === 201) {
        setAlertMsg({
          open: true,
          message: res.data.message || "Leave request submitted successfully",
          severity: "success",
        });

        setTimeout(() => {
          setOpenLeaveRequest(false);
          getEmployeesLeaveForm();
        }, 500);

        setFormData({
          leave_type: "",
          start_date: "",
          end_date: "",
          reason: "",
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

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 450, mx: "auto" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              disablePortal
              id="combo-box-description"
              options={typeLeaveOptions.map((option) => option.name)}
              value={formData.leave_type}
              onChange={(e, value) =>
                setFormData({ ...formData, leave_type: value })
              }
              getOptionLabel={(option) => option}
              label="Leave Type"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="From"
              type="date"
              name="start_date"
              size="small"
              value={formData.start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              label="To"
              type="date"
              name="end_date"
              size="small"
              value={formData.end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Reason for taking leave"
              name="reason"
              size="small"
              value={formData.reason}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
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
              Submit Leave Request
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LeaveForm;
