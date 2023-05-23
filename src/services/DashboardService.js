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
const DashboardService = {
  getLastThreeMonthForecastData,
  getConsLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
};

export default DashboardService;
