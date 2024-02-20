import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  section: {
    marginBottom: 10,
    borderBottomWidth: 1, // Add a border at the bottom
    borderBottomColor: "black", // Border color (you can change it)
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subheading: {
    fontSize: 16, // Adjust the font size here
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  underline: {
    textDecoration: "underline",
  },
  keyValueContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow items to wrap as needed
    justifyContent: "space-between", // Distribute space evenly between the items
    alignItems: "flex-start", // Align items at the start of the container
    marginBottom: 5,
  },
  keyValue: {
    // Adjust width to fit 3 items per row within the container
    width: "33%", // Adjust the width so three items fit in a row
    marginBottom: 5,
    paddingRight: 5, // Add some padding to prevent text from touching the border of the next column
  },
  text: {
    fontSize: 10, // Adjust font size for better fit in the new layout
    marginBottom: 2, // Reduce margin to fit more content
  },

  // Style for the container of the data entry
  dataEntryContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Keep this if you still want wrapping for very long content
    alignItems: "flex-start", // Align items to the start of the container
    marginBottom: 5,
  },

  // Use a monospace font for the invoice numbers
  dataEntryText: {
    fontFamily: "Courier", // This is an example, use a monospace font available in your app
    fontSize: 12,
    marginBottom: 3,
    marginRight: 5, // Add some right margin to each invoice number
  },

  entryContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  // Style for the key label text
  textKey: {
    color: "#666666",
    fontWeight: "bold",
    fontSize: 10, // Adjusted for consistency with the new layout
  },
  textValue: {
    color: "#000000",
    fontSize: 10, // Adjusted for consistency
  },
  // Separate style for the colon to manually add space
  colonStyle: {
    fontSize: 12,
    marginRight: 2, // Space after the colon
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20, // Add space above the signature section
  },
  signatureBlock: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginRight: 10, // Space between the signature blocks
    alignItems: "center", // Align items in the center horizontally
    justifyContent: "center", // Align items in the center vertically
  },
  signatureText: {
    fontSize: 12,
    marginTop: 5, // Space above the email text
    marginBottom: 5, // Space below the email text
    alignSelf: "center", // Center the text element within the block
  },
  emailText: {
    alignSelf: "center", // This ensures the email is centered within the block
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2, // Adjust as needed
  },
  tableCell: {
    flex: 1,
    textAlign: "center", // Center-align the text in each cell
    fontSize: 10, // Adjust font size as needed for readability
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    paddingHorizontal: 2, // Add some padding to prevent text from touching the borders
  },
  // Style for the last cell in a row to avoid the right border
  lastTableCell: {
    borderRightWidth: 0, // Remove the right border for the last cell
  },
  tableHeader: {
    fontWeight: "bold", // Make header text bold
    paddingBottom: 4, // Add padding below the header for space
  },
  tableCellKey: {
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCellValue: {
    fontSize: 12,
    flexWrap: "wrap", // or change to 'nowrap' to prevent wrapping
    marginRight: 2, // spacing between cells
  },
});

