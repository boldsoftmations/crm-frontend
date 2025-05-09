import CustomAxios from "./api";

const getAllColour = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/color/?${params.toString()}`);
};

const createColour = (data) => {
  return CustomAxios.post("/api/product/color/", data);
};

const updateColour = (id, data) => {
  return CustomAxios.patch(`/api/product/color/${id}`, data);
};

const getAllBrand = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/brand/?${params.toString()}`);
};

const createBrand = (data) => {
  return CustomAxios.post("/api/product/brand/", data);
};

const updateBrand = (id, data) => {
  return CustomAxios.patch(`/api/product/brand/${id}`, data);
};

const getAllBasicUnit = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/basic-unit/?${params.toString()}`);
};

const createBasicUnit = (data) => {
  return CustomAxios.post("/api/product/basic-unit/", data);
};

const updateBasicUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/basic-unit/${id}`, data);
};

const getAllUnit = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/unit/?${params.toString()}`);
};

const createUnit = (data) => {
  return CustomAxios.post("/api/product/unit/", data);
};

const updateUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/unit/${id}`, data);
};

const getAllPackingUnit = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/packing-unit/?${params.toString()}`);
};

const createPackingUnit = (data) => {
  return CustomAxios.post("/api/product/packing-unit/", data);
};

const updatePackingUnit = (id, data) => {
  return CustomAxios.patch(`/api/product/packing-unit/${id}`, data);
};

const getAllDescription = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/description/?${params.toString()}`);
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

const updateDescription = (id, data) => {
  return CustomAxios.patch(`/api/product/description/${id}`, data);
};

const getAllProductCode = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/product-code/?${params.toString()}`);
};

const createProductCode = (data) => {
  return CustomAxios.post("/api/product/product-code/", data);
};

const updateProductCode = (id, data) => {
  return CustomAxios.patch(`/api/product/product-code/${id}`, data);
};

const getAllConsumable = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/consumables/?${params.toString()}`);
};

const updateConsumable = (id, data) => {
  return CustomAxios.patch(`/api/product/consumables/${id}`, data);
};

const createConsumable = (data) => {
  return CustomAxios.post("/api/product/consumables/", data);
};

const getAllFinishGoods = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/finished-goods/?${params.toString()}`);
};

const createSampleProduct = (data) => {
  return CustomAxios.post("/api/product/sample/", data);
};
const getAllSampleProduct =(page,searchQuery)=>{
 
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/sample/?${params.toString()}`);
}
const createFinishGoods = (data) => {
  return CustomAxios.post("/api/product/finished-goods/", data);
};

const updateFinishGoods = (id, data) => {
  return CustomAxios.patch(`/api/product/finished-goods/${id}`, data);
};

const getAllFinishGoodsProducts = () => {
  return CustomAxios.get(`api/product/finish-goods-list/`);
};

const getAllRawMaterials = (page, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/raw-materials/?${params.toString()}`);
};

const createRawMaterials = (data) => {
  return CustomAxios.post("/api/product/raw-materials/", data);
};

const updateRawMaterials = (id, data) => {
  return CustomAxios.patch(`/api/product/raw-materials/${id}`, data);
};

const getAllPriceList = (page, filterQuery, searchQuery) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (filterQuery) {
    params.append("validity", filterQuery);
  }
  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`api/product/pricelist/?${params.toString()}`);
};

const createPriceList = (data) => {
  return CustomAxios.post("/api/product/pricelist/", data);
};

const getAllValidPriceList = (all) => {
  return CustomAxios.get(`/api/product/pricelist/?page=${all}`);
};
const getProductPriceList = () => {
  return CustomAxios.get("/api/product/product-pricelist/");
};

const updatePriceList = (id, data) => {
  return CustomAxios.patch(`/api/product/pricelist/${id}`, data);
};

const getAllProduct = () => {
  return CustomAxios.get("/api/product/product/");
};

//api for upload csv files
const uploadCSVFile = (file) => {
  return CustomAxios.post("/api/product/upload-csv/", file);
};


const getSampleProduct = ()=>{
  return CustomAxios.get("/api/product/sample/product_list/")
}

const updateSampleProduct = (id, data) => {
  return CustomAxios.patch(`/api/product/sample/${id}/`, data);
};

const ProductService = {
  getAllColour,
  createColour,
  updateColour,
  getAllBrand,
  createBrand,
  updateBrand,
  getAllBasicUnit,
  createBasicUnit,
  updateBasicUnit,
  getAllUnit,
  createUnit,
  updateUnit,
  getAllPackingUnit,
  createPackingUnit,
  updatePackingUnit,
  getAllDescription,
  getYesDescription,
  getNoDescription,
  createDescription,
  updateDescription,
  getAllProductCode,
  createProductCode,
  updateProductCode,
  getAllConsumable,
  createConsumable,
  updateConsumable,
  getAllFinishGoods,
  getAllSampleProduct,
  createSampleProduct,
  createFinishGoods,
  updateFinishGoods,
  getAllFinishGoodsProducts,
  getAllRawMaterials,
  createRawMaterials,
  updateRawMaterials,
  getAllPriceList,
  createPriceList,
  getAllValidPriceList,
  getProductPriceList,
  updatePriceList,
  getAllProduct,
  uploadCSVFile,
  getSampleProduct,
  updateSampleProduct
};

export default ProductService;
