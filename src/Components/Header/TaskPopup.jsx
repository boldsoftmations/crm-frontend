import React, { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";

function TaskPopup({ tasks, closePopup }) {
  const navigate = useNavigate();
  const [hoveredTask, setHoveredTask] = useState(null);

  const handleTaskClick = (path) => {
    navigate(path);
    closePopup();
  };
  const styles = {
    taskInfo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    taskName: {
      flex: 1,
      marginRight: "10px", // Add some margin for spacing
    },
    list: {
      listStyleType: "none",
      padding: 0,
    },
    listItem: (isHovered) => ({
      display: "flex",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: isHovered ? "#f5f5f5" : "transparent",
      cursor: "pointer",
      transition: "background-color 0.3s",
    }),
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#3f51b5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "10px",
    },
    text: {
      flex: 1,
    },
    description: {
      color: "#555",
    },
    dueDate: {
      color: "#888",
      fontSize: "0.9em",
    },
  };

  return (
    <ul style={styles.list}>
      {tasks.map((task, index) => (
        <li
          key={task.id}
          style={styles.listItem(task.id === hoveredTask)}
          onMouseEnter={() => setHoveredTask(task.id)}
          onMouseLeave={() => setHoveredTask(null)}
        >
          <div style={styles.avatar}>
            <AssignmentIcon />
          </div>
          <div
            style={styles.text}
            onClick={() => handleTaskClick(`/task/view-task`)}
          >
            <div style={styles.taskInfo}>
              <span style={styles.taskName}>{task.name}</span>
              <span style={styles.dueDate}>{`Due: ${task.due_date}`}</span>
            </div>
            <div style={styles.description}>{task.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskPopup;
