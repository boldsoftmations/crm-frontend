import CustomAxios from "./api";

//Designation API
const getDesignationsData = (page, searchQuery) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  return CustomAxios.get(`api/hr/designation/?${params.toString()}`);
};

const addDesignation = (designationName) => {
  return CustomAxios.post("/api/hr/designation/", {
    designation: designationName,
  });
};

const updateDesignations = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/designation/${id}/`, data);
};

//Department API
const getDepartment = () => {
  return CustomAxios.get("/api/hr/department/");
};

const addDepartment = (departmentName) => {
  return CustomAxios.post("/api/hr/department/", {
    department: departmentName,
  });
};

const updateDepartment = (id, data) => {
  return CustomAxios.patch(`/api/hr/department/${id}/`, data);
};

//Source API
const getSource = () => {
  return CustomAxios.get("/api/hr/source/");
};

const addSource = (sourceName) => {
  return CustomAxios.post("/api/hr/source/", {
    name: sourceName.name,
  });
};

const updateSource = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/source/${id}/`, { name: data.name });
};

// Location Api

const getLocation = (page, searchQuery) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchQuery) {
    params.append("search", searchQuery);
  }
  return CustomAxios.get(`/api/hr/location/?${params.toString()}`);
};

const addLocation = (data) => {
  return CustomAxios.post("/api/hr/location/", data);
};

const updateLocation = (id, data) => {
  return CustomAxios.patch(`/api/hr/location/${id}/`, data);
};

const getLocationList = () => {
  return CustomAxios.get("/api/hr/location/?type=list");
};

//Job-Opening API
const getJobOpening = (page, search, stage) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (stage) {
    params.append("stage", stage);
  }
  return CustomAxios.get(
    `/api/hr/job-opening/?stage=Open&${params.toString()}`
  );
};

const getJobOpeningById = (id) => {
  return CustomAxios.get(`/api/hr/job-opening/${id}/`);
};

const addJobOpening = (newJobData) => {
  return CustomAxios.post(`/api/hr/job-opening/`, newJobData);
};

const updateJobOpening = (id, updatedJobData) => {
  return CustomAxios.patch(`/api/hr/job-opening/${id}/`, updatedJobData);
};

// Applicant API
const getApplicants = (
  page,
  searchValue,
  job__designation__designation,
  job__department__department,
  stage = "Screening", // Default stage
  status = "Open", // Default status
  date
) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (job__designation__designation) {
    params.append(
      "job__designation__designation",
      job__designation__designation
    );
  }

  if (job__department__department) {
    params.append("job__department__department", job__department__department);
  }

  // Only append stage if it's not null or undefined
  if (stage !== null && stage !== undefined) {
    params.append("stage", stage);
  }

  // Only append status if it's not null or undefined
  if (status !== null && status !== undefined) {
    params.append("status", status);
  }

  if (date) {
    params.append("date", date);
  }

  return CustomAxios.get(`api/hr/applicant/?${params.toString()}`);
};

const getCandidateProfile = (id) => {
  return CustomAxios.get(`/api/hr/applicant/${id}/`);
};
const addApplicant = (newApplicantData) => {
  return CustomAxios.post(`/api/hr/applicant/`, newApplicantData);
};

const updateApplicant = (id, updatedApplicantData) => {
  return CustomAxios.patch(`/api/hr/applicant/${id}/`, updatedApplicantData);
};

//Shortlisted Cnadidate API
const getInterviewStatus = () => {
  return CustomAxios.get(`/api/hr/applicant/?status=Shortlisted`);
};
const getCompetitorCandidates = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(
    `/api/hr/applicant/?is_competitor=true&${params.toString()}`
  );
};
const getInterviewDate = (page, stage, status) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (stage) {
    params.append("stage", stage);
  }
  if (status) {
    params.append("status", status);
  }
  return CustomAxios.get(`/api/hr/interview-details/?${params.toString()}`);
};

