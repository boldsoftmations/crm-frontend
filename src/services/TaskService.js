import CustomAxios from "./api";

// Generic function to get order book data
const getAllTaskData = ({ page, assignToFilter, searchValue }) => {
  let url = `/api/task/list-tasks/?`;
  if (page) url += `page=${page}&`;
  if (assignToFilter) url += `assigned_to__email=${assignToFilter}&`;
  if (searchValue) url += `search=${searchValue}&`;
  return CustomAxios.get(url);
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
