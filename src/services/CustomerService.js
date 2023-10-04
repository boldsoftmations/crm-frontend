import CustomAxios from "./api";

const getAllCompanyData = () => {
  return CustomAxios.get(`/api/customer/list-company/`);
};

const getAllPaginateCompanyData = (currentPage) => {
  return CustomAxios.get(`/api/customer/list-company/?page=${currentPage}`);
};

const getAllPaginateCompanyDataWithSearch = (currentPage, search) => {
  return CustomAxios.get(
    `/api/customer/list-company/?page=${currentPage}&search=${search}`
  );
};

const getAllSearchCompanyData = (search) => {
  return CustomAxios.get(`/api/customer/list-company/?search=${search}`);
};

const getAllIncompleteKycData = (boolValue) => {
  return CustomAxios.get(
    `/api/customer/list-company/?is_verified=${boolValue}`
  );
};

const getAllPaginateIncompleteKycData = (boolValue, currentPage) => {
  return CustomAxios.get(
    `/api/customer/list-company/?is_verified=${boolValue}&page=${currentPage}`
  );
};

const getAllPaginateIncompleteKycDataWithSearch = (
  boolValue,
  currentPage,
  search
) => {
  return CustomAxios.get(
    `/api/customer/list-company/?is_verified=${boolValue}&page=${currentPage}&search=${search}`
  );
};

const getAllSearchIncompleteKycData = (boolValue, search) => {
  return CustomAxios.get(
    `/api/customer/list-company/?is_verified=${boolValue}&search=${search}`
  );
};

const createCompanyData = (data) => {
  return CustomAxios.post("/api/customer/list-company/", data);
};

const getCompanyDataById = (id) => {
  return CustomAxios.get(`/api/customer/list-company/${id}`);
};

const getCompanyDataByIdWithType = (id, typeValue) => {
  return CustomAxios.get(`/api/customer/list-company/${id}?type=${typeValue}`);
};

const updateCompanyData = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-company/${id}`, data);
};

// Unassigned Company api endpoint
const getUnassignedData = () => {
  return CustomAxios.get(`/api/customer/list-company/?unassigned=true`);
};

const getSearchByUnassignedData = (search) => {
  return CustomAxios.get(
    `/api/customer/list-company/?unassigned=true&search=${search}`
  );
};

const getPaginationByUnassignedData = (page) => {
  return CustomAxios.get(
    `/api/customer/list-company/?unassigned=true&page=${page}`
  );
};

const getSearchandPaginationByUnassignedData = (page, search) => {
  return CustomAxios.get(
    `/api/customer/list-company/?unassigned=true&page=${page}&search=${search}`
  );
};

const getBankDataById = (id) => {
  return CustomAxios.get(`/api/customer/list-bank/${id}`);
};

const createBankData = (data) => {
  return CustomAxios.post("/api/customer/list-bank/", data);
};

const updateBankData = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-bank/${id}`, data);
};

const createContactData = (data) => {
  return CustomAxios.post("/api/customer/list-contact/", data);
};

const getContactDataById = (id) => {
  return CustomAxios.get(`/api/customer/list-contact/${id}`);
};

const updateContactData = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-contact/${id}`, data);
};

const getAllContactData = () => {
  return CustomAxios.get(`/api/customer/list-contact/`);
};

const createWareHouseData = (data) => {
  return CustomAxios.post("/api/customer/list-warehouse/", data);
};

const getWareHouseDataById = (id) => {
  return CustomAxios.get(`/api/customer/list-warehouse/${id}`);
};

const updatetWareHouseData = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-warehouse/${id}`, data);
};

const createSecurityChequeData = (data) => {
  return CustomAxios.post("/api/customer/list-securitycheque/", data);
};

const getSecurityChequeDataById = (id) => {
  return CustomAxios.get(`/api/customer/list-securitycheque/${id}`);
};

const updateSecurityChequeData = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-securitycheque/${id}`, data);
};

const createForecastData = (data) => {
  return CustomAxios.post("/api/forecast/list-product-forecast/", data);
};

const getForecastDataById = (id) => {
  return CustomAxios.get(`/api/forecast/list-product-forecast/${id}`);
};

const updateForecastData = (id, data) => {
  return CustomAxios.patch(`/api/forecast/list-quantity-forecast/${id}`, data);
};

const createProductForecastData = (data) => {
  return CustomAxios.post("/api/forecast/list-quantity-forecast/", data);
};

const updateProductForecastData = (id, data) => {
  return CustomAxios.patch(`/api/forecast/list-quantity-forecast/${id}`, data);
};

// followUp endpoints
const createFollowUpCustomer = (data) => {
  return CustomAxios.post("/api/customer/list-followup/", data);
};

const getCustomerFollowUp = () => {
  return CustomAxios.get(`/api/customer/list-followup/`);
};

const DoneFollowup = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-followup/${id}`, data);
};

// Potential Customer endpoints
const createPotentialCustomer = (data) => {
  return CustomAxios.post("/api/customer/list-company-potential/", data);
};

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

const BulCustomerAssign = (data) => {
  return CustomAxios.post("/api/customer/assign-bulk-customers/ ", data);
};

const CustomerServices = {
  getAllCompanyData,
  getAllPaginateCompanyData,
  getAllPaginateCompanyDataWithSearch,
  getAllSearchCompanyData,
  getAllIncompleteKycData,
  getAllPaginateIncompleteKycData,
  getAllPaginateIncompleteKycDataWithSearch,
  getAllSearchIncompleteKycData,
  createCompanyData,
  getCompanyDataById,
  getCompanyDataByIdWithType,
  updateCompanyData,
  getUnassignedData,
  getSearchByUnassignedData,
  getPaginationByUnassignedData,
  getSearchandPaginationByUnassignedData,
  getBankDataById,
  createBankData,
  updateBankData,
  createContactData,
  getContactDataById,
  updateContactData,
  getAllContactData,
  createWareHouseData,
  updatetWareHouseData,
  getWareHouseDataById,
  createSecurityChequeData,
  getSecurityChequeDataById,
  updateSecurityChequeData,
  createForecastData,
  getForecastDataById,
  updateForecastData,
  createProductForecastData,
  updateProductForecastData,
  createFollowUpCustomer,
  getCustomerFollowUp,
  DoneFollowup,
  createPotentialCustomer,
  getProductForecast,
  getByFilterProductForecast,
  getAllPaginateProductForecast,
  getAllPaginateProductForecastWithSearch,
  getAllSearchProductForecast,
  getAllProductForecastPaginate,
  getProductForecastPaginateData,
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
  BulCustomerAssign,
};

export default CustomerServices;
