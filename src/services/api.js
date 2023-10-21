import axios from "axios";

const CustomAxios = axios.create({
  // baseURL: process.env.REACT_APP_LOCAL_BACKEND_URL,
  baseURL: process.env.REACT_APP_DEPLOY_BACKEND_URL,
  // baseURL: process.env.REACT_APP_TESTING_BACKEND_URL,
  // baseURL: process.env.REACT_APP_DEVELOPMENT_BACKEND_URL,
});

export default CustomAxios;
