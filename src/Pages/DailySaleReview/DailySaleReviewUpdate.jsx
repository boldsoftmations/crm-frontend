import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { CustomChart } from "../../Components/CustomChart";
import {
  callPerformanceChartOptions,
  chartOptions,
  noOrderCustomerChartOptions,
  prepareCallPerformanceChartData,
  prepareFollowupSummaryChartData,
  prepareNewCustomerSummaryChartData,
  prepareNoOrderCustomerChartData,
  preparePiSummaryChartData,
} from "./chartDataPreparers";
import UserProfileService from "../../services/UserProfileService";
import { CustomLoader } from "../../Components/CustomLoader";

const generateListItem = (label, value, maxValue) => {
  const theme = useTheme();
  const progress = (value / (maxValue || 10)) * 100; // Fallback to 10 if maxValue is undefined

  return (
    <ListItem key={label}>
      <ListItemText primary={label} />
      <ListItemSecondaryAction>
        <LinearProgress
          variant="determinate"
          value={progress}
          style={{ width: "100%", marginRight: theme.spacing(2) }}
        />
        <Typography variant="caption">{`${value}/${maxValue}`}</Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const GridItemCard = ({ title, children, xs, sm, lg }) => (
  <Grid item xs={xs} sm={sm} lg={lg}>
    <Card raised>
      <CardContent>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <Divider light />
        {children}
      </CardContent>
    </Card>
  </Grid>
);

const CallPerformanceTable = ({ callPerformanceData }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Today</TableCell>
            <TableCell align="right">Last 7 Days</TableCell>
            <TableCell align="right">Month</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(callPerformanceData).map(([key, values]) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {key.replace(/_/g, " ")}
              </TableCell>
              <TableCell align="right">{values.today}</TableCell>
              <TableCell align="right">{values.last_7_days}</TableCell>
              <TableCell align="right">{values.month}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PendingPaymentsCard = ({ payment }) => {
  const theme = useTheme();

  return (
    <Card style={{ margin: theme.spacing(1) }}>
      <CardContent>
        <Typography variant="h6">{payment.customer || "N/A"}</Typography>
        <Typography color="textSecondary">Amount: {payment.amount}</Typography>
        <Typography color="textSecondary">Date: {payment.date}</Typography>
        <Typography color="textSecondary">
          PI Number: {payment.pi_number}
        </Typography>
        <Typography color="textSecondary">Status: {payment.status}</Typography>
      </CardContent>
    </Card>
  );
};

export const DailySaleReviewUpdate = ({ recordForEdit }) => {
  const theme = useTheme();
  console.log("recordForEdit", recordForEdit);
  // useMemo hooks for preparing chart data
  const callPerformanceChartData = useMemo(() => {
    return recordForEdit ? prepareCallPerformanceChartData(recordForEdit) : [];
  }, [recordForEdit]);

  const noOrderCustomerChartData = useMemo(() => {
    return recordForEdit ? prepareNoOrderCustomerChartData(recordForEdit) : [];
  }, [recordForEdit]);

  const piSummaryChartData = useMemo(() => {
    return recordForEdit
      ? preparePiSummaryChartData(recordForEdit.pi_summary || {})
      : [];
  }, [recordForEdit]);

  const followupSummaryChartData = useMemo(() => {
    return recordForEdit
      ? prepareFollowupSummaryChartData(recordForEdit.followup_summary || {})
      : [];
  }, [recordForEdit]);

  const newCustomerSummaryChartData = useMemo(() => {
    return recordForEdit
      ? prepareNewCustomerSummaryChartData(
          recordForEdit.new_customer_summary || {}
        )
      : [];
  }, [recordForEdit]);

  // Helper function to convert objects to an array of objects
  const convertObjectToArray = (obj) =>
    Object.entries(obj).map(([key, value]) => ({
      key,
      value: Number(value) || 0, // Ensure values are numbers and default to 0 if not
    }));

  // Safely access top_customer array from recordForEdit or default to an empty array
  const topCustomers =
    recordForEdit && recordForEdit.top_customer
      ? recordForEdit.top_customer
      : [];

  // Safely access top_forecast_customer array from recordForEdit or default to an empty array
  const topForecastCustomers =
    recordForEdit && recordForEdit.top_forecast_customer
      ? recordForEdit.top_forecast_customer
      : [];

  const pendingPayments =
    recordForEdit && Array.isArray(recordForEdit.pending_payments)
      ? recordForEdit.pending_payments
      : [];

  // Max amounts
  const maxTopCustomerAmount = Math.max(...topCustomers.map((c) => c.value), 0);
  const maxTopForecastCustomerAmount = Math.max(
    ...topForecastCustomers.map((c) => c.value),
    0
  );

  // Assuming recordForEdit.existing_customer is an object with numeric values
  const maxCustomerValue = Math.max(
    0,
    ...Object.values(recordForEdit ? recordForEdit.existing_customer : {})
  );

  return (
    <div style={{ padding: theme.spacing(3) }}>
      <Grid container spacing={3}>
        <GridItemCard title="Customer Overview" xs={12} sm={6} lg={4}>
          <List>
            {recordForEdit && recordForEdit.existing_customer ? (
              Object.entries(recordForEdit.existing_customer).map(
                ([key, value]) =>
                  generateListItem(
                    key.replace(/_/g, " "),
                    value,
                    maxCustomerValue
                  ) // Assuming a default max value of 10
              )
            ) : (
              <Typography>No Customer Data Available</Typography>
            )}
          </List>
        </GridItemCard>

        <GridItemCard title="Call Performance Overview" xs={12} sm={6} lg={4}>
          <CallPerformanceTable
            callPerformanceData={recordForEdit.call_performance}
          />
        </GridItemCard>

        <GridItemCard title="No Order Customer Overview" xs={12} lg={4}>
          <CustomChart
            chartType="BarChart"
            data={noOrderCustomerChartData}
            options={noOrderCustomerChartOptions}
            heightStyle="100%"
          />
        </GridItemCard>

        <GridItemCard title="PI Summary" xs={12} sm={6} lg={4}>
          <CustomChart
            chartType="PieChart"
            data={piSummaryChartData}
            options={chartOptions}
          />
        </GridItemCard>

        <GridItemCard title="Follow-up Summary" xs={12} sm={6} lg={4}>
          <CustomChart
            chartType="LineChart"
            data={followupSummaryChartData}
            options={chartOptions}
          />
        </GridItemCard>
        {/* Pending Payments */}
        <GridItemCard title="Pending Payments" xs={12}>
          {pendingPayments.map((payment, index) => (
            <PendingPaymentsCard key={index} payment={payment} />
          ))}
        </GridItemCard>
        <GridItemCard title="New Customer Summary" xs={12} sm={6} lg={4}>
          <CustomChart
            chartType="ColumnChart"
            data={newCustomerSummaryChartData}
            options={chartOptions}
          />
        </GridItemCard>
        <GridItemCard title="Top Customers" xs={12} sm={6} lg={4}>
          <List>
            {topCustomers.length ? (
              topCustomers.map((customer, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Customer: ${customer.customer}`}
                    secondary={`Amount: ${customer.amount}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No Top Customer Data Available</Typography>
            )}
          </List>
        </GridItemCard>

        <GridItemCard title="Top Forecast Customers" xs={12} sm={6} lg={4}>
          <List>
            {topForecastCustomers.length ? (
              topForecastCustomers.map((forecastCustomer, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Customer: ${forecastCustomer.customer}`}
                    secondary={`Forecast Amount: ${forecastCustomer.amount}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No Top Forecast Customer Data Available</Typography>
            )}
          </List>
        </GridItemCard>
      </Grid>
    </div>
  );
};
