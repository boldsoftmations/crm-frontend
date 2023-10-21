import React from "react";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import axios from "axios";
import { CustomLoader } from "../../../Components/CustomLoader";

export const AddressFields = ({
  type, // current or permanent
  formData,
  setFormData,
}) => {
  const [open, setOpen] = React.useState(false);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

    // First, store the pincode in formData
    handleChange(event);

    // Then, if pinCode has a specific length, make the API call
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
            disabled={["city", "state"].includes(field)}
            label={`${capitalize(type)} ${capitalize(field)}`}
            name={fieldPath(field)}
            value={formData.address[type][field]}
            onChange={field === "pin" ? handlePinChange : handleChange}
            InputLabelProps={{
              shrink: formData.address[type][field] ? true : undefined,
            }}
          />
        </Grid>
      ))}
    </>
  );
};
