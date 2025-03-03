import CustomAxios from "./api";

const getAllVendorData = (page, searchValue, sourceFilter) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (sourceFilter) {
    params.append("vendor_source", sourceFilter);
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

const createBankInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-bank/", data);
};

const updateBankInventoryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-bank/${id}`, data);
};

const createContactInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-contact/", data);
};

const updateContactInventoryData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-contact/${id}`, data);
};

const createWareHouseInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-warehouse/", data);
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

const updatePackingListData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-packing-list/${id}/`, data);
};

// grn List Api
const getAllGRNData = (page, acceptedToFilter, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (acceptedToFilter !== undefined) {
    params.append("accepted", acceptedToFilter);
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
const getAllGRNRegisterDetails = (yearMonthFilter, page, searchValue) => {
  const params = new URLSearchParams();

  if (yearMonthFilter) {
    params.append("year_month", yearMonthFilter);
  }

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/inventory/grn-register/?${params.toString()}`);
};

// Purchase Invoice List Api
const getAllPurchaseInvoiceData = (yearMonthFilter, page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  params.append("invoice_type", "Purchase");

  if (yearMonthFilter) {
    params.append("year_month", yearMonthFilter);
  }

  if (page) {
    params.append("page", page);
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

// Description Stores Inventory List Api
const getDescriptionStoresInventoryDetails = (filter, searchValue) => {
  const params = new URLSearchParams();

  if (filter) {
    params.append("unit", filter);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(
    `api/inventory/description-stores-inventory/?${params.toString()}`
  );
};

// job worker store inventory api
const getJobWorkerInventoryData = () => {
  return CustomAxios.get(`api/inventory/job-worker-inventory/`);
};

const getProductCodeStoresInventoryDetails = (data) => {
  return CustomAxios.post(
    "api/inventory/description-stores-inventory/cons_store_product/",
    data
  );
};

const getAllProductStoresInventoryDetails = (data) => {
  return CustomAxios.post(
    "api/inventory/description-stores-inventory/store_product/",
    data
  );
};

// Material Requisition Form List Api

const getAllMaterialRequisitionFormData = (
  page,
  searchValue,
  filterValue,
  date,
  start_date,
  end_date
) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (filterValue) {
    params.append("seller_account__unit", filterValue);
  }
  if (date) {
    params.append("date", date);
  }
  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
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

const updateMaterialRequisitionFormData = (id, data) => {
  return CustomAxios.patch(
    `/api/inventory/list-material-requisition-form/${id}`,
    data
  );
};

// Bill of Materials List Api

const getAllBillofMaterialsData = (
  page,
  approvedToFilter,
  is_deactivated,
  searchValue
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (approvedToFilter !== undefined) {
    params.append("approved", approvedToFilter);
  }

  if (is_deactivated !== undefined) {
    params.append("is_deactivated", is_deactivated);
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

const updateBillofMaterialsData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-bill-of-materials/${id}`, data);
};

// Production Entry List Api

const getAllProductionEntryData = (
  page,
  searchValue,
  start_date,
  end_date,
  date
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
  }
  if (date) {
    params.append("date", date);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/inventory/list-production-entry/?${params.toString()}`
  );
};

const createProductionEntryData = (data) => {
  return CustomAxios.post("/api/inventory/list-production-entry/", data);
};

// Material Requisition Form List Api
const getAllMaterialTransferNoteData = (
  page,
  acceptedToFilter,
  searchValue,
  date,
  start_date,
  end_date
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
  if (date) {
    params.append("date", date);
  }
  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?${params.toString()}`
  );
};

const getAllMrfProducts = (date, start_date, end_date) => {
  const params = new URLSearchParams();
  if (date) {
    params.append("date", date);
  }
  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
  }
  return CustomAxios.get(`api/inventory/mrf-product/?${params.toString()}`);
};

const createMaterialTransferNoteData = (data) => {
  return CustomAxios.post("/api/inventory/list-material-transfer-note/", data);
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

const getProductionInventoryData = (page, searchQuery = "") => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(
    `/api/inventory/list-production-inventory/?${params.toString()}`
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

// Improved API Call Implementation
const getAllDailyProductionReport = (
  startDate,
  endDate,
  page = 1,
  searchValue = ""
) => {
  // Construct query parameters
  const params = new URLSearchParams();
  if (startDate) params.append("date_range_after", startDate);
  if (endDate) params.append("date_range_before", endDate);
  params.append("page", page);
  if (searchValue) params.append("search", searchValue);

  // Make GET request with all parameters
  return CustomAxios.get(
    `api/inventory/list-daily-production-report/?${params.toString()}`
  );
};

// Weekly Production Report List Api

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

const updateCurrencyData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/currency/${id}/`, data);
};

//Safety Stock API

const getAllSafetyStockData = () => {
  return CustomAxios.get(`/api/inventory/safety-stock/`);
};

const createSafetyStockData = (data) => {
  return CustomAxios.post(`/api/inventory/safety-stock/`, data);
};

const updateSafetyStockData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/safety-stock/${id}/`, data);
};

const getChalan = (page) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  return CustomAxios.get(`/api/inventory/challan/?${params.toString()}`);
};
const createChalan = (data) => {
  return CustomAxios.post(`/api/inventory/challan/`, data);
};
const updateChalan = (id, data) => {
  return CustomAxios.patch(`/api/inventory/challan/${id}/`, data);
};

const getChallanInvoice = (page) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  return CustomAxios.get(
    `/api/inventory/challan-invoice/?${params.toString()}`
  );
};
const createChalanInvoice = (data) => {
  return CustomAxios.post(`/api/inventory/challan-invoice/`, data);
};

const getPhysical = (page, searchQuery) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(
    `/api/inventory/physical-inventory/?${params.toString()}`
  );
};
const createPhysical = (data) => {
  return CustomAxios.post(`/api/inventory/physical-inventory/`, data);
};
const updatePhysical = (id, data) => {
  return CustomAxios.patch(`/api/inventory/physical-inventory/${id}/`, data);
};

// Sales Return inventory api
const getSalesReturnData = (page, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  params.append("invoice_type", "Sales Return");

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(
    `api/inventory/list-purchase-invoice/?${params.toString()}`
  );
};

const getSalesReturnByIDData = (id) => {
  return CustomAxios.get(`api/invoice/list-sales-invoice/${id}`);
};

const createSalesReturn = (data) => {
  return CustomAxios.post(`/api/inventory/list-purchase-invoice/`, data);
};

//sales return inventory get data api
const getSalesReturnInventoryData = (page, searchValue) => {
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
    `api/inventory/sales-return-inventory/?${params.toString()}`
  );
};

const updateSalesReturnInventoryData = (id, data) => {
  return CustomAxios.patch(`api/inventory/sales-return-inventory/${id}/`, data);
};

// Rework Invoice Api endpoints
const createReworkinvoiceData = (data) => {
  return CustomAxios.post("api/inventory/rework-entry/", data);
};

const getReworkinvoiceData = (page, searchValue) => {
  const params = new URLSearchParams();

  params.append("invoice_type", "Sales Return");

  if (page) {
    params.append("page", page);
  }
  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/inventory/rework-entry/?${params.toString()}`);
};

