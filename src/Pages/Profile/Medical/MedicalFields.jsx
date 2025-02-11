import React from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const YesNoOptions = ["Yes", "No"];
const YesNoNAOptions = [...YesNoOptions, "Not Applicable"];

const fieldsConfig = [
  { label: "Known Allergies", name: "known_allergies", options: null },
  {
    label: "Previous Surgeries",
    name: "previous_surgeries",
    options: null,
  },
  { label: "Surgery Type", name: "surgery_type", options: null },
  { label: "Diabetic", name: "diabetic", options: YesNoOptions },
  {
    label: "Asthma or Respiratory Issues",
    name: "asthama_respiratory",
    options: YesNoOptions,
  },
  {
    label: "Vision Impairments",
    name: "vision",
    options: YesNoOptions,
  },
  {
    label: "Hearing Impairments",
    name: "hearing",
    options: YesNoOptions,
  },
  {
    label: "Hyper Tension",
    name: "hyper_tension",
    options: YesNoOptions,
  },
  {
    label: "Heart Issues",
    name: "heart_issues",
    options: YesNoOptions,
  },
  { label: "Cancer", name: "cancer", options: YesNoOptions },
  {
    label: "High Blood Pressure",
    name: "high_blood_pressure",
    options: YesNoOptions,
  },
  {
    label: "Low Blood Pressure",
    name: "low_blood_pressure",
    options: YesNoOptions,
  },
  { label: "Pregnancy", name: "pregnancy", options: YesNoNAOptions },
];

const AutoCompleteField = ({
  label,
  name,
  value,
  options,
  handleChange,
  error,
}) => (
  <CustomAutocomplete
    options={options || []}
    fullWidth
    size="small"
    value={value}
    onChange={(_, newValue) => handleChange(name, newValue)}
    renderInput={(params) => (
      <CustomTextField
        label={label}
        {...params}
        error={error && error[name]}
        helperText={(error && error[name]) || ""} // Display helper text only if there's an error
      />
    )}
  />
);

export const MedicalFields = ({ formData, setFormData, error }) => {
  const showError = error && error.medical ? error.medical : {};
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      medical: {
        ...prev.medical,
        [name]: value,
      },
    }));
  };

  const getValue = (name) => formData.medical && formData.medical[name];

  return (
    <Grid container spacing={2}>
      {fieldsConfig.map(({ label, name, options }) => (
        <Grid item xs={12} sm={4} key={name}>
          {options ? (
            <AutoCompleteField
              label={label}
              name={name}
              value={getValue(name) || ""}
              options={options}
              handleChange={handleChange}
              error={showError}
            />
          ) : (
            <CustomTextField
              fullWidth
              size="small"
              label={label}
              name={`medical.${name}`}
              error={showError && showError[name]}
              helperText={(showError && showError[name]) || ""}
              value={getValue(name) || ""}
              onChange={(e) => handleChange(name, e.target.value)}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
