import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { TransporterList } from "./TransporterList";
import { TransporterWorkspace } from "./TransporterWorkspace";

export const TransportersHome = () => {
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  if (selectedTransporter) {
    return (
      <Box>
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedTransporter(null)}
          >
            Back to Transporters
          </Button>
        </Box>
        <TransporterWorkspace
          transporterId={selectedTransporter.id}
          initialTransporter={selectedTransporter}
        />
      </Box>
    );
  }

  return <TransporterList onOpenTransporter={setSelectedTransporter} />;
};

export default TransportersHome;
