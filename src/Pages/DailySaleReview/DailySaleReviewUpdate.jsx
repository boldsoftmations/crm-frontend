import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import jsPDF from "jspdf";
import { DailySalesReviewPDF } from "./DailySalesReviewPDF";
import { pdf } from "@react-pdf/renderer";

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const generateListItem = (label, value, maxValue) => {
  // Capitalize each word in the label
  const capitalizedLabel = capitalizeWords(label);

  // Calculate the percentage
  const percentage = (value / maxValue) * 100;

  return (
    <ListItem key={label}>
      <ListItemText
        primary={capitalizedLabel}
        secondary={<LinearProgress variant="determinate" value={percentage} />}
      />
      <ListItemSecondaryAction>
        <Typography variant="caption">{`${value} (${percentage.toFixed(
          2
        )}%)`}</Typography>
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
  // Calculate totals
  const totals = Object.values(callPerformanceData).reduce(
    (acc, values) => {
      acc.today += values.today;
      acc.last_7_days += values.last_7_days;
      acc.month += values.month;
      return acc;
    },
    { today: 0, last_7_days: 0, month: 0 }
  );

  // Placeholder for additional month info - replace with actual calculation if needed
  const additionalMonthInfo = "Placeholder Info";

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Today</TableCell>
            <TableCell align="right">Last 7 Days</TableCell>
            <TableCell align="right">This Month</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(callPerformanceData).map(([key, values]) => (
            <TableRow key={key}>
              <TableCell component="th" scope="row">
                {capitalizeWords(key.replace(/_/g, " "))}
              </TableCell>
              <TableCell align="right">{values.today}</TableCell>
              <TableCell align="right">{values.last_7_days}</TableCell>
              <TableCell align="right">{values.month}</TableCell>
            </TableRow>
          ))}
          {/* Add a row for totals, with additional month info directly in the same cell */}
          <TableRow>
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell align="right">{totals.today}</TableCell>
            <TableCell align="right">{totals.last_7_days}</TableCell>
            <TableCell align="right">{totals.month}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// General-purpose reusable component for displaying overview items
const OverviewItemCard = ({ label, count }) => (
  <>
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1, // Add padding top and bottom for spacing
      }}
    >
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {count}
      </Typography>
    </CardContent>
    <Divider variant="middle" />
  </>
);

