import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";

import Hr from "../../../services/Hr";
import { OfferStatusUpdate } from "./OfferStatusUpdate";

export const OfferStatusView = () => {
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchOffers = async () => {
    try {
      const response = await Hr.getOfferStatus();
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateComplete = () => {
    fetchOffers();
  };

  const TableHeader = [
    "Id",
    "Candidate Name",
    "Designation",
    "Offer Status",
    "Joining Date",
    "Action",
  ];
  const TableData = offers.map((offer) => ({
    id: offer.id,
    name: offer.name,
    designation: offer.designation,
    status: offer.offer_status,
    joining_date: offer.joining_date || null,
  }));

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box flexGrow={1} display="flex" justifyContent="center">
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
            }}
          >
            Offer Status
          </h3>
        </Box>
        <Paper sx={{ p: 2, m: 3 }}>
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleClickOpen}
          />
        </Paper>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Offer Status Update</DialogTitle>
          <DialogContent>
            <OfferStatusUpdate
              row={selectedRow}
              closeDialog={handleClose}
              onUpdateComplete={handleUpdateComplete}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Grid>
  );
};
