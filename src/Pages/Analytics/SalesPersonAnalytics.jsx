import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { CustomChart } from "../../Components/CustomChart";
import { useSelector } from "react-redux";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CallDashboard from "./CallStatusDashboard";

export const SalesPersonAnalytics = (props) => {
  // Destructuring the props passed to this component
  const {
    barChartData,
    pieChartData,
    newCustomerData,
    CallDashboardData,
    getFollowupCallDashboard,
    pendingFollowup,
    pendingDescription,
    callStatusData,
    filterValue,
    handleSegmentHover,
    handleAutocompleteChange,
    assign,
    total,
    piData,
    indiaMartLeadData,
    funnelData,
    hoveredSegment,
    handleRowClick,
    descriptionQuantity,
    callPerformance,
    dailyInvoiceQuantity,
    dailyOrderBookQuantity,
    handleChange,
    selectedDate,
    handleStartDateChange,
    handleEndDateChange,
    startDate,
    endDate,
    maxDate,
    minDate,
    getResetDate,
    team,
    selectedWeek,
    handleDateChange,
    getMonthyCallStatusData,
  } = props;

  // Retrieving user data from Redux store
  const userData = useSelector((state) => state.auth.profile);
  const [dIQdata, setDIQData] = useState([]);
  const [selectedDIQData, setSelectedDIQData] = useState(null);
  const [dOBQdata, setDOBQData] = useState([]);
  const [selectedDOBQData, setSelectedDOBQData] = useState(null);
  const [activeButton, setActiveButton] = useState("monthly");
  const [activeButtonType, setActiveButtonType] = useState("customer");
  const assigned = userData.active_sales_user || [];
  // Determine if the user has limited privacy rights based on group membership
  const [privacy] = useState(
    !userData.groups.includes("Director") &&
      !userData.groups.includes("Sales Manager") &&
      !userData.groups.includes("Sales Deputy Manager") &&
      !userData.groups.includes("Sales Assistant Deputy Manager") &&
      !userData.groups.includes("Sales Executive") &&
      !userData.groups.includes("Sales Manager without Leads") &&
      !userData.groups.includes("Customer Relationship Executive") &&
      !userData.groups.includes("Customer Relationship Manager") &&
      !userData.groups.includes("Business Development Executive") &&
      !userData.groups.includes("Business Development Manager")
  );
  // Filtering sales users based on the team
  let SALES_PERSON_OPTIONS = assigned;
  if (team) {
    SALES_PERSON_OPTIONS = assigned.filter((user) =>
      [
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Director",
      ].includes(user.groups__name)
    );
  }

  // Mapping sales users to display options
  let displayOptions = SALES_PERSON_OPTIONS.map((option) => {
    return {
      email: option.email,
      primaryGroup: team ? option.groups__name : null,
      name: option.name,
    };
  });

  // Find the currently selected option based on 'assign' prop
  const selectedOption = displayOptions.find(
    (option) => option.email === assign
  );

  // Custom function to sort the display options
  const sortOptions = (a, b) => {
    const order = [
      "Sales Manager",
      "Sales Deputy Manager",
      "Sales Assistant Deputy Manager",
      "Director",
    ];

    const groupOrderA = order.indexOf(a.primaryGroup);
    const groupOrderB = order.indexOf(b.primaryGroup);

    if (groupOrderA < groupOrderB) return -1;
    if (groupOrderA > groupOrderB) return 1;

    // If groups are the same, sort by email
    const emailA = a.email || ""; // Use empty string if a.email is undefined or falsy
    const emailB = b.email || ""; // Use empty string if b.email is undefined or falsy

    return emailA.localeCompare(emailB);
  };

  // Apply sorting to the display options
  displayOptions.sort(sortOptions);

  // Handler function for button clicks
  const handleButtonClick = (buttonType) => {
    if (buttonType === "weekly") {
      getMonthyCallStatusData("weekly", filterValue ? filterValue : "");
    } else if (buttonType === "daily") {
      getMonthyCallStatusData("daily", filterValue ? filterValue : "");
    }
    setActiveButton(buttonType);
  };

  useEffect(() => {
    if (filterValue) {
      getMonthyCallStatusData(activeButton, filterValue);
    } else {
      setActiveButton("monthly");
    }
  }, [filterValue]);

  useEffect(() => {
    if (activeButtonType === "lead") {
      getFollowupCallDashboard(filterValue ? filterValue : "", "lead");
    } else {
      getFollowupCallDashboard(filterValue ? filterValue : "", "customer");
    }
  }, [filterValue, startDate, endDate]);
  const handleButtonType = (btn) => {
    setActiveButtonType(btn);
    if (btn === "lead") {
      getFollowupCallDashboard(filterValue ? filterValue : "", "lead");
    } else {
      getFollowupCallDashboard(filterValue ? filterValue : "", "customer");
    }
  };

  // UseEffect hook to set initial data state for DIQDATA and DOBQDATA
  useEffect(() => {
    if (dailyInvoiceQuantity.length) {
      const firstKey = Object.keys(dailyInvoiceQuantity[0])[0];
      setSelectedDIQData(firstKey); // Set the first option as selected
      setDIQData(dailyInvoiceQuantity[0][firstKey]);
    }
    if (dailyOrderBookQuantity.length) {
      const firstKey = Object.keys(dailyOrderBookQuantity[0])[0];
      setSelectedDOBQData(firstKey); // Set the first option as selected
      setDOBQData(dailyOrderBookQuantity[0][firstKey]);
    }
  }, [dailyInvoiceQuantity, dailyOrderBookQuantity]);

  // Map the dailyInvoiceQuantity to get description options
  const descriptionOptionsForInvoice = dailyInvoiceQuantity.map(
    (entry) => Object.keys(entry)[0]
  );
  // Map the dailyOrderBookQuantity to get description options
  const descriptionOptionsForOrderBook = dailyOrderBookQuantity.map(
    (entry) => Object.keys(entry)[0]
  );

  // Handler function to set data for invoice
  const handleDataForInvoice = (value) => {
    setSelectedDIQData(value); // Update the selected option

    const filteredData = dailyInvoiceQuantity.find((entry) =>
      entry.hasOwnProperty(value)
    );
    if (filteredData && filteredData[value]) {
      setDIQData(filteredData[value]);
    }
  };
  // Handler function to set data for order book
  const handleDataForOrderBook = (value) => {
    setSelectedDOBQData(value); // Update the selected option

    const filteredData = dailyOrderBookQuantity.find((entry) =>
      entry.hasOwnProperty(value)
    );

    if (filteredData && filteredData[value]) {
      setDOBQData(filteredData[value]);
    }
  };

  // Define color palette for charts
  const paletteColors = [
    "#f14c14",
    "#f39c35",
    "#68BC00",
    "#1d7b63",
    "#4e97a8",
    "#4466a3",
  ];

  // Define additional color palette
  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#ffbb00",
    "#ff7f50",
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#adff2f",
    "#008080",
  ];

  // Define text style
  const textStyle = {
    color: "#fff",
    fontWeight: "bold",
  };

  // Define style for funnel graphic
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

  return (
    <Box sx={{ margin: "10px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} sx={{ marginTop: "0px" }}>
          <FormControlLabel
            control={<Switch checked={privacy} disabled />}
            label="Privacy"
          />
        </Grid>
      </Grid>
      {/* Privacy */}
      {privacy ? (
        <div style={{ filter: "blur(4px)" }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ margin: "20px" }}
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
                  <Box
                    sx={{
                      backgroundColor: COLORS[index % COLORS.length],
                      textAlign: "center",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-around"
                    >
                      <Box sx={{ marginTop: "10px" }}>
                        <CircularProgressWithLabel
                          variant="determinate"
                          value={percentage}
                          // sx={{ backgroundColor: "#ccc" }}
                        />
                      </Box>
                      <Box sx={{ marginTop: "10px" }}>
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
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Actual vs Forecast(Quantity)
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType="ColumnChart"
                    data={[
                      ["Combination", "Actual", "Forecast"],
                      ...barChartData.map((item) => [
                        item.combination,
                        item.actual,
                        item.forecast,
                      ]),
                    ]}
                    options={{
                      // title: "Actual vs Forecast(Quantity)",
                      width: "100%",
                      height: "300px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    New Customer Data
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType="LineChart"
                    data={[
                      ["Combination", "Count"],
                      ...newCustomerData.map((item) => [
                        item.combination,
                        item.count,
                      ]),
                    ]}
                    options={{
                      // title: "New Customer Data",
                      width: "100%",
                      height: "300px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      ) : (
        // No Privacy
        <div>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ margin: "20px" }}
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
                  <Box
                    sx={{
                      backgroundColor: COLORS[index % COLORS.length],
                      textAlign: "center",
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-around"
                    >
                      <Box sx={{ marginTop: "10px" }}>
                        <CircularProgressWithLabel
                          variant="determinate"
                          value={percentage}
                          // sx={{ backgroundColor: "#ccc" }}
                        />
                      </Box>
                      <Box sx={{ marginTop: "10px" }}>
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
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Filter By Sales Person */}
          <Grid container spacing={1} sx={{ my: "20px" }}>
            {/* Check if userData.groups does NOT include "Sales Executive" AND does NOT include "Customer Relationship Executive" */}
            {!(
              userData.groups.includes("Sales Executive") ||
              userData.groups.includes("Customer Relationship Executive")
            ) && (
              <Paper sx={{ width: "100%", padding: "20px" }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={9} sm={9} md={9} lg={9}>
                    <CustomAutocomplete
                      size="small"
                      value={selectedOption}
                      onChange={(event, value) =>
                        handleAutocompleteChange(value)
                      }
                      options={displayOptions}
                      groupBy={(option) => option.primaryGroup || ""}
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.email}`
                      }
                      label="Filter By Sales Person"
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* first row */}

          <Grid container spacing={2}>
            <Grid item xs={12} lg={4} md={40}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Actual vs Forecast (Quantity)
                  </Typography>
                  <Divider />
                  {barChartData.length > 0 ? (
                    <CustomChart
                      chartType="ColumnChart"
                      data={[
                        ["Combination", "Actual", "Forecast"],
                        ...barChartData.map((item) => [
                          item.combination,
                          item.actual,
                          item.forecast,
                        ]),
                      ]}
                      options={{
                        width: "100%",
                        height: "300px",
                      }}
                      widthStyle={"100%"}
                      heightStyle={"300px"}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ textAlign: "center", marginTop: "20px" }}
                    >
                      No data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4} md={4}>
              {!(
                userData.groups.includes("Customer Relationship Manager") ||
                userData.groups.includes("Customer Relationship Executive")
              ) && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      New Customer Data
                    </Typography>
                    <Divider />
                    <CustomChart
                      chartType="LineChart"
                      data={[
                        ["Combination", "Count"],
                        ...newCustomerData.map((item) => [
                          item.combination,
                          item.count,
                        ]),
                      ]}
                      options={{
                        // title: "New Customer Data",
                        width: "100%",
                        height: "300px",
                      }}
                      widthStyle={"100%"}
                      heightStyle={"300px"}
                    />
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Pending Follow-Up Data
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType="BarChart"
                    data={[
                      ["Label", "Value"],
                      ...pendingFollowup.map((item) => [
                        item.label,
                        item.value,
                      ]),
                    ]}
                    options={{
                      // title: "Pending Follow-Up Data",
                      width: "100%",
                      height: "300px",
                      legend: { position: "none" },
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* second row */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    PI Data
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType={"PieChart"}
                    data={[
                      ["Label", "Value"],
                      ...piData.map((item) => [item.label, item.value]),
                    ]}
                    options={{
                      width: "100%",
                      height: "300px",
                      pieHole: 0.4,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Sales Funnel
                  </Typography>
                  <Divider />
                  <div className="funnelChart" style={funnelStyle}>
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
                        onClick={() => handleRowClick(data)}
                      >
                        <span style={textStyle}>{data.label}</span>&nbsp;
                        <span style={textStyle}>{data.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Description
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType="PieChart"
                    data={[
                      ["Product Description", "Quantity"],
                      ...descriptionQuantity.map((item) => [
                        item.name,
                        item.value,
                      ]),
                    ]}
                    options={{
                      // title: "Description Wise Sales Quantity",
                      width: "100%",
                      height: "400px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Box
              style={{ marginLeft: "20px", marginTop: "30px", width: "100%" }}
            >
              <Button
                variant={
                  activeButtonType === "customer" ? "contained" : "outlined"
                }
                color="primary"
                size="small"
                onClick={() => handleButtonType("customer")}
              >
                Customer
              </Button>
              {!userData.groups.includes("Customer Relationship Executive") && (
                <Button
                  variant={
                    activeButtonType === "lead" ? "contained" : "outlined"
                  } // Set variant to 'contained' for the active button
                  color="primary"
                  size="small"
                  onClick={() => handleButtonType("lead")}
                  style={{ marginLeft: "20px" }}
                >
                  Lead
                </Button>
              )}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              sx={{ marginLeft: "20px", marginTop: "20px" }}
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
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
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
                        startDate
                          ? startDate.toISOString().split("T")[0]
                          : minDate
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
            <Grid item xs={12} sm={12}>
              {activeButtonType === "customer" && (
                <CallDashboard callDashboardData={CallDashboardData} />
              )}
              {activeButtonType === "lead" && (
                <CallDashboard callDashboardData={CallDashboardData} />
              )}
            </Grid>
          </Grid>
          {userData.groups.includes("Director") && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} sx={{ marginTop: "20px" }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      IndiaMart Leads
                    </Typography>
                    <Divider />
                    <CustomTextField
                      id="date"
                      size="small"
                      label="Date"
                      type="date"
                      value={selectedWeek}
                      onChange={handleDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "300px", marginTop: "10px" }}
                    />

                    <CustomChart
                      chartType="ColumnChart"
                      data={[
                        ["Day", "Total Leads"],
                        ...indiaMartLeadData.map((item) => [
                          item.day,
                          item.totalLeads,
                        ]),
                      ]}
                      options={{
                        // title: "IndiaMart Leads",
                        width: "100%",
                        height: "300px",
                      }}
                      widthStyle={"100%"}
                      heightStyle={"300px"}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {/* third row */}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    OrderBook Pending Quantity by Description
                  </Typography>
                  <Divider />
                  <CustomChart
                    chartType="BarChart"
                    data={[
                      ["Product Description", "Pending Quantity"],
                      ...pendingDescription.map((item) => [
                        item.name,
                        item.value,
                      ]),
                    ]}
                    options={{
                      // title: "OrderBook Pending Quantity by Description",
                      width: "100%",
                      height: "400px",
                      legend: { position: "none" },
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Daily Sales Invoice Quantity
                  </Typography>
                  <Divider />

                  <CustomAutocomplete
                    sx={{ marginTop: "10px" }}
                    size="small"
                    value={selectedDIQData}
                    onChange={(e, data) => handleDataForInvoice(data)}
                    options={descriptionOptionsForInvoice}
                    getOptionLabel={(option) => option}
                    label="Filter By Description"
                  />
                  <CustomChart
                    chartType="LineChart"
                    data={[
                      ["Date", "Total"],
                      ...dIQdata.map((entry) => [
                        entry.sales_invoice__generation_date,
                        entry.total,
                      ]),
                    ]}
                    options={{
                      // title: "Daily Sales Invoice Quantity",
                      width: "100%",
                      height: "400px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Daily Sales OrderBook Quantity
                  </Typography>
                  <Divider />

                  <CustomAutocomplete
                    sx={{ marginTop: "10px" }}
                    size="small"
                    value={selectedDOBQData}
                    onChange={(e, value) => handleDataForOrderBook(value)}
                    options={descriptionOptionsForOrderBook}
                    getOptionLabel={(option) => option}
                    label="Filter By Description"
                  />
                  <CustomChart
                    chartType="LineChart"
                    data={[
                      ["Date", "Total"],
                      ...((dOBQdata &&
                        dOBQdata.map((entry) => [
                          entry.orderbook__proforma_invoice__generation_date,
                          entry.total,
                        ])) ||
                        []),
                    ]}
                    options={{
                      // title: "Daily Sales OrderBook Quantity",
                      width: "100%",
                      height: "400px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* fourth row */}

          <Grid item xs={12} sm={3} sx={{ marginTop: "20px" }}>
            <Button
              variant={activeButton === "monthly" ? "contained" : "outlined"} // Set variant to 'contained' for the active button
              sx={{ margin: "0 10px 10px 0" }}
              color="primary"
              onClick={() => handleButtonClick("monthly")}
            >
              Monthly Call Status
            </Button>
            <Button
              variant={activeButton === "weekly" ? "contained" : "outlined"} // Set variant to 'contained' for the active button
              sx={{ margin: "0 10px 10px 0" }}
              color="primary"
              onClick={() => handleButtonClick("weekly")}
            >
              Weekly Call Status
            </Button>
            <Button
              variant={activeButton === "daily" ? "contained" : "outlined"} // Set variant to 'contained' for the active button
              sx={{ margin: "0 10px 10px 0" }}
              color="primary"
              onClick={() => handleButtonClick("daily")}
            >
              Daily Call Status
            </Button>
            {activeButton === "monthly" && (
              <CustomChart
                chartType="ColumnChart"
                data={[
                  ["Month", "Existing Lead", "New Lead", "Customer"],
                  ...callStatusData.map((item) => [
                    item.combination,
                    item.existing_lead,
                    item.new_lead,
                    item.customer,
                  ]),
                ]}
                options={{
                  title: "Monthly Call Status",
                  width: "100%",
                  height: "400px",
                  isStacked: true,
                  legend: { position: "top" },
                }}
                widthStyle={"100%"}
                heightStyle={"300px"}
              />
            )}
            {activeButton === "weekly" && (
              <CustomChart
                chartType="ColumnChart"
                data={[
                  ["Week", "Existing Lead", "New Lead", "Customer"],
                  ...callStatusData.map((item) => [
                    item.combination,
                    item.existing_lead,
                    item.new_lead,
                    item.customer,
                  ]),
                ]}
                options={{
                  title: "Weekly Call Status",
                  width: "100%",
                  height: "400px",
                  curveType: "function",
                  legend: { position: "top" },
                }}
                widthStyle={"100%"}
                heightStyle={"300px"}
              />
            )}
            {activeButton === "daily" && (
              <CustomChart
                chartType="ColumnChart"
                data={[
                  ["Day", "Existing Lead", "New Lead", "Customer"],
                  ...callStatusData.map((item) => [
                    item.combination,
                    item.existing_lead,
                    item.new_lead,
                    item.customer,
                  ]),
                ]}
                options={{
                  title: "Daily Call Status",
                  width: "100%",
                  height: "400px",
                  legend: { position: "top" },
                }}
                widthStyle={"100%"}
                heightStyle={"300px"}
              />
            )}
          </Grid>
          {/* fifth row */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} sx={{ marginTop: "20px" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Call Performance
                  </Typography>
                  <Divider />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                    sx={{ marginTop: "20px" }}
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
                            value={
                              startDate
                                ? startDate.toISOString().split("T")[0]
                                : ""
                            }
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
                            value={
                              endDate ? endDate.toISOString().split("T")[0] : ""
                            }
                            min={
                              startDate
                                ? startDate.toISOString().split("T")[0]
                                : minDate
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

                  <CustomChart
                    chartType="BarChart"
                    data={[
                      ["Call Category", "Value"],
                      ...callPerformance.map((item) => [item.name, item.value]),
                    ]}
                    options={{
                      // title: "Call Performance",
                      width: "100%",
                      height: "300px",
                    }}
                    widthStyle={"100%"}
                    heightStyle={"300px"}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* sixth row */}
        </div>
      )}
    </Box>
  );
};

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="indeterminate" {...props} size={60} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="#ffffff">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const DateOptions = [{ value: "Today" }, { value: "Custom Date" }];
