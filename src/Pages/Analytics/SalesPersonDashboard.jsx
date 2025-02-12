import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardService from "../../services/DashboardService";
import { CustomLoader } from "../../Components/CustomLoader";
import { SalesPersonAnalytics } from "./SalesPersonAnalytics";

export const SalesPersonDashboard = () => {
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
  const [indiaMartLeadData, setIndiaMartLeadData] = useState([]);
  const [monthlyStatus, setMonthlyStatus] = useState([]);
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [dailyStatus, setDailyStatus] = useState([]);
  const [callPerformance, setCallPerformance] = useState([]);
  const [callDashboardData, setCallDashboardData] = useState(null);
  const [dailyInvoiceQuantity, setDailyInvoiceQuantity] = useState([]);
  const [dailyOrderBookQuantity, setDailyOrderBookQuantity] = useState([]);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  // Get the current date
  const currentDate = new Date();

  const [selectedDate, setSelectedDate] = useState("Today");
  const [endDate, setEndDate] = useState(currentDate);
  const [startDate, setStartDate] = useState(currentDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const [selectedWeek, setSelectedWeek] = useState(formattedCurrentDate);
  useEffect(() => {
    getSalesAnalyticDashboard();
    getIndiaMartLeadDetails();
    getMonthlyCallStatusDetails();
    getWeeklyCallStatusDetails();
    getDailyCallStatusDetails();
    getDailyInvoiceQuantityDetails();
    getDailyOrderBookQuantityDetails();
    getCallPerformanceDetails();
  }, []);

  useEffect(() => {
    getForecastDetails();
  }, [userData]);

  useEffect(() => {
    if (filterValue) {
      getFollowupCallDashboard(filterValue);
      getCallPerformanceByFilter(filterValue, startDate, endDate);
    } else {
      getFollowupCallDashboard();
      getCallPerformanceDetails();
    }
  }, [startDate, endDate, filterValue]);

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleDateChange = (event) => {
    setSelectedWeek(event.target.value);
    getIndiaMartLeadByFilter(event);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDate(selectedValue);

    const today = new Date();
    let startDate, endDate;

    switch (selectedValue) {
      case "Today":
        startDate = today;
        endDate = today;
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

  const getSalesAnalyticDashboard = async (email) => {
    try {
      setOpen(true);
      const response = await DashboardService.getSalesAnalyticDashboard(
        email ? email : ""
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

  const getForecastDetails = async () => {
    try {
      setOpen(true);
      const forecastResponse =
        await DashboardService.getLastThreeMonthForecastData();
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

  const getIndiaMartLeadDetails = async () => {
    try {
      setOpen(true);
      const indiaMartLeadResponse =
        await DashboardService.getIndiaMartLeadData();
      const formattedData = indiaMartLeadResponse.data.map((item) => {
        return {
          day: item.day,
          totalLeads: item.total_leads,
        };
      });
      setIndiaMartLeadData(formattedData);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("Error:", err);
    }
  };

  const getMonthlyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getMonthlyCallStatusData();
      const data = response.data;
      const Data = Object.keys(data).map((key) => {
        return {
          combination: key,
          existing_lead: data[key].existing_lead,
          new_lead: data[key].new_lead,
          customer: data[key].customer,
        };
      });

      setMonthlyStatus(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getWeeklyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getWeeklyCallStatusData();

      const data = response.data;
      const Data = Object.keys(data).map((key) => {
        return {
          combination: key,
          existing_lead: data[key].existing_lead,
          new_lead: data[key].new_lead,
          customer: data[key].customer,
        };
      });

      setWeeklyStatus(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getDailyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getDailyCallStatusData();

      const data = response.data;
      const Data = Object.keys(data).map((key) => {
        return {
          combination: key,
          existing_lead: data[key].existing_lead,
          new_lead: data[key].new_lead,
          customer: data[key].customer,
        };
      });
      setDailyStatus(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getAbbreviatedDay = (fullDay) => {
    const fullDayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const abbreviatedDayNames = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    const index = fullDayNames.indexOf(fullDay);
    if (index !== -1) {
      return abbreviatedDayNames[index];
    }

    // If the full day name is not found, return the original value
    return fullDay;
  };

  const getCallPerformanceDetails = async () => {
    try {
      setOpen(true);
      const timezoneOffset = startDate.getTimezoneOffset() * 60000; // Offset in milliseconds
      const adjustedStartDate = new Date(startDate.getTime() - timezoneOffset);
      const adjustedEndDate = new Date(endDate.getTime() - timezoneOffset);

      const StartDate = adjustedStartDate.toISOString().split("T")[0];
      const EndDate = adjustedEndDate.toISOString().split("T")[0];

      const response = await DashboardService.getCallPerformanceData(
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
  const getFollowupCallDashboard = async (value) => {
    try {
      setOpen(true);
      const start_date = startDate.toISOString().split("T")[0];
      const end_date = endDate.toISOString().split("T")[0];
      const response = await DashboardService.getFollowupCallDashboard(
        value ? value : "",
        start_date,
        end_date
      );
      setCallDashboardData(response.data);
    } catch {
      setOpen(false);
      console.log("Error fetching followup call dashboard data");
    } finally {
      setOpen(false);
    }
  };

  const getDailyInvoiceQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getDailyInvoiceQuantityData();
      setDailyInvoiceQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getDailyOrderBookQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getDailyOrderBookQuantityData();
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
      getDailyOrderBookQuantityByFilter(value.email);
      setAssign(value.email);
      getMonthlyCallStatusByFilter(value.email);
      getWeeklyCallStatusByFilter(value.email);
      getDailyCallStatusByFilter(value.email);
      getDailyInvoiceQuantityByFilter(value.email);
    } else {
      getForecastDetails();
      getSalesAnalyticDashboard();
      getDailyInvoiceQuantityDetails();
      getDailyOrderBookQuantityDetails();
      setFilterValue(null);
      getMonthlyCallStatusDetails();
      getWeeklyCallStatusDetails();
      getDailyCallStatusDetails();
      getFollowupCallDashboard();
      getCallPerformanceDetails();
    }
  };

  const getIndiaMartLeadByFilter = async (event) => {
    try {
      setOpen(true);
      const FilterData = event.target.value;
      const indiaMartLeadResponse =
        await DashboardService.getIndiaMartLeadDataByFilter(FilterData);
      const formattedData = indiaMartLeadResponse.data.map((item) => {
        return {
          day: item.day,
          totalLeads: item.total_leads,
        };
      });
      setIndiaMartLeadData(formattedData);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getMonthlyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getMonthlyCallStatusDataByFilter(
        FilterData
      );
      const Data = Object.keys(response.data).flatMap((key) => {
        return response.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            existing_lead: item.existing_lead,
            new_lead: item.new_lead,
            customer: item.customer,
          };
        });
      });

      setMonthlyStatus(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getWeeklyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getWeeklyCallStatusDataByFilter(
        FilterData
      );
      const Data = response.data.map((dayObject) => {
        const week = Object.keys(dayObject)[0];
        const weekData = dayObject[week][0];

        return {
          combination: week,
          existing_lead: weekData.existing_lead,
          new_lead: weekData.new_lead,
          customer: weekData.customer,
        };
      });

      setWeeklyStatus(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getDailyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getDailyCallStatusDataByFilter(
        FilterData
      );
      const Data = response.data.map((dayObject) => {
        const day = Object.keys(dayObject)[0];
        const dayData = dayObject[day][0];

        // Convert full day name to abbreviated form
        const abbreviatedDay = getAbbreviatedDay(day);

        return {
          combination: abbreviatedDay,
          existing_lead: dayData.existing_lead,
          new_lead: dayData.new_lead,
          customer: dayData.customer,
        };
      });

      setDailyStatus(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getCallPerformanceByFilter = async (value, startDate, endDate) => {
    try {
      setOpen(true);
      const FilterData = value;
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await DashboardService.getCallPerformanceDataByFilter(
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

  const getDailyInvoiceQuantityByFilter = async (value) => {
    try {
      setOpen(true);
      const FilterData = value;
      const response =
        await DashboardService.getDailyInvoiceQuantityDataByFilter(FilterData);
      setDailyInvoiceQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getDailyOrderBookQuantityByFilter = async (value) => {
    try {
      setOpen(true);
      const FilterData = value;
      const response =
        await DashboardService.getDailyOrderBookQuantityDataByFilter(
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
      <SalesPersonAnalytics
        barChartData={barChartData}
        pieChartData={pieChartData}
        newCustomerData={newCustomerData}
        CallDashboardData={callDashboardData}
        pendingFollowup={pendingFollowup}
        pendingDescription={pendingDescription}
        piData={piData}
        indiaMartLeadData={indiaMartLeadData}
        monthlyStatus={monthlyStatus}
        weeklyStatus={weeklyStatus}
        dailyStatus={dailyStatus}
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
        team={false}
        selectedWeek={selectedWeek}
        handleDateChange={handleDateChange}
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
