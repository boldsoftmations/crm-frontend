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

export const TaskCreate = (props) => {
  const { setOpenPopup, getAllTaskDetails } = props; // 1
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.sales_users || [];
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
      setOpenPopup(false);
      getAllTaskDetails();
      setOpen(false);
      setOpenSnackbar(true);
    } catch (error) {
      setOpen(false);
      console.error("error Task", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => createTaskDetails(e)}>
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: openSnackbar ? "red" : "green",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            display: openSnackbar ? "block" : "none",
            zIndex: 9999,
          }}
        >
          <span style={{ marginRight: "10px" }}>
            {"Task Created Successfully"}
          </span>
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "0",
            }}
            onClick={handleCloseSnackbar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 7.293l2.146-2.147a.5.5 0 11.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"
              />
            </svg>
          </button>
        </div>
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
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
    </div>
  );
};
