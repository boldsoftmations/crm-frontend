import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { TransporterList } from "./TransporterList";
import { TransporterWorkspace } from "./TransporterWorkspace";

// GAP FIX (1/3): the "Transporters" top-level tab now shows the search+list
// screen first (TransporterList), and only shows the single-record
// TransporterWorkspace once a transporter is actually opened from that
// list. This is what replaces the old "Viewing Transporter ID" text box.
export const TransportersHome = () => {
  const [selectedTransporterId, setSelectedTransporterId] = useState(null);

  if (selectedTransporterId) {
    return (
      <Box>
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedTransporterId(null)}
          >
            Back to Transporters
          </Button>
        </Box>
        <TransporterWorkspace transporterId={selectedTransporterId} />
      </Box>
    );
  }

  return <TransporterList onOpenTransporter={setSelectedTransporterId} />;
};

export default TransportersHome;
