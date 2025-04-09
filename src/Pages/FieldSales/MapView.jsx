import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export const SimpleMapView = ({ latitude, longitude, title = "Location" }) => {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.005
  },${latitude - 0.005},${longitude + 0.005},${
    latitude + 0.005
  }&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        mb: 2,
        borderRadius: 2,
        maxWidth: "100%",
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Box
        component="iframe"
        src={mapUrl}
        width="100%"
        height="300"
        style={{
          border: "none",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        loading="lazy"
        allowFullScreen
        title={title}
      />
    </Paper>
  );
};
