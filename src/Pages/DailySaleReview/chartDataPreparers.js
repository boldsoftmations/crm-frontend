// chartDataPreparers.js

// Function to prepare chart data for Forecast vs Actual Sales
export const prepareForecastChartData = (recordForEdit) => {
  if (recordForEdit && Array.isArray(recordForEdit.forecast)) {
    return [
      ["Product", "Actual", "Forecast", "Percentage"],
      ...recordForEdit.forecast.map((item) => [
        item.description,
        item.actual,
        item.forecast,
        item.percentage,
      ]),
    ];
  }
  return [];
};

// forecastChartOptions
export const forecastChartOptions = {
  // title: "Forecast vs Actual Sales  (in Rs.)",
  hAxis: {
    title: "Products",
    textStyle: {
      fontSize: 10,
    },
    showTextEvery: 1,
    slantedText: false,
    staggered: true,
  },
  showTextEvery: 1,
  slantedText: false,
  staggered: true,
  vAxis: { title: "Quantity", minValue: 0 },
  vAxes: {
    0: { title: "Quantity" },
    1: { title: "Percentage" },
  },
  seriesType: "bars",
  series: {
    0: { targetAxisIndex: 0 },
    1: { targetAxisIndex: 0 },
    2: { targetAxisIndex: 1, type: "line" },
  },
  colors: ["#1b9e77", "#d95f02", "#f3b600"],
};

// Function to prepare chart data for Invoice Quantity Grouped Bar Chart
export const prepareInvoiceGroupedBarChartData = (recordForEdit) => {
  console.log("recordForEdit invoice", recordForEdit);
  if (recordForEdit && Array.isArray(recordForEdit.invoice_product_quantity)) {
    const chartData = [
      ["Product", "Quantity", { role: "style" }], // Headers
      ...recordForEdit.invoice_product_quantity.map((item) => [
        item.product,
        item.quantity,
        "color: #3399FF", // Example color, you can customize it
      ]), // Data rows
    ];
    return chartData;
  }
  return [];
};

// Invoices Grouped Bar Chart Options
export const InvoiceChartOptions = {
  // title: "Invoice Quantity",
  hAxis: { title: "X-Axis Label" },
  vAxis: { title: "Y-Axis Label" },
  legend: "none",
  chartArea: { width: "80%", height: "70%" },
  colors: ["#3399FF", "#FF5733", "#33FF57", "#5733FF"], // Custom colors
  // Add more chart options as needed
};

// Function to prepare chart data for Today's Product PI
export const prepareTodayProductPiChartData = (recordForEdit) => {
  console.log("recordForEdit", recordForEdit);
  if (recordForEdit && Array.isArray(recordForEdit.today_product_pi)) {
    const chartData = [
      [
        "PI Number",
        "Amount",
        "GST",
        "Total",
        { role: "tooltip", type: "string", p: { html: true } },
      ],
      ...recordForEdit.today_product_pi.map((today_product_pi) => [
        `PI ${today_product_pi.proformainvoice}`,
        parseFloat(today_product_pi.amount),
        parseFloat(today_product_pi.gst),
        parseFloat(today_product_pi.total),
        generateTodayProductPiTooltipContent(today_product_pi), // Tooltip content
      ]),
    ];
    return chartData;
  }
  return [];
};

// Today's Product PI Tooltip content function
const generateTodayProductPiTooltipContent = (today_product_pi) => {
  return `<div style="padding:5px;">
  <strong>Product:</strong> ${today_product_pi.product}<br/>
  <strong>Brand:</strong> ${today_product_pi.brand}<br/>
  <strong>Description:</strong> ${today_product_pi.description}<br/>
  <strong>Unit:</strong> ${today_product_pi.unit}<br/>
  <strong>Rate:</strong> ${today_product_pi.rate}<br/>
  <strong>Total:</strong> ${today_product_pi.total}<br/>
  <strong>Quantity:</strong> ${today_product_pi.quantity}
</div>`;
};

// Today's Product PI Chart options
export const todayProductPiChartOptions = {
  // title: "Today's Product PI Financial Overview",
  hAxis: { title: "PI Number" },
  vAxis: { title: "Amount" },
  legend: { position: "top", maxLines: 3 },
  tooltip: { isHtml: true },
  bar: { groupWidth: "75%" },
  isStacked: true,
};

// Function to prepare chart data for Pending Orders
export const preparePendingOrdersChartData = (recordForEdit) => {
  if (recordForEdit && Array.isArray(recordForEdit.pending_order)) {
    return [
      ["Product", "Pending Quantity"],
      ...recordForEdit.pending_order.map((order) => [
        order.product__description__name,
        order.total_pending_quantity,
      ]),
    ];
  }
  return [];
};

// Pending Orders Chart options
export const pendingOrdersChartOptions = {
  // title: "Pending Orders",
  hAxis: {
    title: "Product",
    textStyle: {
      fontSize: 10,
    },
    showTextEvery: 1,
    slantedText: false,
    staggered: true,
  },
  showTextEvery: 1,
  slantedText: false,
  staggered: true,
  vAxis: { title: "Quantity", minValue: 0 },
  vAxes: {
    0: { title: "Quantity" },
    1: { title: "Percentage" },
  },
  seriesType: "bars",
  series: {
    0: { targetAxisIndex: 0 },
    1: { targetAxisIndex: 0 },
    2: { targetAxisIndex: 1, type: "line" },
  },
  colors: ["#1b9e77", "#d95f02", "#f3b600"], // Example colors
};

// Function to prepare chart data for Approve Pi
export const prepareApprovePiChartData = (recordForEdit) => {
  console.log("recordForEdit approve", recordForEdit);
  if (recordForEdit && Array.isArray(recordForEdit.approved_pi)) {
    const chartData = [
      [
        "PI Number",
        "Amount",
        "GST",
        "Total",
        { role: "tooltip", type: "string", p: { html: true } },
      ],
      ...recordForEdit.approved_pi.map((approve_pi) => [
        `PI ${approve_pi.pi_number}`,
        parseFloat(approve_pi.amount),
        parseFloat(approve_pi.gst),
        parseFloat(approve_pi.total),
        approvePiChartTooltipContent(approve_pi), // Tooltip content
      ]),
    ];
    return chartData;
  }
  return [];
};

// Approve Pi Tooltip content function
const approvePiChartTooltipContent = (approve_pi) => {
  return `<div style="padding:5px;">
            <strong>PI Number:</strong> ${approve_pi.pi_number}<br/>
            <strong>Company:</strong> ${approve_pi.company_name}<br/>
            <strong>Amount:</strong> ${approve_pi.amount}<br/>
            <strong>GST:</strong> ${approve_pi.gst}<br/>
            <strong>Total:</strong> ${approve_pi.total}<br/>
          </div>`;
};

// Approve Pi Chart options
export const approvePiChartOptions = {
  // title: "Approved PI Financial Overview",
  hAxis: { title: "Product" },
  vAxis: { title: "Quantity" },
  legend: { position: "top", maxLines: 3 },
  tooltip: { isHtml: true },
  bar: { groupWidth: "75%" },
  isStacked: true,
};
