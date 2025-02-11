import CustomAxios from "./api";

const getSalesAnalyticDashboard = (eamil, sales_type) => {
  const params = new URLSearchParams();
  if (eamil) {
    params.append("email", eamil);
  }
  if (sales_type) {
    params.append("sales_type", sales_type);
  }

  return CustomAxios.get(`/api/dashboard/sales-analytic/?${params.toString()}`);
};
// last Three Month Forecast End Point
const getLastThreeMonthForecastData = () => {
  return CustomAxios.get(`/api/dashboard/last-three-months-forecast/`);
};

const getLastThreeMonthForecastDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/last-three-months-forecast/?email=${filter}`
  );
};

const getNewCustomerData = () => {
  return CustomAxios.get(`/api/dashboard/new-customer-month-on-month/`);
};

const getNewCustomerDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/new-customer-month-on-month/?email=${filter}`
  );
};

const getPendingTaskData = () => {
  return CustomAxios.get(`/api/dashboard/pending-tasks/`);
};

const getPendingTaskDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/pending-tasks/?email=${filter}`);
};

const getPendingFollowupData = () => {
  return CustomAxios.get(`/api/dashboard/pending-followups/`);
};

const getPendingFollowupDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/pending-followups/?email=${filter}`);
};

const getPIData = () => {
  return CustomAxios.get(`/api/dashboard/list-pi-data/`);
};

const getPIDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/list-pi-data/?email=${filter}`);
};

const getIndiaMartLeadData = () => {
  return CustomAxios.get(`/api/dashboard/india-mart-lead/`);
};

const getIndiaMartLeadDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/india-mart-lead/?date=${filter}`);
};

const getCustomerDashboard = () => {
  return CustomAxios.get("/api/dashboard/customer-dashboard/");
};

const getCustomerDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/customer-dashboard/?email=${filter}`);
};

const getLeadDashboard = () => {
  return CustomAxios.get("/api/dashboard/lead-dashboard");
};

const getLeadDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/lead-dashboard/?email=${filter}`);
};

const getDescriptionWisePendingQuantityData = () => {
  return CustomAxios.get("/api/dashboard/list-pending-order-description-wise/");
};

const getDescriptionWisePendingQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/list-pending-order-description-wise/?email=${filter}`
  );
};

const getMonthlyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/monthly-call-status/");
};

const getMonthlyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/monthly-call-status/?email=${filter}`);
};

const getWeeklyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/weekly-call-status/");
};

const getWeeklyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/weekly-call-status/?email=${filter}`);
};

const getDailyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/daily-call-status/");
};

const getDailyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/daily-call-status/?email=${filter}`);
};

const getDescriptionWiseQuantityData = () => {
  return CustomAxios.get(
    "/api/dashboard/list-current-month-orders-description-wise/"
  );
};

const getDescriptionWiseQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/list-current-month-orders-description-wise/?email=${filter}`
  );
};

const getCallPerformanceData = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/call-performance/?start_date=${startDate}&end_date=${endDate}`
  );
};

const getCallPerformanceDataByFilter = (filter, startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/call-performance/?email=${filter}&start_date=${startDate}&end_date=${endDate}`
  );
};

const getDailyProfitableReportsData = () => {
  return CustomAxios.get("/api/dashboard/daily-profitablity-report/");
};

const getDailyProfitableReportsDataByFilter = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/daily-profitablity-report/?date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getDescriptionWiseTurnoverDataByFilter = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/description-wise-turnover/?start_date=${startDate}&end_date=${endDate}`
  );
};

const getDailyProfitableSalesReportsDataByFilter = (
  startDate,
  endDate,
  unit
) => {
  return CustomAxios.get(
    `/api/dashboard/daily-profitablity-report-sales-invoice-wise/?date_range_after=${startDate}&date_range_before=${endDate}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`
  );
};

const getDailyInvoiceQuantityData = () => {
  return CustomAxios.get("/api/dashboard/daily-invoice-quantity/");
};

const getDailyInvoiceQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/daily-invoice-quantity/?email=${filter}`
  );
};

const getDailyOrderBookQuantityData = () => {
  return CustomAxios.get("/api/dashboard/daily-order-book-quantity/");
};

const getDailyOrderBookQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/daily-order-book-quantity/?email=${filter}`
  );
};

// consolidate API

// last Three Month Forecast End Point
const getConsLastThreeMonthForecastData = () => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-last-three-months-forecast/`
  );
};

const getConsLastThreeMonthForecastDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-last-three-months-forecast/?email=${filter}`
  );
};

const getConsNewCustomerData = () => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-new-customer-month-on-month/`
  );
};

const getConsNewCustomerDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-new-customer-month-on-month/?email=${filter}`
  );
};

