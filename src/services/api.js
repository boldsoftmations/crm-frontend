import axios from "axios";

const CustomAxios = axios.create({
  baseURL: process.env.REACT_APP_DEPLOY_BACKEND_URL,
});

export default CustomAxios;
