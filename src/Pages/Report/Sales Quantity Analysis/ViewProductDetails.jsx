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

export const ViewProductDetails = ({ rowData, startMonth, startYear }) => {
  const {
    product__description__name,
    product__brand__name,
    product__unit__name,
  } = rowData;
  const [isLoading, setIsLoading] = useState(false);
  const [salesQuantityAnalysis, setSalesQuantityAnalysis] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getSalesQuatityAnalysisdetailsByproduct = async () => {
    setIsLoading(true);
    try {
      const response =
        await DashboardService.getSalesQuatityAnalysisdetailsByproduct(
          product__description__name,
          product__brand__name,
          product__unit__name,
          startMonth + 1,
          startYear
        );
      setSalesQuantityAnalysis(response.data);
    } catch (error) {
      setAlertMsg({
        message: "Failed to fetch sales quantity analysis",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesQuatityAnalysisdetailsByproduct();
  }, [startMonth, startYear, rowData]);

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
              Sales Quantity Analysis
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
                  <StyledTableCell align="center">Company</StyledTableCell>
                  <StyledTableCell align="center">
                    Product Description
                  </StyledTableCell>
                  <StyledTableCell align="center">Brand</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">
                    Last Month QTY
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    This Month QTY
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesQuantityAnalysis.length > 0 ? (
                  salesQuantityAnalysis.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.company_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.description || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.brand || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.max_qty || 0}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.current_month_qty || 0}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={14}>
                      No Data Available
                    </StyledTableCell>
                  </StyledTableRow>
                )}
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
