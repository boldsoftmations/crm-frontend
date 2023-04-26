import React from "react";
import { styled } from "@mui/material/styles";
const CustomTabButton = styled("button")(({ theme, active }) => ({
  padding: "10px 10px",
  margin: "10px 10px",
  cursor: "pointer",
  fontWeight: "bold",
  color: active ? "#fff" : "#000",
  fontSize: "14px",
  fontWeight: "bolder",
  backgroundColor: active ? "#006ba1" : "transparent",
  border: "none",
  borderRadius: "25px",
  outline: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: active ? "#00507d" : "#ddd",
  },
}));

const CustomTabsContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#f2f2f2",
  borderRadius: "25px",
  overflow: "hidden",
});

function CustomTab({ label, active, onClick }) {
  return (
    <CustomTabButton active={active} onClick={onClick}>
      {label}
    </CustomTabButton>
  );
}

export const CustomTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <CustomTabsContainer>
      {tabs.map((tab, index) => (
        <CustomTab
          key={index}
          label={tab.label}
          active={activeTab === index}
          onClick={() => onTabChange(index)}
        />
      ))}
    </CustomTabsContainer>
  );
};
