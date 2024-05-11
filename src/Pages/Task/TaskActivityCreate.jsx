import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import TaskService from "../../services/TaskService";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const TaskActivityCreate = (props) => {
  const { setOpenModalActivity, getAllTaskDetails, activity } = props;
  const [open, setOpen] = useState(false);
  const [activityTask, setActivityTask] = useState([]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setActivityTask({ ...activityTask, [name]: value });
  };

  const createActivityTaskDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        created_by: users.email,
        task: activity.id,
        description: activityTask.description,
      };
      await TaskService.createActivityTask(req);
      handleSuccess("Activity Created Successfully");
      setTimeout(() => {
        setOpenModalActivity(false);
      }, 300);
      getAllTaskDetails();
      setOpen(false);
    } catch (error) {
      handleError(error);
      setOpen(false);
      console.error("error Task", error);
    }
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createActivityTaskDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="created_by"
              size="small"
              label="Created By"
              variant="outlined"
              value={users.email}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              multiline
              fullWidth
              name="description"
              size="small"
              label="Description"
              variant="outlined"
              onChange={(event) => handleFormChange(event)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