const TopCustomerItemCard = ({ primary, amount, isBilledThisMonth }) => (
  <>
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        py: 1,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {primary}
      </Typography>
      <Typography variant="body2">Amount: {amount}</Typography>
      <Typography variant="body2">
        Billed This Month: {isBilledThisMonth ? "Yes" : "No"}
      </Typography>
    </CardContent>
    <Divider variant="middle" />
  </>
);

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

  // ... your component code ...

  console.log("recordForEdit", JSON.stringify(recordForEdit, null, 2));
  const { daily_sales_review: reviewData = {} } = recordForEdit || {};
  console.log("reviewData", JSON.stringify(reviewData, null, 2));
  const assignedCustomerTotal = reviewData.existing_customer.assigned_customer;
  const entries = Object.entries(reviewData.no_order_customer);
  const totalCount = entries.reduce((acc, [, count]) => acc + count, 0);
  const generatePDF = async () => {
    try {
      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfBlob = await pdf(
        <DailySalesReviewPDF
          recordForEdit={recordForEdit}
          reviewData={reviewData}
        />,
        pdfDoc
      ).toBlob();

      // create a temporary link element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = `sales_review.pdf`;

      // trigger the download
      downloadLink.click();

      // clean up the temporary link element
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.log("Error exporting PDF:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Download as PDF
      </Button>

      <div style={{ padding: theme.spacing(3) }} id="divToPrint">
        <Grid container spacing={3}>
          <GridItemCard title="Customer Overview" xs={12} sm={6} lg={4}>
            <List>
              {reviewData && reviewData.existing_customer ? (
                Object.entries(reviewData.existing_customer).map(
                  ([key, value]) =>
                    generateListItem(
                      key.replace(/_/g, " "),
                      value,
                      assignedCustomerTotal
                    ) // Assuming a default max value of 10
                )
              ) : (
                <Typography>No Customer Data Available</Typography>
              )}
            </List>
          </GridItemCard>

          <GridItemCard title="Call Summary Overview" xs={12} sm={6} lg={4}>
            <CallPerformanceTable
              callPerformanceData={reviewData.call_performance}
            />
          </GridItemCard>

          <GridItemCard
            title="No Order Customer Overview"
            xs={12}
            sm={6}
            lg={4}
          >
            {entries.length > 0 ? (
              entries.map(([label, count]) => (
                <OverviewItemCard
                  key={label}
                  label={capitalizeWords(label.replace(/_/g, " "))}
                  count={count}
                />
              ))
            ) : (
              <Typography variant="subtitle1">
                No Customer Data Available
              </Typography>
            )}
            <Box mt={2} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" color="textPrimary">
                Total Count: {totalCount}
              </Typography>
            </Box>
          </GridItemCard>

          <GridItemCard title="PI Summary" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label="Raised Today"
              count={reviewData.pi_summary.raised}
            />
            <OverviewItemCard
              label="PI Dropped Today"
              count={reviewData.pi_summary.drop}
            />
            <OverviewItemCard
              label="PI Drop This Month"
              count={reviewData.pi_summary.month_drop}
            />
          </GridItemCard>

          <GridItemCard title="Follow-up Summary" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label="New Follow-up Created Today"
              count={reviewData.followup_summary.today}
            />
            <OverviewItemCard
              label="Hot Lead Created Today"
              count={reviewData.followup_summary.today_hot_lead}
            />
            <OverviewItemCard
              label="Follow-up Missed Today"
              count={reviewData.followup_summary.today_missed_followup}
            />
            <OverviewItemCard
              label="Overdue Follow-up"
              count={reviewData.followup_summary.overdue_followup}
            />
            <OverviewItemCard
              label="Overdue Task"
              count={reviewData.followup_summary.overdue_task}
            />
          </GridItemCard>
          {/* Pending Payments */}
          <GridItemCard title="Pending Payments" xs={12}>
            {reviewData &&
              reviewData.pending_payments &&
              reviewData.pending_payments.map((payment, index) => (
                <PendingPaymentsCard key={index} payment={payment} />
              ))}
          </GridItemCard>
          <GridItemCard title="New Customer Summary" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label=" New Customer Last Month"
              count={reviewData.new_customer_summary.last_month}
            />
            <OverviewItemCard
              label="New Customer This Month"
              count={reviewData.new_customer_summary.month}
            />
            <OverviewItemCard
              label="New Customer Billed Today"
              count={reviewData.new_customer_summary.sales_invoice}
            />
          </GridItemCard>
          <GridItemCard title="Call to Conversion Ratio" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label="Lead Count"
              count={reviewData.conversion_ratio.lead_count}
            />
            <OverviewItemCard
              label="New Customer"
              count={reviewData.conversion_ratio.new_customer}
            />
            <OverviewItemCard
              label="Conversion Ratio"
              count={reviewData.conversion_ratio.conversion_ratiof}
            />
          </GridItemCard>
          <GridItemCard title="Top Customers" xs={12} sm={6} lg={4}>
            <List>
              {reviewData.length && reviewData.top_customer ? (
                reviewData.top_customer.map((customer, index) => (
                  <TopCustomerItemCard
                    key={index}
                    primary={`Customer: ${customer.customer}`}
                    amount={customer.amount}
                    isBilledThisMonth={customer.is_billed_this_month}
                  />
                ))
              ) : (
                <Typography>No Top Customer Data Available</Typography>
              )}
            </List>
          </GridItemCard>

          <GridItemCard title="Top Forecast Customers" xs={12} sm={6} lg={4}>
            <List>
              {reviewData.length && reviewData.top_forecast_customer ? (
                reviewData.top_forecast_customer.map(
                  (forecastCustomer, index) => (
                    <TopCustomerItemCard
                      key={index}
                      primary={`Customer: ${forecastCustomer.customer}`}
                      amount={forecastCustomer.amount}
                      isBilledThisMonth={forecastCustomer.is_billed_this_month}
                    />
                  )
                )
              ) : (
                <Typography>No Top Forecast Customer Data Available</Typography>
              )}
            </List>
          </GridItemCard>

          <GridItemCard
            title="Today Missed Customer Order"
            xs={12}
            sm={8}
            lg={6}
          >
            <TableContainer>
              <Table aria-label="Missed Customer Orders">
                <TableHead>
                  <TableRow>
                    <TableCell>Forecast</TableCell>
                    <TableCell>Estimated Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    reviewData.today_missed_customer_order &&
                    reviewData.today_missed_customer_order.map(
                      (order, index) => (
                        <TableRow key={index}>
                          <TableCell>{order.forecast}</TableCell>
                          <TableCell>{order.estimated_date}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.description}</TableCell>
                          <TableCell>{order.product}</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Today Missed Lead Order" xs={12} sm={8} lg={6}>
            <TableContainer>
              <Table aria-label="Missed Customer Orders">
                <TableHead>
                  <TableRow>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Anticipated Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    reviewData.today_missed_lead_order &&
                    reviewData.today_missed_lead_order.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.anticipated_date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.description}</TableCell>
                        <TableCell>{order.product}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Today Lead Estimate Order" xs={12} sm={6} lg={4}>
            {reviewData &&
              reviewData.today_lead_estimate_order &&
              reviewData.today_lead_estimate_order.map((order, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card raised>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        {order.leadcompany || "No Company"}
                      </Typography>
                      <Chip
                        label={order.lead_stage || "No Stage"}
                        color="primary"
                      />
                      <Typography color="textSecondary">
                        Anticipated Date:{" "}
                        {order.anticipated_date || "Not Provided"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </GridItemCard>
          <GridItemCard title="Sales Summary" xs={12} sm={10} lg={8}>
            <TableContainer>
              <Table aria-label="Sales Summary Table">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Forecast Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Sales Quantity</TableCell>
                    <TableCell>Daily Target</TableCell>
                    <TableCell>Today PI</TableCell>
                    <TableCell>Today Sales Invoice</TableCell>
                    <TableCell>Monthly Sales Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    reviewData.sales_summary &&
                    reviewData.sales_summary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.forecast_quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.sales_quantity}</TableCell>
                        <TableCell>{item.daily_target}</TableCell>
                        <TableCell>{item.today_pi.join(", ")}</TableCell>
                        <TableCell>
                          {item.today_sales_invoice.join(", ")}
                        </TableCell>
                        <TableCell>
                          {item.monthly_sales_invoice.join(", ")}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
        </Grid>

        {/* Signature section with underlines */}
        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
          alignItems="center"
        >
          <Box width="50%" textAlign="center">
            <Typography variant="h6">Sales Person</Typography>
            <Box mt={2}>
              <Typography variant="body1">
                {recordForEdit.sales_person}
              </Typography>
            </Box>
            <Box borderBottom={1} width="50%" mx="auto" mt={2}></Box>
          </Box>

          <Box width="50%" textAlign="center">
            <Typography variant="h6">Reviewed By</Typography>
            <Box mt={2}>
              <Typography variant="body1">{recordForEdit.reviewer}</Typography>
            </Box>
            <Box borderBottom={1} width="50%" mx="auto" mt={2}></Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};
