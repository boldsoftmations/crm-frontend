import CustomAxios from "./api";

// Product Forecast

const getProductForecast = () => {
  return CustomAxios.get(`/api/forecast/list-product-forecast/`);
};

const getByFilterProductForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-product-forecast/?${type}=${data}`
  );
};

const getAllPaginateProductForecast = (all) => {
  return CustomAxios.get(`/api/forecast/list-product-forecast/?page=${all}`);
};

const getAllPaginateProductForecastWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchProductForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-forecast/?${type}=${search}`
  );
};

const getAllProductForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getProductForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-product-forecast/?page=${currentPage}`
  );
};

const updateProductForecast = (id, data) => {
  return CustomAxios.patch(`/api/forecast/list-product-forecast/${id}`, data);
};
// Current MMonth Forecast

const getCurrentMonthForecast = () => {
  return CustomAxios.get(`/api/forecast/list-current-month-forecast/`);
};

const getByFilterCurrentMonthForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?${type}=${data}`
  );
};

const getAllPaginateCurrentMonthForecast = (all) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?page=${all}`
  );
};

const getAllPaginateCurrentMonthForecastWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchCurrentMonthForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?${type}=${search}`
  );
};

const getAllCurrentMonthForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getCurrentMonthForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?page=${currentPage}`
  );
};

// Product Not Having Forecast

const getProductNotHavingForecast = () => {
  return CustomAxios.get(`/api/forecast/list-product-not-having-forecast/`);
};

const getByFilterProductNotHavingForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?${type}=${data}`
  );
};

const getAllPaginateProductNotHavingForecast = (all) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?page=${all}`
  );
};

const getAllPaginateProductNotHavingForecastWithSearch = (
  all,
  type,
  search
) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchProductNotHavingForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?${type}=${search}`
  );
};

const getAllProductNotHavingForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getProductNotHavingForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?page=${currentPage}`
  );
};

// Product Having Forecast

const getProductHavingForecast = () => {
  return CustomAxios.get(`/api/forecast/list-product-having-forecast/`);
};

const getByFilterProductHavingForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?${type}=${data}`
  );
};

const getAllPaginateProductHavingForecast = (all) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?page=${all}`
  );
};

const getAllPaginateProductHavingForecastWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchProductHavingForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?${type}=${search}`
  );
};

const getAllProductHavingForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getProductHavingForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?page=${currentPage}`
  );
};

// Dead Customer

const getDeadCustomer = () => {
  return CustomAxios.get(`/api/forecast/list-dead-customers/`);
};

const getByFilterDeadCustomer = (type, data) => {
  return CustomAxios.get(`/api/forecast/list-dead-customers/?${type}=${data}`);
};

const getAllPaginateDeadCustomer = (all) => {
  return CustomAxios.get(`/api/forecast/list-dead-customers/?page=${all}`);
};

const getAllPaginateDeadCustomerWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-dead-customers/?page=${all}&${type}=${search}`
  );
};

const getAllSearchDeadCustomer = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-dead-customers/?${type}=${search}`
  );
};

const getAllDeadCustomerPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-dead-customers/?page=${currentPage}&${type}=${search}`
  );
};

const getDeadCustomerPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-dead-customers/?page=${currentPage}`
  );
};

// Product Wise Forecast

const getProductWiseForecast = () => {
  return CustomAxios.get(`/api/forecast/list-product-wise-forecast/`);
};

const getByFilterProductWiseForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?${type}=${data}`
  );
};

const getAllPaginateProductWiseForecast = (all) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?page=${all}`
  );
};

const getAllPaginateProductWiseForecastWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchProductWiseForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?${type}=${search}`
  );
};

const getAllProductWiseForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getProductWiseForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?page=${currentPage}`
  );
};

// Description Wise Forecast

const getDescriptionWiseForecast = () => {
  return CustomAxios.get(`/api/forecast/list-description-wise-forecast/`);
};

const getByFilterDescriptionWiseForecast = (type, data) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?${type}=${data}`
  );
};

