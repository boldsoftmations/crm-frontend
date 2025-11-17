import React, { useCallback, useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { createWarningLetter } from "../../../services/Hr";
import MasterService from "../../../services/MasterService";

const warningType = ["verbal", "written", "final"];

const CreateWarningLetter = ({ editData = null, setOpenPopup }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    employee: editData && editData.emp_id,
    level: "",
    subject: "",
    remarks: "",
  });

  const [warningTypeOptions, setWarningTypeOptions] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  const getMasterActivityOptions = useCallback(async () => {
    setOpen(true);
    try {
      const { data } = await MasterService.getMasterActivityOptions(
        "Warning type"
      );
      setWarningTypeOptions(data);
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

    if (!inputValue.level || !inputValue.subject || !inputValue.remarks) {
      setAlertMsg({
        message: "All fields are required.",
        severity: "error",
        open: true,
      });
      return;
    }

    setOpen(true);
    try {
      const payload = {
        ...inputValue,
        employee: editData && editData.employee_id,
      };
      await createWarningLetter(payload);
      setAlertMsg({
        message: "Warning Letter sent successfully!",
        severity: "success",
        open: true,
      });
      setInputValue({ level: "", subject: "", remarks: "" });
      setTimeout(() => {
        setOpenPopup(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setAlertMsg({
        message: "Failed to submit warning letter.",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const handleChange = (e) => {
    setInputValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <CustomLoader open={open} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee Name"
              variant="outlined"
              value={editData && `${editData.first_name} ${editData.last_name}`}
              margin="normal"
              size="small"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="level"
              size="small"
              disablePortal
              id="warning-type"
              options={warningType}
              value={inputValue.level}
              getOptionLabel={(option) => option}
              fullWidth
              label="Warning Type"
              onChange={(event, newValue) =>
                setInputValue((prev) => ({
                  ...prev,
                  level: newValue || "",
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="level"
              size="small"
              disablePortal
              id="warning-type"
              options={warningTypeOptions.map((option) => option.name)}
              value={inputValue.subject}
              getOptionLabel={(option) => option}
              fullWidth
              label="Subject"
              onChange={(event, newValue) =>
                setInputValue((prev) => ({
                  ...prev,
                  subject: newValue || "",
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Warning Letter"
              variant="outlined"
              margin="normal"
              name="remarks"
              multiline
              rows={4}
              value={inputValue.remarks}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" color="primary">
              Submit Warning Letter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default React.memo(CreateWarningLetter);
