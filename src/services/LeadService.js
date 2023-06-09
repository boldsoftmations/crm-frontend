import CustomAxios from "./api";

const getProfile = () => {
  return CustomAxios.get(`/api/user/profile/`);
};

const getAllLeads = (stage) => {
  return CustomAxios.get(`/api/lead/list-lead/?stage=${stage}`);
};

const getAllPaginateLeads = (stage, currentPage) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?stage=${stage}&page=${currentPage}`
  );
};

const getAllSearchLeads = (stage, filter, search) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?stage=${stage}&${filter}=${search}`
  );
};

const getFilterLeads = (assignedTo, assignedToValue, stage, stageValue) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?${assignedTo}=${assignedToValue}&${stage}=${stageValue}`
  );
};

const getFilterPaginateLeads = (
  stage,
  currentPage,
  assignedTo,
  assignedToValue
) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?stage=${stage}&page=${currentPage}&${assignedTo}=${assignedToValue}`
  );
};
const getFilterAssignedtoPaginateLeads = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&${filter}=${search}`
  );
};

// duplicate leads

const getAllDuplicateLeads = () => {
  return CustomAxios.get(`/api/lead/duplicate-leads/`);
};

const getAllPaginateDuplicateLeads = (currentPage) => {
  return CustomAxios.get(`/api/lead/duplicate-leads/&page=${currentPage}`);
};

const getAllSearchDuplicateLeads = (
  filter,
  filterValue
  // search,
  // searchValue
) => {
  return CustomAxios.get(`/api/lead/duplicate-leads/?${filter}=${filterValue}`);
};

const getFilteredDuplicateLeads = (filter, filterValue) => {
  return CustomAxios.get(`/api/lead/duplicate-leads/?${filter}=${filterValue}`);
};

const getFilterPaginateDuplicateLeads = (
  currentPage,
  filter,
  filterValue
  // search,
  // searchValue
) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?page=${currentPage}&${filter}=${filterValue}`
  );
};

const getAllUnassignedData = () => {
  return CustomAxios.get(`/api/lead/list-unassigned/`);
};

const getAllPaginateUnassigned = (currentPage) => {
  return CustomAxios.get(`/api/lead/list-unassigned/?page=${currentPage}`);
};

const getAllPaginateWithFilterUnassigned = (currentPage, filter, search) => {
  return CustomAxios.get(
    `/api/lead/list-unassigned/?page=${currentPage}&${filter}=${search}`
  );
};

const getAllFilterByUnassignedData = (filter, search) => {
  return CustomAxios.get(`/api/lead/list-unassigned/?${filter}=${search}`);
};

const getAllAssignedUser = () => {
  return CustomAxios.get(`/api/user/sales-user`);
};

const createLeads = (data) => {
  return CustomAxios.post("/api/lead/list-lead/", data);
};

const getLeadsById = (id) => {
  return CustomAxios.get(`/api/lead/list-lead/${id}`);
};

const updateLeads = (id, data) => {
  return CustomAxios.patch(`/api/lead/list-lead/${id}`, data);
};

const getAllRefernces = () => {
  return CustomAxios.get(`/api/lead/list-references`);
};

const createRefernces = (data) => {
  return CustomAxios.post("/api/lead/view-references/", data);
};

const getReferncesById = (id) => {
  return CustomAxios.get(`/api/lead/view-references/${id}`);
};

const updateRefernces = (id, data) => {
  return CustomAxios.patch(`/api/lead/view-references/${id}`, data);
};

const createFollowUpLeads = (data) => {
  return CustomAxios.post("/api/lead/list-followup/", data);
};

const getAllFollowUp = () => {
  return CustomAxios.get(`/api/lead/list-followup/`);
};

const createPotentialLead = (data) => {
  return CustomAxios.post("/api/lead/list-potential/", data);
};

const deletePotentialLeadsById = (id) => {
  return CustomAxios.delete(`/api/lead/view-potential/${id}`);
};

const DoneLeadFollowup = (id, data) => {
  return CustomAxios.patch(`/api/lead/list-followup/${id}`, data);
};

const BulkLeadAssign = (data) => {
  return CustomAxios.post("/api/lead/assign-bulk-leads/", data);
};

const AssignMultipleLeads = (data) => {
  return CustomAxios.post("/api/lead/assign-multiple-leads/", data);
};

const getAllFollowup = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getFollowupWithPagination = (startDate, endDate, currentPage) => {
  return CustomAxios.get(
    `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}`
  );
};

const getFollowupWithSearch = (startDate, endDate, search, searchValue) => {
  return CustomAxios.get(
    `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}&${search}=${searchValue}`
  );
};

const getFollowupWithPaginationAndSearch = (
  startDate,
  endDate,
  currentPage,
  search,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}&page=${currentPage}&${search}=${searchValue}`
  );
};

const LeadServices = {
  getProfile,
  getAllLeads,
  getAllPaginateLeads,
  getAllAssignedUser,
  getAllUnassignedData,
  getAllFilterByUnassignedData,
  getAllPaginateUnassigned,
  getAllPaginateWithFilterUnassigned,
  getAllSearchLeads,
  getFilterLeads,
  getFilterPaginateLeads,
  getFilterAssignedtoPaginateLeads,
  getAllDuplicateLeads,
  getAllPaginateDuplicateLeads,
  getAllSearchDuplicateLeads,
  getFilteredDuplicateLeads,
  getFilterPaginateDuplicateLeads,
  createLeads,
  getLeadsById,
  updateLeads,
  createFollowUpLeads,
  getAllFollowUp,
  createPotentialLead,
  deletePotentialLeadsById,
  getAllRefernces,
  createRefernces,
  getReferncesById,
  updateRefernces,
  DoneLeadFollowup,
  BulkLeadAssign,
  AssignMultipleLeads,
  getAllFollowup,
  getFollowupWithPagination,
  getFollowupWithSearch,
  getFollowupWithPaginationAndSearch,
};

export default LeadServices;
