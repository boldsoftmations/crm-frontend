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
// Generic function to get Customer Not Having Forecast data
const getAllCurrentMonthData = (page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (assignToFilter) {
    params.append("product_forecast__sales_person__email", assignToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-current-month-forecast/?${params.toString()}`
  );
};

const updateAnticipatedDate = (id, data) => {
  return CustomAxios.patch(`/api/forecast/list-quantity-forecast/${id}`, data);
};

// Generic function to get Customer Not Having Forecast data
const getAllCustomerNotHavingData = (page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (assignToFilter) {
    params.append("sales_person__email", assignToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-product-not-having-forecast/?${params.toString()}`
  );
};

// Generic function to get product Forecast data
const getAllCustomerHavingData = (page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (assignToFilter) {
    params.append("sales_person__email", assignToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-product-having-forecast/?${params.toString()}`
  );
};

// Generic function to get Dead Customer data
const getAllDeadCustomerData = (page, assignToFilter, searchValue) => {
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

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-dead-customers/?${params.toString()}`
  );
};

// Generic function to get Product Wise Forecast data
const getAllProductWiseForecastData = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-product-wise-forecast/?${params.toString()}`
  );
};

// Generic function to get Description Wise Forecast data
const getAllDescriptionWiseForecastData = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/forecast/list-description-wise-forecast/?${params.toString()}`
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

const getProductWiseTurnoverForecast = (page, filterValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (filterValue) {
    params.append("sales_person__email", filterValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/forecast/productwise-turnover/?${params.toString()}`
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
  getAllCurrentMonthData,
  updateAnticipatedDate,
  getAllCustomerNotHavingData,
  getAllCustomerHavingData,
  getAllDeadCustomerData,
  getAllProductWiseForecastData,
  getAllDescriptionWiseForecastData,
  getLastThreeMonthForecastData,
  getConsLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
  getProductWiseTurnoverForecast,
};

export default ProductForecastService;
