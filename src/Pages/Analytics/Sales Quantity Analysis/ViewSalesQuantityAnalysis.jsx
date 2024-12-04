import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
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
import { Popup } from "../../../Components/Popup";
import { ViewProductDetails } from "./ViewProductDetails";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";

export const ViewSalesQuantityAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesQuantityAnalysis, setSalesQuantityAnalysis] = useState([]);
  const [startMonth, setStartMonth] = useState(3);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData, setrowData] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const storeData = useSelector((state) => state.auth);
  const users = storeData.profile;
  const assigned_to_users = users.active_sales_user || [];
  const [filterValue, setFilterValue] = useState("");
  const generateDynamicMonths = (startMonthIndex, startYear) => {
    // Generate dynamic month headers from the selected start month/year to the current month/year
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed
    const currentYear = currentDate.getFullYear();
    const data = {
      dynamicMonths: [],
      dynamicHeaders: [],
    };
    let year = startYear;
    let monthIndex = startMonthIndex;

    while (
      year < currentYear ||
      (year === currentYear && monthIndex <= currentMonth)
    ) {
      data.dynamicMonths.push(`${months[monthIndex]}_${year}`);
      data.dynamicHeaders.push(`${months[monthIndex]} ${year}`);
      monthIndex++;
      if (monthIndex === 12) {
        monthIndex = 0; // Reset to January
        year++;
      }
    }

    return data;
  };
  const data = generateDynamicMonths(startMonth, startYear);

  const getSalesQuantityAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await DashboardService.getSalesQuatityAnalysis(
        startMonth + 1,
        startYear,
        filterValue
      );
      setSalesQuantityAnalysis(response.data);
    } catch (error) {
      const errorMessage = error.response.data.message;
      setAlertMsg({
        message: errorMessage || "Failed to fetch sales quantity analysis",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesQuantityAnalysis();
  }, [startMonth, startYear, filterValue]);

  const handleGetproductDetails = (data) => {
    setrowData(data);
    setOpenPopup(true);
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
          <Grid item xs={12} md={7}>
            <Box display="flex" gap="1rem" marginBottom="1rem">
              <CustomAutocomplete
                fullWidth
                size="small"
                value={filterValue}
                onChange={(e, value) => setFilterValue(value)}
                options={assigned_to_users.map((option) => option.email)}
                getOptionLabel={(option) => `${option}`}
                label={"Filter By Employee"}
              />
              <CustomAutocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-start-month"
                value={months.find((m) => m.value - 1 === startMonth)}
                onChange={(e, value) => setStartMonth(value.value - 1)} // Convert to 0-indexed
                options={months}
                getOptionLabel={(option) => option.label}
                label="Select Start Month"
              />
              <CustomAutocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-start-year"
                value={{ label: startYear }}
                onChange={(e, value) => setStartYear(value.label)}
                options={[...Array(3).keys()].map((i) => ({
                  label: new Date().getFullYear() - i,
                }))}
                getOptionLabel={(option) => `${option.label}`}
                label="Select Start Year"
              />
            </Box>
          </Grid>
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
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Brand</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  {data.dynamicHeaders.map((month, index) => (
                    <StyledTableCell align="center" key={index}>
                      {month}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">Max QTY</StyledTableCell>
                  <StyledTableCell align="center">Short QTY</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesQuantityAnalysis.length > 0 ? (
                  salesQuantityAnalysis.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.product__description__name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product__brand__name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product__unit__name || "N/A"}
                      </StyledTableCell>
                      {data.dynamicMonths.map((month, index) => (
                        <StyledTableCell align="center" key={index}>
                          {row[month] || 0}
                        </StyledTableCell>
                      ))}
                      <StyledTableCell align="center">
                        {row.max_qty}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.short_qty || "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleGetproductDetails(row)}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={10}>
                      No Data Available
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Popup
            fullScreen={true}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <ViewProductDetails
              getSalesQuantityAnalysis={getSalesQuantityAnalysis}
              rowData={rowData}
              startMonth={startMonth}
              startYear={startYear}
              setOpenPopup={setOpenPopup}
              filterValue={filterValue}
            />
          </Popup>
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
const months = [
  {
    value: 1,
    label: "January",
  },
  {
    value: 2,
    label: "February",
  },
  {
    value: 3,
    label: "March",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "May",
  },
  {
    value: 6,
    label: "June",
  },
  {
    value: 7,
    label: "July",
  },
  {
    value: 8,
    label: "August",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "October",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "December",
  },
];
