import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Chip } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomLoader } from "../../Components/CustomLoader";
import { SimpleMapView } from "./MapView";

export const CustomerVisitView = ({ visitLogId, type }) => {
  const [customerData, setCustomerData] = useState(null);
  const [open, setOpen] = useState(false);

  const getCustomerVisitDataById = useCallback(async () => {
    try {
      setOpen(true);
      const fetchFun =
        type === "lead"
          ? CustomerServices.getLeadVisitDataById
          : CustomerServices.getCustomerVisitDataById;
      const res = await fetchFun(visitLogId);
      setCustomerData(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  }, [visitLogId]);

  useEffect(() => {
    getCustomerVisitDataById();
  }, [visitLogId]);

  return (
    <>
      <CustomLoader open={open} />
      <Grid container spacing={2}>
        {/* Left Column - Text Details */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1.5}>
            <Typography variant="body1">
              <strong>Customer:</strong> {customerData && customerData.customer}
            </Typography>
            <Typography variant="body1">
              <strong>Check-In Time:</strong>{" "}
              {customerData && customerData.check_in_time}
            </Typography>
            <Typography variant="body1">
              <strong>Check-Out Time:</strong>{" "}
              {(customerData && customerData.check_out_time) ||
                "Not Checked Out"}
            </Typography>

            <Typography variant="body1" display="flex" gap={2}>
              <strong>Visit Verified:</strong>{" "}
              <Box>
                <Chip
                  label={
                    customerData && customerData.visit_verified
                      ? "Verified"
                      : "Not Verified"
                  }
                  color={
                    customerData && customerData.visit_verified
                      ? "success"
                      : "error"
                  }
                />
              </Box>
            </Typography>
            <Typography variant="body1">
              <strong>Comment:</strong>{" "}
              {(customerData && customerData.comment) || "No comment added"}
            </Typography>
          </Stack>
        </Grid>

        {/* Right Column - Image + Maps */}
        <Grid item xs={12} md={6}>
          {customerData && customerData.visit_image && (
            <Box mb={3}>
              <Box
                component="img"
                src={customerData && customerData.visit_image}
                alt="Visit"
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <SimpleMapView
              latitude={customerData && customerData.check_in_latitude}
              longitude={customerData && customerData.check_in_longitude}
              title="Check-In Location"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {customerData &&
            customerData.check_out_latitude &&
            customerData &&
            customerData.check_out_longitude && (
              <Box>
                <SimpleMapView
                  latitude={customerData && customerData.check_out_latitude}
                  longitude={customerData && customerData.check_out_longitude}
                  title="Check-Out Location"
                />
              </Box>
            )}
        </Grid>
      </Grid>
    </>
  );
};
