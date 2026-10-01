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
  state__name,
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

const getMasterPincode = (page, searchvalue, is_active = true) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (searchvalue) {
    params.append("search", searchvalue);
  }
  if (is_active !== null && is_active !== undefined) {
    params.append("is_active", is_active);
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
    `/api/master/pincode/?page=all&city__state__country__name=${country}&search=${pincode}`,
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
    `/api/master/model-option/?page=all&model_master__name=${model_master__name}`,
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
    data,
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
const getPackagingMaster = (page, search, is_inactive) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (search) {
    params.append("search", search);
  }

  if (is_inactive !== null && is_inactive !== undefined) {
    params.append("is_inactive", is_inactive);
  }

  return CustomAxios.get(`/api/master/packaging-master/?${params.toString()}`);
};
const createPackagingMaster = (data) => {
  return CustomAxios.post("/api/master/packaging-master/", data);
};

const updatePackagingMaster = (id, data) => {
  return CustomAxios.patch(`/api/master/packaging-master/${id}/`, data);
};

const getAllTransportMaster = (page, is_inactive, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }

  params.append("is_inactive", is_inactive);

  return CustomAxios.get(
    `/api/master/transporter-master/?${params.toString()}`,
  );
};
const getTransportMasterById = (id) => {
  return CustomAxios.get(`/api/master/transporter-master/${id}/`);
};

const createTransportMaster = (data) => {
  return CustomAxios.post("/api/master/transporter-master/", data);
};

const updateTransportMaster = (id, data) => {
  return CustomAxios.patch(`/api/master/transporter-master/${id}/`, data);
};

// =====================================================================
// Transporter Branch APIs (V3 handover - Branches & IDs tab, Section 6)
// =====================================================================
const getAllTransportBranch = (transporter_id) => {
  const params = new URLSearchParams();
  if (transporter_id) {
    params.append("transporter_id", transporter_id);
  }
  return CustomAxios.get(
    `/api/master/transporter-branch/?${params.toString()}`,
  );
};

const createTransportBranch = (data) => {
  return CustomAxios.post("/api/master/transporter-branch/", data);
};

const updateTransportBranch = (id, data) => {
  return CustomAxios.patch(`/api/master/transporter-branch/${id}/`, data);
};

// =====================================================================
// Transporter Identifier APIs (GSTIN / TRANSIN / Common Enrolment Number)
// =====================================================================
const getAllTransportIdentifier = (transporter_id) => {
  const params = new URLSearchParams();
  if (transporter_id) {
    params.append("transporter_id", transporter_id);
  }
  return CustomAxios.get(
    `/api/master/transporter-identifier/?${params.toString()}`,
  );
};

const createTransportIdentifier = (data) => {
  return CustomAxios.post("/api/master/transporter-identifier/", data);
};

const updateTransportIdentifier = (id, data) => {
  return CustomAxios.patch(`/api/master/transporter-identifier/${id}/`, data);
};

const getTransportMapping = (
  isActive,
  page,
  search,
  transporter__transporter_name,
  unit__unit,
  pincode__pincode,
) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (isActive !== null && isActive !== undefined) {
    params.append("is_inactive", isActive);
  }
  if (transporter__transporter_name) {
    params.append(
      "transporter__transporter_name",
      transporter__transporter_name,
    );
  }
  if (unit__unit) {
    params.append("unit__unit", unit__unit);
  }
  if (pincode__pincode) {
    params.append("pincode__pincode", pincode__pincode);
  }
  return CustomAxios.get(
    `/api/master/transporter-mapping/?${params.toString()}`,
  );
};

const createTransportMapping = (data) => {
  return CustomAxios.post("/api/master/transporter-mapping/", data);
};
const updateTransportMapping = (id, data) => {
  return CustomAxios.patch(`/api/master/transporter-mapping/${id}/`, data);
};

