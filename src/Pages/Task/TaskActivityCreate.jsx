import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import TaskService from "../../services/TaskService";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";

export const TaskActivityCreate = (props) => {
  const { setOpenModalActivity, getAllTaskDetails, activity } = props;
  console.log("activity", activity);
  const [open, setOpen] = useState(false);
  const [activityTask, setActivityTask] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
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
      setOpenModalActivity(false);
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createActivityTaskDetails(e)}
      >
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
            {"Activity Created Successfully"}
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
    </div>
  );
};
