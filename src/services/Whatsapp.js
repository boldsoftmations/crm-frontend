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

export const WhatsappServices = {
  createWhatsappGroup,
  sendWhatsappJoinGroupInvite,
  AddCustomerNumbersInPhone,
};
