import CustomAxios from "./api";

// Generic function to get order book data

const getAllTaskData = (page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (assignToFilter) {
    params.append("assigned_to__email", assignToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(`api/task/list-tasks/?${params.toString()}`);
};

const createTask = (data) => {
  return CustomAxios.post("/api/task/list-tasks/", data);
};

const updateTask = (id, data) => {
  return CustomAxios.patch(`/api/task/list-tasks/${id}`, data);
};

const createActivityTask = (data) => {
  return CustomAxios.post("/api/task/list-tasks-activity/", data);
};

// users
const getAllUsers = (users) => {
  return CustomAxios.get(`/api/user/users/?is_active=${users}`);
};

const createUsers = (id, data) => {
  return CustomAxios.patch(`/api/user/users/${id}/`, data);
};
const TaskService = {
  getAllTaskData,
  createTask,
  updateTask,
  createActivityTask,
  getAllUsers,
  createUsers,
};

export default TaskService;
