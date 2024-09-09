import CustomAxios from "./api";

const getAllLeads = (
  page,
  funnelVlue,
  orderingValue,
  filter,
  filterValue,
  searchValue
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (funnelVlue) {
    params.append("funnel", funnelVlue);
  }

  if (orderingValue) {
    params.append("ordering", orderingValue);
  }

  if (filter && filterValue) {
    params.append(filter, filterValue);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  // Sending a GET request with query parameters
  return CustomAxios.get(`api/lead/list-lead/?${params.toString()}`);
};

// duplicate leads

// const getAllDuplicateLeads = (
//   page,
//   fieldValue,

//   searchValue
// ) => {
//   // Constructing the query parameters
//   const params = new URLSearchParams();

//   if (page) {
//     params.append("page", page);
//   }

//   if (fieldValue) {
//     params.append("field", fieldValue);
//   }

//   if (searchValue) {
//     params.append("search", searchValue);
//   }

//   // Sending a GET request with query parameters
//   return CustomAxios.get(`api/lead/duplicate-leads/?${params.toString()}`);
// };

const getAllDuplicateLeads = (page, filterValue, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (filterValue) {
    params.append("field", filterValue);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/lead/duplicate-leads/?${params.toString()}`);
};

const getAllUnassignedData = (page, filterValue, searchValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (filterValue) {
    params.append("references__source", filterValue);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/lead/list-unassigned/?${params.toString()}`);
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

const getFollowUp = (typeValue, page, filterValue) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (typeValue) {
    params.append("type", typeValue);
  }

  if (page) {
    params.append("page", page);
  }

  if (filterValue) {
    params.append("user__email", filterValue);
  }

  return CustomAxios.get(`api/lead/list-followup/?${params.toString()}`);
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

const getAllFollowUp = (
  startDate,
  endDate,
  page,
  assignedFilter,
  filterValue
) => {
  // Constructing the query parameters
  const params = new URLSearchParams();

  if (startDate) {
    params.append("date_range_after", startDate);
  }

  if (endDate) {
    params.append("date_range_before", endDate);
  }

  if (page) {
    params.append("page", page);
  }

  if (assignedFilter) {
    params.append("user_email", assignedFilter);
  }

  if (filterValue) {
    params.append("activity", filterValue);
  }

  return CustomAxios.get(`api/lead/list-all-follow-ups/?${params.toString()}`);
};

// IndiaMart Leads API
const getIndiaMartLeads = (data) => {
  return CustomAxios.get(`/api/lead/indiamart-leads-list/?year_month=${data}`);
};

const getLeadForecast = (data) => {
  return CustomAxios.get(`/api/forecast/lead-forecast/`, data);
};
const createLeadForecast = (data) => {
  return CustomAxios.post("/api/forecast/lead-forecast/", data);
};
const updateLeadForecast = (id, data) => {
  return CustomAxios.patch(`/api/forecast/lead-forecast/${id}/`, data);
};
const createJustDialLeads = (data) => {
  return CustomAxios.post("/api/lead/just-dial-lead/", data);
};

const LeadServices = {
  getAllLeads,
  getAllAssignedUser,
  getAllUnassignedData,
  getAllDuplicateLeads,
  createLeads,
  getLeadsById,
  updateLeads,
  createFollowUpLeads,
  getFollowUp,
  createPotentialLead,
  deletePotentialLeadsById,
  getAllRefernces,
  createRefernces,
  getReferncesById,
  updateRefernces,
  DoneLeadFollowup,
  BulkLeadAssign,
  AssignMultipleLeads,
  getAllFollowUp,
  getIndiaMartLeads,
  createLeadForecast,
  getLeadForecast,
  updateLeadForecast,
  createJustDialLeads,
};

export default LeadServices;
