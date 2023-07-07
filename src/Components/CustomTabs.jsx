import React from "react";
import { styled } from "@mui/material/styles";

const CustomTabsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
  borderRadius: "25px",
  overflowX: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "#888 #f2f2f2",
  "&::-webkit-scrollbar": {
    height: "8px",
    backgroundColor: "#f2f2f2",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "4px",
    backgroundColor: "#888",
  },
  position: "relative",
}));

const Spacer = styled("div")({
  flex: "1 1 auto",
});

const ScrollButton = styled("button")(({ theme, right }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  cursor: "pointer",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: right ? "0" : "auto",
}));

export const CustomTabs = ({ tabs, activeTab, onTabChange }) => {
  const tabsContainerRef = React.useRef(null);

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

  const scrollTabs = (scrollOffset) => {
    const container = tabsContainerRef.current;
    container.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    scrollTabs(-100);
  };

  const handleScrollRight = () => {
    scrollTabs(100);
  };

  return (
    <CustomTabsContainer ref={tabsContainerRef}>
      <ScrollButton onClick={handleScrollLeft}></ScrollButton>
      {tabs.map((tab, index) => (
        <CustomTabButton
          key={index}
          active={activeTab === index}
          onClick={() => onTabChange(index)}
        >
          {tab.label}
        </CustomTabButton>
      ))}
      <Spacer /> {/* Added spacer element */}
      <ScrollButton onClick={handleScrollRight} right></ScrollButton>
    </CustomTabsContainer>
  );
};
