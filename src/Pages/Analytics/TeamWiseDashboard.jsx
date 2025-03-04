import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardService from "../../services/DashboardService";
import { CustomLoader } from "../../Components/CustomLoader";
import { SalesTeamAnalytics } from "./SalesTeamAnalytics";

export const TeamWiseDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [newCustomerData, setNewCustomerData] = useState([]);
  const [pendingFollowup, setPendingFollowup] = useState([]);
  const [pendingDescription, setPendingDescription] = useState([]);
  const [descriptionQuantity, setDescriptionQuantity] = useState([]);
  const [piData, setPiData] = useState([]);
  const [callStatusData, setCallStatusData] = useState([]);
  const [callPerformance, setCallPerformance] = useState([]);
  const [dailyInvoiceQuantity, setDailyInvoiceQuantity] = useState([]);
  const [dailyOrderBookQuantity, setDailyOrderBookQuantity] = useState([]);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const [callDashboardData, setCallDashboardData] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState("Today");
  const [endDate, setEndDate] = useState(currentDate);
  const [startDate, setStartDate] = useState(currentDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  useEffect(() => {
    getSalesAnalyticDashboard();
    getConsDailyInvoiceQuantityDetails();
    getConsDailyOrderBookQuantityDetails();
    getMonthyCallStatusData("monthly");
  }, []);

  useEffect(() => {
    getConsForecastDetails();
  }, [userData]);

  useEffect(() => {
    if (filterValue) {
      getConsCallPerformanceByFilter(filterValue, startDate, endDate);
    } else {
      getConsCallPerformanceDetails();
    }
  }, [startDate, endDate, filterValue]);
  // useEffect(() => {
  //   if (filterValue) {
  //     getFollowupCallDashboard(filterValue, startDate, endDate);
  //   } else {
  //     getFollowupCallDashboard();
  //   }
  // }, [startDate, endDate, filterValue]);

  const getSalesAnalyticDashboard = async (email) => {
    try {
      setOpen(true);
      const response = await DashboardService.getSalesAnalyticDashboard(
        email ? email : "",
        "team"
      );
      const CustomeDetail = response.data.customer_dashboard;
      const FunnelData = response.data.lead_dashboard;
      const newCustomerDatas = response.data.new_customers;
      const PendingFollowupData = response.data.pending_followup;
      const PiData = response.data.pi_data;
      const MonthlyDescriptionWiseData =
        response.data.current_month_order_description;
      const DescriptionWisePendingQautity =
        response.data.pending_order_description_wise;
      setTotal(CustomeDetail.total_customers);

      const CustomerData = [
        {
          label: "Active Customers",
          value: CustomeDetail.active_customers,
        },
        {
          label: "Dead Customers",
          value: CustomeDetail.dead_customers,
        },
        {
          label: "New Customers",
          value: CustomeDetail.new_customers,
        },
        {
          label: "Total",
          value: CustomeDetail.total_customers,
        },
      ];

      const LeadData = [
        { name: "new", label: "New", value: FunnelData.new },
        { name: "open", label: "Open", value: FunnelData.open },
        {
          name: "opportunity",
          label: "Opportunity",
          value: FunnelData.opportunity,
        },
        {
          name: "potential",
          label: "Potential",
          value: FunnelData.potential,
        },
        {
          name: "not_interested",
          label: "Not Interested",
          value: FunnelData.not_interested,
        },
        {
          name: "converted",
          label: "Converted",
          value: FunnelData.converted,
        },
      ];

      const newCustomerDatasFormat = Object.keys(newCustomerDatas).map(
        (key) => {
          return {
            combination: key,
            count: newCustomerDatas[key].count,
          };
        }
      );

      const PendingFollowupDataFormat = [
        {
          label: "Upcoming FollowUp",
          value: PendingFollowupData.upcoming_follow_ups,
        },
        {
          label: "Today FollowUp",
          value: PendingFollowupData.todays_followups,
        },
        {
          label: "Overdue FollowUp",
          value: PendingFollowupData.overdue_follow_ups,
        },
      ];

      const PiDataFormat = [
        {
          label: "Paid PI",
          value: PiData.paid_pi,
        },
        {
          label: "Unpaid PI",
          value: PiData.unpaid_pi,
        },
        {
          label: "Dropped PI",
          value: PiData.dropped_pi,
        },
      ];

      const MonthlyDescriptionWiseDataFormat = MonthlyDescriptionWiseData.map(
        (item) => {
          return {
            name: item.product__description__name,
            value: item.total_quantity,
          };
        }
      );

      const DescriptionWisePendingQautityFormat =
        DescriptionWisePendingQautity.map((item) => {
          return {
            name: item.product__description__name,
            value: item.total_pending_quantity,
          };
        });
      setPendingDescription(DescriptionWisePendingQautityFormat);
      setDescriptionQuantity(MonthlyDescriptionWiseDataFormat);
      setPieChartData(CustomerData);
      setPendingFollowup(PendingFollowupDataFormat);
      setNewCustomerData(newCustomerDatasFormat);
      setFunnelData(LeadData);
      setPiData(PiDataFormat);
    } catch (e) {
      setOpen(false);
      console.log("error", e);
    }
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDate(selectedValue);

    const today = new Date();
    let startDate, endDate;

    switch (selectedValue) {
      case "Today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;

      case "Custom Date":
        startDate = new Date(); // Today
        endDate = new Date(); // Now
        endDate.setDate(startDate.getDate() + 1); // Set endDate to tomorrow
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  const getResetDate = () => {
    setStartDate(currentDate);
    setEndDate(currentDate);
    setSelectedDate("Today");
  };

  const getConsForecastDetails = async () => {
    try {
      setOpen(true);
      const forecastResponse =
        await DashboardService.getConsLastThreeMonthForecastData();
      const columnKeys = Object.keys(forecastResponse.data);
      const isAllColumnsEmpty = columnKeys.every(
        (key) => forecastResponse.data[key].length === 0
      );

      let Data = [];

      if (!isAllColumnsEmpty) {
        Data = columnKeys.flatMap((key) =>
          forecastResponse.data[key].map((item) => ({
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            actual: item.actual || 0,
            forecast: item.total_forecast || 0,
          }))
        );

        Data.forEach((item) => {
          item.combination = String(item.combination); // Convert combination to string explicitly
        });
      }

      setBarChartData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getMonthyCallStatusData = async (type = "monthly", filterValue) => {
    try {
      setOpen(true);
      const response = await DashboardService.getCallStatusDataByFilter(
        type,
        filterValue,
        "team"
      );
      const data = response.data;
      const Data = Object.keys(data).map((key) => {
        return {
          combination: key,
          existing_lead: data[key].existing_lead,
          new_lead: data[key].new_lead,
          customer: data[key].customer,
        };
      });
      setCallStatusData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getConsCallPerformanceDetails = async () => {
    try {
      setOpen(true);
      const timezoneOffset = startDate.getTimezoneOffset() * 60000; // Offset in milliseconds
      const adjustedStartDate = new Date(startDate.getTime() - timezoneOffset);
      const adjustedEndDate = new Date(endDate.getTime() - timezoneOffset);

      const StartDate = adjustedStartDate.toISOString().split("T")[0];
      const EndDate = adjustedEndDate.toISOString().split("T")[0];
      const response = await DashboardService.getConsCallPerformanceData(
        StartDate,
        EndDate
      );
      const Data = [
        {
          name: "Order",
          value: response.data.order,
        },
        {
          name: "Followup",
          value: response.data.followup,
        },
        {
          name: "Credit",
          value: response.data.credit,
        },
        {
          name: "Issue",
          value: response.data.issue,
        },
        {
          name: "Not Connect",
          value: response.data.not_connect,
        },
        {
          name: "OEM",
          value: response.data.oem,
        },
        {
          name: "One Time",
          value: response.data.one_time,
        },
        {
          name: "Passed",
          value: response.data.passed,
        },
        {
          name: "Potential",
          value: response.data.potential,
        },
        {
          name: "Sample",
          value: response.data.sample,
        },
        {
          name: "Dropped",
          value: response.data.dropped,
        },
        // Add more data for other categories if needed
      ];

      setCallPerformance(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getFollowupCallDashboard = async (value, type) => {
    try {
      setOpen(true);
      const start_date = startDate.toISOString().split("T")[0];
      const end_date = endDate.toISOString().split("T")[0];
      const response = await DashboardService.getFollowupCallDashboard(
        value ? value : "",
        start_date,
        end_date,
        type ? type : "",
        "team"
      );
      setCallDashboardData(response.data);
    } catch {
      setOpen(false);
      console.log("Error fetching followup call dashboard data");
    } finally {
      setOpen(false);
    }
  };
  const getConsDailyInvoiceQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsDailyInvoiceQuantityData();
      setDailyInvoiceQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getConsDailyOrderBookQuantityDetails = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getConsDailyOrderBookQuantityData();
      setDailyOrderBookQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };
  const handleAutocompleteChange = (value) => {
    // Check if value is not null before accessing its properties
    if (value) {
      setFilterValue(value.email);
      getSalesAnalyticDashboard(value.email);
      setAssign(value.email);
      getConsDataByFilter(value.email);
      getConsCallPerformanceByFilter(value.email, startDate, endDate);
      getFollowupCallDashboard(value.email, startDate, endDate);
      getConsDailyInvoiceQuantityByFilter(value.email);
      getConsDailyOrderBookQuantityByFilter(value.email);
    } else {
      // Handle the case when value is null (i.e., when the Autocomplete is reset)
      getSalesAnalyticDashboard();
      getConsForecastDetails();
      setAssign(null);
      setFilterValue(null);
      getConsCallPerformanceDetails();
      getFollowupCallDashboard();
      getConsDailyInvoiceQuantityDetails();
      getConsDailyOrderBookQuantityDetails();
      getMonthyCallStatusData("monthly");
    }
  };

  const getConsDataByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const forecastResponse =
        await DashboardService.getConsLastThreeMonthForecastDataByFilter(
          FilterData
        );

      const columnKeys = Object.keys(forecastResponse.data);
      const isAllColumnsEmpty = columnKeys.every(
        (key) => forecastResponse.data[key].length === 0
      );

      let Data = [];

      if (!isAllColumnsEmpty) {
        Data = columnKeys.flatMap((key) =>
          forecastResponse.data[key].map((item) => ({
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            actual: item.actual || 0,
            forecast: item.total_forecast || 0,
          }))
        );

        Data.forEach((item) => {
          item.combination = String(item.combination); // Convert combination to string explicitly
        });
      }

      setBarChartData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getConsCallPerformanceByFilter = async (value, startDate, endDate) => {
    try {
      setOpen(true);
      const FilterData = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response =
        await DashboardService.getConsCallPerformanceDataByFilter(
          FilterData,
          StartDate,
          EndDate
        );
      const Data = [
        {
          name: "Order",
          value: response.data.order,
        },
        {
          name: "Followup",
          value: response.data.followup,
        },
        {
          name: "Credit",
          value: response.data.credit,
        },
        {
          name: "Issue",
          value: response.data.issue,
        },
        {
          name: "Not Connect",
          value: response.data.not_connect,
        },
        {
          name: "OEM",
          value: response.data.oem,
        },
        {
          name: "One Time",
          value: response.data.one_time,
        },
        {
          name: "Passed",
          value: response.data.passed,
        },
        {
          name: "Potential",
          value: response.data.potential,
        },
        {
          name: "Sample",
          value: response.data.sample,
        },
        {
          name: "Dropped",
          value: response.data.dropped,
        },
        // Add more data for other categories if needed
      ];

      setCallPerformance(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getConsDailyInvoiceQuantityByFilter = async (value) => {
    try {
      setOpen(true);
      const FilterData = value;
      const response =
        await DashboardService.getConsDailyInvoiceQuantityDataByFilter(
          FilterData
        );
      setDailyInvoiceQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getConsDailyOrderBookQuantityByFilter = async (value) => {
    try {
      setOpen(true);
      const FilterData = value;
      const response =
        await DashboardService.getConsDailyOrderBookQuantityDataByFilter(
          FilterData
        );
      setDailyOrderBookQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const handleSegmentHover = (segment) => {
    setHoveredSegment(segment);
  };

  const handleRowClick = (row) => {
    if (row.label === "New") {
      navigate("/leads/all-lead");
    }
    if (row.label === "Open") {
      navigate("/leads/all-lead");
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <SalesTeamAnalytics
        barChartData={barChartData}
        pieChartData={pieChartData}
        newCustomerData={newCustomerData}
        callDashboardData={callDashboardData}
        getFollowupCallDashboard={getFollowupCallDashboard}
        getMonthyCallStatusData={getMonthyCallStatusData}
        pendingFollowup={pendingFollowup}
        pendingDescription={pendingDescription}
        piData={piData}
        callStatusData={callStatusData}
        handleSegmentHover={handleSegmentHover}
        handleAutocompleteChange={handleAutocompleteChange}
        assign={assign}
        total={total}
        getResetDate={getResetDate}
        funnelData={funnelData}
        hoveredSegment={hoveredSegment}
        handleRowClick={handleRowClick}
        descriptionQuantity={descriptionQuantity}
        callPerformance={callPerformance}
        dailyInvoiceQuantity={dailyInvoiceQuantity}
        dailyOrderBookQuantity={dailyOrderBookQuantity}
        handleChange={handleChange}
        selectedDate={selectedDate}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        startDate={startDate}
        endDate={endDate}
        maxDate={maxDate}
        minDate={minDate}
        openPopup3={openPopup3}
        setOpenPopup3={setOpenPopup3}
        team={true}
        filterValue={filterValue}
      />
    </>
  );
};

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
