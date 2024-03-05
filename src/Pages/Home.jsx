import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/DashboardService";
import { Popup } from "../Components/Popup";
import { DispatchData } from "./DispatchData";
import { CustomLoader } from "../Components/CustomLoader";
import InvoiceServices from "../services/InvoiceService";
import { SalesPersonAnalytics } from "./SalesPersonAnalytics";

export const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [funnelData, setFunnelData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [horizontalBarData, setHorizontalBarData] = useState([]);
  const [newCustomerData, setNewCustomerData] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [pendingFollowup, setPendingFollowup] = useState([]);
  const [pendingDescription, setPendingDescription] = useState([]);
  const [descriptionQuantity, setDescriptionQuantity] = useState([]);
  const [piData, setPiData] = useState([]);
  const [indiaMartLeadData, setIndiaMartLeadData] = useState([]);
  const [monthlyStatus, setMonthlyStatus] = useState([]);
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [dailyStatus, setDailyStatus] = useState([]);
  const [callPerformance, setCallPerformance] = useState([]);
  const [dailyInvoiceQuantity, setDailyInvoiceQuantity] = useState([]);
  const [dailyOrderBookQuantity, setDailyOrderBookQuantity] = useState([]);
  const [dispatchDataByID, setDispatchDataByID] = useState(null);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  // Get the current date
  const currentDate = new Date();
  const initialStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Set the initial endDate to the last day of the current month
  const initialEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const [selectedDate, setSelectedDate] = useState("This Month");
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startDate, setStartDate] = useState(initialStartDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const [selectedWeek, setSelectedWeek] = useState(formattedCurrentDate);
  useEffect(() => {
    getAllTaskDetails();
    getCustomerDetails();
    getAllDispatchData();
    getNewCustomerDetails();
    getPendingTaskDetails();
    getPendingFollowupDetails();
    getPIDetails();
    getIndiaMartLeadDetails();
    getPendingDescriptionDetails();
    getMonthlyCallStatusDetails();
    getWeeklyCallStatusDetails();
    getDailyCallStatusDetails();
    getDescriptionQuantityDetails();
    getDailyInvoiceQuantityDetails();
    getDailyOrderBookQuantityDetails();
  }, []);

  useEffect(() => {
    getForecastDetails();
  }, [userData]);

  useEffect(() => {
    if (filterValue) {
      getCallPerformanceByFilter(filterValue, startDate, endDate);
    } else {
      getCallPerformanceDetails();
    }
  }, [startDate, endDate]);

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
        startDate = new Date(today);
        endDate = new Date(today.getTime() + 86400000); // Plus 1 day
        break;
      case "Yesterday":
        startDate = new Date(today.setDate(today.getDate() - 1));
        endDate = new Date();
        break;
      case "Last 3 Days":
        startDate = new Date(today.setDate(today.getDate() - 2));
        endDate = new Date();
        break;
      case "Last 7 Days":
        startDate = new Date(today.setDate(today.getDate() - 6));
        endDate = new Date();
        break;
      case "Last 14 Days":
        startDate = new Date(today.setDate(today.getDate() - 13));
        endDate = new Date();
        break;
      case "Last 30 Days":
        startDate = new Date(today.setDate(today.getDate() - 29));
        endDate = new Date();
        break;
      case "Last 90 Days":
        startDate = new Date(today.setDate(today.getDate() - 89));
        endDate = new Date();
        break;
      case "Last 180 Days":
        startDate = new Date(today.setDate(today.getDate() - 179));
        endDate = new Date();
        break;
      case "Last 365 Days":
        startDate = new Date(today.setDate(today.getDate() - 364));
        endDate = new Date();
        break;
      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last Month":
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
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
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setSelectedDate("This Month");
  };

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getLeadDashboard();
      const Data = [
        { name: "new", label: "New", value: response.data.new },
        { name: "open", label: "Open", value: response.data.open },
        {
          name: "opportunity",
          label: "Opportunity",
          value: response.data.opportunity,
        },
        {
          name: "potential",
          label: "Potential",
          value: response.data.potential,
        },
        {
          name: "not_interested",
          label: "Not Interested",
          value: response.data.not_interested,
        },
        {
          name: "converted",
          label: "Converted",
          value: response.data.converted,
        },
      ];

      setFunnelData(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getCustomerDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getCustomerDashboard();
      const Total =
        response.data.active_customers +
        response.data.dead_customers +
        response.data.new_customers;
      setTotal(Total);
      const Data = [
        {
          label: "Active Customers",
          value: response.data.active_customers,
        },
        {
          label: "Dead Customers",
          value: response.data.dead_customers,
        },
        {
          label: "New Customers",
          value: response.data.new_customers,
        },
        {
          label: "Total",
          value: Total,
        },
      ];

      setPieChartData(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
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

  const getAllDispatchData = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getDispatchDashboardData();
      const Data = [
        { name: "LR-M1", value: response.data.LR_M1, unit: "M1", type: "LR" },
        { name: "LR-M2", value: response.data.LR_M2, unit: "M2", type: "LR" },
        { name: "LR-D1", value: response.data.LR_D1, unit: "D1", type: "LR" },
        {
          name: "POD-M1",
          value: response.data.POD_M1,
          unit: "M1",
          type: "POD",
        },
        {
          name: "POD-M2",
          value: response.data.POD_M2,
          unit: "M2",
          type: "POD",
        },
        {
          name: "POD-D1",
          value: response.data.POD_D1,
          unit: "D1",
          type: "POD",
        },
      ];
      setHorizontalBarData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getNewCustomerDetails = async () => {
    try {
      setOpen(true);
      const newcustomerResponse = await DashboardService.getNewCustomerData();
      const Data = newcustomerResponse.data.map((item) => {
        return {
          combination: `${shortMonths[item.month - 1]}-${item.year}`,
          count: item.count,
        };
      });
      setNewCustomerData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("Error:", err);
    }
  };

  const getPendingTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPendingTaskData();

      const Data = [
        {
          label: "Activity",
          value: response.data.atleast_one_activity,
        },
        {
          label: "No Activity",
          value: response.data.no_activity,
        },
        {
          label: "Overdue Tasks",
          value: response.data.overdue_tasks,
        },
      ];
      setPendingTask(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getPendingFollowupDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPendingFollowupData();

      const Data = [
        {
          label: "Upcoming FollowUp",
          value: response.data.upcoming_followups,
        },
        {
          label: "Today FollowUp",
          value: response.data.todays_follow_ups,
        },
        {
          label: "Overdue FollowUp",
          value: response.data.overdue_follow_ups,
        },
      ];

      setPendingFollowup(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getPIDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getPIData();
      const Data = [
        {
          label: "Paid PI",
          value: response.data.paid_pi,
        },
        {
          label: "Unpaid PI",
          value: response.data.unpaid_pi,
        },
        {
          label: "Dropped PI",
          value: response.data.dropped_pi,
        },
      ];

      setPiData(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
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

  const getPendingDescriptionDetails = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getDescriptionWisePendingQuantityData();
      const Data = response.data.map((item) => {
        return {
          name: item.product__description__name,
          value: item.total_pending_quantity,
        };
      });
      setPendingDescription(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  const getMonthlyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getMonthlyCallStatusData();
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
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getWeeklyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getWeeklyCallStatusData();
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
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getDailyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getDailyCallStatusData();
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

  const getDescriptionQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getDescriptionWiseQuantityData();
      const Data = response.data.map((item) => {
        return {
          name: item.product__description__name,
          value: item.total_quantity,
        };
      });
      setDescriptionQuantity(Data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
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
      setAssign(value.email);
      getDataByFilter(value.email);
      getNewCustomerByFilter(value.email);
      getPendingTaskByFilter(value.email);
      getPendingFollowupByFilter(value.email);
      getPIByFilter(value.email);
      getCustomerByFilter(value.email);
      geTaskByFilter(value.email);
      getPendingDescriptionByFilter(value.email);
      getMonthlyCallStatusByFilter(value.email);
      getWeeklyCallStatusByFilter(value.email);
      getDailyCallStatusByFilter(value.email);
      getDescriptionQuantityByFilter(value.email);
      getCallPerformanceByFilter(value.email, startDate, endDate);
      getDailyInvoiceQuantityByFilter(value.email);
      getDailyOrderBookQuantityByFilter(value.email);
    } else {
      // Handle the case when value is null (i.e., when the Autocomplete is reset)
      getForecastDetails();
      getNewCustomerDetails();
      getPendingTaskDetails();
      getPendingFollowupDetails();
      getCustomerDetails();
      getPIDetails();
      getAllTaskDetails();
      setAssign(null);
      getPendingDescriptionDetails();
      setFilterValue(null);
      getMonthlyCallStatusDetails();
      getWeeklyCallStatusDetails();
      getDailyCallStatusDetails();
      getDescriptionQuantityDetails();
      getCallPerformanceDetails();
      getDailyInvoiceQuantityDetails();
      getDailyOrderBookQuantityDetails();
    }
  };

  const getDataByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const forecastResponse =
        await DashboardService.getLastThreeMonthForecastDataByFilter(
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

  const getNewCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const newcustomerResponse =
        await DashboardService.getNewCustomerDataByFilter(FilterData);
      const Data = newcustomerResponse.data.map((item) => {
        return {
          combination: `${shortMonths[item.month - 1]}-${item.year}`,
          count: item.count,
        };
      });
      setNewCustomerData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPendingTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPendingTaskDataByFilter(
        FilterData
      );
      const Data = [
        {
          label: "Activity",
          value: response.data.atleast_one_activity,
        },
        {
          label: "No Activity",
          value: response.data.no_activity,
        },
        {
          label: "Overdue Tasks",
          value: response.data.overdue_tasks,
        },
      ];

      setPendingTask(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPendingFollowupByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPendingFollowupDataByFilter(
        FilterData
      );
      const Data = [
        {
          label: "Upcoming FollowUp",
          value: response.data.upcoming_followups,
        },
        {
          label: "Today FollowUp",
          value: response.data.todays_follow_ups,
        },
        {
          label: "Overdue FollowUp",
          value: response.data.overdue_follow_ups,
        },
      ];

      setPendingFollowup(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPIByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getPIDataByFilter(FilterData);
      const Data = [
        {
          label: "Paid PI",
          value: response.data.paid_pi,
        },
        {
          label: "Unpaid PI",
          value: response.data.unpaid_pi,
        },
        {
          label: "Dropped PI",
          value: response.data.dropped_pi,
        },
      ];

      setPiData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
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

  const getCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getCustomerDataByFilter(
        FilterData
      );
      const Total =
        response.data.active_customers +
        response.data.dead_customers +
        response.data.new_customers;
      setTotal(Total);
      const Data = [
        {
          label: "Active Customers",
          value: response.data.active_customers,
        },
        {
          label: "Dead Customers",
          value: response.data.dead_customers,
        },
        {
          label: "New Customers",
          value: response.data.new_customers,
        },
        {
          label: "Total",
          value: Total,
        },
      ];

      setPieChartData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const geTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getLeadDataByFilter(FilterData);
      const Data = [
        { name: "new", label: "New", value: response.data.new },
        { name: "open", label: "Open", value: response.data.open },
        {
          name: "opportunity",
          label: "Opportunity",
          value: response.data.opportunity,
        },
        {
          name: "potential",
          label: "Potential",
          value: response.data.potential,
        },
        {
          name: "not_interested",
          label: "Not Interested",
          value: response.data.not_interested,
        },
        {
          name: "converted",
          label: "Converted",
          value: response.data.converted,
        },
      ];

      setFunnelData(Data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getPendingDescriptionByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getDescriptionWisePendingQuantityDataByFilter(
          FilterData
        );
      const Data = response.data.map((item) => {
        return {
          name: item.product__description__name,
          value: item.total_pending_quantity,
        };
      });
      setPendingDescription(Data);

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

  const getDescriptionQuantityByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getDescriptionWiseQuantityDataByFilter(
          FilterData
        );
      const Data = response.data.map((item) => {
        return {
          name: item.product__description__name,
          value: item.total_quantity,
        };
      });
      setDescriptionQuantity(Data);

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

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };

  const handleRowClick = (row) => {
    if (row.label === "New") {
      navigate("/leads/new-lead");
    }
    if (row.label === "Open") {
      navigate("/leads/open-lead");
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <SalesPersonAnalytics
        barChartData={barChartData}
        pieChartData={pieChartData}
        horizontalBarData={horizontalBarData}
        newCustomerData={newCustomerData}
        pendingTask={pendingTask}
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
        assigned={assigned}
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
      <Popup
        maxWidth={"xl"}
        title={`View ${dispatchDataByID && dispatchDataByID.type} dashboard`}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <DispatchData
          dispatchDataByID={dispatchDataByID}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
