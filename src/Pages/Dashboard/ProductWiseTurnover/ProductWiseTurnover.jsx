import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ProductForecastService from "../../../services/ProductForecastService";
import LeadServices from "../../../services/LeadService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { CustomTable } from "../../../Components/CustomTable";

export const ProductWiseTurnover = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  // const [filterQuery, setFilterQuery] = useState("sales_person__email");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [productWiseTurnover, setProductWiseTurnover] = useState([]);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const getResetData = () => {
    setSearchQuery("");
    setFilterSelectedQuery("");

    getAllProductionForecastDetails();
  };

  const handleInputChange = () => {
    setSearchQuery(searchQuery);
    getSearchData(searchQuery);
  };

  const handleInputChanges = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  // Get the current date
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the last 2 months
  const lastMonth1 = (currentMonth - 2 + 12) % 12;
  const lastMonth2 = (currentMonth - 1 + 12) % 12;

  // Get the next 2 months
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

  useEffect(() => {
    getAssignedData();
    getAllProductionForecastDetails();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();

      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getAllProductionForecastDetails = async () => {
    try {
      setOpen(true);
      const response =
        await ProductForecastService.getProductWiseTurnoverForecast();
      setProductWiseTurnover(response.data);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response =
        await ProductForecastService.getAllSearchProductWiseTurnoverForecast(
          "sales_person__email",
          filterSearch
        );
      if (response) {
        setProductWiseTurnover(response.data);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getAllProductionForecastDetails();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const Tabledata = productWiseTurnover.map((row) => {
    const tableRow = {
      sales_person: row.sales_person__email,
      description: row.product__description__name,
      brand: row.product__brand__name,
    };
    row.total_turnover_monthly.forEach((rowData, index) => {
      tableRow[`total_turnover_monthly_${index}`] =
        rowData.total_turnover_monthly;
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
    const total = Tabledata.reduce(
      (sum, row) => sum + (row[columnKey] || 0),
      0
    );
    columnTotals[columnKey] = numberFormat(total);
  }

  // Add the column totals row to the Tabledata
  Tabledata.push(columnTotals);
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
    <div>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 2, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <FormControl
                sx={{ minWidth: "200px", marginLeft: "1em" }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">
                  Filter By State
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="values"
                  label="Filter By State"
                  value={filterSelectedQuery}
                  onChange={(event) => handleInputChanges(event)}
                  sx={{
                    "& .MuiSelect-iconOutlined": {
                      display: filterSelectedQuery ? "none" : "",
                    },
                    "&.Mui-focused .MuiIconButton-root": {
                      color: "primary.main",
                    },
                  }}
                  endAdornment={
                    <IconButton
                      sx={{
                        visibility: filterSelectedQuery ? "visible" : "hidden",
                      }}
                      onClick={getResetData}
                    >
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  {assigned.map((option, i) => (
                    <MenuItem key={i} value={option.email}>
                      {option.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                Product Wise TurnOver
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
    </div>
  );
};

const filterOption = [
  {
    label: "Sales Person",
    value: "sales_person__email",
  },
];
