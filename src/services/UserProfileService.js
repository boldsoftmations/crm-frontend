import CustomAxios from "./api";

const login = (data) => {
  return CustomAxios.post("api/user/login/", data);
};

const register = (data) => {
  return CustomAxios.post("api/user/register/", data);
};

const sendResetPasswordEmail = (data) => {
  return CustomAxios.post("api/user/send-reset-password-email/", data);
};

const ChangePassword = (id, token, newPasswordDetails) => {
  return CustomAxios.post(
    `api/user/reset-password/${id}/${token}/`,
    newPasswordDetails
  );
};

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

// Daily sales Review routes
const getDailySaleReviewData = (
  selectedYearMonth,
  salesPersonByFilter,
  searchQuery
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (selectedYearMonth) {
    params.append("year_month", selectedYearMonth);
  }

  if (salesPersonByFilter) {
    params.append("sales_person__email", salesPersonByFilter);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/user/daily-sales-review/?${params.toString()}`);
};

const getDailySaleReviewById = (id) => {
  return CustomAxios.get(`api/user/daily-sales-review/${id}`);
};

const createDailySaleReviewData = (data) => {
  return CustomAxios.post("api/user/daily-sales-review/", data);
};

const updateDailySaleReviewData = (id, data) => {
  return CustomAxios.patch(`api/user/daily-sales-review/${id}/`, data);
};

const UserProfileService = {
  login,
  getProfile,
  register,
  sendResetPasswordEmail,
  ChangePassword,
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
  getDailySaleReviewData,
  getDailySaleReviewById,
  createDailySaleReviewData,
  updateDailySaleReviewData,
};

export default UserProfileService;
