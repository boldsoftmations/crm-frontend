import React from "react";
import { Button, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
export const CustomSearchWithButton = (props) => {
  const {
    filterSelectedQuery,
    setFilterSelectedQuery,
    handleInputChange,
    getResetData,
  } = props;
  return (
    <>
      <TextField
        value={filterSelectedQuery}
        onChange={(event) => setFilterSelectedQuery(event.target.value)}
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
            <>
              <IconButton
                sx={{
                  visibility: filterSelectedQuery ? "visible" : "hidden",
                }}
                onClick={getResetData}
              >
                <ClearIcon />
              </IconButton>
            </>
          ),
        }}
      />
      <Button variant="contained" color="primary" onClick={handleInputChange}>
        Search
      </Button>
    </>
  );
};