export const DailySalesReviewPDF = ({ recordForEdit, reviewData }) => {
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
  } = reviewData;

  const monthTotal =
    (call_performance.new_leads.month || 0) +
    (call_performance.existing_leads.month || 0) +
    (call_performance.existing_customer.month || 0);
  const todayTotal =
    (call_performance.new_leads.today || 0) +
    (call_performance.existing_leads.today || 0) +
    (call_performance.existing_customer.today || 0);
  const last7DaysTotal =
    (call_performance.new_leads.last_7_days || 0) +
    (call_performance.existing_leads.last_7_days || 0) +
    (call_performance.existing_customer.last_7_days || 0);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}

        <Text style={styles.heading}>Sales Review</Text>

        {/* Cusomer Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Existing Customer</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                1) Pending Kyc:{" "}
                {existing_customer ? existing_customer.pending_kyc : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                2) Dead Customer:{" "}
                {existing_customer ? existing_customer.dead_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                3) Billed Customer:{" "}
                {existing_customer ? existing_customer.billed_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                4) Assigned Customer:{" "}
                {existing_customer ? existing_customer.assigned_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                5) Pending Potential:{" "}
                {existing_customer ? existing_customer.pending_potential : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                6) Connected Customer:{" "}
                {existing_customer ? existing_customer.connected_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                7) Not Billed Customer:{" "}
                {existing_customer ? existing_customer.not_billed_customer : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* followup summary Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Follow-up Summary</Text>

          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                New Follow-up Created Today: {followup_summary.today}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Hot Lead Created Today: {followup_summary.today_hot_lead}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Follow-up Missed Today: {followup_summary.today_missed_followup}
              </Text>
            </View>

            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Today's Missed Follow-up:{" "}
                {followup_summary.today_missed_forecast}
              </Text>
            </View>
            {/* Adding the specific text for "Pending KYC" */}
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Today's Closed Hot Lead:
                {existing_customer
                  ? existing_customer.today_closed_hot_lead
                  : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Overdue Follow-up: {followup_summary.overdue_followup}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Overdue Task:
                {existing_customer ? existing_customer.overdue_task : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Call Summary Section  */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Call Summary</Text>

          {/* Header Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Category</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Today</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Last 7 Days Avg</Text>
            </View>
            <View style={[styles.tableCell, styles.lastTableCell]}>
              <Text style={styles.text}>This Month</Text>
            </View>
          </View>

          {/* Month Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.text}>New Leads:</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance ? call_performance.new_leads.today : "0"}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance
                  ? call_performance.new_leads.last_7_days
                  : "0"}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.lastTableCell]}>
              <Text style={styles.text}>
                {call_performance ? call_performance.new_leads.month : "0"}
              </Text>
            </View>
          </View>

          {/* Today Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Existing Leads:</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance ? call_performance.existing_leads.today : "0"}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance
                  ? call_performance.existing_leads.last_7_days
                  : "0"}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.lastTableCell]}>
              <Text style={styles.text}>
                {call_performance ? call_performance.existing_leads.month : "0"}
              </Text>
            </View>
          </View>

          {/* Last 7 Days Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Existing Customer:</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance
                  ? call_performance.existing_customer.today
                  : "0"}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>
                {call_performance
                  ? call_performance.existing_customer.last_7_days
                  : "0"}
              </Text>
            </View>
            <View style={[styles.tableCell, styles.lastTableCell]}>
              <Text style={styles.text}>
                {call_performance
                  ? call_performance.existing_customer.month
                  : "0"}
              </Text>
            </View>
          </View>

          {/* Total Row - Assuming you calculate these totals elsewhere */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.text}>Total:</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>{todayTotal}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.text}>{last7DaysTotal}</Text>
            </View>
            <View style={[styles.tableCell, styles.lastTableCell]}>
              <Text style={styles.text}>{monthTotal}</Text>
            </View>
          </View>
        </View>

        {/* No Order Customer Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>No Order Customer</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                0-30 days: {no_order_customer["0-30_days"]}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                30-59 days: {no_order_customer["30-59_days"]}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                60-89 days: {no_order_customer["60-89_days"]}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                90-119 days: {no_order_customer["90-119_days"]}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Over 120 days: {no_order_customer["over_120_days"]}
              </Text>
            </View>
          </View>
        </View>

        {/* PI Summary Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Pi Summary</Text>

          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                1) Drop: {pi_summary ? pi_summary.drop : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                2) Raised: {pi_summary ? pi_summary.raised : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                3) Month Drop: {pi_summary ? pi_summary.month_drop : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* New Customer Summary Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>New Customer Summary</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                1) Month:{" "}
                {new_customer_summary ? new_customer_summary.month : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                2) Last Month:{" "}
                {new_customer_summary ? new_customer_summary.last_month : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                3) Sales Invoice:{" "}
                {new_customer_summary ? new_customer_summary.sales_invoice : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Pending Payment Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Pending Payment</Text>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              PI Number
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Status
            </Text>
          </View>
          {/* Data Rows for Pending Payments */}
          {pending_payments.map((summary, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{summary.pi_number}</Text>
              <Text style={styles.tableCell}>
                {summary.customer ? summary.customer : "NA"}
              </Text>
              <Text style={styles.tableCell}>{summary.date}</Text>
              <Text style={styles.tableCell}>
                {summary.amount.toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {summary.status}
              </Text>
            </View>
          ))}
        </View>

        {/* lead to customer conversion Ratio Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Lead to Customer Ratio</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Lead Count: {conversion_ratio ? conversion_ratio.lead_count : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                New Customer:{" "}
                {conversion_ratio ? conversion_ratio.new_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                Conversion Ratio:{" "}
                {conversion_ratio ? conversion_ratio.conversion_ratio : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Customer Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Top Customer</Text>

          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Billed This Month
            </Text>
          </View>

          {/* Data Rows for Top Customer */}
          {top_customer.map((customer, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{customer.customer}</Text>
              <Text style={styles.tableCell}>
                {customer.amount.toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {customer.billedThisMonth ? "Yes" : "No"}
              </Text>
            </View>
          ))}
        </View>

        {/* Top Forecast Customer */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Top Forecast Customer</Text>

          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Billed This Month
            </Text>
          </View>

          {/* Data Rows for Top Forecast Customer */}
          {top_forecast_customer.map((customer, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{customer.customer}</Text>
              <Text style={styles.tableCell}>
                {customer.amount.toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {customer.billedThisMonth ? "Yes" : "No"}
              </Text>
            </View>
          ))}
        </View>

        {/* Today Missed Customer Order */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Today Missed Customer Order</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Product</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Forecast</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Description
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Estimated Date
            </Text>
          </View>
          {today_missed_customer_order.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.product}</Text>
              <Text style={styles.tableCell}>
                {order.customer ? order.customer : "NA"}
              </Text>
              <Text style={styles.tableCell}>{order.forecast}</Text>
              <Text style={styles.tableCell}>{order.description}</Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {order.estimated_date}
              </Text>
            </View>
          ))}
        </View>

        {/*Today Customer Estimated Order */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Today Customer Estimated Order</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Description
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Estimated Date
            </Text>
          </View>
          {customer_estimated_order.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {order.customer ? order.customer : "NA"}
              </Text>
              <Text style={styles.tableCell}>{order.quantity}</Text>
              <Text style={styles.tableCell}>{order.description}</Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {order.estimated_date}
              </Text>
            </View>
          ))}
        </View>

        {/* Today Missed Lead Order */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Today Missed Lead Order</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Product</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Forecast</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Description
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Estimated Date
            </Text>
          </View>
          {today_missed_lead_order.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.product}</Text>
              <Text style={styles.tableCell}>
                {order.customer ? order.customer : "NA"}
              </Text>
              <Text style={styles.tableCell}>{order.forecast}</Text>
              <Text style={styles.tableCell}>{order.description}</Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {order.estimated_date}
              </Text>
            </View>
          ))}
        </View>

        {/* Today Lead Estimate Order */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Today Lead Estimate Order</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Product</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Customer</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Forecast</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Description
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Estimated Date
            </Text>
          </View>
          {today_lead_estimate_order.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.product}</Text>
              <Text style={styles.tableCell}>
                {order.customer ? order.customer : "NA"}
              </Text>
              <Text style={styles.tableCell}>{order.forecast}</Text>
              <Text style={styles.tableCell}>{order.description}</Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {order.estimated_date}
              </Text>
            </View>
          ))}
        </View>

        {/* Sales Summary Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Sales Summary</Text>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Description
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Forecast Quantity
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Unit</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Sales Quantity
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Daily Target
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Today PI</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              Today Sales Invoice
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Monthly Sales Invoice
            </Text>
          </View>
          {/* Data Rows for Sales Summary */}
          {sales_summary.map((summary, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{summary.description}</Text>
              <Text style={styles.tableCell}>
                {summary.forecast_quantity.toString()}
              </Text>
              <Text style={styles.tableCell}>{summary.unit}</Text>
              <Text style={styles.tableCell}>
                {summary.sales_quantity.toString()}
              </Text>
              <Text style={styles.tableCell}>
                {summary.daily_target.toString()}
              </Text>
              <Text style={styles.tableCell}>
                {summary.today_sales_invoice.join(", ")}
              </Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {summary.monthly_sales_invoice.join(", ")}
              </Text>
            </View>
          ))}
        </View>

        {/* Monthly sales section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Monthly Sales</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>Month</Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>Year</Text>

            <Text
              style={[
                styles.tableCell,
                styles.lastTableCell,
                styles.tableHeader,
              ]}
            >
              Total Sales
            </Text>
          </View>
          {month_on_month_sales.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.month}</Text>

              <Text style={styles.tableCell}>{order.year}</Text>
              <Text style={[styles.tableCell, styles.lastTableCell]}>
                {order.total_sales.toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          ))}
        </View>

        {/* Whatsapp Summary Section */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Whatsapp Summary</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                1) Customer Not in Group:
                {whatsapp_summary ? whatsapp_summary.not_customer : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                2) Customer Not Having Group:
                {whatsapp_summary ? whatsapp_summary.not_group : 0}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                3) Sales Person Not in Group:
                {whatsapp_summary ? whatsapp_summary.not_sale_person : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* customer billed today */}
        <View style={styles.card}>
          <Text style={styles.subheading}>Customer Billing Today</Text>
          <View style={styles.keyValueContainer}>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                1) Customer :{" "}
                {customer_billed_today &&
                customer_billed_today.order_book__company__name
                  ? customer_billed_today.order_book__company__name
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.keyValue}>
              <Text style={styles.text}>
                2) Amount :{" "}
                {customer_billed_today && customer_billed_today.amount
                  ? customer_billed_today.amount.toLocaleString("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Sales Person</Text>
            <Text style={[styles.signatureText, styles.emailText]}>
              {recordForEdit.sales_person}
            </Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Reviewer</Text>
            <Text style={[styles.signatureText, styles.emailText]}>
              {recordForEdit.reviewer}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
