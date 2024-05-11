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
  renderInput, // Existing custom renderInput
  multiple, // Added for multi-select functionality
  limitTags, // Added to limit the number of tags shown
  freeSolo, // Added for allowing arbitrary values not present in the options
  renderTags, // Added for custom tag rendering
  // Include any additional props that might be necessary
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
      renderInput || ((params) => <CustomTextField {...params} label={label} />)
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
    // Spread additional props for maximum flexibility
    {...(multiple ? { ChipComponent: Chip } : {})}
  />
);

export default CustomAutocomplete;
