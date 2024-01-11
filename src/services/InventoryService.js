import CustomAxios from "./api";

const getAllVendorData = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/inventory/list-vendor/?${params.toString()}`);
};

const createVendorData = (data) => {
  return CustomAxios.post("/api/inventory/list-vendor/", data);
};

const getVendorDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-vendor/${id}`);
};

const updateVendorData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-vendor/${id}`, data);
};

const getBankInventoryDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-bank/${id}`);
};

const createBankInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-bank/", data);
};

const updateBankInventoryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-bank/${id}`, data);
};

const createContactInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-contact/", data);
};

const getContactInventoryDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-contact/${id}`);
};

const updateContactInventoryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-contact/${id}`, data);
};

const getAllContactInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-contact/`);
};

const createWareHouseInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-warehouse/", data);
};

const getWareHouseInventoryDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-warehouse/${id}`);
};

const updatetWareHouseInventoryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-warehouse/${id}`, data);
};

// Purchase Order Form List Api
const getAllPurchaseOrderData = (page, acceptedToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (acceptedToFilter !== undefined) {
    params.append("close_short", acceptedToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/inventory/purchase-order/?${params.toString()}`);
};

const createPurchaseOrderData = (data) => {
  return CustomAxios.post("/api/inventory/purchase-order/", data);
};

const getPurchaseOrderDataById = (id) => {
  return CustomAxios.get(`/api/inventory/purchase-order/${id}`);
};

const updatePurchaseOrderData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/purchase-order/${id}/`, data);
};

// Packing List Api
const getAllPackingListData = (page, acceptedToFilter, searchValue) => {
  console.log(page, acceptedToFilter, searchValue);
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (acceptedToFilter !== undefined) {
    // Append 'acceptedToFilter' regardless of it being true or false
    params.append("accepted", acceptedToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/inventory/list-packing-list/?${params.toString()}`
  );
};

const createPackingListData = (data) => {
  return CustomAxios.post("/api/inventory/list-packing-list/", data);
};

const getPackingListDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-packing-list/${id}`);
};

const updatePackingListData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-packing-list/${id}/`, data);
};

// grn List Api
const getAllGRNData = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/inventory/list-grn/?${params.toString()}`);
};

const createGRNData = (data) => {
  return CustomAxios.post("/api/inventory/list-grn/", data);
};

const getGRNDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-grn/${id}`);
};

const updateGRNData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-grn/${id}`, data);
};

// GRN Register
const getAllGRNRegisterDetails = (yearMonthFilter, page) => {
  const params = new URLSearchParams();

  if (yearMonthFilter) {
    params.append("year_month", yearMonthFilter);
  }

  if (page) {
    params.append("page", page);
  }

  // if (searchValue) {
  //   params.append("search", searchValue);
  // }

  return CustomAxios.get(`api/inventory/grn-register/?${params.toString()}`);
};

// Purchase Invoice List Api
const getAllPurchaseInvoiceData = (page, yearMonthFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (yearMonthFilter) {
    params.append("year_month", yearMonthFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/inventory/list-purchase-invoice/?${params.toString()}`
  );
};

const createPurchaseInvoiceData = (data) => {
  return CustomAxios.post("/api/inventory/list-purchase-invoice/", data);
};

const getPurchaseInvoiceDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-purchase-invoice/${id}`);
};

const updatePurchaseInvoiceData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-purchase-invoice/${id}`, data);
};

// Stores Inventory List Api
const getAllStoresInventoryDetails = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(
    `api/inventory/list-stores-inventory/?${params.toString()}`
  );
};

const createStoresInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-stores-inventory/", data);
};

const getAllConsStoresInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-con-stores-inventory/`);
};

const getAllPaginateConsStoresInventoryData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-con-stores-inventory/?page=${all}`
  );
};

const getAllPaginateConsStoresInventoryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-stores-inventory/?page=${all}&search=${search}`
  );
};

const getAllSearchConsStoresInventoryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-stores-inventory/?search=${search}`
  );
};

const getAllConsStoresInventoryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-stores-inventory/?page=${currentPage}&search=${search}`
  );
};

const getConsStoresInventoryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-con-stores-inventory/?page=${currentPage}`
  );
};
// Material Requisition Form List Api

const getAllMaterialRequisitionFormData = (page, searchValue) => {
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
    `api/inventory/list-material-requisition-form/?${params.toString()}`
  );
};

const createMaterialRequisitionFormData = (data) => {
  return CustomAxios.post(
    "/api/inventory/list-material-requisition-form/",
    data
  );
};

const getMaterialRequisitionFormDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-material-requisition-form/${id}`);
};

