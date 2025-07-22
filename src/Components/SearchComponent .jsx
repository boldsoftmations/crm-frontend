import React, { useState } from "react";
import { TextField, IconButton, Box, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchComponent = ({ onSearch, onReset }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  const handleResetClick = () => {
    setSearchQuery("");
    onReset();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      if (onReset) {
        onReset(); // Optional callback to parent to clear results, etc.
      }
    }

    if (e.key === "Enter") {
      if (onSearch) {
        onSearch(searchQuery.trim()); //append search value
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {" "}
      {/* Ensured Box takes 100% width */}
      <TextField
        size="small"
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="search" onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
              {searchQuery && (
                <IconButton aria-label="reset" onClick={handleResetClick}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchComponent;
