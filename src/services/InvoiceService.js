import CustomAxios from "./api";

const getAllSellerAccountData = () => {
  return CustomAxios.get(`/api/invoice/list-seller-account`);
};

const getfilterSellerAccountData = (data) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/?state=${data}`);
};

const getAllPaginateSellerAccountData = (all) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/?page=${all}`);
};

const getAllSearchSellerAccountData = (search) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/?search=${search}`);
};

const getAllSellerAccountDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/ invoice/list-seller-account/?page=${currentPage}&search=${search}`,
  );
};

const createSellerAccountData = (data) => {
  return CustomAxios.post("/api/invoice/list-seller-account/", data);
};

const getSellerAccountDataById = (id) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/${id}`);
};

const updateSellerAccountData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-seller-account/${id}`, data);
};

const getAllPIWithDateRange = (
  startDate,
  endDate,
  piType,
  page,
  filterType,
  filterValue,
  searchValue,
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (startDate) {
    params.append("date_range_after", startDate);
  }

  if (endDate) {
    params.append("date_range_before", endDate);
  }

  if (piType) {
    params.append("pi", piType);
  }
  if (page) {
    params.append("page", page);
  }

  if (filterType && filterValue) {
    params.append(filterType, filterValue);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/list-proforma-invoice/?${params.toString()}`,
  );
};

const getAllPIData = (piType, page, filterType, filterValue, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (piType) {
    params.append("pi", piType);
  }
  if (page) {
    params.append("page", page);
  }

  if (filterType && filterValue) {
    params.append(filterType, filterValue);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/list-proforma-invoice/?${params.toString()}`,
  );
};

// All Lead Api

const getCompanyPerformaInvoiceByIDData = (id) => {
  return CustomAxios.get(`/api/invoice/list-company-pi/${id}`);
};

const getLeadsPerformaInvoiceByIDData = (id) => {
  return CustomAxios.get(`/api/invoice/list-lead-pi/${id}`);
};

const sendForApprovalCompanyData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-company-pi/${id}`, data);
};

const sendForApprovalLeadsData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-lead-pi/${id}`, data);
};

const sendForApprovalData = (data) => {
  return CustomAxios.post(`/api/invoice/list-approval/`, data);
};

const createLeadsProformaInvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-lead-pi/", data);
};

const getLeadsProformaInvoiceDataByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-lead-pi/${id}`);
};

const updateLeadsProformaInvoiceData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-lead-pi/${id}`, data);
};

const createCustomerProformaInvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-company-pi/", data);
};

const getCustomerProformaInvoiceDataByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-company-pi/${id}`);
};

const updateCustomerProformaInvoiceData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-company-pi/${id}`, data);
};

// All order Api
const getOrderBookData = (
  orderingType,
  page,
  filterBySellerUnit,
  filterBySellerEmail,
  searchValue,
  isReady,
  is_estimated,
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();
  if (orderingType) {
    params.append("ordering", orderingType);
  }

  if (page) {
    params.append("page", page);
  }

  if (filterBySellerUnit) {
    params.append(
      "orderbook__proforma_invoice__seller_account__state",
      filterBySellerUnit,
    );
  }

  if (filterBySellerEmail) {
    params.append(
      "orderbook__proforma_invoice__raised_by__email",
      filterBySellerEmail,
    );
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  params.append("is_ready", isReady);
  params.append("is_estimated", is_estimated);

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/invoice/list-order-book/?${params.toString()}`);
};

// Generic function to update order book data
const updateOrderBookData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-order-book/${id}`, data);
};

// Generic function to get order book data by ID
const getOrderBookDataByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-order-book/${id}`);
};

const getTotalPendingQuantity = () => {
  return CustomAxios.get(`/api/invoice/pending-order-total`);
};

const getAllOrderBookDataWithSearch = (data, type, searchvalue) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book-company/?page=${data}&ordering=${type}&search=${searchvalue}`,
  );
};

// sales invoice api
const getSalesInvoiceData = (
  invoiceType,
  startDate,
  endDate,
  page,
  filterValue,
  searchValue,
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (invoiceType) {
    params.append("invoice_type", invoiceType);
  }
  if (startDate) {
    params.append("start_date", startDate);
  }

  if (endDate) {
    params.append("end_date", endDate);
  }

  if (page) {
    params.append("page", page);
  }

  if (filterValue) {
    params.append(
      "order_book__proforma_invoice__seller_account__unit",
      filterValue,
    );
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/list-sales-invoice/?${params.toString()}`,
  );
};

const getTallyInvoiceData = (startDate, endDate, filterValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (startDate) {
    params.append("start_date", startDate);
  }

  if (endDate) {
    params.append("end_date", endDate);
  }
  if (filterValue) {
    params.append(
      "sales_invoice__order_book__proforma_invoice__seller_account__unit",
      filterValue,
    );
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/invoice/tally-invoice/?${params.toString()}`);
};

const createBranchinvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/branch-invoice/", data);
};

const createSalesinvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-sales-invoice/", data);
};

const cancelSalesInvoice = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-sales-invoice/${id}`, data);
};

const getSalesnvoiceDataById = (id) => {
  return CustomAxios.get(`api/invoice/list-sales-invoice/${id}`);
};

// sales register api endpooint
const getAllSaleRegisterData = (
  startDate,
  endDate,
  page,
  searchValue,
  filterByperson,
  status,
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (startDate) {
    params.append("date_range_after", startDate);
  }

  if (endDate) {
    params.append("date_range_before", endDate);
  }

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (filterByperson) {
    params.append(
      "sales_invoice__order_book__proforma_invoice__raised_by__email",
      filterByperson,
    );
  }
  if (status) {
    params.append("status", status);
  }
  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/list-sales-register/?${params.toString()}`,
  );
};

