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

const getAllDuplicateLeads = (filterValue) => {
  return CustomAxios.get(`/api/lead/duplicate-leads/?field=${filterValue}`);
};

const getAllPaginateDuplicateLeads = (
  currentPage,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?page=${currentPage}&field=${filterValue}&search=${searchValue}`
  );
};

const getSearchDuplicateLeads = (filterValue, searchValue) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?field=${filterValue}&search=${searchValue}`
  );
};

const getFilterPaginateDuplicateLeads = (
  currentPage,
  filterValue,
  searchValue
) => {
  return CustomAxios.get(
    `/api/lead/duplicate-leads/?page=${currentPage}&field=${filterValue}&search=${searchValue}`
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

// Generic function to get order book data
const getAllFollowUp = ({ typeValue, page = 1, assignToFilter }) => {
  let url = `/api/lead/list-followup/?type=${typeValue}&page=${page}`;
  if (assignToFilter) {
    url += `&user__email=${assignToFilter}`;
  }
  return CustomAxios.get(url);
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

const getAllFollowup = (options) => {
  const {
    startDate,
    endDate,
    currentPage,
    filter,
    filterValue,
    search,
    searchValue,
  } = options;

  let url = `/api/lead/list-all-follow-ups/?date_range_after=${startDate}&date_range_before=${endDate}`;

  if (currentPage) {
    url += `&page=${currentPage}`;
  }

  if (filter && filterValue) {
    url += `&${filter}=${filterValue}`;
  }

  if (search && searchValue) {
    url += `&${search}=${searchValue}`;
  }

  return CustomAxios.get(url);
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

const LeadServices = {
  getAllLeads,
  getAllAssignedUser,
  getAllUnassignedData,
  getAllFilterByUnassignedData,
  getAllPaginateUnassigned,
  getAllPaginateWithFilterUnassigned,
  getAllDuplicateLeads,
  getAllPaginateDuplicateLeads,
  getSearchDuplicateLeads,
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
  getIndiaMartLeads,
  createLeadForecast,
  getLeadForecast,
  updateLeadForecast,
};

export default LeadServices;
