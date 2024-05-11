import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import TaskService from "../../services/TaskService";
import { useSelector } from "react-redux";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const TaskCreate = (props) => {
  const { setOpenPopup, getAllTaskDetails } = props; // 1
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState([]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.sales_users || [];
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setTask({ ...task, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setTask({
      ...task,
      [name]: value,
    });
  };

  const createTaskDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        created_by: users.email,
        name: task.name,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        assigned_to: task.assigned_to,
      };
      await TaskService.createTask(req);
      handleSuccess("Task Created Successfully");
      setTimeout(() => {
        setOpenPopup(false);
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

      <Box component="form" noValidate onSubmit={(e) => createTaskDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="created_by"
              size="small"
              label="Created By"
              variant="outlined"
              value={users.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Task Name"
              variant="outlined"
              onChange={(event) => handleFormChange(event)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="date"
              name="due_date"
              size="small"
              label="Due Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().slice(0, 10),
              }}
              onChange={(event) => handleFormChange(event)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Priority</InputLabel>
              <Select
                name="priority"
                labelId="demo-select-small"
                id="demo-select-small"
                label="Priority"
                value={task.priority}
                onChange={(event) =>
                  handleSelectChange("priority", event.target.value)
                }
              >
                <MenuItem value={"Low"}>Low </MenuItem>
                <MenuItem value={"Medium"}>Medium</MenuItem>
                <MenuItem value={"High"}>High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {!users.groups.includes("Sales Executive") && (
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small">Assigned To</InputLabel>
                <Select
                  name="assigned_to"
                  labelId="demo-select-small"
                  id="demo-select-small"
                  label="Assigned To"
                  value={task.assigned_to}
                  onChange={(event) =>
                    handleSelectChange("assigned_to", event.target.value)
                  }
                >
                  {assigned.map((option, i) => (
                    <MenuItem key={i} value={option.email}>
                      {option.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
