import CustomAxios from "./api";

const createMasterCountry = (data) => {
  return CustomAxios.post("/api/master/country/", data);
};

const updateMasterCountry = (id, data) => {
  return CustomAxios.patch(`/api/master/country/${id}/`, data);
};

const getAllMasterCountries = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(`/api/master/country/?${params.toString()}`);
};

const createMasterState = (data) => {
  return CustomAxios.post("/api/master/state/", data);
};

const updateMasterState = (id, data) => {
  return CustomAxios.patch(`/api/master/state/${id}/`, data);
};

const getAllMasterStates = (page, searchValue, country__name) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (country__name) {
    params.append("country__name", country__name);
  }
  return CustomAxios.get(`/api/master/state/?${params.toString()}`);
};

const createcity = (data) => {
  return CustomAxios.post(`/api/master/city/`, data);
};

const getMasterCities = (
  page,
  searchvalue,
  state__country__name,
  state__name
) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchvalue) {
    params.append("search", searchvalue);
  }
  if (state__country__name) {
    params.append("state__country__name", state__country__name);
  }
  if (state__name) {
    params.append("state__name", state__name);
  }
  return CustomAxios.get(`/api/master/city/?${params.toString()}`);
};

const updateMasterCity = (id, data) => {
  return CustomAxios.patch(`/api/master/city/${id}/`, data);
};

const getMasterPincode = (page, searchvalue) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchvalue) {
    params.append("search", searchvalue);
  }
  return CustomAxios.get(`/api/master/pincode/?${params.toString()}`);
};

const createMasterPincode = (data) => {
  return CustomAxios.post(`/api/master/pincode/`, data);
};

const updateMasterPincode = (id, data) => {
  return CustomAxios.patch(`/api/master/pincode/${id}/`, data);
};

const getCountryDataByPincode = (country = "India", pincode) => {
  return CustomAxios.get(
    `/api/master/pincode/?page=all&city__state__country__name=${country}&search=${pincode}`
  );
};

const getMasterActivity = (page) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  return CustomAxios.get(`/api/master/model-master/?${params.toString()}`);
};

const createMasterActivityMainHeading = (data) => {
  return CustomAxios.post(`/api/master/model-master/`, data);
};

const createMasterActivityOption = (data) => {
  return CustomAxios.post(`/api/master/model-option/`, data);
};

const createMasterBeat = (data) => {
  return CustomAxios.post(`/api/master/beat/`, data);
};

const getMasterBeat = (page,search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/master/beat/?${params.toString()}`);
};

const getBeatCustomers = (page,search)=>{
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/customer/customer-beat/?${params.toString()}`);
}
const getBeatLeads = (page,search)=>{
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("filter", search);
  }
  return CustomAxios.get(`/api/lead/lead-beat/?${params.toString()}`);
}

const removeCustomterBeatList = (id,data)=>{
 return CustomAxios.post(`/api/customer/customer-beat/${id}/remove_customer/`,data)
}

const removeLeadsBeatList = (id,data)=>{
  return CustomAxios.post(`/api/lead/lead-beat/${id}/remove_lead/`,data)
 }

const getBeatlist= ()=>{
  return CustomAxios.get("/api/customer/customer-beat/beat_list/")
}

const getLeadBeatlist= ()=>{
  return CustomAxios.get("/api/lead/lead-beat/beat_list/")
}

const EmployeesAttendance = (page,search)=>{
  const params = new URLSearchParams();
  if (page)  params.append("page", page);
  if (search)  params.append("search", search);
  return CustomAxios.get(`/api/user/attendance/?${params.toString()}`);
  
}
const MasterService = {
  createMasterCountry,
  updateMasterCountry,
  getAllMasterCountries,
  createMasterState,
  updateMasterState,
  getAllMasterStates,
  createcity,
  getMasterCities,
  updateMasterCity,
  getMasterPincode,
  createMasterPincode,
  updateMasterPincode,
  getCountryDataByPincode,
  getMasterActivity,
  createMasterActivityMainHeading,
  createMasterActivityOption,
  createMasterBeat,
  getMasterBeat,
  getBeatCustomers,
  getBeatLeads,
  removeCustomterBeatList,
  removeLeadsBeatList,
  getBeatlist,
  getLeadBeatlist,
  EmployeesAttendance
};
export default MasterService;
