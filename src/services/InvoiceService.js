import CustomAxios from "./api";

const getAllSellerAccountData = () => {
  return CustomAxios.get(`/api/invoice/list-seller-account`);
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

// All Company Api
const getCompanyPerformaInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-company-pi`);
};

const getCompanyPIFilterBy = (filter, search) => {
  return CustomAxios.get(`/api/invoice/list-company-pi/?${filter}=${search}`);
};

const getCompanyPIPagination = (currentPage) => {
  return CustomAxios.get(`/api/invoice/list-company-pi/?page=${currentPage}`);
};

const getCompanyPIPaginationWithFilterBy = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/invoice/list-company-pi/?page=${currentPage}&${filter}=${search}`
  );
};

// All Lead Api
const getLeadsPerformaInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-lead-pi`);
};

const getLeadsPerformaInvoiceFilterBy = (filter, search) => {
  return CustomAxios.get(`/api/invoice/list-lead-pi/?${filter}=${search}`);
};

const getLeadsPerformaInvoicePagination = (currentPage) => {
  return CustomAxios.get(`/api/invoice/list-lead-pi/?page=${currentPage}`);
};

const getLeadsPIPaginationWithFilterBy = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/invoice/list-lead-pi/?page=${currentPage}&${filter}=${search}`
  );
};

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

const getOTotalPendingQuantity = () => {
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

const getSalesnvoiceDataById = (id) => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice/${id}`);
};

const getAllSaleRegisterData = () => {
  return CustomAxios.get(`/api/invoice/list-sales-register`);
};

const getSaleRegisterDataWithPagination = (currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?page=${currentPage}`
  );
};

const getSaleRegisterDataWithSearch = (search) => {
  return CustomAxios.get(`/api/invoice/list-sales-register/?search=${search}`);
};

const getSaleRegisterDataWithPaginationAndSearch = (currentPage, search) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-register/?page=${currentPage}&search=${search}`
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
const InvoiceServices = {
  getAllSellerAccountData,
  getAllPaginateSellerAccountData,
  getAllSearchSellerAccountData,
  getAllSellerAccountDataPaginate,
  createSellerAccountData,
  getAllOrderBookData,
  getAllOrderBookDataWithSearch,
  getAllcustomerOrderBookData,
  getcustomerOrderBookData,
  getcustomerOrderBookDataByID,
  getSellerAccountDataById,
  updateSellerAccountData,
  getCompanyPerformaInvoiceData,
  getCompanyPIFilterBy,
  getCompanyPIPagination,
  getCompanyPIPaginationWithFilterBy,
  getLeadsPerformaInvoiceData,
  getLeadsPerformaInvoiceFilterBy,
  getLeadsPIPaginationWithFilterBy,
  getLeadsPerformaInvoicePagination,
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
  getOTotalPendingQuantity,
  getSalesInvoiceData,
  getSalesInvoiceDataWithSearch,
  getSalesInvoiceDataWithPagination,
  getSalesInvoiceDataWithPaginationAndSearch,
  createSalesnvoiceData,
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
};

export default InvoiceServices;
