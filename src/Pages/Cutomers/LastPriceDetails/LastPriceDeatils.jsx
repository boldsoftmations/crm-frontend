import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Box, Snackbar, Alert } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";

export const LastPriceDeatils = ({ recordForEdit }) => {
  const [lastPrice, setLastPrice] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

  const extractErrorMessages = (data) => {
    let messages = [];
    if (data.errors) {
      for (const [key, value] of Object.entries(data.errors)) {
        // Assuming each key has an array of messages, concatenate them.
        value.forEach((msg) => {
          messages.push(`${key}: ${msg}`);
        });
      }
    }
    return messages;
  };

  useEffect(() => {
    getLastPriceData();
  }, []);

  const getLastPriceData = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataByIdWithType(
        recordForEdit,
        "last_price"
      );
      setLastPrice(response.data.last_price);
      setOpen(false);
    } catch (error) {
      console.log("getting Last Price api error", error);
      const newErrors = extractErrorMessages(error.response.data);
      setErrorMessages(newErrors);
      setCurrentErrorIndex(0); // Reset the error index when new errors arrive
      setOpenSnackbar((prevOpen) => !prevOpen);
    } finally {
      setOpen(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
    }
  }, [currentErrorIndex, errorMessages.length]);

  const TableHeader = [
    "PI",
    "Status",
    "Date",
    "Description",
    "Product",
    "Price",
    "Quantity",
  ];

  const TableData = lastPrice.map((value) => ({
    pi: value.proformainvoice,
    status: value.status,
    date: value.date,
    description: value.description,
    product: value.product,
    price: value.rate,
    quantity: value.quantity,
  }));

  return (
    <>
      <CustomLoader open={open} />
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Last Price
            </h3>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={null}
          />
        </Paper>
      </Grid>
    </>
  );
};
