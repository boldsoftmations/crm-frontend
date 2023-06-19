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
    `/api/ invoice/list-seller-account/?page=${currentPage}&search=${search}`
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

// all proforma invoice api
const getPIDataWithDateRange = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?pi=all&date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getPISearchWithDateRange = (
  startDate,
  endDate,
  filter,
  filterValue,
  search,
  searchValue
) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?pi=all&date_range_after=${startDate}&date_range_before=${endDate}&${filter}=${filterValue}&${search}=${searchValue}`
  );
};

const getPIPaginationWithDateRange = (currentPage, startDate, endDate) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?page=${currentPage}&pi=all&date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getPIPaginationWithFilterByWithDateRange = (
  currentPage,
  startDate,
  endDate,
  filter,
  filterValue,
  search,
  searchValue
) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?page=${currentPage}&pi=all&date_range_after=${startDate}&date_range_before=${endDate}&${filter}=${filterValue}&${search}=${searchValue}`
  );
};

const getAllPIData = (piValue) => {
  return CustomAxios.get(`/api/invoice/list-proforma-invoice/?pi=${piValue}`);
};

const getAllPISearch = (piValue, filter, filterValue, search, searchValue) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?pi=${piValue}&${filter}=${filterValue}&${search}=${searchValue}`
  );
};

const getAllPIPagination = (piValue, currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?pi=${piValue}&page=${currentPage}`
  );
};

const getAllPIPaginationWithFilterBy = (
  piValue,
  currentPage,
  filter,
  filterValue,
  search,
  searchValue
) => {
  return CustomAxios.get(
    `/api/invoice/list-proforma-invoice/?pi=${piValue}&page=${currentPage}&${filter}=${filterValue}&${search}=${searchValue}`
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
const getOrderBookData = (type) => {
  return CustomAxios.get(`/api/invoice/list-order-book/?ordering=${type}`);
};

const getAllOrderBookData = (data, type) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?page=${data}&ordering=${type}`
  );
};

const getAllOrderBookDataWithSearch = (data, type, searchvalue) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book-company/?page=${data}&ordering=${type}&search=${searchvalue}`
  );
};

const getcustomerOrderBookData = (data) => {
  return CustomAxios.get(`/api/invoice/list-order-book-company/?page=${data}`);
};

const getcustomerOrderBookDataByID = (data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book-company/?proforma_invoice=${data}`
  );
};

const getProductOrderBookDatawithPage = (type, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&page=${data}`
  );
};

const getAllOrderBookDatawithSearch = (type, searchType, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&${searchType}=${data}`
  );
};

const getAllOrderBookDatawithSearchWithPagination = (
  type,
  value,
  searchType,
  data
) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&page=${value}&${searchType}=${data}`
  );
};

const getAllOrderBookDatawithPage = (type, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&page=${data}`
  );
};

const getAllcustomerOrderBookData = () => {
  return CustomAxios.get(`/api/invoice/list-order-book-company`);
};

const updateOrderBookData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-order-book/${id}`, data);
};

const getCustomerOrderBookByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-order-book/${id}`);
};

const updateProductOrderBookData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-order-book/${id}`, data);
};

const getProductOrderBookDataByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-order-book/${id}`);
};

const updatePIOrderBookData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-order-book/${id}`, data);
};

const getPIOrderBookDataByID = (id) => {
  return CustomAxios.get(`/api/invoice/list-order-book/${id}`);
};

const getTotalPendingQuantity = () => {
  return CustomAxios.get(`/api/invoice/pending-order-total`);
};

const getSalesInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice`);
};

const getSalesInvoiceDataWithSearch = (type, search) => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice/?${type}=${search}`);
};

const getSalesInvoiceDataWithPagination = (currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-invoice/?page=${currentPage}`
  );
};

const getSalesInvoiceDataWithPaginationAndSearch = (
  currentPage,
  type,
  search
) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-invoice/?page=${currentPage}&${type}=${search}`
  );
};

const createSalesnvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-sales-invoice/", data);
};

const cancelSalesInvoice = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-sales-invoice/${id}`, data);
};

const getSalesnvoiceDataById = (id) => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice/${id}`);
};

const getAllSaleRegisterData = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getSaleRegisterDataWithPagination = (startDate, endDate, currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}`
  );
};

const getSaleRegisterDataWithSearch = (startDate, endDate, search) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?date_range_after=${startDate}&date_range_before=${endDate}&search=${search}`
  );
};

const getSaleRegisterDataWithPaginationAndSearch = (
  startDate,
  endDate,
  currentPage,
  search
) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}&search=${search}`
  );
};

const getDispatchData = (value) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?dispatched=${value}`
  );
};

const getDispatchDataWithSearch = (value, search) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?dispatched=${value}&search=${search}`
  );
};

const getDispatchSearchWithPagination = (value, search, currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?dispatched=${value}&search=${search}&page=${currentPage}`
  );
};

const getDispatchDataWithPagination = (value, currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?dispatched=${value}&page=${currentPage}`
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
    `/api/invoice/list-dashboard/?start_date=${startDate}&end_date=${endDate}`
  );
};

const getDispatchDashboardData = () => {
  return CustomAxios.get(`/api/invoice/list-dashboard-dispatch`);
};

const getLRCopyDashboardData = (pageNumber, boolean, isNull, unit) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?page=${pageNumber}&dispatched=${boolean}&lr_copy__isnull=${isNull}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`
  );
};

const getPODCopyDashboardData = (pageNumber, boolean, isNull, unit) => {
  return CustomAxios.get(
    `/api/invoice/list-dispatch-book/?page=${pageNumber}&dispatched=${boolean}&pod_copy__isnull=${isNull}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`
  );
};

const InvoiceServices = {
  getAllSellerAccountData,
  getfilterSellerAccountData,
  getAllPaginateSellerAccountData,
  getAllSearchSellerAccountData,
  getAllSellerAccountDataPaginate,
  createSellerAccountData,
  getAllOrderBookData,
  getAllOrderBookDataWithSearch,
  getAllcustomerOrderBookData,
  updateOrderBookData,
  getCustomerOrderBookByID,
  getcustomerOrderBookData,
  getcustomerOrderBookDataByID,
  getProductOrderBookDataByID,
  getPIOrderBookDataByID,
  getSellerAccountDataById,
  updateSellerAccountData,
  getPIDataWithDateRange,
  getPISearchWithDateRange,
  getPIPaginationWithDateRange,
  getPIPaginationWithFilterByWithDateRange,
  getAllPIData,
  getAllPISearch,
  getAllPIPagination,
  getAllPIPaginationWithFilterBy,
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
  getProductOrderBookDatawithPage,
  getAllOrderBookDatawithSearch,
  getAllOrderBookDatawithSearchWithPagination,
  getAllOrderBookDatawithPage,
  // getAllcustomerOrderBookData,
  getTotalPendingQuantity,
  getSalesInvoiceData,
  getSalesInvoiceDataWithSearch,
  getSalesInvoiceDataWithPagination,
  getSalesInvoiceDataWithPaginationAndSearch,
  createSalesnvoiceData,
  cancelSalesInvoice,
  getSalesnvoiceDataById,
  getAllSaleRegisterData,
  getSaleRegisterDataWithPagination,
  getSaleRegisterDataWithSearch,
  getSaleRegisterDataWithPaginationAndSearch,
  getDispatchData,
  getDispatchSearchWithPagination,
  getDispatchDataWithSearch,
  getDispatchDataWithPagination,
  updateDispatched,
  getAllDashboardData,
  getFilterDashboardData,
  getDispatchDashboardData,
  getLRCopyDashboardData,
  getPODCopyDashboardData,
};

export default InvoiceServices;
