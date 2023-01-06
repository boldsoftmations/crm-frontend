import CustomAxios from "./api";

const getAllColour = () => {
  return CustomAxios.get("/api/product/color");
};

const getAllPaginateColour = (all) => {
  return CustomAxios.get(`/api/product/color/?page=${all}`);
};

const getColourById = (id) => {
  return CustomAxios.get(`/api/product/color/${id}`);
};

const createColour = (data) => {
  return CustomAxios.post("/api/product/color/", data);
};

const getAllSearchColour = (search) => {
  return CustomAxios.get(`/api/product/color/?search=${search}`);
};

const updateColour = (id, data) => {
  return CustomAxios.patch(`/api/product/color/${id}`, data);
};

const getAllBrand = () => {
  return CustomAxios.get("/api/product/brand");
};

const getAllPaginateBrand = (all) => {
  return CustomAxios.get(`/api/product/brand/?page=${all}`);
};

const getAllSearchBrand = (search) => {
  console.log("search", search);
  return CustomAxios.get(`/api/product/brand/?search=${search}`);
};

const getBrandById = (id) => {
  return CustomAxios.get(`/api/product/brand/${id}`);
};

const createBrand = (data) => {
  return CustomAxios.post("/api/product/brand/", data);
};

const updateBrand = (id, data) => {
  return CustomAxios.patch(`/api/product/brand/${id}`, data);
};

const getAllBasicUnit = () => {
  return CustomAxios.get("/api/product/basic-unit");
};

const getAllPaginateBasicUnit = (all) => {
  return CustomAxios.get(`/api/product/basic-unit/?page=${all}`);
};
const getAllSearchBasicUnit = (search) => {
  return CustomAxios.get(`/api/product/basic-unit/?search=${search}`);
};

const getBasicUnitById = (id) => {
  return CustomAxios.get(`/api/product/basic-unit/${id}`);
};

const createBasicUnit = (data) => {
  return CustomAxios.post("/api/product/basic-unit/", data);
};

const updateBasicUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/basic-unit/${id}`, data);
};

const getAllUnit = () => {
  return CustomAxios.get("/api/product/unit");
};

const getAllPaginateUnit = (all) => {
  return CustomAxios.get(`/api/product/unit/?page=${all}`);
};

const getAllSearchUnit = (search) => {
  return CustomAxios.get(`/api/product/unit/?search=${search}`);
};

const createUnit = (data) => {
  return CustomAxios.post("/api/product/unit/", data);
};

const getUnitById = (id) => {
  return CustomAxios.get(`/api/product/unit/${id}`);
};

const updateUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/unit/${id}`, data);
};

const getAllPackingUnit = () => {
  return CustomAxios.get("/api/product/packing-unit");
};

const getAllPaginatePackingUnit = (all) => {
  return CustomAxios.get(`/api/product/packing-unit/?page=${all}`);
};

const getAllSearchPackingUnit = (search) => {
  return CustomAxios.get(`/api/product/packing-unit/?search=${search}`);
};

const createPackingUnit = (data) => {
  return CustomAxios.post("/api/product/packing-unit/", data);
};

const getPackingUnitById = (id) => {
  return CustomAxios.get(`/api/product/packing-unit/${id}`);
};

const updatePackingUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/packing-unit/${id}`, data);
};

const getAllDescription = () => {
  return CustomAxios.get("/api/product/description");
};

const getAllSearchDescription = (search) => {
  return CustomAxios.get(`/api/product/description/?search=${search}`);
};

const getYesDescription = () => {
  return CustomAxios.get("/api/product/description-yes");
};

const getNoDescription = () => {
  return CustomAxios.get("/api/product/description-no");
};

const createDescription = (data) => {
  return CustomAxios.post("/api/product/description/", data);
};

const getDescriptionById = (id) => {
  return CustomAxios.get(`/api/product/description/${id}`);
};

const updateDescription = (id, data) => {
  return CustomAxios.patch(`/api/product/description/${id}`, data);
};

const getAllProductCode = () => {
  return CustomAxios.get("/api/product/product-code");
};

const getAllPaginateProductCode = (all) => {
  return CustomAxios.get(`/api/product/product-code/?page=${all}`);
};

const getAllSearchProductCode = (search) => {
  return CustomAxios.get(`/api/product/product-code/?search=${search}`);
};

const createProductCode = (data) => {
  return CustomAxios.post("/api/product/product-code/", data);
};

const getProductCodeById = (id) => {
  return CustomAxios.get(`/api/product/product-code/${id}`);
};

const updateProductCode = (id, data) => {
  return CustomAxios.patch(`/api/product/product-code/${id}`, data);
};

const getAllConsumable = () => {
  return CustomAxios.get("/api/product/consumables");
};

const getAllSearchConsumable = (search) => {
  return CustomAxios.get(`/api/product/consumables/?search=${search}`);
};

const getAllConsumablePaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/product/consumables/?page=${currentPage}&search=${search}`
  );
};