const updateMaterialRequisitionFormData = (id, data) => {
  return CustomAxios.patch(
    `/api/inventory/list-material-requisition-form/${id}`,
    data
  );
};

// Bill of Materials List Api

const getAllBillofMaterialsData = (page, approvedToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (approvedToFilter !== undefined) {
    params.append("approved", approvedToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/inventory/list-bill-of-materials/?${params.toString()}`
  );
};

const createBillofMaterialsData = (data) => {
  return CustomAxios.post("/api/inventory/list-bill-of-materials/", data);
};

const getBillofMaterialsDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-bill-of-materials/${id}`);
};

const updateBillofMaterialsData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-bill-of-materials/${id}`, data);
};

// Production Entry List Api

const getAllProductionEntryData = (page, searchValue) => {
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
    `api/inventory/list-production-entry/?${params.toString()}`
  );
};

const createProductionEntryData = (data) => {
  return CustomAxios.post("/api/inventory/list-production-entry/", data);
};

const getProductionEntryDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-production-entry/${id}`);
};

const updateProductionEntryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-production-entry/${id}`, data);
};

// Material Requisition Form List Api
const getAllMaterialTransferNoteData = (
  page,
  acceptedToFilter,
  searchValue
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (acceptedToFilter) {
    params.append("accepted", acceptedToFilter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?${params.toString()}`
  );
};

const createMaterialTransferNoteData = (data) => {
  return CustomAxios.post("/api/inventory/list-material-transfer-note/", data);
};

const getMaterialTransferNoteDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-material-transfer-note/${id}`);
};

const updateMaterialTransferNoteData = (id, data) => {
  return CustomAxios.patch(
    `/api/inventory/list-material-transfer-note/${id}`,
    data
  );
};

// Stores Inventory List Api

const getAllConsProductionInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-con-production-inventory/`);
};

const getAllPaginateConsProductionInventoryData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-con-production-inventory/?page=${all}`
  );
};

const getAllPaginateConsProductionInventoryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-production-inventory/?page=${all}&search=${search}`
  );
};

const getAllSearchConsProductionInventoryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-production-inventory/?search=${search}`
  );
};

const getAllConsProductionInventoryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-con-production-inventory/?page=${currentPage}&search=${search}`
  );
};

const getConsProductionInventoryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-con-production-inventory/?page=${currentPage}`
  );
};

const getAllProductionInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-production-inventory/`);
};

const getAllPaginateProductionInventoryData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?page=${all}`
  );
};

const getAllPaginateProductionInventoryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?page=${all}&search=${search}`
  );
};

const getAllSearchProductionInventoryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?search=${search}`
  );
};

const getAllProductionInventoryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?page=${currentPage}&search=${search}`
  );
};

const getProductionInventoryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?page=${currentPage}`
  );
};

// Production Inventory G&L List Api
const getAllProductionGAndLInventoryData = (page, searchValue) => {
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
    `api/inventory/list-production-gnl/?${params.toString()}`
  );
};

// Production ShortFall List Api
const getAllProductionShortFallData = () => {
  return CustomAxios.get(`/api/inventory/list-production-shortfall/`);
};

const getAllPaginateProductionShortFallData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-production-shortfall/?page=${all}`
  );
};

const getAllPaginateProductionShortFallDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-shortfall/?page=${all}&search=${search}`
  );
};

const getAllSearchProductionShortFallData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-shortfall/?search=${search}`
  );
};

const getAllProductionShortFallDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-shortfall/?page=${currentPage}&search=${search}`
  );
};

const getProductionShortFallPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-production-shortfall/?page=${currentPage}`
  );
};

// Daily Production Repor Api

const getAllDailyProductionReport = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/inventory/list-daily-production-report/?date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getDailyProductionReportWithPagination = (
  startDate,
  endDate,
  currentPage
) => {
  return CustomAxios.get(
    `/api/inventory/list-daily-production-report/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}`
  );
};

const getDailyProductionReportWithSearch = (startDate, endDate, search) => {
  return CustomAxios.get(
    `/api/inventory/list-daily-production-report/?date_range_after=${startDate}&date_range_before=${endDate}&search=${search}`
  );
};

const getDailyProductionReportWithPaginationAndSearch = (
  startDate,
  endDate,
  currentPage,
  search
) => {
  return CustomAxios.get(
    `/api/inventory/list-daily-production-report/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}&search=${search}`
  );
};

