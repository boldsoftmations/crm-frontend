import React from 'react'
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, TextField } from '@mui/material';
export const CustomSearch = (props) => {
    const {filterSelectedQuery,handleInputChange,getResetData} =props
  return (
    <TextField
    value={filterSelectedQuery}
    onChange={(event) => handleInputChange(event)}
    name="search"
    size="small"
    placeholder="search"
    label="Search"
    variant="outlined"
    sx={{
      backgroundColor: "#ffffff",
      marginLeft: "1em",
      "& .MuiSelect-iconOutlined": {
        display: filterSelectedQuery ? "none" : "",
      },
      "&.Mui-focused .MuiIconButton-root": {
        color: "primary.main",
      },
    }}
    InputProps={{
      endAdornment: (
        <IconButton
          sx={{
            visibility: filterSelectedQuery ? "visible" : "hidden",
          }}
          onClick={getResetData}
        >
          <ClearIcon />
        </IconButton>
      ),
      startAdornment: (
        <IconButton
        >
          <SearchIcon />
        </IconButton>
      ),
    }}
    
  />
  )
}