const updateReworkInvoiceData = (id, data) => {
  return CustomAxios.patch(`api/inventory/rework-entry/${id}/`, data);
};

const InventoryServices = {
  getAllVendorData,
  createVendorData,
  getVendorDataById,
  updateVendorData,
  createBankInventoryData,
  updateBankInventoryData,
  createContactInventoryData,
  updateContactInventoryData,
  createWareHouseInventoryData,
  updatetWareHouseInventoryData,
  getAllPurchaseOrderData,
  createPurchaseOrderData,
  updatePurchaseOrderData,
  getAllPackingListData,
  createPackingListData,
  updatePackingListData,
  getAllGRNData,
  createGRNData,
  getGRNDataById,
  updateGRNData,
  getAllGRNRegisterDetails,
  getAllPurchaseInvoiceData,
  createPurchaseInvoiceData,
  getPurchaseInvoiceDataById,
  createStoresInventoryData,
  getAllConsStoresInventoryData,
  getDescriptionStoresInventoryDetails,
  getJobWorkerInventoryData,
  getProductCodeStoresInventoryDetails,
  getAllProductStoresInventoryDetails,
  getAllMaterialRequisitionFormData,
  createMaterialRequisitionFormData,
  updateMaterialRequisitionFormData,
  getAllBillofMaterialsData,
  createBillofMaterialsData,
  updateBillofMaterialsData,
  getAllProductionEntryData,
  createProductionEntryData,
  getAllMaterialTransferNoteData,
  getAllMrfProducts,
  createMaterialTransferNoteData,
  updateMaterialTransferNoteData,
  getProductionInventoryData,
  getAllConsProductionInventoryData,
  getAllProductionGAndLInventoryData,
  getAllProductionShortFallData,
  getAllDailyProductionReport,
  getWeeklyProductionReportFilterData,
  getCurrencyData,
  createCurrencyData,
  updateCurrencyData,
  getAllStoresInventoryDetails,
  getAllSafetyStockData,
  createSafetyStockData,
  updateSafetyStockData,
  getChalan,
  createChalan,
  updateChalan,
  getChallanInvoice,
  createChalanInvoice,
  getPhysical,
  createPhysical,
  updatePhysical,
  getSalesReturnData,
  getSalesReturnByIDData,
  createSalesReturn,
  getSalesReturnInventoryData,
  updateSalesReturnInventoryData,
  createReworkinvoiceData,
  getReworkinvoiceData,
  updateReworkInvoiceData,
};

export default InventoryServices;
