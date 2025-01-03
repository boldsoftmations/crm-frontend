import CustomAxios from "./api";
const createWhatsappGroup = (customer_name) => {
  return CustomAxios.post("/api/whatsapp/group/", customer_name);
};

const sendWhatsappJoinGroupInvite = (customer_name) => {
  return CustomAxios.post("/api/whatsapp/group/", customer_name);
};

const AddCustomerNumbersInPhone = (data) => {
  return CustomAxios.post("api/whatsapp/contact/", data);
};

const getParticipants = (company) => {
  // Constructing the query parameters
  const params = new URLSearchParams();
  if (company) {
    params.append("company", company);
  }
  // Sending a GET request with query parameters
  return CustomAxios.get(`/api/whatsapp/participants/?${params.toString()}`);
};

const promoteAdmintoMembers = (data) => {
  return CustomAxios.post("/api/whatsapp/participants/make_admin/", data);
};

const RemoveParticipantsMembers = (data) => {
  return CustomAxios.post(
    "/api/whatsapp/participants/remove_participants/",
    data
  );
};

const AddParticipantsMembers = (data) => {
  return CustomAxios.post("/api/whatsapp/participants/add_member/", data);
};

export const WhatsappServices = {
  createWhatsappGroup,
  sendWhatsappJoinGroupInvite,
  AddCustomerNumbersInPhone,
  getParticipants,
  promoteAdmintoMembers,
  RemoveParticipantsMembers,
  AddParticipantsMembers,
};
