import React, { useEffect, useState } from "react";
import LeadServices from "../services/LeadService";
import { CustomLoader } from "../Components/CustomLoader";
import { SalesFunnel } from "./SalesFunnel";
import { Popup } from "../Components/Popup";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
} from "recharts";

export const LeadDashboardView = () => {
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [funnelDataByID, setFunnelDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  useEffect(() => {
    getAllTaskDetails();
    geCustomerDetails();
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

  const geCustomerDetails = async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getCustomerDashboard();
      console.log("response", response);
      const Data = [
        {
          label: "Active",
          value: response.data.active_customers,
        },
        {
          label: "Dead",
          value: response.data.dead_customers,
        },
        {
          label: "New",
          value: response.data.new_customers,
        },
        {
          label: "Total",
          value: response.data.total_customers,
        },
      ];
      setBarChartData(Data);
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
    width: "100%",
    minHeight: "300px",
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

  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"];

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
              <div
                key={index}
                className="chartSegment"
                style={{
                  backgroundColor: paletteColors[index % paletteColors.length],
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
            ))}
          </div>
        </div>
        <div style={chartContainerStyle}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={barChartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120} // Increase the outerRadius for a larger pie chart
                fill="#8884d8"
                labelLine={false} // Disable the default label line
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`${barChartData[index].label} (${barChartData[index].value})`}
                    </text>
                  );
                }}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
              <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                Customer Stats
              </text>
            </PieChart>
          </ResponsiveContainer>
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