const getDispatchData = (
  dispatchedValue,
  page,
  searchValue,
  filterByperson,

  display_tab,
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (dispatchedValue) {
    params.append("dispatched", dispatchedValue);
  }
  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (filterByperson) {
    params.append(
      "sales_invoice__order_book__proforma_invoice__raised_by__email",
      filterByperson,
    );
  }

  if (display_tab) {
    params.append("display_tab", display_tab);
  }
  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/list-dispatch-book/?${params.toString()}`,
  );
};

const updateDispatched = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-dispatch-book/${id}`, data);
};

const getAllDashboardData = () => {
  return CustomAxios.get("/api/invoice/list-dashboard");
};

const getFilterDashboardData = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/invoice/list-dashboard/?start_date=${startDate}&end_date=${endDate}`,
  );
};

const getDispatchDashboardData = () => {
  return CustomAxios.get(`/api/invoice/list-dashboard-dispatch`);
};

const getLRCopyDashboardData = (pageNumber, boolean, isNull, unit) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?page=${pageNumber}&dispatched=${boolean}&lr_copy__isnull=${isNull}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`,
  );
};

const getPODCopyDashboardData = (pageNumber, boolean, isNull, unit) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?page=${pageNumber}&dispatched=${boolean}&pod_copy__isnull=${isNull}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`,
  );
};

const checkPrice = (pi_number) => {
  return CustomAxios.get(
    `/api/invoice/check-price-list/?pi_number=${pi_number}`,
  );
};

// get sales return data by company search api endpoint
const getSalesReturnBySearchCompany = (unitValue, companyValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (unitValue) {
    params.append("seller_unit", unitValue);
  }

  if (companyValue) {
    params.append("company", companyValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/invoice/company-sales-invoice/?${params.toString()}`,
  );
};

const getSalesReturnByCCF = (complain_no) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (complain_no) {
    params.append("complain_no", complain_no);
  }
  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/invoice/ccf-sales-invoice/?${params.toString()}`,
  );
};

//Debit/credit api starts here
const getCustomersList = () => {
  return CustomAxios.get(`/api/customer/customer/`);
};

const getDebitCreditnotes = (page, searchValue) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(
    `/api/invoice/credit-debit-note/?${params.toString()}`,
  );
};

const CreateDebitCreditNote = (data) => {
  return CustomAxios.post("/api/invoice/credit-debit-note/", data);
};

const getDebitCreditNoteById = (id) => {
  return CustomAxios.get(`/api/invoice/credit-debit-note/${id}/`);
};

const getInvoiceByCustomerAndSellerUnit = (customer, unit) => {
  const params = new URLSearchParams();
  if (customer) {
    params.append("customer", customer);
  }
  if (unit) {
    params.append("unit", unit);
  }
  return CustomAxios.get(
    `/api/invoice/six-month-invoice/?${params.toString()}`,
  );
};
const getBillingAddressbyCustomer = (data) => {
  return CustomAxios.get(`api/customer/warehouse/?customer=${data}`);
};

const uploadSalesinvoice = (data) => {
  return CustomAxios.post(`/api/invoice/invoice-upload/`, data);
};
const updateAllPerformaInvoiceData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/update-proforma-invoice/${id}`, data);
};
const InvoiceServices = {
  getAllSellerAccountData,
  getfilterSellerAccountData,
  getAllPaginateSellerAccountData,
  getAllSearchSellerAccountData,
  getAllSellerAccountDataPaginate,
  createSellerAccountData,
  updateOrderBookData,
  getOrderBookDataByID,
  getSellerAccountDataById,
  updateSellerAccountData,
  getAllPIWithDateRange,
  getAllPIData,
  getCompanyPerformaInvoiceByIDData,
  getLeadsPerformaInvoiceByIDData,
  sendForApprovalCompanyData,
  sendForApprovalLeadsData,
  sendForApprovalData,
  createLeadsProformaInvoiceData,
  getLeadsProformaInvoiceDataByID,
  updateLeadsProformaInvoiceData,
  createCustomerProformaInvoiceData,
  getCustomerProformaInvoiceDataByID,
  updateCustomerProformaInvoiceData,
  getOrderBookData,
  getTotalPendingQuantity,
  getAllOrderBookDataWithSearch,
  getSalesInvoiceData,
  getTallyInvoiceData,
  createBranchinvoiceData,
  cancelSalesInvoice,
  getSalesnvoiceDataById,
  getAllSaleRegisterData,
  getDispatchData,
  updateDispatched,
  getAllDashboardData,
  getFilterDashboardData,
  getDispatchDashboardData,
  getLRCopyDashboardData,
  getPODCopyDashboardData,
  checkPrice,
  getSalesReturnBySearchCompany,
  getSalesReturnByCCF,
  getCustomersList,
  getDebitCreditnotes,
  CreateDebitCreditNote,
  getDebitCreditNoteById,
  getInvoiceByCustomerAndSellerUnit,
  getBillingAddressbyCustomer,
  uploadSalesinvoice,
  createSalesinvoiceData,
  updateAllPerformaInvoiceData,
};

export default InvoiceServices;
