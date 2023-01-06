import * as types from "./actiontypes";

export const loginstart = () => {
  return {
    type: types.LOGIN_START,
  };
};

export const loginsucces = (token) => {
  return {
    type: types.LOGIN_SUCCESS,
    payload: token,
  };
};

export const loginfail = (error) => {
  return {
    type: types.LOGIN_FAIL,
    payload: error,
  };
};

export const logoutUser = () => {
  return {
    type: types.LOGOUT_USER,
  };
};

export const logoutinitiate = (token) => {
  return {
    type: types.LOGOUT_USER,
    payload: token,
  };
};

export const refreshToken = (accessToken) => {
  return {
    type: types.REFRESH_TOKEN,
    payload: accessToken,
  };
};

export const getProfileUser = (data) => {
  return {
    type: types.PROFILE_USER,
    payload: data,
  };
};

export const getSellerAccountData = (data) => {
  return {
    type: types.SELLER_ACCOUNT,
    payload: data,
  };
};

export const getCompanyName = (data) => {
  return {
    type: types.COMPANY_NAME,
    payload: data,
  };
};

export const getBrandData = (data) => {
  return {
    type: types.BRAND,
    payload: data,
  };
};

export const getColourData = (data) => {
  return {
    type: types.COLOUR,
    payload: data,
  };
};

export const getUnitData = (data) => {
  return {
    type: types.UNIT,
    payload: data,
  };
};

export const getBasicUnitData = (data) => {
  return {
    type: types.BASIC_UNIT,
    payload: data,
  };
};

export const getPackingUnitData = (data) => {
  return {
    type: types.PACKING_UNIT,
    payload: data,
  };
};

export const getProductCodeData = (data) => {
  return {
    type: types.PRODUCT_CODE,
    payload: data,
  };
};
