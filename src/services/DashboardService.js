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

const getIndiaMartLeadData = () => {
  return CustomAxios.get(`/api/dashboard/india-mart-lead/`);
};

const getIndiaMartLeadDataByFilter = (filter) => {
  return CustomAxios.get(`/api/dashboard/india-mart-lead/?date=${filter}`);
};

const getCallStatusDataByFilter = (type, email, team) => {
  const params = new URLSearchParams();

  if (type) {
    params.append("call_status_type", type);
  }
  if (email) {
    params.append("email", email);
  }

  if (team) {
    params.append("sales_type", team);
  }

  return CustomAxios.get(`/api/dashboard/call-status/?${params.toString()}`);
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
  type,
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
  if (type) {
    params.append("type", type);
  }
  if (sales_type) {
    params.append("sales_type", sales_type);
  }

  return CustomAxios.get(
    `/api/dashboard/followup-dashboard/?${params.toString()}`
  );
};

const getSalesFieldDashboardData=(email,start_date,end_date)=>{
  const params = new URLSearchParams();
  if(end_date) params.append("email",email);
  if(start_date) params.append("start_date",start_date);
  if(end_date) params.append("end_date",end_date);
  return CustomAxios.get(`/api/field-sales/customer-visit-dashboard/?${params.toString()}`)
}

const getLeadSalesFieldDashboardData=(email,start_date,end_date)=>{
  const params = new URLSearchParams();
  if(end_date) params.append("email",email);
  if(start_date) params.append("start_date",start_date);
  if(end_date) params.append("end_date",end_date);
  return CustomAxios.get(`/api/field-sales/lead-visit-dashboard/?${params.toString()}`)
}

const SalesPersonCustomerVisitMap = (email,visit_date)=>{
   const params = new URLSearchParams();
  if(email) params.append("email",email);
  if(visit_date) params.append("visit_date",visit_date);
  return CustomAxios.get(`/api/field-sales/customer-visit-map/?${params.toString()}`)
}

const getEmployeesCurrentLocation = ()=>{
  return CustomAxios.get(`/api/field-sales/current-location/`)
}

const getLeadSalesPersonCustomerVisitMap = (email,visit_date)=>{
   const params = new URLSearchParams();
  if(email) params.append("email",email);
  if(visit_date) params.append("visit_date",visit_date);
  return CustomAxios.get(`/api/field-sales/lead-visit-map/?${params.toString()}`)
}
const DashboardService = {
  getSalesAnalyticDashboard,
  getLastThreeMonthForecastData,
  getLastThreeMonthForecastDataByFilter,
  getIndiaMartLeadData,
  getIndiaMartLeadDataByFilter,
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
  getConsCallPerformanceData,
  getConsCallPerformanceDataByFilter,
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
  getCallStatusDataByFilter,
  getSalesFieldDashboardData,
  getLeadSalesFieldDashboardData,
  SalesPersonCustomerVisitMap,
  getLeadSalesPersonCustomerVisitMap,
  getEmployeesCurrentLocation,
};

export default DashboardService;