const getConsPendingTaskData = () => {
  return CustomAxios.get(`/api/dashboard/consolidated-pending-tasks/`);
};

const getConsPendingTaskDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/pending-tasks/?email=${filter}`);
};

const getConsPendingFollowupData = () => {
  return CustomAxios.get(`/api/dashboard/consolidated-pending-followups/`);
};

const getConsPendingFollowupDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-pending-followups/?email=${filter}`
  );
};

const getConsPIData = () => {
  return CustomAxios.get(`/api/dashboard/consolidated-list-pi-data/`);
};

const getConsPIDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-list-pi-data/?email=${filter}`
  );
};

const getConsCustomerDashboard = () => {
  return CustomAxios.get("/api/dashboard/consolidated-customer-dashboard/");
};

const getConsCustomerDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-customer-dashboard/?email=${filter}`
  );
};

const getConsLeadDashboard = () => {
  return CustomAxios.get("/api/dashboard/consolidated-lead-dashboard");
};

const getConsLeadDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-lead-dashboard/?email=${filter}`
  );
};

const getConsDescriptionWisePendingQuantityData = () => {
  return CustomAxios.get(
    "/api/dashboard/consolidated-list-pending-order-description-wise/"
  );
};

const getConsDescriptionWisePendingQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-list-pending-order-description-wise/?email=${filter}`
  );
};

const getConsMonthlyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/consolidated-monthly-call-status/");
};

const getConsMonthlyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-monthly-call-status/?email=${filter}`
  );
};

const getConsWeeklyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/consolidated-weekly-call-status/");
};

const getConsWeeklyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-weekly-call-status/?email=${filter}`
  );
};

const getConsDailyCallStatusData = () => {
  return CustomAxios.get("/api/dashboard/consolidated-daily-call-status/");
};

const getConsDailyCallStatusDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-daily-call-status/?email=${filter}`
  );
};

const getConsDescriptionWiseQuantityData = () => {
  return CustomAxios.get(
    "/api/dashboard/consolidated-list-current-month-orders-description-wise/"
  );
};

const getConsDescriptionWiseQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-list-current-month-orders-description-wise/?email=${filter}`
  );
};

const getConsCallPerformanceData = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-call-performance/?start_date=${startDate}&end_date=${endDate}`
  );
};

const getConsCallPerformanceDataByFilter = (filter, startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-call-performance/?email=${filter}&start_date=${startDate}&end_date=${endDate}`
  );
};

const getConsDailyProfitableReportsData = () => {
  return CustomAxios.get(
    "/api/dashboard/consolidated-daily-profitablity-report/"
  );
};

const getConsDailyProfitableReportsDataByFilter = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-daily-profitablity-report/?date_range_after=${startDate}&date_range_before=${endDate}`
  );
};

const getConsDescriptionWiseTurnoverDataByFilter = (startDate, endDate) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-description-wise-turnover/?start_date=${startDate}&end_date=${endDate}`
  );
};

const getConsDailyProfitableSalesReportsDataByFilter = (
  startDate,
  endDate,
  unit
) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-daily-profitablity-report-sales-invoice-wise/?date_range_after=${startDate}&date_range_before=${endDate}&sales_invoice__order_book__proforma_invoice__seller_account__unit=${unit}`
  );
};

const getConsDailyInvoiceQuantityData = () => {
  return CustomAxios.get("/api/dashboard/consolidated-daily-invoice-quantity/");
};

const getConsDailyInvoiceQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-daily-invoice-quantity/?email=${filter}`
  );
};

const getConsDailyOrderBookQuantityData = () => {
  return CustomAxios.get(
    "/api/dashboard/consolidated-daily-order-book-quantity/"
  );
};

const getConsDailyOrderBookQuantityDataByFilter = (filter) => {
  return CustomAxios.get(
    `/api/dashboard/consolidated-daily-order-book-quantity/?email=${filter}`
  );
};

const getRetailerCustomerData = () => {
  return CustomAxios.get("/api/customer/customer-summary/");
};

const getLeadRetailData = () => {
  return CustomAxios.get("/api/lead/lead-summary/");
};

const getTopCustomersMonthwise = (number = 25) => {
  return CustomAxios.get(`/api/dashboard/top-customer/?number=${number}`);
};

const potentialTurnoverReport = (page) => {
  return CustomAxios.get(`/api/dashboard/potential-turnover/?page=${page}`);
};

const getCRReportData = (email) => {
  return CustomAxios.get(`/api/dashboard/cr-report/?email=${email}`);
};

const getSalesQuatityAnalysis = (start_month, start_year, email) => {
  const params = new URLSearchParams();
  if (start_month) {
    params.append("start_month", start_month);
  }
  if (start_year) {
    params.append("start_year", start_year);
  }
  if (email) {
    params.append("email", email);
  }

  return CustomAxios.get(`/api/dashboard/sales-qty/?${params.toString()}`);
};

