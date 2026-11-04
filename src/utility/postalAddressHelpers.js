/**
 * Shared postal helpers for Lead and Customer address flows.
 * Lookup itself lives in validatePincode.js.
 */

export const getCountryIdForOrigin = (originType, countryId) => {
  if (originType === "Domestic") {
    return 1;
  }
  return countryId || null;
};

export const applyPostalLookupSuccess = (prev, data) => {
  const next = {
    ...prev,
    pin_code: data.id,
    state: data.state_name || "",
    city: data.city_name || "",
    zone: data.zone_name || "",
  };

  /*
   * Update Customer forms store country as a name string — fill from lookup.
   * Lead International stores country as a numeric id — do not overwrite.
   * Create Customer stores country as a Country Master object — keep it.
   */
  if (
    data.country_name &&
    (typeof prev.country === "string" ||
      prev.country === null ||
      prev.country === undefined ||
      prev.country === "")
  ) {
    next.country = data.country_name;
  }

  return next;
};

export const clearPostalFields = (prev) => ({
  ...prev,
  pin_code: "",
  state: "",
  city: "",
  zone: "",
});

export const applyShippingPostalLookupSuccess = (prev, data) => ({
  ...prev,
  shipping_pin_code: data.id,
  shipping_state: data.state_name || "",
  shipping_city: data.city_name || "",
});

export const clearShippingPostalFields = (prev) => ({
  ...prev,
  shipping_pin_code: "",
  shipping_state: "",
  shipping_city: "",
});

export const clearAllPostalVerification = (prev) => ({
  ...prev,
  pin_code: "",
  state: "",
  city: "",
  zone: "",
  shipping_pin_code: "",
  shipping_state: "",
  shipping_city: "",
});
