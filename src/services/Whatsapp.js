import CustomAxios from "./api";

const createWhatsappGroup = (customer_name) => {
  return CustomAxios.post("/api/whatsapp/group/", customer_name);
};

export const WhatsappServices = {
  createWhatsappGroup,
};
