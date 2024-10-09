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
} from "@mui/material";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import DashboardService from "../../services/DashboardService";

export const CRReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [CRReportDatas, setCRReportDatas] = useState([]);

  const [filterValue, setFilterValue] = useState("");
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getCRReportData = async () => {
    setIsLoading(true);
    try {
      const response = await DashboardService.getCRReportData(filterValue);
      setCRReportDatas(response.data.data);
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

  const handleFilterChange = (event, value) => {
    setFilterValue(value.value);
  };
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
                    disablePortal
                    id="combo-box-status"
                    onChange={handleFilterChange}
                    getOptionLabel={(option) => option.label}
                    label="Filter By Employee"
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
              Customer Relationship Forecast Report
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
              {/* <TableBody>
                {CRReportDatas.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.decription}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody> */}
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