const getTransportContact = (tranporter_id) => {
  const params = new URLSearchParams();
  if (tranporter_id) {
    params.append("transporter_id", tranporter_id);
  }
  return CustomAxios.get(
    `/api/master/transporter-unit-city/?${params.toString()}`,
  );
};
const getAllTransportConstact = (
  transporter__transporter_name,
  page,
  is_inactive,
  search,
) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (transporter__transporter_name) {
    params.append(
      "transporter__transporter_name",
      transporter__transporter_name,
    );
  }
  params.append("is_inactive", is_inactive);
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(
    `/api/master/transporter-contact/?${params.toString()}`,
  );
};
const createTransportContact = (data) => {
  return CustomAxios.post("/api/master/transporter-contact/", data);
};

const updateTransportContact = (id, data) => {
  return CustomAxios.patch(`/api/master/transporter-contact/${id}/`, data);
};
const getonUniversalType = () => {
  return CustomAxios.get(
    `/api/master/transporter-master/?page=1&search=universal+mode&is_inactive=false`,
  );
};

const CreateMasterPincode = (data) => {
  return CustomAxios.post(`/api/master/pincode-alias/`, data);
};
const CreateMergePincode = (data) => {
  return CustomAxios.post(`/api/master/pincode-merge/`, data);
};
const getMergePincodeList = (page, search, old_pincode__pincode) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (old_pincode__pincode) {
    params.append("old_pincode__pincode", old_pincode__pincode);
  }

  return CustomAxios.get(`/api/master/pincode-merge/?${params.toString()}`);
};

const getPincodeAuditlog = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/master/geo-audit-logs/?${params.toString()}`);
};

const getPincodeRefrenceData = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(
    `/api/master/pincode-reference-logs/?${params.toString()}`,
  );
};

const ValidatePincode = (country_id, postal_code) => {
  const params = new URLSearchParams();
  if (country_id) {
    params.append("country_id", country_id);
  }
  if (postal_code) {
    params.append("postal_code", postal_code);
  }
  return CustomAxios.get(
    `/api/master/postal-code-lookup/?${params.toString()}`,
  );
};

const getTransporterAuditLog = ({
  entityType,
  entityId,
  action,
  pageAll = true,
} = {}) => {
  const params = new URLSearchParams();

  if (entityType) {
    params.append("entity_type", entityType);
  }
  if (entityId) {
    params.append("entity_id", entityId);
  }
  if (action) {
    params.append("action", action);
  }
  if (pageAll) {
    params.append("page", "all");
  }

  return CustomAxios.get(
    `/api/master/transporter-audit-log/?${params.toString()}`,
  );
};

const getTransportRefData = (page, search, status) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (status) {
    params.append("status", status);
  }
  return CustomAxios.get(
    `/api/master/transporter-mapping-request/?${params.toString()}`,
  );
};
const UpdateMasterRefRequest = (id, data) => {
  return CustomAxios.patch(
    `/api/master/transporter-mapping-request/${id}/`,
    data,
  );
};

const resolveTransportRequest = (requestId, data) => {
  return CustomAxios.post(
    `/api/master/resolve-transport-request/${requestId}/`,
    data,
  );
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
  getMergePincodeList,
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
  getPackagingMaster,
  createPackagingMaster,
  updatePackagingMaster,
  getTransportMapping,
  createTransportMaster,
  updateTransportMaster,
  getAllTransportMaster,
  getTransportMasterById,
  getAllTransportBranch,
  createTransportBranch,
  updateTransportBranch,
  getAllTransportIdentifier,
  createTransportIdentifier,
  updateTransportIdentifier,
  createTransportMapping,
  updateTransportMapping,
  getTransportContact,
  createTransportContact,
  getAllTransportConstact,
  updateTransportContact,
  getonUniversalType,
  CreateMasterPincode,
  CreateMergePincode,
  getPincodeAuditlog,
  getPincodeRefrenceData,
  ValidatePincode,
  UpdateMasterRefRequest,
  getTransporterAuditLog,
  getTransportRefData,
  resolveTransportRequest,
};
export default MasterService;
