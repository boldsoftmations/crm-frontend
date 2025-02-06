import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Card, CardContent, CardHeader } from "@mui/material";
import DashboardService from "../../services/DashboardService";

export const RetailCustomerData = () => {
  const [retailers, setRetailers] = useState([]);
  const [retailerCustomerCount, setRetailerCustomerCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardService.getRetailerCustomerData();
        setRetailers(response.data.state_based_count || []);
        setRetailerCustomerCount(response.data.retailer_customer_count);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const data = {
    retailerCustomerCount: retailerCustomerCount,
    stateBasedCount: retailers,
  };

  // Aggregate counts for states with case differences
  const aggregatedData = data.stateBasedCount;

  const chartData = [
    ["State", "Customer Count"],
    ...Object.values(aggregatedData).map((item) => [item.state, item.count]),
  ];

  const options = {
    title: "Active State-Based Customer Distribution",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Customer Count",
      minValue: 0,
    },
    vAxis: {
      title: "State",
    },
  };

  return (
    <div className="p-4 grid gap-4">
      <Card className="shadow-lg mb-2">
        <CardContent>
          <h2 className="text-md font-extrabold tracking-tight text-center">
            Distribution Customer Count:{" "}
            <span className="mx-2"> {data.retailerCustomerCount}</span>
          </h2>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold">Customer Count by State</h2>
        </CardHeader>
        <CardContent>
          <Chart
            chartType="BarChart"
            data={chartData}
            options={options}
            width="100%"
            height="400px"
          />
        </CardContent>
      </Card>
    </div>
  );
};
