import CustomAxios from "./api";

const getAllVendorData = () => {
  return CustomAxios.get(`/api/inventory/list-vendor/`);
};

const getAllPaginateVendorData = (all) => {
  return CustomAxios.get(`/api/inventory/list-vendor/?page=${all}`);
};

const getAllPaginateVendorDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-vendor/?page=${all}&search=${search}`
  );
};

const getAllSearchVendorData = (search) => {
  return CustomAxios.get(`/api/inventory/list-vendor/?search=${search}`);
};

const getAllVendorDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-vendor/?page=${currentPage}&search=${search}`
  );
};

const getVendorPaginateData = (currentPage) => {
  return CustomAxios.get(`/api/inventory/list-vendor/?page=${currentPage}`);
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

// Packing List Api

const getAllPackingListData = () => {
  return CustomAxios.get(`/api/inventory/list-packing-list/`);
};

const getAllPaginatePackingListData = (all) => {
  return CustomAxios.get(`/api/inventory/list-packing-list/?page=${all}`);
};

const getAllPaginatePackingListDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-packing-list/?page=${all}&search=${search}`
  );
};

const getAllSearchPackingListData = (search) => {
  return CustomAxios.get(`/api/inventory/list-packing-list/?search=${search}`);
};

const getAllSearchWithFilterPackingListData = (all, type) => {
  return CustomAxios.get(
    `/api/inventory/list-packing-list/?page=${all}&accept=${type}`
  );
};

const getAllPackingListDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-packing-list/?page=${currentPage}&search=${search}`
  );
};

const getPackingListPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-packing-list/?page=${currentPage}`
  );
};

const createPackingListData = (data) => {
  return CustomAxios.post("/api/inventory/list-packing-list/", data);
};

const getPackingListDataById = (id) => {
  return CustomAxios.get(`/api/inventory/list-packing-list/${id}`);
};

const updatePackingListData = (id, data) => {
  return CustomAxios.patch(`/api/inventory/list-packing-list/${id}`, data);
};

// grn List Api

const getAllGRNData = () => {
  return CustomAxios.get(`/api/inventory/list-grn/`);
};

const getAllPaginateGRNData = (all) => {
  return CustomAxios.get(`/api/inventory/list-grn/?page=${all}`);
};

const getAllPaginateGRNDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-grn/?page=${all}&search=${search}`
  );
};

const getAllSearchGRNData = (search) => {
  return CustomAxios.get(`/api/inventory/list-grn/?search=${search}`);
};

const getAllSearchWithFilterGRNData = (all, type) => {
  return CustomAxios.get(
    `/api/inventory/list-grn/?page=${all}&accepted=${type}`
  );
};

const getAllGRNDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-grn/?page=${currentPage}&search=${search}`
  );
};

const getGRNPaginateData = (currentPage) => {
  return CustomAxios.get(`/api/inventory/list-grn/?page=${currentPage}`);
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

// Purchase Invoice List Api

const getAllPurchaseInvoiceData = () => {
  return CustomAxios.get(`/api/inventory/list-purchase-invoice/`);
};

const getAllPaginatePurchaseInvoiceData = (all) => {
  return CustomAxios.get(`/api/inventory/list-purchase-invoice/?page=${all}`);
};

const getAllPaginatePurchaseInvoiceDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-purchase-invoice/?page=${all}&search=${search}`
  );
};

const getAllSearchPurchaseInvoiceData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-purchase-invoice/?search=${search}`
  );
};

const getAllPurchaseInvoiceDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-purchase-invoice/?page=${currentPage}&search=${search}`
  );
};

const getPurchaseInvoicePaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-purchase-invoice/?page=${currentPage}`
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

const getAllStoresInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-stores-inventory/`);
};

const createStoresInventoryData = (data) => {
  return CustomAxios.post("/api/inventory/list-stores-inventory/", data);
};

const getAllPaginateStoresInventoryData = (all) => {
  return CustomAxios.get(`/api/inventory/list-stores-inventory/?page=${all}`);
};

const getAllPaginateStoresInventoryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-stores-inventory/?page=${all}&search=${search}`
  );
};

const getAllSearchStoresInventoryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-stores-inventory/?search=${search}`
  );
};

const getAllStoresInventoryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-stores-inventory/?page=${currentPage}&search=${search}`
  );
};

const getStoresInventoryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-stores-inventory/?page=${currentPage}`
  );
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

const getAllMaterialRequisitionFormData = () => {
  return CustomAxios.get(`/api/inventory/list-material-requisition-form/`);
};

const getAllPaginateMaterialRequisitionFormData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-material-requisition-form/?page=${all}`
  );
};

const getAllPaginateMaterialRequisitionFormDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-requisition-form/?page=${all}&search=${search}`
  );
};

const getAllSearchMaterialRequisitionFormData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-requisition-form/?search=${search}`
  );
};

const getAllMaterialRequisitionFormDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-requisition-form/?page=${currentPage}&search=${search}`
  );
};

const getMaterialRequisitionFormPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-material-requisition-form/?page=${currentPage}`
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

const getAllBillofMaterialsData = () => {
  return CustomAxios.get(`/api/inventory/list-bill-of-materials/`);
};

const getAllPaginateBillofMaterialsData = (all) => {
  return CustomAxios.get(`/api/inventory/list-bill-of-materials/?page=${all}`);
};

const getAllPaginateBillofMaterialsDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?page=${all}&search=${search}`
  );
};

const getAllSearchBillofMaterialsData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?search=${search}`
  );
};

const getAllFilterBillofMaterialsData = (val) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?approved=${val}`
  );
};
const getFilterhBillofMaterialsData = (search, filter) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?search=${search}&approved=${filter}`
  );
};
const getAllBillofMaterialsDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?page=${currentPage}&search=${search}`
  );
};

const getBillofMaterialsPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-bill-of-materials/?page=${currentPage}`
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

const getAllProductionEntryData = () => {
  return CustomAxios.get(`/api/inventory/list-production-entry/`);
};

const getAllPaginateProductionEntryData = (all) => {
  return CustomAxios.get(`/api/inventory/list-production-entry/?page=${all}`);
};

const getAllPaginateProductionEntryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-entry/?page=${all}&search=${search}`
  );
};

const getAllSearchProductionEntryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-entry/?search=${search}`
  );
};

const getAllProductionEntryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-entry/?page=${currentPage}&search=${search}`
  );
};

const getProductionEntryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-production-entry/?page=${currentPage}`
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

const getAllMaterialTransferNoteData = () => {
  return CustomAxios.get(`/api/inventory/list-material-transfer-note/`);
};

const getAllPaginateMaterialTransferNoteData = (all) => {
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?page=${all}`
  );
};

const getAllPaginateMaterialTransferNoteDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?page=${all}&search=${search}`
  );
};

const getAllSearchMaterialTransferNoteData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?search=${search}`
  );
};

const getAllMaterialTransferNoteDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?page=${currentPage}&search=${search}`
  );
};

const getMaterialTransferNotePaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-material-transfer-note/?page=${currentPage}`
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

const getAllProductionGAndLInventoryData = () => {
  return CustomAxios.get(`/api/inventory/list-production-gnl/`);
};

const getAllPaginateProductionGAndLInventoryData = (all) => {
  return CustomAxios.get(`/api/inventory/list-production-gnl/?page=${all}`);
};

const getAllPaginateProductionGAndLInventoryDataWithSearch = (all, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-gnl/?page=${all}&search=${search}`
  );
};

const getAllSearchProductionGAndLInventoryData = (search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-gnl/?search=${search}`
  );
};

const getAllProductionGAndLInventoryDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/inventory/list-production-gnl/?page=${currentPage}&search=${search}`
  );
};

const getProductionGAndLInventoryPaginateData = (currentPage) => {
  return CustomAxios.get(
    `/api/inventory/list-production-gnl/?page=${currentPage}`
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
const InventoryServices = {
  getAllVendorData,
  getAllPaginateVendorData,
  getAllPaginateVendorDataWithSearch,
  getAllSearchVendorData,
  getAllVendorDataPaginate,
  getVendorPaginateData,
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
  getAllPackingListData,
  getAllPaginatePackingListData,
  getAllPaginatePackingListDataWithSearch,
  getAllSearchPackingListData,
  getAllSearchWithFilterPackingListData,
  getAllPackingListDataPaginate,
  getPackingListPaginateData,
  createPackingListData,
  getPackingListDataById,
  updatePackingListData,
  getAllGRNData,
  getAllPaginateGRNData,
  getAllPaginateGRNDataWithSearch,
  getAllSearchGRNData,
  getAllSearchWithFilterGRNData,
  getAllGRNDataPaginate,
  getGRNPaginateData,
  createGRNData,
  getGRNDataById,
  updateGRNData,
  getAllPurchaseInvoiceData,
  getAllPaginatePurchaseInvoiceData,
  getAllPaginatePurchaseInvoiceDataWithSearch,
  getAllSearchPurchaseInvoiceData,
  getAllPurchaseInvoiceDataPaginate,
  getPurchaseInvoicePaginateData,
  createPurchaseInvoiceData,
  getPurchaseInvoiceDataById,
  updatePurchaseInvoiceData,
  getAllStoresInventoryData,
  createStoresInventoryData,
  getAllPaginateStoresInventoryData,
  getAllPaginateStoresInventoryDataWithSearch,
  getAllSearchStoresInventoryData,
  getAllStoresInventoryDataPaginate,
  getStoresInventoryPaginateData,
  getAllConsStoresInventoryData,
  getAllPaginateConsStoresInventoryData,
  getAllPaginateConsStoresInventoryDataWithSearch,
  getAllSearchConsStoresInventoryData,
  getAllConsStoresInventoryDataPaginate,
  getConsStoresInventoryPaginateData,
  getAllMaterialRequisitionFormData,
  getAllPaginateMaterialRequisitionFormData,
  getAllPaginateMaterialRequisitionFormDataWithSearch,
  getAllSearchMaterialRequisitionFormData,
  getAllMaterialRequisitionFormDataPaginate,
  getMaterialRequisitionFormPaginateData,
  createMaterialRequisitionFormData,
  getMaterialRequisitionFormDataById,
  updateMaterialRequisitionFormData,
  getAllBillofMaterialsData,
  getAllPaginateBillofMaterialsData,
  getAllPaginateBillofMaterialsDataWithSearch,
  getAllSearchBillofMaterialsData,
  getAllFilterBillofMaterialsData,
  getFilterhBillofMaterialsData,
  getAllBillofMaterialsDataPaginate,
  getBillofMaterialsPaginateData,
  createBillofMaterialsData,
  getBillofMaterialsDataById,
  updateBillofMaterialsData,
  getAllProductionEntryData,
  getAllPaginateProductionEntryData,
  getAllPaginateProductionEntryDataWithSearch,
  getAllSearchProductionEntryData,
  getAllProductionEntryDataPaginate,
  getProductionEntryPaginateData,
  createProductionEntryData,
  getProductionEntryDataById,
  updateProductionEntryData,
  getAllMaterialTransferNoteData,
  getAllPaginateMaterialTransferNoteData,
  getAllPaginateMaterialTransferNoteDataWithSearch,
  getAllSearchMaterialTransferNoteData,
  getAllMaterialTransferNoteDataPaginate,
  getMaterialTransferNotePaginateData,
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
  getAllPaginateProductionGAndLInventoryData,
  getAllPaginateProductionGAndLInventoryDataWithSearch,
  getAllSearchProductionGAndLInventoryData,
  getAllProductionGAndLInventoryDataPaginate,
  getProductionGAndLInventoryPaginateData,
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
};

export default InventoryServices;
