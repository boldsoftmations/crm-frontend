import MasterService from "../services/MasterService";

const validatePincode = async (countryId, pincode) => {
  if (!countryId) {
    throw new Error("Country is required.");
  }

  // pincode kabhi number type se aaye to bhi safely string bana lo,
  // taaki .trim() par crash na ho
  const pincodeValue =
    pincode !== null && pincode !== undefined ? String(pincode).trim() : "";

  if (!pincodeValue) {
    throw new Error("Pincode is required.");
  }

  try {
    const response = await MasterService.ValidatePincode(
      countryId,
      pincodeValue,
    );

    if (response && response.data) {
      return response.data;
    }

    throw new Error("Invalid pincode.");
  } catch (error) {
    // axios error ka error.message generic hota hai (e.g. "Request failed
    // with status code 400") - asli backend validation message
    // error.response.data me hota hai, usko nikal ke use karo
    const backendMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : null;

    throw new Error(
      backendMessage ? backendMessage : error.message || "Invalid pincode.",
    );
  }
};

export default validatePincode;
