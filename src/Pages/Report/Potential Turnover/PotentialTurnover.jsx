import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import DashboardService from "../../../services/DashboardService";

export const PotentialTurnover = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [potentialData, setPotentialData] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getPotentialTurnover = async () => {
    setIsLoading(true);
    try {
      const response = await DashboardService.getPotentialTurnover();
      setPotentialData(response.data.data);
    } catch (error) {
      setAlertMsg({
        message: "Failed to fetch potential customers",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPotentialTurnover();
  }, []);

  // Create a number formatter to add commas to the total values
  const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  });

  const calculateTotals = () => {
    let approx_turnover_total = 0;

    potentialData.forEach((row) => {
      approx_turnover_total += row.third_last_month_total || 0;
    });

    return {
      approx_turnover_total: numberFormatter.format(approx_turnover_total),
    };
  };

  const totals = calculateTotals();

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Potential Turnover
            </h3>
          </Box>

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
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">
                    Potential Quatity
                  </StyledTableCell>
                  <StyledTableCell align="center">Last Updated</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">
                    Approx Turnover
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(potentialData.length > 0) &
                  potentialData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.order_book__company__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormatter.format(row.third_last_month_total)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormatter.format(row.second_last_month_total)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormatter.format(row.last_month_total)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormatter.format(row.total)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormatter.format(row.this_month_total)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                {/* Add the totals row */}
                <StyledTableRow>
                  <StyledTableCell align="center">
                    <strong>Total</strong>
                  </StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">
                    {totals.approx_turnover_total}
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
