import CustomAxios from "./api";

// last Three Month Forecast End Point
const getLastThreeMonthForecastData = () => {
  return CustomAxios.get(`/api/dashboard/last-three-months-forecast/`);
};

const getConsLastThreeMonthForecastData = () => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-last-three-month-forecast/`
  );
};

const getLastThreeMonthForecastDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/last-three-months-forecast/?email=${filter}`
  );
};

const getNewCustomerData = () => {
  return CustomAxios.get(`/api/dashboard/new-customer-month-on-month/`);
};

const getNewCustomerDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/new-customer-month-on-month/?email=${filter}`
  );
};

const getPendingTaskData = () => {
  return CustomAxios.get(`/api/dashboard/pending-tasks/`);
};

const getPendingTaskDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/pending-tasks/?email=${filter}`);
};

const getPendingFollowupData = () => {
  return CustomAxios.get(`/api/dashboard/pending-followups/`);
};

const getPendingFollowupDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/pending-followups/?email=${filter}`);
};

const getPIData = () => {
  return CustomAxios.get(`/api/dashboard/list-pi-data/`);
};

const getPIDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/list-pi-data/?email=${filter}`);
};

const getCustomerDashboard = () => {
  return CustomAxios.get("/api/dashboard/customer-dashboard/");
};

const getCustomerDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/customer-dashboard/?email=${filter}`);
};

const getLeadDashboard = () => {
  return CustomAxios.get("/api/dashboard/lead-dashboard");
};

const getLeadDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/lead-dashboard/?email=${filter}`);
};

const getDescriptionWisePendingQuantityData = () => {
  return CustomAxios.get("/api/dashboard/list-pending-order-description-wise/");
};

const getDescriptionWisePendingQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/list-pending-order-description-wise/?email=${filter}`
  );
};
const DashboardService = {
  getLastThreeMonthForecastData,
  getConsLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
  getNewCustomerData,
  getNewCustomerDataByFilter,
  getPendingTaskData,
  getPendingTaskDataByFilter,
  getPendingFollowupData,
  getPendingFollowupDataByFilter,
  getPIData,
  getPIDataByFilter,
  getCustomerDashboard,
  getLeadDashboard,
  getCustomerDataByFilter,
  getLeadDataByFilter,
  getDescriptionWisePendingQuantityData,
  getDescriptionWisePendingQuantityDataByFilter,
};

export default DashboardService;
