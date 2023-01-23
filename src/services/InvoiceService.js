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

const createCustomerProformaInvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-company-pi/", data);
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

const getcustomerOrderBookData = (data) => {
  return CustomAxios.get(`/api/invoice/list-order-book-company/?page=${data}`);
};

const getProductOrderBookDatawithPage = (type, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&page=${data}`
  );
};

const getAllOrderBookDatawithSearch = (type, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&search=${data}`
  );
};

const getAllOrderBookDatawithSearchWithPagination = (type, value, data) => {
  return CustomAxios.get(
    `/api/invoice/list-order-book/?ordering=${type}&page=${value}&search=${data}`
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

const getOTotalPendingQuantity = (type) => {
  return CustomAxios.get(`/api/invoice/pending-order-total`);
};

const getSalesInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice`);
};

const getSalesInvoiceDataWithPagination = (currentPage) => {
  return CustomAxios.get(
    `/api/invoice/list-sales-invoice/?page=${currentPage}`
  );
};

const createSalesnvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-sales-invoice/", data);
};

const getSalesnvoiceDataById = (id) => {
  return CustomAxios.get(`/api/invoice/list-sales-invoice/${id}`);
};

const InvoiceServices = {
  getAllSellerAccountData,
  getAllPaginateSellerAccountData,
  getAllSearchSellerAccountData,
  getAllSellerAccountDataPaginate,
  createSellerAccountData,
  getAllOrderBookData,
  getAllcustomerOrderBookData,
  getcustomerOrderBookData,
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
  createCustomerProformaInvoiceData,
  getOrderBookData,
  getProductOrderBookDatawithPage,
  getAllOrderBookDatawithSearch,
  getAllOrderBookDatawithSearchWithPagination,
  getAllOrderBookDatawithPage,
  getAllcustomerOrderBookData,
  getOTotalPendingQuantity,
  getSalesInvoiceData,
  getSalesInvoiceDataWithPagination,
  createSalesnvoiceData,
  getSalesnvoiceDataById,
};

export default InvoiceServices;
