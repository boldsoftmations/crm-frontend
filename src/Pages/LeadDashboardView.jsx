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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ProductForecastService from "../services/ProductForecastService";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";

export const LeadDashboardView = () => {
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [funnelDataByID, setFunnelDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  useEffect(() => {
    getAllTaskDetails();
    geCustomerDetails();
    getForecastDetails();
    getAssignedData();
  }, []);

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getLeadDashboard();
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
      setPieChartData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getForecastDetails = async () => {
    try {
      setOpen(true);
      const users = userData.is_staff;
      const forecastResponse = users
        ? await ProductForecastService.getConsLastThreeMonthForecastData()
        : await ProductForecastService.getLastThreeMonthForecastData();
      const Data = forecastResponse.data.map((item) => {
        return {
          combination: `${months[item.month - 1]} - ${item.year}`,
          actual: item.actual,
          forecast: item.total_forecast,
        };
      });

      setBarChartData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const handleAutocompleteChange = (value) => {
    setAssign(value);
    getDataByFilter(value);
  };

  const getDataByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await ProductForecastService.getLastThreeMonthForecastDataByFilter(
          FilterData
        );
      const Data = response.data.map((item) => {
        return {
          combination: `${months[item.month - 1]}  - ${item.year}`,
          actual: item.actual,
          forecast: item.total_forecast,
        };
      });

      setBarChartData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    getForecastDetails();
    setAssign(null);
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
      {userData.is_staff === true && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...chartContainerStyle,
              minHeight: "10px",
              paddingTop: "0px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              style={{
                width: 400,
                marginRight: "10px",
              }}
              size="small"
              onChange={(event, value) => handleAutocompleteChange(value)}
              value={assign}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Filter By Sales Person" />
              )}
            />
            <button className="btn btn-primary" onClick={getResetData}>
              Reset
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={chartContainerStyle}>
          <BarChart width={600} height={400} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="combination" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" name="Actual" fill="#8884d8" />
            <Bar dataKey="forecast" name="Forecast" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

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
                data={pieChartData}
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
                      {`${pieChartData[index].label} (${pieChartData[index].value})`}
                    </text>
                  );
                }}
              >
                {pieChartData.map((entry, index) => (
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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
