import CustomAxios from "./api";

const getProfile = () => {
  return CustomAxios.get(`/api/user/profile/`);
};

const getAllLeads = () => {
  return CustomAxios.get(`/api/lead/list-lead/`);
};

const getAllPaginateLeads = (currentPage, search) => {
  return CustomAxios.get(
    `/api/lead/list-lead/?page=${currentPage}&search=${search}`
  );
};
const getAllUnassignedData = () => {
  return CustomAxios.get(`/api/lead/list-unassigned/`);
};

const getAllPaginateUnassigned = (currentPage, search) => {
  return CustomAxios.get(
    `/api/lead/list-unassigned/?page=${currentPage}&search=${search}`
  );
};

const getAllSearchUnassignedData = (search) => {
  return CustomAxios.get(`/api/lead/list-unassigned/?search=${search}`);
};

const getAllAssignedUser = () => {
  return CustomAxios.get(`/api/user/sales-user`);
};

const getAllSearchLeads = (search) => {
  return CustomAxios.get(`/api/lead/list-lead/?search=${search}`);
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

const createFollowUps = (id, data) => {
  return CustomAxios.patch(`/api/lead/view-followup/${id}`, data);
};
const LeadServices = {
  getProfile,
  getAllLeads,
  getAllPaginateLeads,
  getAllAssignedUser,
  getAllUnassignedData,
  getAllSearchUnassignedData,
  getAllPaginateUnassigned,
  getAllSearchLeads,
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
  createFollowUps,
};

export default LeadServices;
