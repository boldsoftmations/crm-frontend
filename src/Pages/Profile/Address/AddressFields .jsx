import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import axios from "axios";
import { CustomLoader } from "../../../Components/CustomLoader";
import React from "react";
export const AddressFields = ({
  type, // "current" or "permanent"
  formData,
  setFormData,
  error,
}) => {
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

  const handlePinChange = async (event) => {
    const pinCode = event.target.value;
    handleChange(event);

    if (pinCode.length === 6) {
      handlePinBlur(event);
    }
  };

  const handlePinBlur = async (event) => {
    const pinCode = event.target.value;
    try {
      setOpen(true);
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      if (response.data[0].Status === "Success") {
        let addressData = { ...formData.address };
        addressData[type].city = response.data[0].PostOffice[0].District;
        addressData[type].state = response.data[0].PostOffice[0].State;

        setFormData((prev) => ({
          ...prev,
          address: addressData,
        }));
      } else {
        console.log("Pincode not valid or data not found.");
      }
      setOpen(false);
    } catch (error) {
      console.log("Error validating pincode", error);
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
            error={showError && !!showError[field]} // Fix: Replace fieldName with field
            helperText={(showError && showError[field]) || ""} // Fix: Use correct field reference
            value={formData.address[type][field] || ""}
            onChange={field === "pin" ? handlePinChange : handleChange}
            InputLabelProps={{
              shrink: Boolean(formData.address[type][field]), // Ensures label shrinks when value exists
            }}
          />
        </Grid>
      ))}
    </>
  );
};
