import React from "react";
import { Box, Grid, Paper } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";

export const DescriptionWiseTurnover = ({
  descriptionWiseTurnoverFilterData,
}) => {
  const Tableheaders = ["Description", "Brand", "Turnover"];

  const Tabledata =
    descriptionWiseTurnoverFilterData.length > 0 &&
    descriptionWiseTurnoverFilterData.map((row, i) => ({
      description: row.product__description__name,
      brand: row.product__brand__name,
      turnover: row.turnover,
    }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
            }}
          >
            DESCRIPTION WISE TURNOVER
          </h3>
        </Box>
        {descriptionWiseTurnoverFilterData.length > 0 && (
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
        )}
      </Paper>
    </Grid>
  );
};
