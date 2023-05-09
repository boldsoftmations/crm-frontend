import React from "react";
import { Box, Divider, Grid, Paper } from "@mui/material";

export const ViewAllPotential = (props) => {
  const { leadsByID } = props;

  return (
    <>
      {leadsByID.potential && (
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Paper
            sx={{
              p: 2,
              m: 4,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Box display="flex">
              <Box flexGrow={0.9} align="left"></Box>
              <Box flexGrow={2.5} align="center">
                <h3 className="Auth-form-title">View Potential</h3>
              </Box>
              <Box flexGrow={0.3} align="right"></Box>
            </Box>

            {leadsByID.potential.map((potentialInput, index) => {
              return (
                <>
                  <Grid
                    key={index}
                    sx={{ marginBottom: "1em", marginTop: "1em" }}
                    container
                    spacing={2}
                  >
                    <Grid item xs={24} sm={4}>
                      ProductName :{" "}
                      {potentialInput.product ? potentialInput.product : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Brand :{" "}
                      {potentialInput.current_brand
                        ? potentialInput.current_brand
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Buying Price :{" "}
                      {potentialInput.current_buying_price
                        ? potentialInput.current_buying_price
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Buying Quantity :{" "}
                      {potentialInput.current_buying_quantity}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Target Price :{" "}
                      {potentialInput.target_price
                        ? potentialInput.target_price
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Qunatity :{" "}
                      {potentialInput.quantity ? potentialInput.quantity : ""}
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })}
          </Paper>
        </Box>
      )}
    </>
  );
};
