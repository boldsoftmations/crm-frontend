import React, { useEffect, useState } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const CheckPrice = ({ priceData: initialPriceData }) => {
  const [priceData, setPriceData] = useState(initialPriceData || []);

  useEffect(() => {
    fetchPriceData();
  });

  const fetchPriceData = async () => {
    try {
      const response = await InvoiceServices.getPriceData();
      setPriceData(response.data);
    } catch (error) {
      console.error("Failed to fetch price data:", error);
      // Optionally, update your component's state with the error to display a message to the user
    }
  };

  return (
    <TableContainer
      sx={{
        maxHeight: 440,
        "&::-webkit-scrollbar": {
          width: 15,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f2f2f2",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaa9ac",
        },
      }}
    >
      <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Product</TableCell>
            <TableCell align="center">Unit</TableCell>
            <TableCell align="center">PI Rate</TableCell>
            <TableCell align="center">Slab 1 Price</TableCell>
            <TableCell align="center">Slab 2 Price</TableCell>
            <TableCell align="center">Slab 3 Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {priceData.map((row, i) => {
            return (
              <TableRow key={i}>
                <TableCell align="center">{row.product}</TableCell>
                <TableCell align="center">{row.unit}</TableCell>
                <TableCell align="center">{row.rate}</TableCell>
                <TableCell align="center">{row.slab1_price}</TableCell>
                <TableCell align="center">{row.slab2_price}</TableCell>
                <TableCell align="center">{row.slab3_price}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
