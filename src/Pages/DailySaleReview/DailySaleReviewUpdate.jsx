import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
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

const generateListItem = (label, value, maxValue) => {
  return (
    <ListItem key={label}>
      <ListItemText primary={label} />
      <ListItemSecondaryAction>
        <Typography variant="caption">{value}</Typography>
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
    <TableContainer>
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

  // ... your component code ...

  console.log("recordForEdit", JSON.stringify(recordForEdit, null, 2));
  const { daily_sales_review: reviewData = {} } = recordForEdit || {};
  console.log("reviewData", JSON.stringify(reviewData, null, 2));

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
                    generateListItem(key.replace(/_/g, " "), value) // Assuming a default max value of 10
                )
              ) : (
                <Typography>No Customer Data Available</Typography>
              )}
            </List>
          </GridItemCard>

          <GridItemCard title="Call Performance Overview" xs={12} sm={6} lg={4}>
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
            {Object.entries(reviewData.no_order_customer).map(
              ([timeRange, count]) => (
                <Box key={timeRange} mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {timeRange.replace(/_/g, " ")}
                  </Typography>
                  {/* <LinearProgress
                variant="determinate"
                value={(count / maxCount) * 100}
                style={{ height: 10, borderRadius: 5, marginBottom: 4 }}
              /> */}
                  <Typography variant="caption">{`Count: ${count}`}</Typography>
                </Box>
              )
            )}
          </GridItemCard>

          <GridItemCard title="PI Summary" xs={12} sm={6} lg={4}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Drop"
                  secondary={reviewData.pi_summary.drop}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Month Drop"
                  secondary={reviewData.pi_summary.month_drop}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Raised"
                  secondary={reviewData.pi_summary.raised}
                />
              </ListItem>
            </List>
          </GridItemCard>

          <GridItemCard title="Follow-up Summary" xs={12} sm={6} lg={4}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Overdue Follow-up"
                  secondary={reviewData.followup_summary.overdue_followup}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Overdue Task"
                  secondary={reviewData.followup_summary.overdue_task}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Today"
                  secondary={reviewData.followup_summary.today}
                />
              </ListItem>
            </List>
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
            <List>
              <ListItem>
                <ListItemText
                  primary="Last Month"
                  secondary={reviewData.new_customer_summary.last_month}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Month"
                  secondary={reviewData.new_customer_summary.month}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sales Invoice"
                  secondary={reviewData.new_customer_summary.sales_invoice}
                />
              </ListItem>
            </List>
          </GridItemCard>
          <GridItemCard title="Top Customers" xs={12} sm={6} lg={4}>
            <List>
              {reviewData.length && reviewData.top_customer ? (
                reviewData.top_customer.map((customer, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Customer: ${customer.customer}`}
                      secondary={
                        <span>
                          {`Amount: ${customer.amount}`}
                          <br />
                          {`Billed This Month: ${
                            customer.is_billed_this_month ? "Yes" : "No"
                          }`}
                        </span>
                      }
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
              {reviewData.length && reviewData.top_forecast_customer ? (
                reviewData.top_forecast_customer.map(
                  (forecastCustomer, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Customer: ${forecastCustomer.customer}`}
                        secondary={
                          <span>
                            {`Amount: ${forecastCustomer.amount}`}
                            <br />
                            {`Billed This Month: ${
                              forecastCustomer.is_billed_this_month
                                ? "Yes"
                                : "No"
                            }`}
                          </span>
                        }
                      />
                    </ListItem>
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
