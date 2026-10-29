import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CustomTextField from "./CustomTextField"; // Adjust the path as needed
import Chip from "@mui/material/Chip";

const CustomAutocomplete = ({
  size,
  fullWidth,
  id,
  value,
  onChange,
  options,
  groupBy,
  getOptionLabel,
  label,
  sx,
  renderInput,
  multiple,
  limitTags,
  freeSolo,
  renderTags,
  disabled,
  required,
  error,
  helperText,
}) => (
  <Autocomplete
    size={size || "small"}
    fullWidth={fullWidth}
    id={id}
    value={value}
    onChange={onChange}
    options={options}
    groupBy={groupBy}
    getOptionLabel={getOptionLabel || ((option) => option)} // Ensuring there's a default getOptionLabel
    renderInput={
      renderInput ||
      ((params) => (
        <CustomTextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      ))
    }
    sx={sx}
    multiple={multiple}
    limitTags={limitTags}
    freeSolo={freeSolo}
    renderTags={
      renderTags ||
      ((value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        )))
    }
    disabled={disabled}
    // Spread additional props for maximum flexibility
    {...(multiple ? { ChipComponent: Chip } : {})}
  />
);

export default CustomAutocomplete;
