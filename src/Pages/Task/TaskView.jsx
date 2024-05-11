import React, { useEffect, useState } from "react";
import LeadServices from "../../services/LeadService";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomSearchWithButton } from "./../../Components/CustomSearchWithButton";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";
import { TaskUpdate } from "./TaskUpdate";
import { TaskCreate } from "./TaskCreate";
import { TaskActivityCreate } from "./TaskActivityCreate";
import { useSelector } from "react-redux";
import { Box, Button } from "@mui/material";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

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

  const handleFilterChange = (value) => {
    setFilterSelectedQuery(value);
    getSearchData(value, searchValue);
  };
  const handleInputChange = () => {
    setSearchValue(searchValue);
    getSearchData(filterSelectedQuery, searchValue);
  };

  const getResetData = async () => {
    setSearchValue("");
    await getAllTaskDetails();
  };

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

  useEffect(() => {
    getAssignedData();
    getAllTaskDetails();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("error", error);
      setOpen(false);
    }
  };

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllTaskData({
        page: currentPage,
        assignToFilter: filterSelectedQuery,
        searchValue: searchValue,
      });

      setTask(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (filterValue, searchValue) => {
    try {
      setOpen(true);

      const response = await TaskService.getAllTaskData({
        assignToFilter: filterValue,
        searchValue: searchValue,
      });
      if (response) {
        setTask(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      } else {
        await getAllTaskDetails();
        setFilterSelectedQuery("");
        setSearchValue("");
      }
    } catch (error) {
      handleError(error);
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageChange = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response =
        filterSelectedQuery || searchValue
          ? await TaskService.getAllTaskData({
              page: page,
              assignToFilter: filterSelectedQuery,
              searchValue: searchValue,
            })
          : await TaskService.getAllTaskData({ page: page });

      if (response) {
        setTask(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
      } else {
        await getAllTaskDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      handleError(error);
      console.log("error", error);
    } finally {
      setOpen(false);
    }
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
      <div>
        <div
          style={{
            padding: "16px",
            margin: "16px",
            boxShadow: "0px 3px 6px #00000029",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
          }}
        >
          <Box display="flex" marginBottom="10px">
            {!UsersData.groups.includes("Sales Executive") && (
              <CustomAutocomplete
                size="small"
                sx={{ width: 300 }}
                onChange={(event, value) => handleFilterChange(value)}
                value={filterSelectedQuery}
                options={assignedOption.map((option) => option.email)}
                getOptionLabel={(option) => option}
                label="Filter By Sales Person"
              />
            )}
            <CustomSearchWithButton
              filterSelectedQuery={searchValue}
              setFilterSelectedQuery={setSearchValue}
              handleInputChange={handleInputChange}
              getResetData={getResetData}
            />
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
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
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
