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
  prepareTodayProductPiChartData,
  prepareApprovePiChartData,
  preparePendingOrdersChartData,
  prepareForecastChartData,
  prepareInvoiceGroupedBarChartData,
  approvePiChartOptions,
  forecastChartOptions,
  pendingOrdersChartOptions,
  todayProductPiChartOptions,
  InvoiceChartOptions,
} from "./chartDataPreparers";
import { G } from "@react-pdf/renderer";

function generateListItem(primaryText, value, theme) {
  return (
    <ListItem>
      <ListItemText primary={primaryText} />
      <ListItemSecondaryAction>
        <LinearProgress
          variant="determinate"
          value={100}
          size={20}
          color="primary"
        />
        <Typography variant="caption" style={{ marginLeft: theme.spacing(1) }}>
          {value}
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export const DailySaleReviewUpdate = ({ recordForEdit }) => {
  const theme = useTheme();

  // useMemo hooks for chart data preparation
  const todayProductPiChartData = useMemo(
    () => prepareTodayProductPiChartData(recordForEdit),
    [recordForEdit]
  );
  const approvePiChartData = useMemo(
    () => prepareApprovePiChartData(recordForEdit),
    [recordForEdit]
  );
  const pendingOrdersChartData = useMemo(
    () => preparePendingOrdersChartData(recordForEdit),
    [recordForEdit]
  );
  const forecastChartData = useMemo(
    () => prepareForecastChartData(recordForEdit),
    [recordForEdit]
  );
  const invoiceGroupedBarChartData = useMemo(
    () => prepareInvoiceGroupedBarChartData(recordForEdit),
    [recordForEdit]
  );

  return (
    <div style={{ padding: theme.spacing(3) }}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h4">
            Daily Sales Review - {recordForEdit.date}
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {/* Call and Customer Overview */}
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent style={{ height: "450px" }}>
                <Typography variant="h6" color="primary">
                  Call and Customer Overview
                </Typography>
                <Divider />
                <List>
                  {generateListItem(
                    "Total Calls Answered",
                    recordForEdit.total_answer_count,
                    theme
                  )}
                  {generateListItem(
                    "Assigned Customers",
                    recordForEdit.assigned_customer,
                    theme
                  )}
                  {generateListItem(
                    "Dead Customers",
                    recordForEdit.dead_customer,
                    theme
                  )}
                  {generateListItem(
                    "New Customers This Month",
                    recordForEdit.new_customer,
                    theme
                  )}
                  {generateListItem(
                    "Today's New Customers",
                    recordForEdit.today_new_customer,
                    theme
                  )}
                  {generateListItem(
                    "KYC Incomplete",
                    recordForEdit.incomplete_kyc,
                    theme
                  )}
                  {generateListItem(
                    "Potential Incomplete",
                    recordForEdit.incomplete_potential,
                    theme
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Forecast vs Actual Sales  (in Rs.) */}

          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardContent style={{ height: "450px" }}>
                <Typography variant="h6" color="primary">
                  Forecast vs Actual Sales (in Rs.)
                </Typography>
                <Divider />
                <CustomChart
                  chartType="ComboChart"
                  data={forecastChartData}
                  options={forecastChartOptions}
                  heightStyle="350px"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Invoice Quantity Overview */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Invoice Quantity Overview
                </Typography>
                <Divider />
                <CustomChart
                  chartType="BarChart"
                  data={invoiceGroupedBarChartData}
                  options={InvoiceChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>

          {/*Today's Product PI Financial Overview */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Today's Product PI Financial Overview
                </Typography>
                <Divider />
                <CustomChart
                  chartType="ColumnChart"
                  data={todayProductPiChartData}
                  options={todayProductPiChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Orders */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Pending Orders
                </Typography>
                <Divider />
                <CustomChart
                  chartType="BarChart"
                  data={pendingOrdersChartData}
                  options={pendingOrdersChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>

          {/*  Approved PI Financial Overview */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Approved PI Financial Overview
                </Typography>
                <Divider />
                <CustomChart
                  chartType="ColumnChart"
                  data={approvePiChartData}
                  options={approvePiChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Reporting Manager and Sales Person */}
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Salesperson: {recordForEdit.sales_person_name}
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="subtitle1">
                  Reporting Manager: {recordForEdit.reporting_manager}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