// Weekly Production Report List Api

const getAllWeeklyProductionReportData = () => {
  return CustomAxios.get(`/api/inventory/list-weekly-product-quantity/`);
};

const getAllSearchWeeklyProductionReportData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-weekly-product-quantity/?search=${search}`
  );
};

const getAllWeeklyProductionReportDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-weekly-product-quantity/?page=${currentPage}&search=${search}`
  );
};

const getWeeklyProductionReportPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-weekly-product-quantity/?page=${currentPage}`
  );
};

const getWeeklyProductionReportFilterData = (month, year) => {
  return CustomAxios.get(
    `/api/inventory/list-weekly-product-quantity/?month=${month}&year=${year}`
  );
};

// Currency List Api
const getCurrencyData = () => {
  return CustomAxios.get(`/api/inventory/currency`);
};

const createCurrencyData = (data) => {
  return CustomAxios.post("/api/inventory/currency/", data);
};

const getCurrencyDataById = (id) => {
  return CustomAxios.get(`/api/inventory/currency/${id}`);
};

const updateCurrencyData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/currency/${id}/`, data);
};

const InventoryServices = {
  getAllVendorData,
  createVendorData,
  getVendorDataById,
  updateVendorData,
  getBankInventoryDataById,
  createBankInventoryData,
  updateBankInventoryData,
  createContactInventoryData,
  getContactInventoryDataById,
  updateContactInventoryData,
  getAllContactInventoryData,
  createWareHouseInventoryData,
  updatetWareHouseInventoryData,
  getWareHouseInventoryDataById,
  getAllPurchaseOrderData,
  createPurchaseOrderData,
  getPurchaseOrderDataById,
  updatePurchaseOrderData,
  getAllPackingListData,
  createPackingListData,
  getPackingListDataById,
  updatePackingListData,
  getAllGRNData,
  createGRNData,
  getGRNDataById,
  updateGRNData,
  getAllGRNRegisterDetails,
  getAllPurchaseInvoiceData,
  createPurchaseInvoiceData,
  getPurchaseInvoiceDataById,
  updatePurchaseInvoiceData,
  createStoresInventoryData,
  getAllConsStoresInventoryData,
  getAllPaginateConsStoresInventoryData,
  getAllPaginateConsStoresInventoryDataWithSearch,
  getAllSearchConsStoresInventoryData,
  getAllConsStoresInventoryDataPaginate,
  getConsStoresInventoryPaginateData,
  getAllMaterialRequisitionFormData,
  createMaterialRequisitionFormData,
  getMaterialRequisitionFormDataById,
  updateMaterialRequisitionFormData,
  getAllBillofMaterialsData,
  createBillofMaterialsData,
  getBillofMaterialsDataById,
  updateBillofMaterialsData,
  getAllProductionEntryData,
  createProductionEntryData,
  getProductionEntryDataById,
  updateProductionEntryData,
  getAllMaterialTransferNoteData,
  createMaterialTransferNoteData,
  getMaterialTransferNoteDataById,
  updateMaterialTransferNoteData,
  getAllProductionInventoryData,
  getAllPaginateProductionInventoryData,
  getAllPaginateProductionInventoryDataWithSearch,
  getAllSearchProductionInventoryData,
  getAllProductionInventoryDataPaginate,
  getProductionInventoryPaginateData,
  getAllConsProductionInventoryData,
  getAllPaginateConsProductionInventoryData,
  getAllPaginateConsProductionInventoryDataWithSearch,
  getAllSearchConsProductionInventoryData,
  getAllConsProductionInventoryDataPaginate,
  getConsProductionInventoryPaginateData,
  getAllProductionGAndLInventoryData,
  getAllProductionShortFallData,
  getAllPaginateProductionShortFallData,
  getAllPaginateProductionShortFallDataWithSearch,
  getAllSearchProductionShortFallData,
  getAllProductionShortFallDataPaginate,
  getProductionShortFallPaginateData,
  getAllDailyProductionReport,
  getDailyProductionReportWithPagination,
  getDailyProductionReportWithSearch,
  getDailyProductionReportWithPaginationAndSearch,
  getAllWeeklyProductionReportData,
  getAllSearchWeeklyProductionReportData,
  getAllWeeklyProductionReportDataPaginate,
  getWeeklyProductionReportPaginateData,
  getWeeklyProductionReportFilterData,
  getCurrencyData,
  createCurrencyData,
  getCurrencyDataById,
  updateCurrencyData,
  getAllStoresInventoryDetails,
};

export default InventoryServices;
