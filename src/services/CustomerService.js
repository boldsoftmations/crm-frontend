import CustomAxios from "./api";

// Generic function to get order book data
const getAllCustomerData = (statusValue, page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (statusValue) {
    params.append("status", statusValue);
  }

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
  return CustomAxios.get(`/api/customer/list-company/?${params.toString()}`);
};

const getIncompleteKycCustomerData = ({
  page,
  assignToFilter,
  searchValue,
}) => {
  let url = `/api/customer/list-company/?is_verified=false&`;
  if (page) url += `page=${page}&`;
  if (assignToFilter) url += `assigned_to__email=${assignToFilter}&`;
  if (searchValue) url += `search=${searchValue}&`;
  return CustomAxios.get(url);
};

// Inactive customer api
const getInActiveCustomerData = ({ page, searchValue }) => {
  let url = `/api/customer/list-company/?is_active=false`;
  if (page) url += `&page=${page}`;
  if (searchValue) url += `&search=${searchValue}`;
  return CustomAxios.get(url);
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

const getSalesHistoryDataByIdWithType = (id, typeValue, filterValue) => {
  return CustomAxios.get(
    `/api/customer/list-company/${id}?type=${typeValue}&year_month=${filterValue}`
  );
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

const updatePotentialCustomer = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-company-potential/${id}`, data);
};

const BulkCustomerAssign = (data) => {
  return CustomAxios.post("/api/customer/assign-bulk-customers/ ", data);
};

// Competitor API
const getAllCompetitors = () => {
  return CustomAxios.get("/api/customer/list-main-distribution");
};

const getCompetitorsPaginatewithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/customer/list-main-distribution/?page=${all}&search=${search}`
  );
};

const getAllPaginateCompetitors = (all) => {
  return CustomAxios.get(`/api/customer/list-main-distribution/?page=${all}`);
};

const getCompetitorsById = (id) => {
  return CustomAxios.get(`/api/customer/list-main-distribution/${id}`);
};

const createCompetitorAPI = (data) => {
  return CustomAxios.post("/api/customer/list-main-distribution/", data);
};

const getAllSearchCompetitors = (search) => {
  return CustomAxios.get(
    `/api/customer/list-main-distribution/?search=${search}`
  );
};

const updateCompetitors = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-main-distribution/${id}`, data);
};

// Whatsapp routes
const getAllWhatsappGroupData = (page = 1, searchValue) => {
  const params = new URLSearchParams();
  if (!searchValue && page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(
    `/api/customer/whatsapp-group-list/?${params.toString()}`
  );
};

const getCustomerNotHavingWhatsappGroup = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  params.append("is_whatsapp", false);

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/customer/whatsapp-group-list/?${params.toString()}`
  );
};

const getCustomerNotInGroupData = (page, searchValue) => {
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
    `api/customer/whatsapp-customer/?${params.toString()}`
  );
};

const getSalesPersonNotInGroupData = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/customer/sales-person/?${params.toString()}`);
};

const createWhatsappData = (data) => {
  return CustomAxios.post("/api/customer/whatsapp-group-list/", data);
};

const createWhatsappImageData = (data) => {
  return CustomAxios.post("/api/customer/whatsapp-image/", data);
};

const createWhatsappPdfData = (data) => {
  return CustomAxios.post("/api/customer/whatsapp-group-list/send-pdf/", data);
};

const deleteWhatsappData = (ID) => {
  return CustomAxios.patch(`/api/customer/whatsapp-group-list/${ID}/`);
};

const getWhatsappImageData = (page = 1) => {
  return CustomAxios.get(`/api/customer/whatsapp-image/?page=${page}`);
};

const resendWhatsappMessage = (data) => {
  return CustomAxios.post(`/api/customer/whatsapp-image/unsent_message/`, data);
};

const bulkResendMessage = (data) => {
  return CustomAxios.post(
    `/api/customer/whatsapp-image/unsent_bulk_message/`,
    data
  );
};

const CustomerServices = {
  getAllCustomerData,
  getIncompleteKycCustomerData,
  getInActiveCustomerData,
  createCompanyData,
  getCompanyDataById,
  getCompanyDataByIdWithType,
  getSalesHistoryDataByIdWithType,
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
  updatePotentialCustomer,
  BulkCustomerAssign,
  getAllCompetitors,
  getCompetitorsPaginatewithSearch,
  getAllPaginateCompetitors,
  getCompetitorsById,
  createCompetitorAPI,
  getAllSearchCompetitors,
  updateCompetitors,
  getAllWhatsappGroupData,
  getCustomerNotHavingWhatsappGroup,
  getCustomerNotInGroupData,
  getSalesPersonNotInGroupData,
  createWhatsappData,
  createWhatsappImageData,
  createWhatsappPdfData,
  deleteWhatsappData,
  getWhatsappImageData,
  resendWhatsappMessage,
  bulkResendMessage,
};

export default CustomerServices;