const getSalesQuatityAnalysisdetailsByproduct = (
  description,
  brand,
  unit,
  start_month,
  year,
  email
) => {
  const params = new URLSearchParams();
  if (description) {
    params.append("description", description);
  }
  if (brand) {
    params.append("brand", brand);
  }
  if (unit) {
    params.append("unit", unit);
  }
  if (start_month) {
    params.append("start_month", start_month);
  }
  if (year) {
    params.append("year", year);
  }
  if (email) {
    params.append("email", email);
  }

  return CustomAxios.get(
    `/api/dashboard/customers-sale-qty/?${params.toString()}`
  );
};
const getFollowupCallDashboard = (
  email,
  start_date,
  end_date,
  sales_type = ""
) => {
  const params = new URLSearchParams();
  if (email) {
    params.append("email", email);
  }
  if (start_date) {
    params.append("start_date", start_date);
  }
  if (end_date) {
    params.append("end_date", end_date);
  }
  if (sales_type) {
    params.append("sales_type", sales_type);
  }
  return CustomAxios.get(
    `/api/dashboard/company-followup/?${params.toString()}`
  );
};
const DashboardService = {
  getSalesAnalyticDashboard,
  getLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
  getNewCustomerData,
  getNewCustomerDataByFilter,
  getPendingTaskData,
  getPendingTaskDataByFilter,
  getPendingFollowupData,
  getPendingFollowupDataByFilter,
  getPIData,
  getPIDataByFilter,
  getIndiaMartLeadData,
  getIndiaMartLeadDataByFilter,
  getCustomerDashboard,
  getLeadDashboard,
  getCustomerDataByFilter,
  getLeadDataByFilter,
  getDescriptionWisePendingQuantityData,
  getDescriptionWisePendingQuantityDataByFilter,
  getMonthlyCallStatusData,
  getMonthlyCallStatusDataByFilter,
  getWeeklyCallStatusData,
  getWeeklyCallStatusDataByFilter,
  getDailyCallStatusData,
  getDailyCallStatusDataByFilter,
  getDescriptionWiseQuantityData,
  getDescriptionWiseQuantityDataByFilter,
  getCallPerformanceData,
  getCallPerformanceDataByFilter,
  getDailyProfitableReportsData,
  getDailyProfitableReportsDataByFilter,
  getDescriptionWiseTurnoverDataByFilter,
  getDailyProfitableSalesReportsDataByFilter,
  getDailyInvoiceQuantityData,
  getDailyInvoiceQuantityDataByFilter,
  getDailyOrderBookQuantityData,
  getDailyOrderBookQuantityDataByFilter,
  // consolidate

  getConsLastThreeMonthForecastData,
  getConsLastThreeMonthForecastDataByFilter,
  getConsNewCustomerData,
  getConsNewCustomerDataByFilter,
  getConsPendingTaskData,
  getConsPendingTaskDataByFilter,
  getConsPendingFollowupData,
  getConsPendingFollowupDataByFilter,
  getConsPIData,
  getConsPIDataByFilter,
  getConsCustomerDashboard,
  getConsLeadDashboard,
  getConsCustomerDataByFilter,
  getConsLeadDataByFilter,
  getConsDescriptionWisePendingQuantityData,
  getConsDescriptionWisePendingQuantityDataByFilter,
  getConsMonthlyCallStatusData,
  getConsMonthlyCallStatusDataByFilter,
  getConsWeeklyCallStatusData,
  getConsWeeklyCallStatusDataByFilter,
  getConsDailyCallStatusData,
  getConsDailyCallStatusDataByFilter,
  getConsDescriptionWiseQuantityData,
  getConsDescriptionWiseQuantityDataByFilter,
  getConsCallPerformanceData,
  getConsCallPerformanceDataByFilter,
  getConsDailyProfitableReportsData,
  getConsDailyProfitableReportsDataByFilter,
  getConsDescriptionWiseTurnoverDataByFilter,
  getConsDailyProfitableSalesReportsDataByFilter,
  getConsDailyInvoiceQuantityData,
  getConsDailyInvoiceQuantityDataByFilter,
  getConsDailyOrderBookQuantityData,
  getConsDailyOrderBookQuantityDataByFilter,
  getRetailerCustomerData,
  getLeadRetailData,
  getTopCustomersMonthwise,
  potentialTurnoverReport,
  getCRReportData,
  getSalesQuatityAnalysis,
  getSalesQuatityAnalysisdetailsByproduct,
  getFollowupCallDashboard,
};

export default DashboardService;
