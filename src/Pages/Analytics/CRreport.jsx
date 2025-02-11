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
  Table,
  tableCellClasses,
  TableBody,
} from "@mui/material";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import DashboardService from "../../services/DashboardService";
import { useSelector } from "react-redux";
import CustomAutocomplete from "./../../Components/CustomAutocomplete";

export const CRReport = () => {
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned_to_users = users.active_sales_user || [];
  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [CRReportDatas, setCRReportDatas] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const isCRDepartment = assigned_to_users.filter((user) => {
    return (
      user.groups__name === "Customer Relationship Executive" ||
      user.groups__name === "Customer Relationship Manager"
    );
  });

  const getCRReportData = async () => {
    setIsLoading(true);
    try {
      const response = await DashboardService.getCRReportData(filterValue);
      setCRReportDatas(response.data);
    } catch (error) {
      setAlertMsg({
        message: "Failed to fetch top customers",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCRReportData();
  }, [filterValue]);

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
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    value={filterValue}
                    onChange={(e, value) => setFilterValue(value)}
                    options={isCRDepartment.map((option) => option.email)}
                    getOptionLabel={(option) => `${option}`}
                    label={"Filter By Employee"}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
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
              Sales Analysis Report - CR
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
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Brand</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">
                    Forecast (This Month)
                  </StyledTableCell>
                  <StyledTableCell align="center">Potential</StyledTableCell>
                  <StyledTableCell align="center">
                    Last Month Invoicing (In Quantity)
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    This Month Invoicing (In Quantity)
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CRReportDatas &&
                  CRReportDatas.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.product__description__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product__brand__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product__unit__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.forecast}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.potential}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.last_month}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.this_month}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
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
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
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
