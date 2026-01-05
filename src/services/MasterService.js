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

const getMasterActivityOptions = (model_master__name) => {
  return CustomAxios.get(
    `/api/master/model-option/?page=all&model_master__name=${model_master__name}`
  );
};

const getLeadSummaryDetails = () => {
  return CustomAxios.get(`/api/lead/list-references`);
};

const createLeadSummary = (data) => {
  return CustomAxios.post(`/api/lead/list-references/`, data);
};

const getFactoryModelName = () => {
  return CustomAxios.get(`/api/master/machine-model/`);
};

const getStageList = () => {
  return CustomAxios.get(`/api/master/approval-stage/`);
};
const CreateFactoryModel = (data) => {
  return CustomAxios.post(`/api/master/machine-model/`, data);
};

const CreatApprovalStage = (data) => {
  return CustomAxios.post(`/api/master/approval-stage/`, data);
};
const updateApprovalStage = (id, data) => {
  return CustomAxios.patch(`/api/master/approval-stage/${id}/`, data);
};

const createMasterBeat = (data) => {
  return CustomAxios.post(`/api/master/beat/`, data);
};

const getMasterBeat = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/master/beat/?${params.toString()}`);
};

const getBeatCustomers = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/customer/customer-beat/?${params.toString()}`);
};
const getBeatLeads = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("filter", search);
  }
  return CustomAxios.get(`/api/lead/lead-beat/?${params.toString()}`);
};

const removeCustomterBeatList = (id, data) => {
  return CustomAxios.post(
    `/api/customer/customer-beat/${id}/remove_customer/`,
    data
  );
};

const removeLeadsBeatList = (id, data) => {
  return CustomAxios.post(`/api/lead/lead-beat/${id}/remove_lead/`, data);
};

const getBeatlist = () => {
  return CustomAxios.get("/api/customer/customer-beat/beat_list/");
};

const getLeadBeatlist = () => {
  return CustomAxios.get("/api/lead/lead-beat/beat_list/");
};

const EmployeesAttendance = (page, user__name, user__groups__name) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (user__name) params.append("user__name", user__name);
  if (user__groups__name)
    params.append("user__groups__name", user__groups__name);
  return CustomAxios.get(`/api/user/attendance/?${params.toString()}`);
};

const getEmployeesLeaveForm = (page, status, search) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  return CustomAxios.get(`/api/user/leave/?${params.toString()}`);
};

const createLeaveApplication = (data) => {
  return CustomAxios.post(`/api/user/leave/`, data);
};

const leaveApproval = (data) => {
  return CustomAxios.post(`/api/user/leave-approval/`, data);
};
const getLeavapproval = () => {
  return CustomAxios.get(`/api/user/leave-approval/`);
};

const getZoneMasterList = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/master/zone/?${params.toString()}`);
};
const createZoneMaster = (data) => {
  return CustomAxios.post("/api/master/zone/", data);
};

const UpdateZoneMaster = (id, data) => {
  // const params = new URLSearchParams();

  return CustomAxios.patch(`/api/master/zone/${id}/`, data);
};

const MasterService = {
  getLeavapproval,
  updateApprovalStage,
  CreatApprovalStage,
  getStageList,
  CreateFactoryModel,
  getFactoryModelName,
  createLeadSummary,
  getLeadSummaryDetails,
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
  getMasterActivityOptions,
  createMasterBeat,
  getMasterBeat,
  getBeatCustomers,
  getBeatLeads,
  removeCustomterBeatList,
  removeLeadsBeatList,
  getBeatlist,
  getLeadBeatlist,
  EmployeesAttendance,
  getEmployeesLeaveForm,
  createLeaveApplication,
  leaveApproval,
  getZoneMasterList,
  createZoneMaster,
  UpdateZoneMaster,
};
export default MasterService;