const getAllPaginateDescriptionWiseForecast = (all) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?page=${all}`
  );
};

const getAllPaginateDescriptionWiseForecastWithSearch = (all, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?page=${all}&${type}=${search}`
  );
};

const getAllSearchDescriptionWiseForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?${type}=${search}`
  );
};

const getAllDescriptionWiseForecastPaginate = (currentPage, type, search) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?page=${currentPage}&${type}=${search}`
  );
};

const getDescriptionWiseForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?page=${currentPage}`
  );
};

// last Three Month Forecast End Point
const getLastThreeMonthForecastData = () => {
  return CustomAxios.get(`/api/forecast/last-three-month-forecast/`);
};

const getConsLastThreeMonthForecastData = () => {
  return CustomAxios.get(
    `/api/forecast/consolidated-last-three-month-forecast/`
  );
};

const getLastThreeMonthForecastDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/forecast/last-three-month-forecast/?product_forecast__sales_person__email=${filter}`
  );
};

const getProductWiseTurnoverForecast = () => {
  return CustomAxios.get(`/api/forecast/productwise-turnover`);
};

const getAllSearchProductWiseTurnoverForecast = (type, search) => {
  return CustomAxios.get(
    `/api/forecast/productwise-turnover/?${type}=${search}`
  );
};

const getAllProductWiseTurnoverForecastPaginate = (
  currentPage,
  type,
  search
) => {
  return CustomAxios.get(
    `/api/forecast/productwise-turnover/?page=${currentPage}&${type}=${search}`
  );
};

const getProductWiseTurnoverForecastPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/forecast/productwise-turnover/?page=${currentPage}`
  );
};

const ProductForecastService = {
  getProductForecast,
  getByFilterProductForecast,
  getAllPaginateProductForecast,
  getAllPaginateProductForecastWithSearch,
  getAllSearchProductForecast,
  getAllProductForecastPaginate,
  getProductForecastPaginateData,
  updateProductForecast,
  getCurrentMonthForecast,
  getByFilterCurrentMonthForecast,
  getAllPaginateCurrentMonthForecast,
  getAllPaginateCurrentMonthForecastWithSearch,
  getAllSearchCurrentMonthForecast,
  getAllCurrentMonthForecastPaginate,
  getCurrentMonthForecastPaginateData,
  getProductNotHavingForecast,
  getByFilterProductNotHavingForecast,
  getAllPaginateProductNotHavingForecast,
  getAllPaginateProductNotHavingForecastWithSearch,
  getAllSearchProductNotHavingForecast,
  getAllProductNotHavingForecastPaginate,
  getProductNotHavingForecastPaginateData,
  getProductHavingForecast,
  getByFilterProductHavingForecast,
  getAllPaginateProductHavingForecast,
  getAllPaginateProductHavingForecastWithSearch,
  getAllSearchProductHavingForecast,
  getAllProductHavingForecastPaginate,
  getProductHavingForecastPaginateData,
  getDeadCustomer,
  getByFilterDeadCustomer,
  getAllPaginateDeadCustomer,
  getAllPaginateDeadCustomerWithSearch,
  getAllSearchDeadCustomer,
  getAllDeadCustomerPaginate,
  getDeadCustomerPaginateData,
  getProductWiseForecast,
  getByFilterProductWiseForecast,
  getAllPaginateProductWiseForecast,
  getAllPaginateProductWiseForecastWithSearch,
  getAllSearchProductWiseForecast,
  getAllProductWiseForecastPaginate,
  getProductWiseForecastPaginateData,
  getDescriptionWiseForecast,
  getByFilterDescriptionWiseForecast,
  getAllPaginateDescriptionWiseForecast,
  getAllPaginateDescriptionWiseForecastWithSearch,
  getAllSearchDescriptionWiseForecast,
  getAllDescriptionWiseForecastPaginate,
  getDescriptionWiseForecastPaginateData,
  getLastThreeMonthForecastData,
  getConsLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
  getProductWiseTurnoverForecast,
  getAllSearchProductWiseTurnoverForecast,
  getAllProductWiseTurnoverForecastPaginate,
  getProductWiseTurnoverForecastPaginateData,
};

export default ProductForecastService;
