import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Grid } from "@mui/material";
import ProductForecastService from "../../../services/ProductForecastService";
import LeadServices from "../../../services/LeadService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomSelect from "../../../Components/CustomSelect";

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
      const response = await LeadServices.getAllAssignedUser();
      const AssignedOptions = response.data.map((user) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.email,
      }));
      setAssigned(AssignedOptions);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

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

    // Initialize the columns for the next months with zero or empty string
    tableRow[`total_turnover_monthly_${currentMonth}`] = 0;
    tableRow[`total_turnover_monthly_${nextMonth1}`] = 0;
    tableRow[`total_turnover_monthly_${nextMonth2}`] = 0;
    tableRow[`total_turnover_monthly_${nextMonth3}`] = 0;

    row.total_turnover_monthly.forEach((rowData) => {
      const month = parseInt(rowData.month, 10) - 1; // Adjust for 0-based index
      const key = `total_turnover_monthly_${month}`;
      tableRow[key] = numberFormat(rowData.total_turnover_monthly);
    });

    return tableRow;
  });

  // Calculate the total for each column
  const columnTotals = {
    sales_person: "Total",
    description: "-",
    brand: "-",
  };

  for (let i = 0; i < 4; i++) {
    const columnKey = `total_turnover_monthly_${i}`;
    const total = Tabledata.reduce((sum, row) => {
      // Check if the columnKey exists and if its value can be parsed as a number
      const value = parseFloat(row[columnKey]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    columnTotals[columnKey] = numberFormat(total);
  }

  // Add the column totals row to the Tabledata
  if (Tabledata.length > 0) {
    Tabledata.push(columnTotals);
  }

  const Tableheaders = [
    "Sales Person",
    "Description",
    "Brand",
    `${months[currentMonth]} -- ${currentYear} Total TurnOver`,
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
            <Box flexGrow={2}>
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
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
            isLastRow={columnTotals ? true : false}
            openInPopup={null}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
        </Paper>
      </Grid>
    </>
  );
};

const filterOption = [
  {
    label: "Sales Person",
    value: "sales_person__email",
  },
];
