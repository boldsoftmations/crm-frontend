import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// The tab container should allow for horizontal scrolling when overflow
const CustomTabsContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap", // Changed to nowrap to ensure horizontal scrolling
  overflowX: "auto", // Allow horizontal scrolling when tabs overflow
  gap: "8px", // Adds space between items
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  padding: "8px",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: `pointer`,
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 5px grey",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#006ba1",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "#00507d",
    },
  },
});

export const CustomTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <CustomTabsContainer>
      {tabs.map((tab, index) => (
        <Button
          key={index}
          variant={activeTab === index ? "contained" : "outlined"}
          onClick={() => onTabChange(index)}
          sx={{
            minWidth: "160px", // Minimum width for each tab
            margin: "0 4px", // Margin on left and right for spacing between tabs
            textTransform: "none",
            fontWeight: activeTab === index ? 600 : 400,
            fontSize: "12px",
            color: activeTab === index ? "#fff" : "#006ba1",
            backgroundColor: activeTab === index ? "#006ba1" : "transparent",
            "&:hover": {
              backgroundColor: activeTab === index ? "#00507d" : "#e0e0e0",
            },
            borderRadius: "4px",
            padding: "10px 15px", // Padding inside the button for larger click area
          }}
        >
          {tab.label}
        </Button>
      ))}
    </CustomTabsContainer>
  );
};
