import React from "react";
import { Grid } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";

const YesNoOptions = ["Yes", "No"];

export const AddictionFields = ({ formData, setFormData, error }) => {
  const showError = error && error.addiction ? error.addiction : {};
  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split(".");
    const nestedKey = keys[1];

    setFormData((prev) => ({
      ...prev,
      addiction: {
        ...prev.addiction,
        [nestedKey]: value,
      },
    }));
  };

  return (
    <>
      <Grid item xs={12} sm={4}>
        <CustomAutocomplete
          options={YesNoOptions}
          fullWidth
          size="small"
          value={formData.addiction.tobacco}
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "addiction.tobacco",
                value: newValue || "",
              },
            });
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Tobacco"
              required
              error={showError.tobacco}
              helperText={showError.tobacco || ""}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomAutocomplete
          options={YesNoOptions}
          fullWidth
          size="small"
          value={formData.addiction.cigarettes}
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "addiction.cigarettes",
                value: newValue || "",
              },
            });
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Cigarettes"
              required
              error={showError.tobacco}
              helperText={showError.tobacco || ""}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <CustomAutocomplete
          options={YesNoOptions}
          fullWidth
          size="small"
          value={formData.addiction.alcohol}
          onChange={(event, newValue) => {
            handleChange({
              target: {
                name: "addiction.alcohol",
                value: newValue || "",
              },
            });
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Alcohol"
              required
              error={showError && showError.alcohol}
              helperText={(showError && showError.alcohol) || ""}
            />
          )}
        />
      </Grid>
    </>
  );
};
