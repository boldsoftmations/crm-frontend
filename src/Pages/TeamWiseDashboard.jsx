import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/DashboardService";
import { Popup } from "../Components/Popup";
import { DispatchData } from "./DispatchData";
import { CustomLoader } from "../Components/CustomLoader";
import InvoiceServices from "../services/InvoiceService";
import { SalesTeamAnalytics } from "./SalesTeamAnalytics";

export const TeamWiseDashboard = () => {
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
  // Set the initial startDate to the first day of the current month
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
  useEffect(() => {
    getConsAllTaskDetails();
    getConsCustomerDetails();
    getConsAllDispatchData();
    getConsNewCustomerDetails();
    getConsPendingTaskDetails();
    getConsPendingFollowupDetails();
    getConsPIDetails();
    getConsPendingDescriptionDetails();
    getConsMonthlyCallStatusDetails();
    getConsWeeklyCallStatusDetails();
    getConsDailyCallStatusDetails();
    getConsDescriptionQuantityDetails();
    getConsDailyInvoiceQuantityDetails();
    getConsDailyOrderBookQuantityDetails();
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

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDate(selectedValue);
    if (selectedValue === "Today") {
      const currentDate = new Date();
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1); // Set the next day from the current date
      setStartDate(currentDate);
      setEndDate(nextDate);
    } else if (selectedValue === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setEndDate(yesterday);
      setStartDate(yesterday);
    } else if (selectedValue === "Last 7 Days") {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // Set the next day from the current date
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Set the start date 7 days ago
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last 30 Days") {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // Set the next day from the current date
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "This Month") {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Set the next month from the current date
      const startDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 1,
        1
      );
      endDate.setDate(endDate.getDate() + 1); // Set the next day from the current date
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Last Month") {
      const endDate = new Date();
      endDate.setDate(0); // Set the last day of the previous month
      const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      endDate.setDate(endDate.getDate() + 1); // Set the next day from the current date
      setEndDate(endDate);
      setStartDate(startDate);
    } else if (selectedValue === "Custom Date") {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // Set the next day from the current date
      setStartDate(startDate);
      setEndDate(endDate);
      setOpenPopup3(true);
    }
  };

  const getResetData = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setAssign(null);
  };

  const getConsAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsLeadDashboard();
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

  const getConsCustomerDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsCustomerDashboard();
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

  const getConsAllDispatchData = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getConsDispatchDashboardData();
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

  const getConsNewCustomerDetails = async () => {
    try {
      setOpen(true);
      const newcustomerResponse =
        await DashboardService.getConsConsNewCustomerData();
      const Data = Object.keys(newcustomerResponse.data).flatMap((key) => {
        return newcustomerResponse.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            count: item.count,
          };
        });
      });

      setNewCustomerData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  const getConsPendingTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsPendingTaskData();

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

  const getConsPendingFollowupDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsPendingFollowupData();

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

  const getConsPIDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsPIData();
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

  const getConsPendingDescriptionDetails = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getConsDescriptionWisePendingQuantityData();
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

  const getConsMonthlyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getConsMonthlyCallStatusData();
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

  const getConsWeeklyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getConsWeeklyCallStatusData();
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

  const getConsDailyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getConsDailyCallStatusData();
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

  const getConsDescriptionQuantityDetails = async () => {
    try {
      setOpen(true);
      const response =
        await DashboardService.getConsDescriptionWiseQuantityData();
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

  const getConsCallPerformanceDetails = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
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
      setAssign(value.email);
      getConsDataByFilter(value.email);
      getConsNewCustomerByFilter(value.email);
      getConsPendingTaskByFilter(value.email);
      getConsPendingFollowupByFilter(value.email);
      getConsPIByFilter(value.email);
      getConsCustomerByFilter(value.email);
      getConsTaskByFilter(value.email);
      getConsPendingDescriptionByFilter(value.email);
      getConsMonthlyCallStatusByFilter(value.email);
      getConsWeeklyCallStatusByFilter(value.email);
      getConsDailyCallStatusByFilter(value.email);
      getConsDescriptionQuantityByFilter(value.email);
      getConsCallPerformanceByFilter(value.email, startDate, endDate);
      getConsDailyInvoiceQuantityByFilter(value.email);
      getConsDailyOrderBookQuantityByFilter(value.email);
    } else {
      // Handle the case when value is null (i.e., when the Autocomplete is reset)
      getConsForecastDetails();
      getConsNewCustomerDetails();
      getConsPendingTaskDetails();
      getConsPendingFollowupDetails();
      getConsCustomerDetails();
      getConsPIDetails();
      getConsAllTaskDetails();
      setAssign(null);
      getConsPendingDescriptionDetails();
      setFilterValue(null);
      getConsMonthlyCallStatusDetails();
      getConsWeeklyCallStatusDetails();
      getConsDailyCallStatusDetails();
      getConsDescriptionQuantityDetails();
      getConsCallPerformanceDetails();
      getConsDailyInvoiceQuantityDetails();
      getConsDailyOrderBookQuantityDetails();
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

  const getConsNewCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const newcustomerResponse =
        await DashboardService.getConsNewCustomerDataByFilter(FilterData);
      const Data = Object.keys(newcustomerResponse.data).flatMap((key) => {
        return newcustomerResponse.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            count: item.count,
          };
        });
      });

      setNewCustomerData(Data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getConsPendingTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getConsPendingTaskDataByFilter(
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

  const getConsPendingFollowupByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsPendingFollowupDataByFilter(FilterData);
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

  const getConsPIByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getConsPIDataByFilter(FilterData);
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

  const getConsCustomerByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getConsCustomerDataByFilter(
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

  const getConsTaskByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getConsLeadDataByFilter(
        FilterData
      );
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

  const getConsPendingDescriptionByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsDescriptionWisePendingQuantityDataByFilter(
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

  const getConsMonthlyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsMonthlyCallStatusDataByFilter(FilterData);
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

  const getConsWeeklyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsWeeklyCallStatusDataByFilter(FilterData);
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

  const getConsDailyCallStatusByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsDailyCallStatusDataByFilter(FilterData);
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

  const getConsDescriptionQuantityByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response =
        await DashboardService.getConsDescriptionWiseQuantityDataByFilter(
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
      <SalesTeamAnalytics
        barChartData={barChartData}
        pieChartData={pieChartData}
        horizontalBarData={horizontalBarData}
        newCustomerData={newCustomerData}
        pendingTask={pendingTask}
        pendingFollowup={pendingFollowup}
        pendingDescription={pendingDescription}
        piData={piData}
        monthlyStatus={monthlyStatus}
        weeklyStatus={weeklyStatus}
        dailyStatus={dailyStatus}
        handleSegmentHover={handleSegmentHover}
        handleAutocompleteChange={handleAutocompleteChange}
        assign={assign}
        total={total}
        assigned={assigned}
        getResetData={getResetData}
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
