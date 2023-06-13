import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeadServices from "../services/LeadService";
import DashboardService from "../services/DashboardService";
import { Popup } from "../Components/Popup";
import { DispatchData } from "./DispatchData";
import { CustomLoader } from "../Components/CustomLoader";
import InvoiceServices from "../services/InvoiceService";
import { StaffDashboard } from "./StaffDashboard";
import { SalesDashboard } from "./SalesDashboard";

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
  const [monthlyStatus, setMonthlyStatus] = useState([]);
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [dailyStatus, setDailyStatus] = useState([]);
  const [callPerformance, setCallPerformance] = useState([]);
  const [dispatchDataByID, setDispatchDataByID] = useState(null);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState(null);
  const [total, setTotal] = useState(0);
  const [filterValue, setFilterValue] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  // const userData = data.profile;
  useEffect(() => {
    getAllTaskDetails();
    getCustomerDetails();
    getAssignedData();
    getAllDispatchData();
    getNewCustomerDetails();
    getPendingTaskDetails();
    getPendingFollowupDetails();
    getPIDetails();
    getPendingDescriptionDetails();
    getMonthlyCallStatusDetails();
    getWeeklyCallStatusDetails();
    getDailyCallStatusDetails();
    getDescriptionQuantityDetails();
    getCallPerformanceDetails();
  }, []);

  useEffect(() => {
    getForecastDetails();
  }, [userData]);

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
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
          label: "Oppurtunity",
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
      const users = userData !== null ? userData.is_staff : "";
      const forecastResponse = users
        ? await DashboardService.getConsLastThreeMonthForecastData()
        : await DashboardService.getLastThreeMonthForecastData();
      const Data = Object.keys(forecastResponse.data).flatMap((key) => {
        return forecastResponse.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            actual: item.actual,
            forecast: item.total_forecast,
          };
        });
      });

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

        return {
          combination: day,
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
      const response = await DashboardService.getCallPerformanceData();

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

  const handleAutocompleteChange = (value) => {
    setFilterValue(value);
    setAssign(value);
    getDataByFilter(value);
    getNewCustomerByFilter(value);
    getPendingTaskByFilter(value);
    getPendingFollowupByFilter(value);
    getPIByFilter(value);
    getCustomerByFilter(value);
    geTaskByFilter(value);
    getPendingDescriptionByFilter(value);
    getMonthlyCallStatusByFilter(value);
    getWeeklyCallStatusByFilter(value);
    getDailyCallStatusByFilter(value);
    getDescriptionQuantityByFilter(value);
    getCallPerformanceByFilter(value);
  };

  const getDataByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const forecastResponse =
        await DashboardService.getLastThreeMonthForecastDataByFilter(
          FilterData
        );
      const Data = Object.keys(forecastResponse.data).flatMap((key) => {
        return forecastResponse.data[key].map((item) => {
          return {
            combination: `${shortMonths[item.month - 1]}-${item.year}`,
            actual: item.actual,
            forecast: item.total_forecast,
          };
        });
      });

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
          label: "Oppurtunity",
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

        return {
          combination: day,
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

  const getCallPerformanceByFilter = async (value) => {
    try {
      const FilterData = value;
      setOpen(true);
      const response = await DashboardService.getCallPerformanceDataByFilter(
        FilterData
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

  const getResetData = () => {
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
  };

  const handleSegmentHover = (segment) => {
    setHoveredSegment(segment);
  };

  const handleSegmentLeave = () => {
    setHoveredSegment(null);
  };

  const handlePieChartClick = () => {
    navigate("/task/view-task");
  };

  const handlePendingFollowup = () => {
    navigate("/leads/view-followup");
  };
  const handleRowClick = (row) => {
    if (row.label === "New") {
      navigate("/leads/new-lead");
    }
    if (row.label === "Open") {
      navigate("/leads/open-lead");
    }
    if (row.label === "Oppurtunity") {
      navigate("/leads/opportunity-lead");
    }
    if (row.label === "Potential") {
      navigate("/leads/potential-lead");
    }
    if (row.label === "Not Interested") {
      navigate("/leads/not_interested-lead");
    }
    if (row.label === "Converted") {
      navigate("/leads/converted-lead");
    }
  };

  const handleDispatch = (row) => {
    setDispatchDataByID(row);
    setOpenPopup2(true);
  };

  return (
    <>
      <CustomLoader open={open} />
      {/* filter by sales person */}
      {userData.is_staff === true && (
        <StaffDashboard
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
          handlePieChartClick={handlePieChartClick}
          handleDispatch={handleDispatch}
          handlePendingFollowup={handlePendingFollowup}
          funnelData={funnelData}
          hoveredSegment={hoveredSegment}
          handleRowClick={handleRowClick}
          descriptionQuantity={descriptionQuantity}
          callPerformance={callPerformance}
        />
      )}
      {userData.groups.includes("Sales") && userData.is_staff !== true && (
        <SalesDashboard
          barChartData={barChartData}
          pieChartData={pieChartData}
          newCustomerData={newCustomerData}
          pendingTask={pendingTask}
          pendingFollowup={pendingFollowup}
          pendingDescription={pendingDescription}
          piData={piData}
          monthlyStatus={monthlyStatus}
          weeklyStatus={weeklyStatus}
          dailyStatus={dailyStatus}
          handleSegmentHover={handleSegmentHover}
          total={total}
          handlePieChartClick={handlePieChartClick}
          handleDispatch={handleDispatch}
          handlePendingFollowup={handlePendingFollowup}
          funnelData={funnelData}
          hoveredSegment={hoveredSegment}
          handleRowClick={handleRowClick}
          descriptionQuantity={descriptionQuantity}
          callPerformance={callPerformance}
        />
      )}
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
