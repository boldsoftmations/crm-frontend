import React from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const DocterFields = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split(".");
    const nestedKey = keys[1];

    setFormData((prev) => ({
      ...prev,
      doctor: {
        ...prev.doctor,
        [nestedKey]: value,
      },
    }));
  };
  return (
    <>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          size="small"
          label="Doctor's Name"
          name="doctor.name"
          value={formData.doctor.name || ""}
          onChange={(e) => handleChange(e)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          size="small"
          label="Doctor's Phone Number"
          name="doctor.phone_number"
          value={formData.doctor.phone_number || ""}
          onChange={(e) => handleChange(e)}
        />
      </Grid>
    </>
  );
};
