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

const addDesignation = (data) => {
  return CustomAxios.post("/api/hr/designation/", data);
};

const updateDesignations = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/designation/${id}/`, data);
};

const deleteDesignations = (id, data) => {
  return CustomAxios.delete(`/api/hr/designation/${id}/`, data);
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
    `/api/hr/job-opening/?stage=Open&${params.toString()}`,
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
  date,
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
      job__designation__designation,
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
    `/api/hr/applicant/?is_competitor=true&${params.toString()}`,
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
    updatedInterviewDate,
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
    updatedOfferStatus,
  );
};

//Mis Report API

const getMisReport = () => {
  return CustomAxios.get(`/api/hr/mis-report/`);
};

//Rejected Candaiate List API

const getRejectedCandidates = (
  page,
  searchValue,
  status = "Rejected",
  filterValue,
) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (searchValue) {
    params.append("search", searchValue);
  }

  if (status) {
    params.append("status", status);
  }

  if (filterValue) {
    params.append("job__designation__designation", filterValue);
  }

  return CustomAxios.get(`api/hr/applicant/?${params.toString()}`);
};

const updateRejectedCandidates = (updatedRejectedCandidates) => {
  return CustomAxios.post(
    `/api/hr/interview-details/`,
    updatedRejectedCandidates,
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
const UpdateCompetancyAttribute = (id, data) => {
  return CustomAxios.patch(`/api/hr/competency-attribute/${id}/`, data);
};

const getCompentancyAttribute = (page, search) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  return CustomAxios.get(`/api/hr/competency-attribute/?${params.toString()}`);
};

// role clarity
const createRoleClarity = (data) => {
  return CustomAxios.post(`/api/hr/role/`, data);
};

const UpdateRoleClarity = (id, data) => {
  return CustomAxios.patch(`/api/hr/role/${id}/`, data);
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

const UpdateJobDescription = (id, data) => {
  return CustomAxios.patch(`/api/hr/job-description/${id}/`, data);
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
const UpdateMCQQuetion = (id, data) => {
  return CustomAxios.patch(`api/hr/mcq/${id}/`, data);
};

const getMCQQuetion = (page, designation) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }
  if (designation) {
    params.append("designation__designation", designation);
  }
  return CustomAxios.get(`/api/hr/mcq/?${params.toString()}`);
};
const getDepartmentList = () => {
  return CustomAxios.get(`/api/hr/department/?type=list`);
};
const getDesginationList = () => {
  return CustomAxios.get(`/api/hr/designation/?type=list`);
};

const createInterviewQuestionAndanswwer = (data) => {
  return CustomAxios.post(`/api/hr/interview-question/`, data);
};
const getInterviewQuestionAndAnswer = (page, designation, typeofinterview) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (designation) {
    params.append("designation__designation", designation);
  }

  if (typeofinterview) {
    params.append("interview_type", typeofinterview);
  }
  return CustomAxios.get(`/api/hr/interview-question/?${params.toString()}`);
};
const UpdateInterviewQuestionandanswwer = (id, data) => {
  return CustomAxios.patch(`/api/hr/interview-question/${id}/`, data);
};

const DeteteInterviewQuestionandanswwer = (id) => {
  return CustomAxios.delete(`/api/hr/interview-question/${id}/`);
};

const handleGetDataFromCVAndCheckATS = (data) => {
  return CustomAxios.post("/api/hr/ats/", data);
};

const sendAutomatedMessage = (data) => {
  return CustomAxios.post("/api/hr/whatsapp-email/", data);
};

const bulkATScandidates = (page, filterValue) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (filterValue) {
    params.append("job__designation__designation", filterValue);
  }
  return CustomAxios.get(`/api/hr/bulk-ats/?${params.toString()}`);
};

const SendbulkEamilTocandidates = (data) => {
  return CustomAxios.post(`/api/hr/send-bulk-email/`, data);
};

const getAssessementDetails = (page, search, filter) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (filter) {
    params.append("job__designation__designation", filter);
  }
  return CustomAxios.get(`/api/hr/interview/?${params.toString()}`);
};

const getAssessementResultDetails = (data) => {
  return CustomAxios.post(`/api/hr/question-answer/applicant_result/`, data);
};

const deleteMCQQuestion = (id) => {
  return CustomAxios.delete(`/api/hr/mcq/${id}/`);
};

const createCandidateFollowup = (data) => {
  return CustomAxios.post(`/api/hr/applicant-followup/`, data);
};

const getCandidateFollowup = (page, search, designation, type) => {
  const params = new URLSearchParams();
  if (page) {
    params.append("page", page);
  }
  if (search) {
    params.append("search", search);
  }
  if (designation) {
    params.append("applicant__job__designation__designation", designation);
  }
  if (type) {
    params.append("type", type);
  }

  return CustomAxios.get(`/api/hr/applicant-followup/?${params.toString()}`);
};

const CandidateDoneFollowup = (id, data) => {
  return CustomAxios.patch(`/api/hr/applicant-followup/${id}/`, data);
};

const getCandidates = () => {
  return CustomAxios.get(
    "/api/master/model-option/?page=all&model_master__name=Applicant Followup Status",
  );
};

const getRevisedDataHrFollowup = () => {
  return CustomAxios.get("/api/hr/applicant-followup/revised_followup_date/");
};

export const createWarningLetter = (data) => {
  return CustomAxios.post(`/api/user/employee-warning/`, data);
};

export const viewWarningLetter = (page, search, filter) => {
  const params = new URLSearchParams();

  if (page) {
    params.append("page", page);
  }

  if (search) {
    params.append("search", search);
  }

  if (filter) {
    params.append("employee__user__first_name", filter);
  }
  return CustomAxios.get(`/api/user/employee-warning/?${params.toString()}`);
};

const UpdateApplicantDesignation = (id, data) => {
  return CustomAxios.patch(`/api/hr/applicant-job-update/${id}/`, data);
};
const Hr = {
  getDesignationsData,
  addDesignation,
  updateDesignations,
  deleteDesignations,
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
  UpdateCompetancyAttribute,
  getCompentancyAttribute,
  createRoleClarity,
  UpdateRoleClarity,
  getRoleClarity,
  createJobDescription,
  UpdateJobDescription,
  getJobDescription,
  createMCQQuetion,
  UpdateMCQQuetion,
  getMCQQuetion,
  deleteMCQQuestion,
  getCompetitorCandidates,
  getDepartmentList,
  getDesginationList,
  createInterviewQuestionAndanswwer,
  getInterviewQuestionAndAnswer,
  UpdateInterviewQuestionandanswwer,
  DeteteInterviewQuestionandanswwer,
  handleGetDataFromCVAndCheckATS,
  sendAutomatedMessage,
  bulkATScandidates,
  SendbulkEamilTocandidates,
  getAssessementDetails,
  getAssessementResultDetails,
  createCandidateFollowup,
  getCandidateFollowup,
  CandidateDoneFollowup,
  getCandidates,
  getRevisedDataHrFollowup,
  UpdateApplicantDesignation,
};

export default Hr;
