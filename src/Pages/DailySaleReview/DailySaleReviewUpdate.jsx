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

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Today</TableCell>
            <TableCell align="right">Last 7 Days Avg</TableCell>
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

export const DailySaleReviewUpdate = ({ recordForEdit }) => {
  const theme = useTheme();

  // ... your component code ...

  console.log("recordForEdit", JSON.stringify(recordForEdit, null, 2));
  const { daily_sales_review: reviewData = {} } = recordForEdit || {};
  console.log("reviewData", JSON.stringify(reviewData, null, 2));
  const {
    call_performance,
    existing_customer,
    followup_summary,
    pi_summary,
    sales_summary,
    new_customer_summary,
    no_order_customer,
    conversion_ratio,
    pending_payments,
    top_customer,
    top_forecast_customer,
    today_missed_lead_order,
    customer_estimated_order,
    today_lead_estimate_order,
    today_missed_customer_order,
    month_on_month_sales,
    whatsapp_summary,
    customer_billed_today,
    pipeline_summary,
  } = reviewData;
  const assignedCustomerTotal = existing_customer.assigned_customer;
  const entries = Object.entries(no_order_customer);
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
              {existing_customer ? (
                Object.entries(existing_customer).map(
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

          <GridItemCard title="Follow-up Summary" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label="New Follow-up Created Today"
              count={followup_summary.today}
            />
            <OverviewItemCard
              label="Hot Lead Created Today"
              count={followup_summary.today_hot_lead}
            />
            <OverviewItemCard
              label="Follow-up Missed Today"
              count={followup_summary.today_missed_followup}
            />
            <OverviewItemCard
              label="Today's Missed Follow-up"
              count={followup_summary.today_missed_forecast}
            />
            <OverviewItemCard
              label="Today's Closed Hot Lead"
              count={followup_summary.today_closed_hot_lead}
            />
            <OverviewItemCard
              label="Overdue Follow-up"
              count={followup_summary.overdue_followup}
            />
            <OverviewItemCard
              label="Overdue Task"
              count={followup_summary.overdue_task}
            />
          </GridItemCard>

          <GridItemCard title="Call Summary Overview" xs={12} sm={6} lg={4}>
            <CallPerformanceTable callPerformanceData={call_performance} />
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
            <OverviewItemCard label="Raised Today" count={pi_summary.raised} />
            <OverviewItemCard
              label="PI Dropped Today"
              count={pi_summary.drop}
            />
            <OverviewItemCard
              label="PI Drop This Month"
              count={pi_summary.month_drop}
            />
          </GridItemCard>

          <GridItemCard title="New Customer Summary" xs={12} sm={6} lg={4}>
            <OverviewItemCard
              label=" New Customer Last Month"
              count={new_customer_summary.last_month}
            />
            <OverviewItemCard
              label="New Customer This Month"
              count={new_customer_summary.month}
            />
            <OverviewItemCard
              label="New Customer Billed Today"
              count={new_customer_summary.sales_invoice}
            />
          </GridItemCard>
          {/* Pending Payments */}
          <GridItemCard title="Pending Payments" xs={12}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Pending Payment Overview">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>PI Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    pending_payments &&
                    pending_payments.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          {order.amount.toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.pi_number}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Top Customer" xs={6}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Top Customer Overview">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Billed This Month</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    top_customer &&
                    top_customer.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          {order.amount.toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{order.is_billed_this_month}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Top Forecast Customer" xs={6}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Top Forecast Customer Overview">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Billed This Month</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    top_forecast_customer &&
                    top_forecast_customer.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          {order.amount.toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{order.is_billed_this_month}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard
            title="Today Missed Customer Order"
            xs={6}
            // sm={8}
            // lg={6}
          >
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
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
                    today_missed_customer_order &&
                    today_missed_customer_order.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.forecast}</TableCell>
                        <TableCell>{order.estimated_date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.description}</TableCell>
                        <TableCell>{order.product}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard
            title="Today Estimate Customer Order"
            xs={6}
            // sm={8}
            // lg={6}
          >
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Estimate Customer Order">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Estimated Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    customer_estimated_order &&
                    customer_estimated_order.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.estimated_date}</TableCell>
                        <TableCell>{order.description}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Today Missed Lead Order" xs={6}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
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
                    today_missed_lead_order &&
                    today_missed_lead_order.map((order, index) => (
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
          <GridItemCard title="Today Lead Estimate Order" xs={6}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Lead Estimate Order">
                <TableHead>
                  <TableRow>
                    <TableCell>Stage</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Anticipated Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    today_lead_estimate_order &&
                    today_lead_estimate_order.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.stage}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.anticipated_date}</TableCell>
                        <TableCell>{order.description}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Sales Summary" xs={12}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Sales Summary Table">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Forecast Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Sales Quantity</TableCell>
                    <TableCell>Daily Target</TableCell>
                    <TableCell>Today PI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales_summary ? (
                    sales_summary.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.forecast_quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.sales_quantity}</TableCell>
                        <TableCell>{item.daily_target}</TableCell>
                        <TableCell>
                          {Array.isArray(item.today_pi) &&
                          item.today_pi.length > 0
                            ? item.today_pi.join(", ")
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <Typography>No Sales Summary Data Available</Typography>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Monthly Sales Chart" xs={12}>
            <TableContainer style={{ maxHeight: "400px", overflow: "auto" }}>
              <Table aria-label="Monthly Sales Overview">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Total Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewData &&
                    month_on_month_sales &&
                    month_on_month_sales.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>
                          {item.total_sales
                            ? item.total_sales.toLocaleString("en-US", {
                                style: "decimal",
                                minimumFractionDigits: 2,
                              })
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GridItemCard>
          <GridItemCard title="Lead to Customer Ratio" xs={4}>
            <OverviewItemCard
              label="Lead Count"
              count={conversion_ratio.lead_count}
            />
            <OverviewItemCard
              label="New Customer"
              count={conversion_ratio.new_customer}
            />
            <OverviewItemCard
              label="Conversion Ratio"
              count={conversion_ratio.conversion_ratio}
            />
          </GridItemCard>
          <GridItemCard title="Whatsapp Summary" xs={4}>
            <OverviewItemCard
              label="Customer Not in WhatsApp Group"
              count={whatsapp_summary.not_customer}
            />
            <OverviewItemCard
              label="Customer Not Having WhatsApp Group"
              count={whatsapp_summary.not_group}
            />
            <OverviewItemCard
              label="Sales Person Not in Group"
              count={whatsapp_summary.not_sale_person}
            />
          </GridItemCard>

          <GridItemCard title="Customer Billing Today" xs={4}>
            <OverviewItemCard
              label="Customer"
              count={
                customer_billed_today &&
                customer_billed_today.order_book__company
                  ? customer_billed_today.order_book__company__name
                  : "N/A"
              }
            />
            <OverviewItemCard
              label="Amount"
              count={
                customer_billed_today && customer_billed_today.amount
                  ? customer_billed_today.amount.toLocaleString("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })
                  : "N/A" // Or any other fallback value you prefer
              }
            />
          </GridItemCard>
          <GridItemCard title="Pipeline Summary" xs={12}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Hot Lead Performance
              </Typography>
              {pipeline_summary &&
                pipeline_summary.hot_lead_performance &&
                Object.entries(pipeline_summary.hot_lead_performance).map(
                  ([key, value]) => (
                    <Typography variant="body2" key={key} sx={{ mb: 1 }}>
                      {`${key
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}: ${value}`}
                    </Typography>
                  )
                )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Lead Pipeline
              </Typography>
              {pipeline_summary &&
                pipeline_summary.lead_pipeline &&
                Object.entries(pipeline_summary.lead_pipeline).map(
                  ([key, value]) => (
                    <Typography variant="body2" key={key} sx={{ mb: 1 }}>
                      {`${key
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}: ${value}`}
                    </Typography>
                  )
                )}
            </CardContent>
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
