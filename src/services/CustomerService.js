import CustomAxios from "./api";

// Generic function to get order book data
const getAllCustomerData = (
  statusValue,
  page,
  assignToFilter,
  searchValue,
  type_of_customer
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (statusValue) {
    params.append("status", statusValue);
  }

  if (page) {
    params.append("page", page);
  }
  if (type_of_customer) {
    params.append("type_of_customer", type_of_customer);
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

const getAllCustomerMasterList = (pincode) => {
  // Sending a GET request with query parameters
  const params = new URLSearchParams();

  if (pincode) {
    params.append("pincode", pincode);
  }
  return CustomAxios.get(`/api/customer/active-customer/?${params.toString()}`);
};

const getLeadsMasterListByPincode = (pincode) => {
  // Sending a GET request with query parameters
  const params = new URLSearchParams();
  if (pincode) {
    params.append("pincode", pincode);
  }
  return CustomAxios.get(`/api/lead/active-lead/?${params.toString()}`);
};

const createCustomerBeatPlan = (data) => {
  return CustomAxios.post("/api/customer/customer-beat/", data);
};

const addLeadsintoBeatName = (data) => {
  return CustomAxios.post("/api/lead/lead-beat/", data);
};

const updateCustomerBeatPlan = (id, data) => {
  return CustomAxios.post(
    `/api/customer/customer-beat/${id}/add_customer/`,
    data
  );
};

const updateLeadsBeatPlan = (id, data) => {
  return CustomAxios.post(`/api/lead/lead-beat/${id}/add_lead/`, data);
};
const AssignBeatToSalesPerson = (data) => {
  return CustomAxios.post("/api/field-sales/visit-plan/", data);
};

const AssignBeatLeadToSalesPerson = (data) => {
  return CustomAxios.post("/api/field-sales/lead-visit-plan/", data);
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
const getUnassignedData = (page, searchValue, filterValue) => {
  const params = new URLSearchParams();

  params.append("unassigned", true);

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (filterValue) {
    params.append("type_of_customer", filterValue);
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
const deleteCustomerContact = (id) => {
  return CustomAxios.delete(`/api/customer/list-contact/${id}`);
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
  return CustomAxios.post("/api/customer/customer-followup/", data);
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

const getAllGroupCompanies = (type) => {
  return CustomAxios.get(
    `/api/customer/list-group-company/?type_of_customer=${type}`
  );
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

const getCustomerNotHavingWhatsappGroup = (
  page,
  searchValue,
  customerFilter,
  sale_invoice_status
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  params.append("is_whatsapp", false);

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (customerFilter) {
    params.append("type_of_customer", customerFilter);
  }
  if (sale_invoice_status) {
    params.append("sale_invoice_status", sale_invoice_status);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/customer/whatsapp-group-list/?${params.toString()}`
  );
};

const getCustomerNotInGroupData = (page, searchValue, customerFilter) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (customerFilter) {
    params.append("type_of_customer", customerFilter);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/customer/whatsapp-customer/?${params.toString()}`
  );
};

const getSalesPersonNotInGroupData = (page, searchValue, customerFilter) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (customerFilter) {
    params.append("type_of_customer", customerFilter);
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
const createCCF = (data) => {
  return CustomAxios.post("/api/customer/ccf/", data);
};
const createComplaintpes = (data) => {
  return CustomAxios.post("/api/customer/ccf-choice/", data);
};

const uploadCCFdocument = (data) => {
  return CustomAxios.post("/api/customer/ccf-document/", data);
};

const createCCFComplaintForm = (data) => {
  return CustomAxios.post("/api/customer/ccf/", data);
};

const getAllCCFData = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(
    `/api/customer/ccf/?is_closed=false&${params.toString()}`
  );
};

const getAllClosedCCF = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(
    `/api/customer/ccf/?is_closed=true${params.toString()}`
  );
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
const getAllComplaintsListData = (type, department) => {
  const params = new URLSearchParams();
  if (type) {
    params.append("type", type);
  }
  if (department) {
    params.append("department", department);
  }

  return CustomAxios.get(`/api/customer/ccf-choice/?${params.toString()}`);
};

const getProductBaseCustomer = (description, customerName, product) => {
  const params = new URLSearchParams();
  if (description) {
    params.append("description", description);
  }
  if (customerName) {
    params.append("customer", customerName);
  }
  if (product) {
    params.append("product", product);
  }

  return CustomAxios.get(
    `/api/customer/product-customer/?${params.toString()}`
  );
};

const getAllDescription = () => {
  return CustomAxios.get("/api/customer/description-product/");
};

const getAllProductDescription = () => {
  return CustomAxios.get(`/api/product/description/`);
};
const getDiscription = (desc_id) => {
  const params = new URLSearchParams();
  if (desc_id) {
    params.append("desc_id", desc_id);
  }
  return CustomAxios.get(
    `/api/customer/description-product/?${params.toString()}`
  );
};
const getproductToDescription = (desc_id) => {
  const params = new URLSearchParams();
  if (desc_id) {
    params.append("desc_id", desc_id);
  }
  return CustomAxios.get(`/api/product/product/?${params.toString()}`);
};

//capa api

const CreateCapa = (data) => {
  return CustomAxios.post("/api/customer/cpa/", data);
};

const UpdateCapa = (id, data) => {
  return CustomAxios.patch(`/api/customer/cpa/${id}/`, data);
};

const getAllCapaData = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/customer/cpa/?${params.toString()}`);
};

const getCustomerLastPi = (company, seller_account) => {
  return CustomAxios.get(
    `/api/invoice/customer-last-pi/?company=${company}&seller_account=${seller_account}`
  );
};

const getProductLastPi = (company, unit, product) => {
  const params = new URLSearchParams();
  if (company) {
    params.append("company", company);
  }
  if (unit) {
    params.append("seller_account", unit);
  }

  if (product) {
    params.append("product", product);
  }
  return CustomAxios.get(`/api/invoice/pi-products/?${params.toString()}`);
};

const getAllStatesList = () => {
  return CustomAxios.get("/api/customer/state/");
};

const getCustomerScheme = (page) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  return CustomAxios.get(`/api/customer/scheme/?${params.toString()}`);
};

const createCustomerScheme = (data) => {
  return CustomAxios.post("/api/customer/scheme/", data);
};

const updateCustomerscheme = (id, data) => {
  return CustomAxios.patch(`/api/customer/scheme/${id}/`, data);
};
const getCustomerStatus = () => {
  return CustomAxios.get(
    "/api/master/model-option/?page=all&model_master__name=Customer Followup"
  );
};

//Api for fields sales person and customer

const getFieldsSalesPersonVisitPlan = (
  page,
  search,
  visited_by__name,
  is_completed = true
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (search) params.append("search", search);
  if (visited_by__name) params.append("visited_by__name", visited_by__name);
  return CustomAxios.get(
    `/api/field-sales/visit-plan/?is_completed=${is_completed}&${params.toString()}`
  );
};

const getFieldsSalesPersonLeadVisitPlan = (
  page,
  search,
  visited_by__name,
  is_completed = true
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (search) params.append("search", search);
  if (visited_by__name) params.append("visited_by__name", visited_by__name);
  return CustomAxios.get(
    `/api/field-sales/lead-visit-plan/?is_completed=${is_completed}&${params.toString()}`
  );
};

const getCustomerVisitDataById = (id) => {
  return CustomAxios.get(`/api/field-sales/visit-logs/${id}/`);
};

const getLeadVisitDataById = (id) => {
  return CustomAxios.get(`/api/field-sales/lead-visit-logs/${id}/`);
};

const createCustomerSRF = (data) => {
  return CustomAxios.post("/api/srf/srf/", data);
};

const getCustomerAddressType = (customer_name) => {
  return CustomAxios.get(
    `/api/srf/customer-address/?customer=${customer_name}`
  );
};

const updateCustomerSRfStatus = (id, data) => {
  return CustomAxios.patch(`/api/srf/srf/${id}/`, data);
};

const updateSRFProduct = (id, data) => {
  return CustomAxios.patch(`/api/srf/product/${id}/`, data);
};
const getCustomerSRF = (page, search, status, start_date, end_date) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }
  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
  }
  return CustomAxios.get(`/api/srf/srf/?${params.toString()}`);
};

const getNewCustomers = (
  page,
  filterPerson,
  custom_date,
  start_date,
  end_date
) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (filterPerson)
    params.append(
      "order_book__proforma_invoice__lead__assigned_to__name",
      filterPerson
    );
  if (custom_date) params.append("custom_date", custom_date);
  if (start_date) params.append("start_date", start_date);
  if (end_date) params.append("end_date", end_date);

  return CustomAxios.get(`/api/customer/new-customer/?${params.toString()}`);
};

const CustomerServices = {
  getproductToDescription,
  getDiscription,
  getAllProductDescription,
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
  createCCF,
  uploadCCFdocument,
  createCCFComplaintForm,
  getAllCCFData,
  getAllClosedCCF,
  createComplaintpes,
  getAllComplaintsList,
  getAllComplaintsListData,
  getProductBaseCustomer,
  getAllDescription,
  CreateCapa,
  UpdateCapa,
  getAllCapaData,
  getCustomerLastPi,
  getProductLastPi,
  getAllStatesList,
  deleteCustomerContact,
  getCustomerScheme,
  createCustomerScheme,
  updateCustomerscheme,
  getCustomerStatus,
  getAllCustomerMasterList,
  createCustomerBeatPlan,
  addLeadsintoBeatName,
  updateCustomerBeatPlan,
  updateLeadsBeatPlan,
  AssignBeatToSalesPerson,
  AssignBeatLeadToSalesPerson,
  getFieldsSalesPersonVisitPlan,
  getFieldsSalesPersonLeadVisitPlan,
  getCustomerVisitDataById,
  getLeadVisitDataById,
  createCustomerSRF,
  updateCustomerSRfStatus,
  updateSRFProduct,
  getCustomerSRF,
  getNewCustomers,
  getLeadsMasterListByPincode,
  getCustomerAddressType,
};

export default CustomerServices;
