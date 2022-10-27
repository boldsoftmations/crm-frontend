import { combineReducers } from "redux";
import userReducer from "./UserReducer";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; //

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: userReducer,
});

export default persistReducer(persistConfig, rootReducer);
