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

const getIncompleteKycCustomerData = (page, assignToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  params.append("is_verified", false);

  if (page) {
    params.append("page", page);
  }

  if (assignToFilter) {
    params.append("assigned_to__email", assignToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`/api/customer/list-company/?${params.toString()}`);
};

// Inactive customer api
const getInActiveCustomerData = (page, searchValue) => {
  const params = new URLSearchParams();

  params.append("is_active", false);

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/customer/list-company/?${params.toString()}`);
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
const getUnassignedData = (page, searchValue) => {
  const params = new URLSearchParams();

  params.append("unassigned", true);

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/customer/list-company/?${params.toString()}`);
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
const getAllCompetitors = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(
    `api/customer/list-main-distribution/?${params.toString()}`
  );
};

const createCompetitorAPI = (data) => {
  return CustomAxios.post("/api/customer/list-main-distribution/", data);
};

const updateCompetitors = (id, data) => {
  return CustomAxios.patch(`/api/customer/list-main-distribution/${id}`, data);
};

const getAllGroupCompanies = () => {
  return CustomAxios.get("/api/customer/list-group-company/");
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

const getAutomatioData = (page = 1, isScheduledFilter = "") => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (isScheduledFilter !== "") {
    params.append("is_scheduled", isScheduledFilter);
  }

  return CustomAxios.get(
    `/api/whatsapp/whatsapp-automation/?${params.toString()}`
  );
};

const getAllEdc = () => {
  return CustomAxios.get("/api/customer/assign-to-edc/");
};

const CreateEDC_Customer = (data) => {
  return CustomAxios.post("/api/customer/assign-to-edc/", data);
};
const EDC_List = () => {
  return CustomAxios.get("/api/customer/edc/");
};

const RemoveEdc = (data) => {
  return CustomAxios.post("/api/customer/edc/", data);
};

const AllLeadEDC = (name) => {
  return CustomAxios.get(`/api/customer/lead-edc/?name=${name}`);
};
const AllEdcCustomer = (name) => {
  return CustomAxios.get(`/api/customer/customer-edc/?name=${name}`);
};
//CCF API starts here
const createComplaintpes = (data) => {
  return CustomAxios.post("/api/customer/ccf-choice/", data);
};

const getAllComplaintsList = (page, department) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (department) {
    params.append("department", department);
  }

  return CustomAxios.get(`/api/customer/ccf-choice/?${params.toString()}`);
};

const getProductBaseCustomer = (product) => {
  const params = new URLSearchParams();
  if (product) {
    params.append("product", product);
  }

  return CustomAxios.get(
    `/api/customer/product-customer/?${params.toString()}`
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
  createCompetitorAPI,
  updateCompetitors,
  getAllGroupCompanies,
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
  getAutomatioData,
  getAllEdc,
  CreateEDC_Customer,
  EDC_List,
  RemoveEdc,
  AllLeadEDC,
  AllEdcCustomer,
  createComplaintpes,
  getAllComplaintsList,
  getProductBaseCustomer,
};

export default CustomerServices;
