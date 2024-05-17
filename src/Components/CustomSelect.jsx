import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Box,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const CustomSelect = ({ label, value, options, onChange, onClear }) => (
  <FormControl
    fullWidth
    size="small"
    sx={{
      position: "relative",
      minWidth: "300px",
      display: "flex",
      alignItems: "center",
    }}
  >
    <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Select
        labelId={`${label}-select-label`}
        id={`${label}-select`}
        name={label}
        label={label}
        value={value}
        onChange={onChange}
        sx={{ flexGrow: 1 }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        aria-label={`clear ${label}`}
        onClick={onClear}
        sx={{
          position: "absolute",
          right: "0px",
          top: "50%",
          transform: "translateY(-50%)",
        }} // Adjust icon positioning here
      >
        <ClearIcon />
      </IconButton>
    </Box>
  </FormControl>
);

export default CustomSelect;
