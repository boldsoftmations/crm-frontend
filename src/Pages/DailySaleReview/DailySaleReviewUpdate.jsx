import React, { useMemo } from "react";
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

export const DailySaleReviewUpdate = ({ recordForEdit }) => {
  const theme = useTheme();

  // Preparing chart data
  const callPerformanceChartData = useMemo(
    () => prepareCallPerformanceChartData(recordForEdit),
    [recordForEdit]
  );
  const noOrderCustomerChartData = useMemo(
    () => prepareNoOrderCustomerChartData(recordForEdit),
    [recordForEdit]
  );
  const piSummaryChartData = preparePiSummaryChartData(
    recordForEdit.pi_summary
  );
  const followupSummaryChartData = prepareFollowupSummaryChartData(
    recordForEdit.followup_summary
  );
  const newCustomerSummaryChartData = prepareNewCustomerSummaryChartData(
    recordForEdit.new_customer_summary
  );

  // Preparing top customer data
  const topCustomers = recordForEdit.top_customer;
  const maxTopCustomerAmount = Math.max(...topCustomers.map((c) => c.amount));
  // Assuming recordForEdit.existing_customer is an object with numeric values
  const customerValues = Object.values(recordForEdit.existing_customer);
  const maxCustomerValue = Math.max(...customerValues);

  return (
    <div style={{ padding: theme.spacing(3) }}>
      <Grid container spacing={3}>
        <GridItemCard title="Customer Overview" xs={12} sm={6} lg={4}>
          <List>
            {Object.entries(recordForEdit.existing_customer).map(
              ([key, value]) =>
                generateListItem(
                  key.replace(/_/g, " "),
                  value,
                  maxCustomerValue
                ) // Assuming a default max value of 10
            )}
          </List>
        </GridItemCard>

        <GridItemCard title="Call Performance Overview" xs={12} lg={8}>
          <CustomChart
            chartType="ColumnChart"
            data={callPerformanceChartData}
            options={callPerformanceChartOptions}
            heightStyle="100%"
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

        <GridItemCard title="New Customer Summary" xs={12} sm={6} lg={4}>
          <CustomChart
            chartType="ColumnChart"
            data={newCustomerSummaryChartData}
            options={chartOptions}
          />
        </GridItemCard>
        <GridItemCard title="Top Customers" xs={12} sm={6} lg={4}>
          <List>
            {topCustomers.map((c) =>
              generateListItem(c.customer, c.amount, maxTopCustomerAmount)
            )}
          </List>
        </GridItemCard>
      </Grid>
    </div>
  );
};
