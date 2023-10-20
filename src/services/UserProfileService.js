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

const UserProfileService = {
  getProfile,
  getAllUserProfileData,
  createUserProfileData,
  updateUserProfileData,
  getUserProfileDataById,
};

export default UserProfileService;
