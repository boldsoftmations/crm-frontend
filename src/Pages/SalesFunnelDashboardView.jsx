import React, { useEffect, useState } from "react";
import LeadServices from "../services/LeadService";
import { CustomLoader } from "../Components/CustomLoader";
import { SalesFunnel } from "./SalesFunnel";
import { Popup } from "../Components/Popup";
import Tooltip from "@mui/material/Tooltip";

export const SalesFunnelDashboardView = () => {
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [funnelDataByID, setFunnelDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  useEffect(() => {
    getAllTaskDetails();
  }, []);

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getLeadDashboard();
      console.log("response", response);
      const Data = [
        { name: "new", label: "New", value: response.data.new },
        { name: "open", label: "Open", value: response.data.open },
        {
          name: "opportunity",
          label: "Oppurtunity",
          value: response.data.opportunity,
        },
        {
          name: "potential",
          label: "Potential",
          value: response.data.potential,
        },
        {
          name: "not_interested",
          label: "Not Interested",
          value: response.data.not_interested,
        },
        {
          name: "converted",
          label: "Converted",
          value: response.data.converted,
        },
      ];
      setFunnelData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const handleRowClick = (row) => {
    setFunnelDataByID(row);
    setOpenPopup(true);
  };

  const chartContainerStyle = {
    margin: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    paddingTop: "20px",
    width: "600px",
    height: "370px",
  };

  const textStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  const funnelStyle = {
    width: "100%",
    minHeight: "1px",
    fontSize: "12px",
    padding: "10px 0",
    margin: "2px 0",
    color: "black",
    clipPath: "polygon(0 0, 100% 0, 60% 78%, 60% 90%, 40% 100%, 40% 78%)",
    WebkitClipPath: "polygon(0 0, 100% 0, 60% 78%, 60% 90%, 40% 100%, 40% 78%)",
    textAlign: "center",
  };

  const paletteColors = [
    "#f14c14",
    "#f39c35",
    "#68BC00",
    "#1d7b63",
    "#4e97a8",
    "#4466a3",
  ];

  const handleSegmentHover = (segment) => {
    setHoveredSegment(segment);
  };

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };
  return (
    <>
      <CustomLoader open={open} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={chartContainerStyle}>
          <div className="funnelChart" style={funnelStyle}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Sales Funnel</h2>
            {funnelData.map((data, index) => (
              <Tooltip key={index} title={`${data.name}  ${data.value}`}>
                <div
                  className="chartSegment"
                  style={{
                    backgroundColor:
                      paletteColors[index % paletteColors.length],
                    opacity: hoveredSegment === data ? 0.7 : 1,
                  }}
                  onMouseEnter={() => handleSegmentHover(data)}
                  // onMouseLeave={handleSegmentLeave}
                  onClick={() => handleRowClick(data)}
                >
                  <div
                  // className="segmentTitle"
                  >
                    <span style={textStyle}>{data.label}</span>&nbsp;
                    <span style={textStyle}>{data.value}</span>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <Popup
        maxWidth={"xl"}
        title={"Vsiew Leads dashboard"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesFunnel
          funnelDataByID={funnelDataByID}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </>
  );
};
