import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import DashboardService from "../../services/DashboardService";
import { useSelector } from "react-redux";
import CustomerMap from "./DistanceCoveredMap";
import CustomTextField from "../../Components/CustomTextField";
import { CustomLoader } from "../../Components/CustomLoader";
import EmployeesCurrentLocation from "./EmployeesCurrentLocation";

const DashboardCard = ({ title, value, color }) => (
  <Paper
    elevation={4}
    className="dashboard-card"
    style={{
      backgroundColor: color,
      color: "#fff",
    }}
  >
    <Typography variant="subtitle2" fontWeight="bold" sx={{ opacity: 0.9 }}>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold" mt={1}>
      {value}
    </Typography>
  </Paper>
);

export const SalesFieldDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [customerVisitMapData, setCustomerVisitMapData] = useState([]);
  const [employeesCurrentLocation, setEmployeesCurrentLocation] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterPerson, setFilterPerson] = useState("");
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.field_sales_user || [];
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState("Today");
  const [endDate, setEndDate] = useState(currentDate);
  const [startDate, setStartDate] = useState(currentDate); // set default value as current date
  const [visitDate, setVisitDate] = useState(currentDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];

  const fetchDashboardData = async () => {
    try {
      setOpen(true);
      let EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      let StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const res = await DashboardService.getSalesFieldDashboardData(
        filterPerson ? filterPerson : "",
        StartDate,
        EndDate
      );

      setDashboardData(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  const getSalesPersonCustomerVisitMap = async () => {
    try {
      setOpen(true);
      let VisitDate = visitDate ? visitDate.toISOString().split("T")[0] : "";
      const res = await DashboardService.SalesPersonCustomerVisitMap(
        filterPerson ? filterPerson : "",
        VisitDate
      );

      setCustomerVisitMapData(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  const getEmployeesCurrentLocation = async () => {
    try {
      setOpen(true);
      const res = await DashboardService.getEmployeesCurrentLocation();
      setEmployeesCurrentLocation(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (filterPerson) {
      fetchDashboardData();
    }
  }, [filterPerson, startDate, endDate]);

  useEffect(() => {
    if (filterPerson) {
      getSalesPersonCustomerVisitMap();
    }
  }, [filterPerson, visitDate]);

  useEffect(() => {
    getEmployeesCurrentLocation();
  }, []);
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleVisitDateChange = (event) => {
    const date = new Date(event.target.value);
    setVisitDate(date);
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDate(selectedValue);

    const today = new Date();
    let startDate, endDate;

    switch (selectedValue) {
      case "Today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;

      case "Custom Date":
        startDate = new Date(); // Today
        endDate = new Date(); // Now
        endDate.setDate(startDate.getDate() + 1); // Set endDate to tomorrow
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  const getResetDate = () => {
    setStartDate(currentDate);
    setEndDate(currentDate);
    setSelectedDate("Today");
  };

  return (
    <>
      <CustomLoader open={open} />

      <Box p={3} className="fade-in">
        {/* Filter */}
        <Grid container spacing={2} justifyContent="left" mb={2}>
          <Grid item xs={12} sm={6} md={4}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={assigned}
              getOptionLabel={(option) => `${option.name}`}
              onChange={(e, value) => setFilterPerson(value && value.email)}
              label={"Filter By Employee"}
            />
          </Grid>
        </Grid>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="start"
          sx={{ marginTop: "20px" }}
          mb={2}
        >
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel id="date-select-label">Date</InputLabel>
            <Select
              labelId="date-select-label"
              id="date-select"
              label="Date"
              value={selectedDate || ""}
              onChange={handleChange}
              size="small"
            >
              {DateOptions.map((option, i) => (
                <MenuItem key={i} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedDate === "Custom Date" && (
            <React.Fragment>
              <FormControl sx={{ marginRight: 2 }}>
                <CustomTextField
                  fullWidth
                  label="Start Date"
                  variant="outlined"
                  size="small"
                  type="date"
                  id="start-date"
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  min={minDate}
                  max={maxDate}
                  onChange={handleStartDateChange}
                />
              </FormControl>
              <FormControl>
                <CustomTextField
                  fullWidth
                  label="End Date"
                  variant="outlined"
                  size="small"
                  type="date"
                  id="end-date"
                  value={endDate ? endDate.toISOString().split("T")[0] : ""}
                  min={
                    startDate ? startDate.toISOString().split("T")[0] : minDate
                  }
                  max={maxDate}
                  onChange={handleEndDateChange}
                  disabled={!startDate}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={getResetDate}
                sx={{ marginLeft: 2 }}
              >
                Reset
              </Button>
            </React.Fragment>
          )}
        </Box>
        {/* Cards */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Visits"
              value={dashboardData.total_visits}
              color="#8E7DBE"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Completed Visits"
              value={dashboardData.completed_visits}
              color="#5F8B4C"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Distance(km)"
              value={dashboardData.total_distance_km}
              color="#328E6E"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Meeting Minutes"
              value={dashboardData.total_meeting_minutes}
              color="#D91656"
            />
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid item xs={12} sm={12} md={12}>
            <FormControl style={{ marginBottom: "1rem" }}>
              <CustomTextField
                fullWidth
                label="Visit Date"
                variant="outlined"
                size="small"
                type="date"
                id="start-date"
                value={visitDate ? visitDate.toISOString().split("T")[0] : ""}
                onChange={handleVisitDateChange}
              />
            </FormControl>
            <CustomerMap
              customerVisitMapData={customerVisitMapData}
            ></CustomerMap>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid item xs={12} sm={12} md={12}>
            <Box marginBottom={2}>
              <Typography
                style={{
                  color: "#833AB4",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Employees Current Location
              </Typography>
            </Box>
            <EmployeesCurrentLocation
              employeesCurrentLocation={employeesCurrentLocation}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

const DateOptions = [{ value: "Today" }, { value: "Custom Date" }];
