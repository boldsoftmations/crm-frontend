import React from "react";
import { Button } from "@mui/material";

export const CustomTable = ({ headers, data, openInPopup }) => {
  return (
    <div
      style={{
        maxHeight: 440,
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 15,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f2f2f2",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaa9ac",
        },
      }}
    >
      <div
        style={{
          display: "table",
          minWidth: 700,
          backgroundColor: "#f5f5f5",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "table-header-group",
            position: "sticky",
            top: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: "table-row" }}>
            {headers.map((header, index) => (
              <div
                style={{
                  display: "table-cell",
                  textAlign: "center",
                  padding: "6px",
                  color: "white",
                  backgroundColor: "black",
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                }}
                key={index}
              >
                {header}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "table-row-group" }}>
          {data.map((row, index) => (
            <div
              style={{
                display: "table-row",
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2",
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
              }}
              key={index}
            >
              {Object.values(row).map((value, index) => (
                <div
                  style={{
                    display: "table-cell",
                    textAlign: "center",
                    padding: "6px",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  }}
                  key={index}
                >
                  {value}
                </div>
              ))}
              {openInPopup && (
                <div
                  style={{
                    display: "table-cell",
                    textAlign: "center",
                    padding: "6px",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    zIndex: 0,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => openInPopup(row)}
                  >
                    View
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