const getConsumableById = (id) => {
  return CustomAxios.get(`/api/product/consumables/${id}`);
};

const updateConsumable = (id, data) => {
  return CustomAxios.patch(`/api/product/consumables/${id}`, data);
};

const createConsumable = (data) => {
  return CustomAxios.post("/api/product/consumables/", data);
};

const getAllFinishGoods = () => {
  return CustomAxios.get("/api/product/finished-goods");
};

const getAllSearchFinishGoods = (search) => {
  return CustomAxios.get(`/api/product/finished-goods/?search=${search}`);
};

const getAllFinishGoodsPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/product/finished-goods/?page=${currentPage}&search=${search}`
  );
};

const createFinishGoods = (data) => {
  return CustomAxios.post("/api/product/finished-goods/", data);
};

const getFinishGoodsById = (id) => {
  return CustomAxios.get(`/api/product/finished-goods/${id}`);
};

const updateFinishGoods = (id, data) => {
  return CustomAxios.patch(`/api/product/finished-goods/${id}`, data);
};

const getAllRawMaterials = () => {
  return CustomAxios.get("/api/product/raw-materials/");
};

const getAllSearchRawMaterials = (search) => {
  return CustomAxios.get(`/api/product/raw-materials/?search=${search}`);
};

const getAllRawMaterialsPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/product/raw-materials/?page=${currentPage}&search=${search}`
  );
};

const createRawMaterials = (data) => {
  return CustomAxios.post("/api/product/raw-materials/", data);
};

const getRawMaterialsById = (id) => {
  return CustomAxios.get(`/api/product/raw-materials/${id}`);
};

const updateRawMaterials = (id, data) => {
  return CustomAxios.patch(`/api/product/raw-materials/${id}`, data);
};

const getAllPriceList = () => {
  return CustomAxios.get("/api/product/pricelist/");
};

const getAllPaginatePriceList = (filter,all) => {
  return CustomAxios.get(`/api/product/pricelist/?${filter}=${all}`);
};

const getAllSearchPriceList = (search) => {
  return CustomAxios.get(`/api/product/pricelist/?search=${search}`);
};

const getAllPriceListPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/product/pricelist/?page=${currentPage}&search=${search}`
  );
};

const createPriceList = (data) => {
  return CustomAxios.post("/api/product/pricelist/", data);
};

const getPriceListById = (id) => {
  return CustomAxios.get(`/api/product/pricelist/${id}`);
};

const updatePriceList = (id, data) => {
  return CustomAxios.patch(`/api/product/pricelist/${id}`, data);
};

const getAllProduct = () => {
  return CustomAxios.get("/api/product/product/");
};

const ProductService = {
  getAllColour,
  getAllPaginateColour,
  getAllSearchColour,
  getColourById,
  createColour,
  updateColour,
  getAllBrand,
  getAllPaginateBrand,
  getAllSearchBrand,
  getBrandById,
  createBrand,
  updateBrand,
  getAllBasicUnit,
  getAllPaginateBasicUnit,
  getAllSearchBasicUnit,
  getBasicUnitById,
  createBasicUnit,
  updateBasicUnit,
  getAllUnit,
  getAllPaginateUnit,
  getAllSearchUnit,
  createUnit,
  getUnitById,
  updateUnit,
  getAllPackingUnit,
  getAllPaginatePackingUnit,
  getAllSearchPackingUnit,
  createPackingUnit,
  getPackingUnitById,
  updatePackingUnit,
  getAllDescription,
  getAllSearchDescription,
  getYesDescription,
  getNoDescription,
  createDescription,
  getDescriptionById,
  updateDescription,
  getAllProductCode,
  getAllPaginateProductCode,
  getAllSearchProductCode,
  createProductCode,
  getProductCodeById,
  updateProductCode,
  getAllConsumable,
  getAllSearchConsumable,
  getAllConsumablePaginate,
  createConsumable,
  getConsumableById,
  updateConsumable,
  getAllFinishGoods,
  getAllSearchFinishGoods,
  getAllFinishGoodsPaginate,
  createFinishGoods,
  getFinishGoodsById,
  updateFinishGoods,
  getAllRawMaterials,
  getAllSearchRawMaterials,
  getAllRawMaterialsPaginate,
  createRawMaterials,
  getRawMaterialsById,
  updateRawMaterials,
  getAllPriceList,
  getAllPaginatePriceList,
  getAllSearchPriceList,
  getAllPriceListPaginate,
  createPriceList,
  getPriceListById,
  updatePriceList,
  getAllProduct,
};

export default ProductService;
