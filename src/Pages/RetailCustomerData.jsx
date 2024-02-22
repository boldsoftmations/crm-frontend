import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import CustomAutocomplete from "../Components/CustomAutocomplete";
import CustomTextField from "../Components/CustomTextField";
import DashboardService from "../services/DashboardService";

const StateOption = [
  { id: 1, value: "All", label: "All States" },
  {
    id: 1,
    value: "Andhra Pradesh",
    label: "Andhra Pradesh",
  },

  {
    id: 2,
    value: "Arunachal Pradesh",
    label: "Arunachal Pradesh",
  },
  {
    id: 3,
    value: "Assam",
    label: "Assam",
  },
  {
    id: 4,
    value: "Bihar",
    label: "Bihar",
  },
  {
    id: 5,
    value: "Chhattisgarh",
    label: "Chhattisgarh",
  },
  {
    id: 6,
    value: "Goa",
    label: "Goa",
  },
  {
    id: 7,
    value: "Gujarat",
    label: "Gujarat",
  },
  {
    id: 8,
    value: "Haryana",
    label: "Haryana",
  },
  {
    id: 9,
    value: "Himachal Pradesh",
    label: "Himachal Pradesh",
  },
  {
    id: 10,
    value: "Jharkhand",
    label: "Jharkhand",
  },
  {
    id: 11,
    value: "Karnataka",
    label: "Karnataka",
  },
  {
    id: 12,
    value: "Kerala",
    label: "Kerala",
  },
  {
    id: 13,
    value: "Madhya Pradesh",
    label: "Madhya Pradesh",
  },
  {
    id: 14,
    value: "Maharashtra",
    label: "Maharashtra",
  },
  {
    id: 15,
    value: "Manipur",
    label: "Manipur",
  },
  {
    id: 16,
    value: "Meghalaya",
    label: "Meghalaya",
  },
  {
    id: 17,
    value: "Mizoram",
    label: "Mizoram",
  },
  {
    id: 18,
    value: "Nagaland",
    label: "Nagaland",
  },
  {
    id: 19,
    value: "Odisha",
    label: "Odisha",
  },
  {
    id: 20,
    value: "Punjab",
    label: "Punjab",
  },
  {
    id: 21,
    value: "Rajasthan",
    label: "Rajasthan",
  },
  {
    id: 22,
    value: "Sikkim",
    label: "Sikkim",
  },
  {
    id: 23,
    value: "Tamil Nadu",
    label: "Tamil Nadu",
  },
  {
    id: 24,
    value: "Telangana",
    label: "Telangana",
  },
  {
    id: 25,
    value: "Tripura",
    label: "Tripura",
  },
  {
    id: 26,
    value: "Uttar Pradesh",
    label: "Uttar Pradesh",
  },
  {
    id: 27,
    value: "Uttarakhand",
    label: "Uttarakhand",
  },
  {
    id: 28,
    value: "West Bengal",
    label: "West Bengal",
  },
  {
    id: 28,
    value: "New Delhi",
    label: "New Delhi",
  },
  {
    id: 29,
    value: "Jammu & Kashmir",
    label: "Jammu & Kashmir",
  },
  {
    id: 30,
    value: "Ladakh",
    label: "Ladakh",
  },
];

export const RetailCustomerData = () => {
  const [retailers, setRetailers] = useState([]);
  const [filterState, setFilterState] = useState(StateOption[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retailerCustomerCount, setRetailerCustomerCount] = useState(0);
  const [deadCustomerCount, setDeadCustomerCount] = useState(0);

  useEffect(() => {
    // This effect will now re-fetch data whenever filterState changes.
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await DashboardService.getRetailerCustomerData(
          filterState.value
        ); // Assume service can handle 'All' or specific state
        setRetailers(response.data.state_based_count || []);
        setRetailerCustomerCount(response.data.retailer_customer_count);
        setDeadCustomerCount(response.data.dead_retailer_customer_count);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterState]);

  const handleStateChange = (_, newValue) => {
    setFilterState(newValue || StateOption[0]);
  };

  const filteredRetailers = retailers.filter((retailer) =>
    filterState && filterState.value === "All"
      ? true
      : filterState && retailer.state === filterState.value
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <CustomAutocomplete
              size="small"
              value={filterState}
              onChange={handleStateChange}
              options={StateOption}
              getOptionLabel={(option) => option.label || ""}
              fullWidth
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Select State"
                  variant="outlined"
                  margin="normal"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === (value && value.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" align="right">
              Retailer Customer Count: {retailerCustomerCount}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2}>
          {filteredRetailers.map((retailer, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">
                    Count: {retailer.count}
                  </Typography>
                  <Typography color="textSecondary">
                    State: {retailer.state}
                  </Typography>
                  <Typography variant="body2">
                    Status: {retailer.count > 0 ? "Active" : "Inactive"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};
