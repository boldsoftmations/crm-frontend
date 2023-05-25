import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import LeadServices from "../services/LeadService";
import { CustomLoader } from "../Components/CustomLoader";
import { SalesFunnel } from "./SalesFunnel";
import { Popup } from "../Components/Popup";
import { Autocomplete, TextField } from "@mui/material";
import InvoiceServices from "../services/InvoiceService";
import { DispatchData } from "./DispatchData";
import DashboardService from "../services/DashboardService";
import { useNavigate } from "react-router-dom";

export const LeadDashboardView = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [horizontalBarData, setHorizontalBarData] = useState([]);
  const [newCustomerData, setNewCustomerData] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [pendingFollowup, setPendingFollowup] = useState([]);
  const [piData, setPiData] = useState([]);
  const [funnelDataByID, setFunnelDataByID] = useState(null);
  const [dispatchDataByID, setDispatchDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  useEffect(() => {
    getAllTaskDetails();
    getCustomerDetails();
    getForecastDetails();
    getAssignedData();
    getAllDispatchData();
    getNewCustomerDetails();
    getPendingTaskDetails();
    getPendingFollowupDetails();
    getPIDetails();
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
      const response = await DashboardService.getLeadDashboard();
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

  const getCustomerDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getCustomerDashboard();
      const Total =
        response.data.active_customers +
        response.data.dead_customers +
        response.data.new_customers;
      setTotal(Total);
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
          value: Total,
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
        ? await DashboardService.getConsLastThreeMonthForecastData()
        : await DashboardService.getLastThreeMonthForecastData();
      const Data = Object.keys(forecastResponse.data).flatMap((key) => {
        return forecastResponse.data[key].map((item) => {
          return {
            combination: `${months[item.month - 1]} - ${item.year}`,
            actual: item.actual,
            forecast: item.total_forecast,
          };
        });
      });

      setBarChartData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getAllDispatchData = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getDispatchDashboardData();
      const Data = [
        { name: "LR-M1", value: response.data.LR_M1, unit: "M1", type: "LR" },
        { name: "LR-M2", value: response.data.LR_M2, unit: "M2", type: "LR" },
        { name: "LR-D1", value: response.data.LR_D1, unit: "D1", type: "LR" },
        {
          name: "POD-M1",
          value: response.data.POD_M1,
          unit: "M1",
          type: "POD",
        },
        {
          name: "POD-M2",
          value: response.data.POD_M2,
          unit: "M2",
          type: "POD",
        },
        {
          name: "POD-D1",
          value: response.data.POD_D1,
          unit: "D1",
          type: "POD",
        },
      ];
      setHorizontalBarData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getNewCustomerDetails = async () => {
    try {
      setOpen(true);
      const newcustomerResponse = await DashboardService.getNewCustomerData();
      const Data = Object.keys(newcustomerResponse.data).flatMap((key) => {
        return newcustomerResponse.data[key].map((item) => {
          return {
            combination: `${months[item.month - 1]} - ${item.year}`,
            count: item.count,
          };
        });
      });

      setNewCustomerData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getPendingTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPendingTaskData();

      const Data = [
        {
          label: "Timely Tasks",
          value: response.data.timely_tasks,
        },
        {
          label: "Overdue Tasks",
          value: response.data.overdue_tasks,
        },
      ];
      setPendingTask(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getPendingFollowupDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPendingFollowupData();

      const Data = [
        {
          label: "Timely FollowUp",
          value: response.data.timely_followups,
        },
        {
          label: "Overdue FollowUp",
          value: response.data.overdue_follow_ups,
        },
      ];

      setPendingFollowup(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getPIDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPIData();
      const Data = [
        {
          label: "Paid PI",
          value: response.data.paid_pi,
        },
        {
          label: "Unpaid PI",
          value: response.data.unpaid_pi,
        },
        {
          label: "Dropped PI",
          value: response.data.dropped_pi,
        },
      ];

      setPiData(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const handleAutocompleteChange = (value) => {
    setAssign(value);
    getDataByFilter(value);
    getNewCustomerByFilter(value);
    getPendingTaskByFilter(value);
    getPendingFollowupByFilter(value);
    getPIByFilter(value);
    getCustomerByFilter(value);
    geTaskByFilter(value);
  };

  const getDataByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const forecastResponse =
        await DashboardService.getLastThreeMonthForecastDataByFilter(
          FilterData
        );
      const Data = Object.keys(forecastResponse.data).flatMap((key) => {
        return forecastResponse.data[key].map((item) => {
          return {
            combination: `${months[item.month - 1]} - ${item.year}`,
            actual: item.actual,
            forecast: item.total_forecast,
          };
        });
      });

      setBarChartData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getNewCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const newcustomerResponse =
        await DashboardService.getNewCustomerDataByFilter(FilterData);
      const Data = Object.keys(newcustomerResponse.data).flatMap((key) => {
        return newcustomerResponse.data[key].map((item) => {
          return {
            combination: `${months[item.month - 1]}  - ${item.year}`,
            count: item.count,
          };
        });
      });

      setNewCustomerData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPendingTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPendingTaskDataByFilter(
        FilterData
      );
      const Data = [
        {
          label: "Timely Tasks",
          value: response.data.timely_tasks,
        },
        {
          label: "Overdue Tasks",
          value: response.data.overdue_tasks,
        },
      ];

      setPendingTask(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPendingFollowupByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPendingFollowupDataByFilter(
        FilterData
      );
      const Data = [
        {
          label: "Timely FollowUp",
          value: response.data.timely_followups,
        },
        {
          label: "Overdue FollowUp",
          value: response.data.overdue_follow_ups,
        },
      ];

      setPendingFollowup(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPIByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPIDataByFilter(FilterData);
      const Data = [
        {
          label: "Paid PI",
          value: response.data.paid_pi,
        },
        {
          label: "Unpaid PI",
          value: response.data.unpaid_pi,
        },
        {
          label: "Dropped PI",
          value: response.data.dropped_pi,
        },
      ];

      setPiData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getCustomerDataByFilter(
        FilterData
      );
      const Total =
        response.data.active_customers +
        response.data.dead_customers +
        response.data.new_customers;
      setTotal(Total);
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
          value: Total,
        },
      ];

      setPieChartData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const geTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getLeadDataByFilter(FilterData);
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
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    getForecastDetails();
    getNewCustomerDetails();
    getPendingTaskDetails();
    getPendingFollowupDetails();
    getCustomerDetails();
    getPIDetails();
    getAllTaskDetails();
    setAssign(null);
  };

  const handlePieChartClick = () => {
    navigate("/task/view-task");
  };

  const handlePendingFollowup = () => {
    navigate("/leads/view-followup");
  };
  const handleRowClick = (row) => {
    setFunnelDataByID(row);
    setOpenPopup(true);
  };

  const handleDispatch = (row) => {
    setDispatchDataByID(row);
    setOpenPopup2(true);
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
      {userData.groups.toString() === "Sales" && (
        <>
          {/* Customer Stats */}
          {pieChartData.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              {pieChartData.map((data, index) => {
                let percentage = 0;
                console.log("data", data);
                console.log("total", total);
                if (total !== 0) {
                  percentage = (data.value / total) * 100;
                }

                return (
                  <div
                    key={index}
                    style={{
                      ...chartContainerStyle,
                      minHeight: "40px",
                      minWidth: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      margin: "0 10px",
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "5px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {data.label}
                    </div>
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      {data.value}
                    </div>
                    <div
                      style={{
                        width: "80%",
                        height: "5px",
                        backgroundColor: "#ccc",
                        marginTop: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          backgroundColor: "#007bff",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={chartContainerStyle}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Actual and forecast bar chart */}
                {barChartData.length > 0 && (
                  <BarChart width={600} height={300} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="combination" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" name="Actual" fill="#8884d8" />
                    <Bar dataKey="forecast" name="Forecast" fill="#82ca9d" />
                    {/* <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                Forecast vs Achieved
              </text> */}
                  </BarChart>
                )}
                {newCustomerData.length > 0 && (
                  <BarChart width={600} height={300} data={newCustomerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="combination" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="New Customer" fill="#8884d8" />

                    {/* <text
                x="50%"
                y={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="chart-title"
              >
                New Customer
              </text> */}
                  </BarChart>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Pie Chart of pending task */}
                {pendingTask.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart onClick={handlePieChartClick}>
                      <Pie
                        data={pendingTask}
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
                              {`${pendingTask[index].label} (${pendingTask[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {pendingTask.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
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
                        Pending Tasks
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* pie chart of pending followups */}
                {pendingFollowup.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart onClick={handlePendingFollowup}>
                      <Pie
                        data={pendingFollowup}
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
                              {`${pendingFollowup[index].label} (${pendingFollowup[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {pendingTask.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
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
                        Pending FollowUp
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* pie chart of pi data */}
                {piData.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart>
                      <Pie
                        data={piData}
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
                              {`${piData[index].label} (${piData[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {piData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]} // Set color based on index
                          />
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
                        PI Data
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Funnel Chart */}
                {funnelData.length > 0 && (
                  <div className="funnelChart" style={funnelStyle}>
                    <h2 style={{ textAlign: "center", color: "#333" }}>
                      Sales Funnel
                    </h2>
                    {funnelData.map((data, index) => (
                      <div
                        key={index}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* filter by sales person */}
      {userData.is_staff === true && (
        <>
          {/* Customer Stats */}
          {pieChartData.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "10px",
              }}
            >
              {pieChartData.map((data, index) => {
                let percentage = 0;
                console.log("data", data);
                console.log("total", total);
                if (total !== 0) {
                  percentage = (data.value / total) * 100;
                }

                return (
                  <div
                    key={index}
                    style={{
                      ...chartContainerStyle,
                      minHeight: "40px",
                      minWidth: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      margin: "0 10px",
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  >
                    <div
                      style={{
                        marginBottom: "5px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {data.label}
                    </div>
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      {data.value}
                    </div>
                    <div
                      style={{
                        width: "80%",
                        height: "5px",
                        backgroundColor: "#ccc",
                        marginTop: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          backgroundColor: "#007bff",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={chartContainerStyle}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "20px",
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Actual and forecast bar chart */}
                {barChartData.length > 0 && (
                  <BarChart width={600} height={300} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="combination" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" name="Actual" fill="#8884d8" />
                    <Bar dataKey="forecast" name="Forecast" fill="#82ca9d" />
                    {/* <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-title"
                >
                  Forecast vs Achieved
                </text> */}
                  </BarChart>
                )}
                {newCustomerData.length > 0 && (
                  <BarChart width={600} height={300} data={newCustomerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="combination" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="New Customer" fill="#8884d8" />

                    {/* <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-title"
                >
                  New Customer
                </text> */}
                  </BarChart>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Horizontal Bar Chart */}
                {horizontalBarData.length > 0 && (
                  <BarChart
                    width={600}
                    height={300}
                    data={horizontalBarData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      barSize={20}
                      onClick={(data) => {
                        // Handle the click event
                        handleDispatch(data);
                        console.log("Bar clicked:", data);
                      }}
                    />
                  </BarChart>
                )}
                {/* Pie Chart of pending task */}
                {pendingTask.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart onClick={handlePieChartClick}>
                      <Pie
                        data={pendingTask}
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
                              {`${pendingTask[index].label} (${pendingTask[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {pendingTask.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
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
                        Pending Tasks
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* pie chart of pending followups */}
                {pendingFollowup.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart onClick={handlePendingFollowup}>
                      <Pie
                        data={pendingFollowup}
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
                              {`${pendingFollowup[index].label} (${pendingFollowup[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {pendingTask.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
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
                        Pending FollowUp
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* pie chart of pi data */}
                {piData.length > 0 && (
                  <ResponsiveContainer width={600} height={400}>
                    <PieChart>
                      <Pie
                        data={piData}
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
                              {`${piData[index].label} (${piData[index].value})`}
                            </text>
                          );
                        }}
                      >
                        {piData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]} // Set color based on index
                          />
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
                        PI Data
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* Funnel Chart */}
                {funnelData.length > 0 && (
                  <div className="funnelChart" style={funnelStyle}>
                    <h2 style={{ textAlign: "center", color: "#333" }}>
                      Sales Funnel
                    </h2>
                    {funnelData.map((data, index) => (
                      <div
                        key={index}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <Popup
        maxWidth={"xl"}
        title={"View Leads dashboard"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesFunnel
          funnelDataByID={funnelDataByID}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={`View ${dispatchDataByID && dispatchDataByID.type} dashboard`}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <DispatchData
          dispatchDataByID={dispatchDataByID}
          setOpenPopup={setOpenPopup2}
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
