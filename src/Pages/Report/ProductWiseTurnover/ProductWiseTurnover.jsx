import React, { useCallback, useEffect, useState } from "react";
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
import ProductForecastService from "../../../services/ProductForecastService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomSelect from "../../../Components/CustomSelect";
import UserProfileService from "../../../services/UserProfileService";

export const ProductWiseTurnover = () => {
  const [open, setOpen] = useState(false);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [productWiseTurnover, setProductWiseTurnover] = useState([]);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const clearFilterValue = () => setFilterSelectedQuery("");

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  // Get the current date
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the next 3 months
  const nextMonth1 = (currentMonth + 1) % 12;
  const nextMonth2 = (currentMonth + 2) % 12;
  const nextMonth3 = (currentMonth + 3) % 12;

  // Convert month number to month name
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

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const response = await UserProfileService.getProfile();
      const AssignedOptions = response.data.sales_users.map((user) => ({
        label: `${user.name}`,
        value: user.email,
      }));
      setAssigned(AssignedOptions);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };
  console.log(assigned);
  useEffect(() => {
    getAssignedData();
  }, []);

  const getAllProductionForecastDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response =
        await ProductForecastService.getProductWiseTurnoverForecast(
          filterSelectedQuery
        );
      console.log("response", response.data);
      setProductWiseTurnover(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [filterSelectedQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getAllProductionForecastDetails();
  }, [filterSelectedQuery]);

  const handleFilter = (event) => {
    setFilterSelectedQuery(event.target.value);
  };

  const Tabledata = productWiseTurnover.map((row) => {
    const tableRow = {
      sales_person: row.first_name + " " + row.last_name,
      description: row.product__description__name,
      brand: row.product__brand__name,
    };

    // Initialize raw values to store numeric data
    const rawValues = {
      [`total_turnover_monthly_${currentMonth}`]: 0,
      [`total_turnover_monthly_${nextMonth1}`]: 0,
      [`total_turnover_monthly_${nextMonth2}`]: 0,
      [`total_turnover_monthly_${nextMonth3}`]: 0,
    };

    row.total_turnover_monthly.forEach((rowData) => {
      const month = parseInt(rowData.month, 10) - 1; // Adjust for 0-based index
      const key = `total_turnover_monthly_${month}`;
      rawValues[key] = rowData.total_turnover_monthly; // Store raw value
      tableRow[key] = numberFormat(rowData.total_turnover_monthly); // Store formatted value
    });

    return { ...tableRow, rawValues }; // Include rawValues for later use
  });

  // Calculate the total for each column using raw values
  const columnTotals = {
    sales_person: "Total",
    description: "-",
    brand: "-",
  };

  for (let i = 0; i < 4; i++) {
    const columnKey = `total_turnover_monthly_${(currentMonth + i) % 12}`;
    const total = Tabledata.reduce((sum, row) => {
      return sum + (row.rawValues[columnKey] || 0); // Sum raw values
    }, 0);

    columnTotals[columnKey] = numberFormat(total); // Format the total
  }

  // Add the column totals row to the Tabledata
  if (Tabledata.length > 0) {
    Tabledata.push(columnTotals);
  }

  console.log("tableRow", Tabledata);

  const Tableheaders = [
    "Sales Person",
    "Description",
    "Brand",
    `${months[currentMonth]} - ${currentYear} Total Turnover`,
    `${months[nextMonth1]} - ${
      nextMonth1 > currentMonth ? currentYear : currentYear + 1
    } Total TurnOver`,
    `${months[nextMonth2]} - ${
      nextMonth2 > currentMonth ? currentYear : currentYear + 1
    } Total TurnOver`,
    `${months[nextMonth3]} - ${
      nextMonth3 > currentMonth ? currentYear : currentYear + 1
    } Total TurnOver`,
  ];

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <CustomSelect
                label="Sales Person"
                options={assigned}
                value={filterSelectedQuery}
                onChange={handleFilter}
                onClear={clearFilterValue}
              />
            </Box>
            <Box flexGrow={2} marginLeft={2}>
              <h3
                style={{
                  textAlign: "left",

                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Forecast Turnover
              </h3>
            </Box>
            <Box flexGrow={0.5}></Box>
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
                  {Tableheaders.map((header, index) => (
                    <StyledTableCell align="center" key={index}>
                      {header}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Tabledata.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      {row.sales_person}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.brand}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row[`total_turnover_monthly_${currentMonth}`]
                        ? row[`total_turnover_monthly_${currentMonth}`]
                        : 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row[`total_turnover_monthly_${nextMonth1}`]
                        ? row[`total_turnover_monthly_${nextMonth1}`]
                        : 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row[`total_turnover_monthly_${nextMonth2}`]
                        ? row[`total_turnover_monthly_${nextMonth2}`]
                        : 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row[`total_turnover_monthly_${nextMonth3}`]
                        ? row[`total_turnover_monthly_${nextMonth3}`]
                        : 0}
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
