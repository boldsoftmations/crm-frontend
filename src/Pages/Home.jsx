import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { experimentalStyled as styled } from "@mui/material/styles";
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
import {
  Autocomplete,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LeadServices from "../services/LeadService";
import DashboardService from "../services/DashboardService";
import { Popup } from "../Components/Popup";
import { SalesFunnel } from "./SalesFunnel";
import { DispatchData } from "./DispatchData";
import { CustomLoader } from "../Components/CustomLoader";
import InvoiceServices from "../services/InvoiceService";

export const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [horizontalBarData, setHorizontalBarData] = useState([]);
  const [newCustomerData, setNewCustomerData] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [pendingFollowup, setPendingFollowup] = useState([]);
  const [pendingDescription, setPendingDescription] = useState([]);
  const [piData, setPiData] = useState([]);
  const [funnelDataByID, setFunnelDataByID] = useState(null);
  const [dispatchDataByID, setDispatchDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  // const userData = data.profile;
  useEffect(() => {
    getAllTaskDetails();
    getCustomerDetails();
    getAssignedData();
    getAllDispatchData();
    getNewCustomerDetails();
    getPendingTaskDetails();
    getPendingFollowupDetails();
    getPIDetails();
    getPendingDescriptionDetails();
  }, []);

  useEffect(() => {
    getForecastDetails();
  }, [userData]);

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
      const users = userData !== null ? userData.is_staff : "";
      const forecastResponse = users
        ? await DashboardService.getConsLastThreeMonthForecastData()
        : await DashboardService.getLastThreeMonthForecastData();
      const Data = Object.keys(forecastResponse.data).flatMap((key) => {
        return forecastResponse.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
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
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
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
          label: "Activity",
          value: response.data.atleast_one_activity,
        },
        {
          label: "No Activity",
          value: response.data.no_activity,
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
          label: "Upcoming FollowUp",
          value: response.data.upcoming_followups,
        },
        {
          label: "Today FollowUp",
          value: response.data.todays_follow_ups,
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

  const getPendingDescriptionDetails = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getDescriptionWisePendingQuantityData();
      const Data = response.data.map((item) => {
        return {
          label: item.product__description__name,
          value: item.total_pending_quantity,
        };
      });
      setPendingDescription(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const handleAutocompleteChange = (value) => {
    setFilterValue(value);
    setAssign(value);
    getDataByFilter(value);
    getNewCustomerByFilter(value);
    getPendingTaskByFilter(value);
    getPendingFollowupByFilter(value);
    getPIByFilter(value);
    getCustomerByFilter(value);
    geTaskByFilter(value);
    getPendingDescriptionByFilter(value);
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
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
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
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
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
          label: "Activity",
          value: response.data.atleast_one_activity,
        },
        {
          label: "No Activity",
          value: response.data.no_activity,
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
          label: "Upcoming FollowUp",
          value: response.data.upcoming_followups,
        },
        {
          label: "Today FollowUp",
          value: response.data.todays_follow_ups,
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

  const getPendingDescriptionByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getDescriptionWisePendingQuantityDataByFilter(
          FilterData
        );
      const Data = response.data.map((item) => {
        return {
          label: item.product__description__name,
          value: item.total_pending_quantity,
        };
      });
      setPendingDescription(Data);

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

  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#ffbb00",
    "#ff7f50",
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
      {/* filter by sales person */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          margin: "30px",
          padding: "20px",
        }}
      >
        {/* Filter By Sales Person */}
        <Grid container spacing={1}>
          <Grid item xs={9} sm={9} md={9} lg={9}>
            <Autocomplete
              sx={{}}
              size="small"
              onChange={(event, value) => handleAutocompleteChange(value)}
              value={assign}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Filter By Sales Person" />
              )}
            />
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <Button variant="contained" color="primary" onClick={getResetData}>
              Reset
            </Button>
          </Grid>
        </Grid>
        {/* Customer Stats */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {pieChartData.map((data, index) => {
            let percentage = 0;
            if (total !== 0) {
              percentage = (data.value / total) * 100;
            }

            return (
              <Grid
                item
                xs={1}
                sm={2}
                md={3}
                lg={3}
                key={index}
                sx={{ marginTop: "20px" }}
              >
                <Item
                  sx={{
                    backgroundColor: COLORS[index % COLORS.length],
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {data.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {data.value}
                  </Typography>
                  <Box sx={{ width: "100%", marginTop: "10px" }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{ backgroundColor: "#ccc" }}
                    />
                  </Box>
                </Item>
              </Grid>
            );
          })}
        </Grid>
        {/* actual vs forecast and new customer bar chart */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
              <BarChart
                data={barChartData}
                margin={{ bottom: 30, left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="combination"
                  tick={{ fontSize: 15 }}
                  interval={0} // Display all labels without interval
                  angle={-45} // Rotate the labels for better visibility
                  textAnchor="end" // Align the labels at the end of the tick
                  height={80} // Increase the height of the XAxis to provide more space for labels
                />
                <YAxis />
                <Tooltip />
                <Legend style={{ marginTop: 20 }} />
                <Bar
                  dataKey="actual"
                  name="Actual"
                  fill="#8884d8"
                  minPointSize={20}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="forecast"
                  name="Forecast"
                  fill="#82ca9d"
                  minPointSize={20}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width={"100%"}
              height={400}
              preserveAspectRatio={false}
            >
              <BarChart data={newCustomerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="combination"
                  tick={{ fontSize: 15 }}
                  interval={0} // Display all labels without interval
                  angle={-45} // Rotate the labels for better visibility
                  textAnchor="end" // Align the labels at the end of the tick
                  height={80} // Increase the height of the XAxis to provide more space for labels
                />
                <YAxis />
                <Tooltip />
                <Legend style={{ marginTop: 20 }} />
                <Bar
                  dataKey="count"
                  name="New Customer"
                  fill="#8884d8"
                  minPointSize={20}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
        {/* pod vs lr bar chart and Task pie chart   */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
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
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
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
                        {`${pendingTask[index].value}`}
                      </text>
                    );
                  }}
                >
                  {pendingTask.map((entry, index) => (
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
                  Pending Tasks
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
        {/* Pending follwup and pi data pie chart */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
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
                        fontSize={12} // Adjust the font size as needed
                      >
                        {`${pendingFollowup[index].value}`}
                      </text>
                    );
                  }}
                >
                  {pendingFollowup.map((entry, index) => (
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
                  Pending FollowUp
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
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
                        {`${piData[index].value}`}
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
          </Grid>
        </Grid>
        {/* sales funnel */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
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
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
            <ResponsiveContainer
              width="100%"
              height={400}
              preserveAspectRatio={false}
            >
              <PieChart>
                <Pie
                  data={pendingDescription}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={120} // Increase the outerRadius for a larger pie chart
                  fill={COLORS[0]} // Set the first color from COLORS array
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
                        {`${pendingDescription[index].value}`}
                      </text>
                    );
                  }}
                >
                  {pendingDescription.map((entry, index) => {
                    return (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]} // Set color based on index
                      />
                    );
                  })}
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
                  Peding Description
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Box>
      <Popup
        maxWidth={"xl"}
        title={"View Leads dashboard"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <SalesFunnel
          funnelDataByID={funnelDataByID}
          setOpenPopup={setOpenPopup}
          AssignedTo={filterValue}
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

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
