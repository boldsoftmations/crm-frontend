import React, { useEffect, useRef, useState } from "react";
import LeadServices from "../../services/LeadService";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomSearchWithButton } from "./../../Components/CustomSearchWithButton";
import { CustomLoader } from "../../Components/CustomLoader";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../Components/Popup";
import { TaskUpdate } from "./TaskUpdate";
import { TaskCreate } from "./TaskCreate";
import { TaskActivityCreate } from "./TaskActivityCreate";

export const TaskView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [task, setTask] = useState([]);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState(null);
  const [activity, setActivity] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [taskByID, setTaskByID] = useState([]);
  const [openModalactivity, setOpenModalActivity] = useState(false);
  const handleInputChange = () => {
    setFilterSelectedQuery(filterSelectedQuery);
    getSearchData(filterSelectedQuery);
  };

  const getResetData = async () => {
    setFilterSelectedQuery("");
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
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllTaskDetails();
  }, []);

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await TaskService.getAllPaginateTask(currentPage)
        : await TaskService.getAllTask();
      setTask(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name ||
            err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else if (err.response.status === 404 || !err.response.data) {
        setErrMsg("Data not found or request was null/empty");
      } else {
        setErrMsg("Server Error");
      }
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response = await TaskService.getAllSearchTask(filterSearch);
        setTask(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllTaskDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await TaskService.getTaskPaginatewithSearch(page, filterSelectedQuery)
        : await TaskService.getAllPaginateTask(page);

      if (response) {
        setTask(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllTaskDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
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
      <CustomLoader open={open} />

      <div>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />

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
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 0.9 }}>
              <CustomSearchWithButton
                filterSelectedQuery={filterSelectedQuery}
                setFilterSelectedQuery={setFilterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </div>
            <div style={{ flexGrow: 2 }}>
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
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              <div
                className="btn btn-success"
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  margin: "10px",
                  fontSize: "0.875rem",
                  minWidth: "64px",
                  fontWeight: 500,
                  lineHeight: 1.75,
                  borderRadius: "4px",
                  letterSpacing: "0.02857em",
                  textTransform: "uppercase",
                  boxShadow:
                    "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() => setOpenPopup(true)}
              >
                Add
              </div>
            </div>
          </div>

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
            pageCount={pageCount}
            handlePageClick={handlePageClick}
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
