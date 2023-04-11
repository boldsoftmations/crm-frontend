import * as types from "../Action/actiontypes";
import { CUSTOMER_ORDERBOOK_DATA } from "./../Action/actiontypes";

const initialState = {
  user: null,
  loading: true,
  error: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case types.LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.LOGOUT_USER:
      return {
        ...state,
        user: null,
        profile: null,
        companyName: null,
        brandAllData: null,
        colourAllData: null,
        unitAllData: null,
        basicunitAllData: null,
        packingunitAllData: null,
        productCodeAllData: null,
        sellerAccount: null,
        customerOrderBookData: null,
        vendorName: null,
        finishgoodsProduct: null,
        rawMaterialProduct: null,
        consumableProduct: null,
        packingList: null,
        grnList: null,
      };
    case types.REFRESH_TOKEN:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case types.PROFILE_USER:
      return {
        ...state,
        loading: false,
        profile: action.payload,
      };
    case types.SELLER_ACCOUNT:
      return {
        ...state,
        loading: false,
        sellerAccount: action.payload,
      };
    case types.COMPANY_NAME:
      return {
        ...state,
        loading: false,
        companyName: action.payload,
      };
    case types.BRAND:
      return {
        ...state,
        loading: false,
        brandAllData: action.payload,
      };
    case types.COLOUR:
      return {
        ...state,
        loading: false,
        colourAllData: action.payload,
      };
    case types.UNIT:
      return {
        ...state,
        loading: false,
        unitAllData: action.payload,
      };
    case types.BASIC_UNIT:
      return {
        ...state,
        loading: false,
        basicunitAllData: action.payload,
      };
    case types.PACKING_UNIT:
      return {
        ...state,
        loading: false,
        packingunitAllData: action.payload,
      };
    case types.PRODUCT_CODE:
      return {
        ...state,
        loading: false,
        productCodeAllData: action.payload,
      };
    case types.CUSTOMER_ORDERBOOK_DATA:
      return {
        ...state,
        loading: false,
        customerOrderBookData: action.payload,
      };
    case types.VENDOR_NAME:
      return {
        ...state,
        loading: false,
        vendorName: action.payload,
      };
    case types.FINISHGOODS_PRODUCT:
      return {
        ...state,
        loading: false,
        finishgoodsProduct: action.payload,
      };
    case types.RAWMATERIAL_PRODUCT:
      return {
        ...state,
        loading: false,
        rawMaterialProduct: action.payload,
      };
    case types.CONSUMABLE_PRODUCT:
      return {
        ...state,
        loading: false,
        consumableProduct: action.payload,
      };
    case types.PACKINGLISTNO:
      return {
        ...state,
        loading: false,
        packingList: action.payload,
      };
    case types.GRNLIST:
      return {
        ...state,
        loading: false,
        grnList: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
