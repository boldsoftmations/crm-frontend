import CustomAxios from "./api";

const getProfile = () => {
  return CustomAxios.get(`/api/user/profile/`);
};

// Generic function to get order book data
const getAllUserProfileData = () => {
  return CustomAxios.get(`/api/user/user-personal-details/`);
};

const createUserProfileData = (data) => {
  return CustomAxios.post("/api/user/user-personal-details/", data);
};

const updateUserProfileData = (id, data) => {
  return CustomAxios.patch(`/api/user/user-personal-details/${id}/`, data);
};

const getUserProfileDataById = (id) => {
  console.log("id", id);
  return CustomAxios.get(`/api/user/user-personal-details/${id}`);
};

// Scripts routes
const getAllScriptData = (page, searchQuery) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/user/script/?${params.toString()}`);
};

const createScriptData = (data) => {
  return CustomAxios.post("/api/user/script/", data);
};

const updateScriptData = (id, data) => {
  return CustomAxios.patch(`/api/user/script/${id}/`, data);
};

// Objection routes
const getAllObjectionData = (page, searchQuery) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/user/objection-bank/?${params.toString()}`);
};

const createObjectionData = (data) => {
  return CustomAxios.post("/api/user/objection-bank/", data);
};

const updateObjectionData = (id, data) => {
  return CustomAxios.patch(`/api/user/objection-bank/${id}/`, data);
};

// Product Objection routes
const getAllProductObjectionData = (page, searchQuery) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/user/product-objection/?${params.toString()}`);
};

const createProductObjectionData = (data) => {
  return CustomAxios.post("/api/user/product-objection/", data);
};

const updateProductObjectionData = (id, data) => {
  return CustomAxios.patch(`/api/user/product-objection/${id}/`, data);
};

const UserProfileService = {
  getProfile,
  getAllUserProfileData,
  createUserProfileData,
  updateUserProfileData,
  getUserProfileDataById,
  getAllScriptData,
  createScriptData,
  updateScriptData,
  getAllObjectionData,
  createObjectionData,
  updateObjectionData,
  getAllProductObjectionData,
  createProductObjectionData,
  updateProductObjectionData,
};

export default UserProfileService;
