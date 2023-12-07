// Call Performance
export const prepareCallPerformanceChartData = (record) => {
  const categories = ["Today", "Month", "Last 7 Days"];
  if (!record || !record.call_performance) {
    return [
      ["Category", "Existing Customer", "New Leads", "Existing Leads"],
      ...categories.map((category) => [
        category,
        record.call_performance.existing_customer[category.toLowerCase()] || 0,
        record.call_performance.new_leads[category.toLowerCase()] || 0,
        record.call_performance.existing_leads[category.toLowerCase()] || 0,
      ]),
    ];
  }
};

// Define Chart Options for Call Performance Overview
export const callPerformanceChartOptions = {
  // title: "Call Performance",
  chartArea: { width: "50%" },
  hAxis: {
    title: "Counts",
    minValue: 0,
  },
  vAxis: {
    title: "Category",
  },
  legend: { position: "top", maxLines: 3 },
  bar: { groupWidth: "75%" },
  isStacked: true,
};

export const prepareNoOrderCustomerChartData = (record) => {
  return [
    ["Days Range", "Count"],
    ["30-59 Days", record.no_order_customer["30-59_days"]],
    ["60-89 Days", record.no_order_customer["60-89_days"]],
    ["90-119 Days", record.no_order_customer["90-119_days"]],
    ["Over 120 Days", record.no_order_customer["over_120_days"]],
  ];
};

export const noOrderCustomerChartOptions = {
  // title: "No Order Customer Overview",
  chartArea: { width: "50%" },
  hAxis: { title: "Days Range", minValue: 0 },
  vAxis: { title: "Count" },
  legend: { position: "top", maxLines: 3 },
  bar: { groupWidth: "75%" },
  isStacked: true,
};

export const preparePiSummaryChartData = (piData) => {
  return [
    ["Category", "Value"],
    ["Raised", piData.raised],
    ["Drop", piData.drop],
    ["Month Drop", piData.month_drop],
  ];
};

export const prepareFollowupSummaryChartData = (followupData) => {
  return [
    ["Category", "Value"],
    ["Today", followupData.today],
    ["Overdue Follow-up", followupData.overdue_followup],
    ["Overdue Task", followupData.overdue_task],
  ];
};

export const prepareNewCustomerSummaryChartData = (newCustomerData) => {
  return [
    ["Category", "Value"],
    ["This Month", newCustomerData.month],
    ["Last Month", newCustomerData.last_month],
    ["Sales Invoice", newCustomerData.sales_invoice],
  ];
};

export const chartOptions = {
  // title: "Chart Title",
  chartArea: { width: "70%" },
  hAxis: { title: "Category" },
  vAxis: { title: "Value" },
};
