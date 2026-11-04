import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import React from "react";
import validatePincode from "../../../utility/validatePincode";
import { getCountryIdForOrigin } from "../../../utility/postalAddressHelpers";

export const AddressFields = ({ type, formData, setFormData, error }) => {
  const [open, setOpen] = React.useState(false);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const showError = error && error.address && error.address[type];

  const handleChange = (event) => {
    const { name, value } = event.target;
    let addressData = { ...formData.address };
    const [addrType, field] = name.split("_");
    addressData[addrType][field] = value;

    setFormData((prev) => ({
      ...prev,
      address: addressData,
    }));
  };

  const handlePinChange = (event) => {
    const pinCode = event.target.value;
    const { name } = event.target;
    const [addrType, field] = name.split("_");

    setFormData((prev) => {
      const addressData = {
        ...prev.address,
        [addrType]: {
          ...prev.address[addrType],
          [field]: pinCode,
          ...(pinCode.length !== 6 ? { city: "", state: "" } : {}),
        },
      };
      return {
        ...prev,
        address: addressData,
      };
    });

    if (pinCode.length === 6) {
      handlePinLookup(pinCode);
    }
  };

  const handlePinLookup = async (pinCode) => {
    setOpen(true);

    try {
      const data = await validatePincode(
        getCountryIdForOrigin("Domestic"),
        pinCode
      );

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [type]: {
            ...prev.address[type],
            city: data.city_name || "",
            state: data.state_name || "",
          },
        },
      }));
    } catch (error) {
      console.log(error.message || "Pincode not valid or data not found.");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [type]: {
            ...prev.address[type],
            city: "",
            state: "",
          },
        },
      }));
    } finally {
      setOpen(false);
    }
  };

  const onSameAsCurrentChange = (event) => {
    const { checked } = event.target;
    let addressData = { ...formData.address };

    if (checked) {
      addressData.permanent = { ...addressData.current };
      addressData.permanent.is_permanent_same_as_current = true;
    } else {
      addressData.permanent = {
        address: "",
        city: "",
        state: "",
        pin: "",
        is_permanent_same_as_current: false,
      };
    }

    setFormData((prev) => ({
      ...prev,
      address: addressData,
    }));
  };

  const fieldPath = (field) => `${type}_${field}`;

  return (
    <>
      <CustomLoader open={open} />
      {type === "permanent" && (
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  formData.address.permanent.is_permanent_same_as_current ||
                  false
                }
                onChange={onSameAsCurrentChange}
                name="is_permanent_same_as_current"
                color="primary"
              />
            }
            label="Same as Current Address"
          />
        </Grid>
      )}

      {["address", "pin", "city", "state"].map((field, idx) => (
        <Grid item xs={12} sm={idx > 0 ? 4 : 12} key={field}>
          <CustomTextField
            fullWidth
            size="small"
            required
            disabled={["city", "state"].includes(field)}
            label={`${capitalize(type)} ${capitalize(field)}`}
            name={fieldPath(field)}
            error={showError && !!showError[field]}
            helperText={(showError && showError[field]) || ""}
            value={formData.address[type][field] || ""}
            onChange={field === "pin" ? handlePinChange : handleChange}
            InputLabelProps={{
              shrink: Boolean(formData.address[type][field]),
            }}
          />
        </Grid>
      ))}
    </>
  );
};
