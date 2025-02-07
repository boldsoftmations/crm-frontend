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
  // const [pendingTask, setPendingTask] = useState([]);
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
  const [openPopup3, setOpenPopup3] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
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
  const [selectedDate, setSelectedDate] = useState("Today");
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startDate, setStartDate] = useState(initialStartDate); // set default value as current date
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  useEffect(() => {
    getConsAllTaskDetails();
    getConsCustomerDetails();
    getConsNewCustomerDetails();
    // getConsPendingTaskDetails();
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
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setSelectedDate("This Month");
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

  const getConsNewCustomerDetails = async () => {
    try {
      setOpen(true);
      const newcustomerResponse =
        await DashboardService.getConsNewCustomerData();
      const Data = newcustomerResponse.data.map((item) => ({
        combination: `${shortMonths[item.month - 1]}-${item.year}`,
        count: item.count,
      }));

      setNewCustomerData(Data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error:", err);
    }
  };

  // const getConsPendingTaskDetails = async () => {
  //   try {
  //     setOpen(true);
  //     const response = await DashboardService.getConsPendingTaskData();

  //     const Data = [
  //       {
  //         label: "Activity",
  //         value: response.data.atleast_one_activity,
  //       },
  //       {
  //         label: "No Activity",
  //         value: response.data.no_activity,
  //       },
  //       {
  //         label: "Overdue Tasks",
  //         value: response.data.overdue_tasks,
  //       },
  //     ];
  //     setPendingTask(Data);
  //     setOpen(false);
  //   } catch (err) {
  //     setOpen(false);
  //     console.log("err", err);
  //   }
  // };

  const getConsPendingFollowupDetails = async () => {
    try {
      setOpen(true);
      const response = await DashboardService.getConsPendingFollowupData();

      const Data = [
        {
          label: "Upcoming FollowUp",
          value: response.data.upcoming_follow_ups,
        },
        {
          label: "Today FollowUp",
          value: response.data.todays_followups,
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

  const getConsWeeklyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getConsWeeklyCallStatusData();
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

  const getConsDailyCallStatusDetails = async () => {
    try {
      setOpen(true);

      const response = await DashboardService.getConsDailyCallStatusData();
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
      // getConsPendingTaskByFilter(value.email);
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
      // getConsPendingTaskDetails();
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

  // const getConsPendingTaskByFilter = async (value) => {
  //   try {
  //     const FilterData = value;
  //     setOpen(true);
  //     const response = await DashboardService.getConsPendingTaskDataByFilter(
  //       FilterData
  //     );
  //     const Data = [
  //       {
  //         label: "Activity",
  //         value: response.data.atleast_one_activity,
  //       },
  //       {
  //         label: "No Activity",
  //         value: response.data.no_activity,
  //       },
  //       {
  //         label: "Overdue Tasks",
  //         value: response.data.overdue_tasks,
  //       },
  //     ];

  //     setPendingTask(Data);

  //     setOpen(false);
  //   } catch (error) {
  //     console.log("error", error);
  //     setOpen(false);
  //   }
  // };

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
        // pendingTask={pendingTask}
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
