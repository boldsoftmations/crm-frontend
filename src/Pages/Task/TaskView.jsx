import React, { useCallback, useEffect, useState } from "react";
import LeadServices from "../../services/LeadService";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { TaskUpdate } from "./TaskUpdate";
import { TaskCreate } from "./TaskCreate";
import { TaskActivityCreate } from "./TaskActivityCreate";
import { useSelector } from "react-redux";
import { Box, Button, Grid, Paper } from "@mui/material";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const TaskView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [assigned, setAssigned] = useState([]);
  const [task, setTask] = useState([]);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [activity, setActivity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [taskByID, setTaskByID] = useState([]);
  const [openModalactivity, setOpenModalActivity] = useState(false);
  const UsersData = useSelector((state) => state.auth.profile);
  const assignedOption = UsersData.sales_users || [];
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const openInPopup = (item) => {
    const matchedActivity = task.find((activity) => activity.id === item.id);
    setActivity(matchedActivity.activities);
    setTaskByID(matchedActivity);
    setOpenPopup2(true);
  };

  const openInPopup2 = (item) => {
    const matchedActivity = task.find((activity) => activity.id === item.id);
    setActivity(matchedActivity);

    setOpenModalActivity(true);
  };

  const getAssignedData = useCallback(async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    getAssignedData();
  }, []);

  const getAllTaskDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllTaskData(
        currentPage,
        filterSelectedQuery,
        searchValue
      );
      setTask(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterSelectedQuery, searchValue]);

  useEffect(() => {
    getAllTaskDetails();
  }, [currentPage, filterSelectedQuery, searchValue]);

  const handleSearch = (query) => {
    setSearchValue(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchValue("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handleFilterChange = (value) => {
    setFilterSelectedQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const PriorityColor = task.map((row) => {
    let color = "";
    switch (row.priority) {
      case "High":
        color = "#ffcccc";
        break;
      case "Medium":
        color = "#ccccff";
        break;
      case "Low":
        color = "#ffffcc";
        break;
      default:
        color = "#ffffff";
    }
    return { priority: color };
  });

  const Tabledata = task.map((row, i) => ({
    id: row.id,
    created_by: row.created_by,
    name: row.name,
    description: row.description,
    due_date: row.due_date,
    priority: row.priority,
    assigned_to: row.assigned_to,
    completed: row.completed,
  }));

  const Tableheaders = [
    "ID",
    "CREATED BY",
    "TASK",
    "DESCRIPTION",
    "DUE DATE",
    "PRIORITY",
    "ASSIGNED TO",
    "COMPLETED",
    "ACTION",
  ];

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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box marginBottom="10px">
            <Grid container spacing={2}>
              {!UsersData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    size="small"
                    fullWidth
                    onChange={(event, value) => handleFilterChange(value)}
                    value={filterSelectedQuery}
                    options={assignedOption.map((option) => option.email)}
                    getOptionLabel={(option) => option}
                    label="Filter By Sales Person"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={() => setOpenPopup(true)}
                  style={{
                    backgroundColor: "#006ba1",
                    color: "#fff",
                    marginLeft: "auto",
                    marginRight: "1em",
                  }}
                >
                  Create Task
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Task
            </h3>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={openInPopup2}
            openInPopup3={null}
            openInPopup4={null}
            ButtonText={"Activity"}
            PriorityColor={PriorityColor}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Task"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <TaskCreate
          getAllTaskDetails={getAllTaskDetails}
          assigned={assigned}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Task"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <TaskUpdate
          setOpenPopup={setOpenPopup2}
          getAllTaskDetails={getAllTaskDetails}
          assigned={assigned}
          taskByID={taskByID}
          activity={activity}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Create Activity"}
        openPopup={openModalactivity}
        setOpenPopup={setOpenModalActivity}
      >
        <TaskActivityCreate
          activity={activity}
          getAllTaskDetails={getAllTaskDetails}
          setOpenModalActivity={setOpenModalActivity}
        />{" "}
      </Popup>
    </>
  );
};
