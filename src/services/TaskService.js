import CustomAxios from "./api";

const getAllTask = () => {
  return CustomAxios.get("/api/task/list-tasks");
};

const getTaskPaginatewithSearch = (all, search) => {
  return CustomAxios.get(`/api/task/list-tasks/?page=${all}&search=${search}`);
};

const getAllPaginateTask = (all) => {
  return CustomAxios.get(`/api/task/list-tasks/?page=${all}`);
};

const createTask = (data) => {
  return CustomAxios.post("/api/task/list-tasks/", data);
};

const getAllSearchTask = (search) => {
  return CustomAxios.get(`/api/task/list-tasks/?search=${search}`);
};

const updateTask = (id, data) => {
  return CustomAxios.patch(`/api/task/list-tasks/${id}`, data);
};

const TaskService = {
  getAllTask,
  getTaskPaginatewithSearch,
  getAllPaginateTask,
  getAllSearchTask,
  createTask,
  updateTask,
};

export default TaskService;
