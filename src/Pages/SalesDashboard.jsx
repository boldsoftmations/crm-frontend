import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import { CustomChart } from "../Components/CustomChart";

export const SalesDashboard = (props) => {
  const {
    barChartData,
    pieChartData,
    newCustomerData,
    pendingTask,
    pendingFollowup,
    pendingDescription,
    monthlyStatus,
    weeklyStatus,
    dailyStatus,
    handleSegmentHover,
    total,
    handlePieChartClick,
    handlePendingFollowup,
    piData,
    funnelData,
    hoveredSegment,
    handleRowClick,
    descriptionQuantity,
    callPerformance,
    dailyInvoiceQuantity,
    dailyOrderBookQuantity,
    startDate,
    endDate,
    handleStartDateChange,
    handleEndDateChange,
    minDate,
    maxDate,
    getReset,
  } = props;

  const [dIQdata, setDIQData] = useState();
  const [dOBQdata, setDOBQData] = useState();
  const descriptionOptionsForInvoice = dailyInvoiceQuantity.flatMap((entry) =>
    Object.keys(entry)
  );

  const descriptionOptionsForOrderBook = dailyOrderBookQuantity.flatMap(
    (entry) => Object.keys(entry)
  );
  console.log("barChartData", barChartData);
  const handleDataForInvoice = (value) => {
    // Filter the dailyInvoiceQuantity data based on the selected option
    const filteredData = dailyInvoiceQuantity
      .filter((entry) => entry.hasOwnProperty(value))
      .map((entry) => entry[value]);

    // Store the filtered data in the dIQdata state variable
    setDIQData(filteredData[0]);
  };

  const handleDataForOrderBook = (value) => {
    // Filter the dailyInvoiceQuantity data based on the selected option
    const filteredData = dailyOrderBookQuantity
      .filter((entry) => entry.hasOwnProperty(value))
      .map((entry) => entry[value]);
    // Store the filtered data in the dIQdata state variable
    setDOBQData(filteredData[0]);
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
    "#ff69b4",
    "#ba55d3",
    "#cd5c5c",
    "#ffa500",
    "#adff2f",
    "#008080",
  ];

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

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        margin: "30px",
        padding: "20px",
      }}
    >
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
      {/* actual vs forecast and new customer bar chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="ColumnChart"
            data={[
              ["Combination", "Actual", "Forecast"],
              ...barChartData.map((item) => [
                item.combination,
                Number(item.actual),
                Number(item.forecast),
              ]),
            ]}
            options={{
              title: "Actual vs Forecast (Quantity)",
              width: "100%",
              height: "300px",
            }}
            widthStyle="100%"
            heightStyle="300px"
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="LineChart"
            data={[
              ["Combination", "Count"],
              ...newCustomerData.map((item) => [item.combination, item.count]),
            ]}
            options={{
              title: "New Customer",
              width: "100%",
              height: "300px",
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="PieChart"
            data={[
              ["Label", "Value"],
              ...pendingTask.map((item) => [item.label, item.value]),
            ]}
            options={{
              title: "Pending Task",
              width: "100%",
              height: "300px",
              pieHole: 0.4,
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
      </Grid>
      {/* pod vs lr bar chart and Task pie chart   */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="BarChart"
            data={[
              ["Label", "Value"],
              ...pendingFollowup.map((item) => [item.label, item.value]),
            ]}
            options={{
              title: "Pending Follow-Up",
              width: "100%",
              height: "300px",
              legend: { position: "none" },
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType={"PieChart"}
            data={[
              ["Label", "Value"],
              ...piData.map((item) => [item.label, item.value]),
            ]}
            options={{
              title: "PI Data",
              width: "100%",
              height: "300px",
              pieHole: 0.4,
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
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
        </Grid>
      </Grid>
      {/* Pending follwup and pi data pie chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="ColumnChart"
            data={[
              ["Month", "Existing Lead", "New Lead", "Customer"],
              ...monthlyStatus.map((item) => [
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
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="LineChart"
            data={[
              ["Week", "Existing Lead", "New Lead", "Customer"],
              ...weeklyStatus.map((item) => [
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
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="ColumnChart"
            data={[
              ["Day", "Existing Lead", "New Lead", "Customer"],
              ...dailyStatus.map((item) => [
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
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="BarChart"
            data={[
              ["Product Description", "Pending Quantity"],
              ...pendingDescription.map((item) => [item.name, item.value]),
            ]}
            options={{
              title: "Pending Quantity by Description",
              width: "100%",
              height: "400px",
              legend: { position: "none" },
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ marginTop: "20px" }}>
          <CustomChart
            chartType="PieChart"
            data={[
              ["Product Description", "Quantity"],
              ...descriptionQuantity.map((item) => [item.name, item.value]),
            ]}
            options={{
              title: "Description Wise Sales Quantity",
              width: "100%",
              height: "400px",
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "20px" }}>
          <div>
            <TextField
              width="100%"
              sx={{ marginRight: "10px" }}
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
            <TextField
              width="100%"
              sx={{ marginRight: "10px" }}
              label="End Date"
              variant="outlined"
              size="small"
              type="date"
              id="end-date"
              value={endDate ? endDate.toISOString().split("T")[0] : ""}
              min={startDate ? startDate.toISOString().split("T")[0] : minDate}
              max={maxDate}
              onChange={handleEndDateChange}
              disabled={!startDate}
            />
            <Button variant="contained" color="primary" onClick={getReset}>
              Reset
            </Button>
          </div>
          <CustomChart
            chartType="BarChart"
            data={[
              ["Call Category", "Value"],
              ...callPerformance.map((item) => [item.name, item.value]),
            ]}
            options={{
              title: "Call Performance",
              width: "100%",
              height: "400px",
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
      </Grid>

      {/* Daily Sales Invoice Quantity */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <Autocomplete
            sx={{}}
            size="small"
            onChange={(event, value) => handleDataForInvoice(value)}
            options={descriptionOptionsForInvoice.map((option) => option)}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Filter By Description" />
            )}
          />
          <CustomChart
            chartType="LineChart"
            data={[
              ["Date", "Total"],
              ...((dIQdata &&
                dIQdata.map((entry) => [
                  entry.sales_invoice__generation_date,
                  entry.total,
                ])) ||
                []),
            ]}
            options={{
              title: "Daily Sales Invoice Quantity",
              width: "100%",
              height: "400px",
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ marginTop: "20px" }}>
          <Autocomplete
            sx={{}}
            size="small"
            onChange={(event, value) => handleDataForOrderBook(value)}
            options={descriptionOptionsForOrderBook.map((option) => option)}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Filter By Description" />
            )}
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
              title: "Daily Sales OrderBook Quantity",
              width: "100%",
              height: "400px",
            }}
            widthStyle={"100%"}
            heightStyle={"300px"}
          />
        </Grid>
      </Grid>
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