const addInterviewDate = (newInterviewDate) => {
  return CustomAxios.post(`/api/hr/interview-details/`, newInterviewDate);
};
const updateInterviewDate = (id, updatedInterviewDate) => {
  return CustomAxios.patch(
    `/api/hr/interview-details/${id}/`,
    updatedInterviewDate
  );
};

//Offer Status API

const getOfferStatus = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  return CustomAxios.get(`api/hr/applicant/?stage=Offer${params.toString()}`);
};

const updateOfferStatus = (id, updatedOfferStatus) => {
  return CustomAxios.patch(
    `/api/hr/interview-details/${id}/?stage=Selected`,
    updatedOfferStatus
  );
};

//Mis Report API

const getMisReport = () => {
  return CustomAxios.get(`/api/hr/mis-report/`);
};

//Rejected Candaiate List API

const getRejectedCandidates = (page, searchValue, filterValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  if (filterValue) {
    params.append("job__designation__designation", filterValue);
  }

  return CustomAxios.get(
    `api/hr/applicant/?status=Rejected&${params.toString()}`
  );
};

const updateRejectedCandidates = (updatedRejectedCandidates) => {
  return CustomAxios.post(
    `/api/hr/interview-details/`,
    updatedRejectedCandidates
  );
};

// Hr attributes
const createAttribute = (data) => {
  return CustomAxios.post(`/api/hr/attribute/`, data);
};

const getAttribute = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(`/api/hr/attribute/?${params.toString()}`);
};

const getAttributeList = () => {
  return CustomAxios.get(`/api/hr/attribute/attibute_list/`);
};

// competency attributes
const getUserGroupList = () => {
  return CustomAxios.get(`/api/user/groups/group_list/`);
};

const createCompetancyAttribute = (data) => {
  return CustomAxios.post(`/api/hr/competency-attribute/`, data);
};

const getCompentancyAttribute = () => {
  return CustomAxios.get(`/api/hr/competency-attribute/`);
};

// role clarity
const createRoleClarity = (data) => {
  return CustomAxios.post(`/api/hr/role/`, data);
};

const getRoleClarity = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(`/api/hr/role/?${params.toString()}`);
};
//job description api
const createJobDescription = (data) => {
  return CustomAxios.post(`/api/hr/job-description/`, data);
};

const getJobDescription = (page, searchValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }
  return CustomAxios.get(`/api/hr/job-description/?${params.toString()}`);
};

const createMCQQuetion = (data) => {
  return CustomAxios.post(`api/hr/mcq/`, data);
};

const getMCQQuetion = (page, filterValue) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (filterValue) {
    params.append("department__department", filterValue);
  }
  return CustomAxios.get(`/api/hr/mcq/?${params.toString()}`);
};
const getDepartmentList = () => {
  return CustomAxios.get(`/api/hr/department/?type=list`);
};

const Hr = {
  getDesignationsData,
  addDesignation,
  updateDesignations,
  getDepartment,
  addDepartment,
  updateDepartment,
  getSource,
  addSource,
  updateSource,
  getLocation,
  addLocation,
  updateLocation,
  getLocationList,
  getJobOpening,
  getJobOpeningById,
  addJobOpening,
  updateJobOpening,
  getApplicants,
  getCandidateProfile,
  addApplicant,
  updateApplicant,
  getInterviewStatus,
  addInterviewDate,
  getInterviewDate,
  updateInterviewDate,
  getOfferStatus,
  updateOfferStatus,
  getMisReport,
  getRejectedCandidates,
  updateRejectedCandidates,
  createAttribute,
  getAttribute,
  getAttributeList,
  getUserGroupList,
  createCompetancyAttribute,
  getCompentancyAttribute,
  createRoleClarity,
  getRoleClarity,
  createJobDescription,
  getJobDescription,
  createMCQQuetion,
  getMCQQuetion,
  getCompetitorCandidates,
  getDepartmentList,
};

export default Hr;
