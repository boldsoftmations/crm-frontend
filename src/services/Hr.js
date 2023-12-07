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
}

const addSource = (sourceName) => { 
  return CustomAxios.post("/api/hr/source/", {
    name: sourceName.name,
  });
}

const updateSource = (id, data) => {
  console.log("data", data);
  return CustomAxios.patch(`/api/hr/source/${id}/`, {name:data.name});
}

//Job-Opening API
const getJobOpening = () => {
  return CustomAxios.get(`/api/hr/job-opening/`);
};

const getJobOpeningById = (id) => {
  return CustomAxios.get(`/api/hr/job-opening/${id}/`);
}

const addJobOpening = (newJobData) => {
  return CustomAxios.post(`/api/hr/job-opening/`, newJobData);
};

const updateJobOpening = (id, updatedJobData) => {
  return CustomAxios.patch(`/api/hr/job-opening/${id}/`, updatedJobData);
};

// Applicant API
const getApplicants = () => {
  return CustomAxios.get(`/api/hr/applicant/`);
};

const addApplicant = (newApplicantData) => {
  return CustomAxios.post(`/api/hr/applicant/`, newApplicantData);
};

const updateApplicant = (id, updatedApplicantData) => {
  return CustomAxios.patch(`/api/hr/applicant/${id}/`, updatedApplicantData);
};

//Shortlisted Cnadidate API
const getInterviewStatus = () => {
  return CustomAxios.get(`/api/hr/applicant/?is_shortlisted=True`);
};

const getInterviewDate = () => {
  return CustomAxios.get(`/api/hr/interview-details/`);
}

const addInterviewDate = (newInterviewDate) => {
  return CustomAxios.post(`/api/hr/interview-details/`, newInterviewDate);
}
const updateInterviewDate =(id,updatedInterviewDate) =>{
  return CustomAxios.patch(`/api/hr/interview-details/${id}/`,updatedInterviewDate)
}


//Offer Status API

const getOfferStatus = () => {
  return CustomAxios.get(`/api/hr/interview-details/?stage=Selected`);
}

const updateOfferStatus = (id, updatedOfferStatus) => {
  return CustomAxios.patch(`/api/hr/interview-details/${id}/`, updatedOfferStatus);
}

//Mis Report API

const getMisReport = () => {
  return CustomAxios.get(`/api/hr/mis-report/`);
}

//Rejected Candaiate List API

const getRejectedCandidates = () => {  
  return CustomAxios.get(`/api/hr/interview-details/?stage=Rejected`);
}

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
  getJobOpening,
  getJobOpeningById,
  addJobOpening,
  updateJobOpening,
  getApplicants,
  addApplicant,
  updateApplicant,
  getInterviewStatus,
  addInterviewDate,
  getInterviewDate,
  updateInterviewDate,
  getOfferStatus,
  updateOfferStatus,
  getMisReport,
  getRejectedCandidates
};

export default Hr;
