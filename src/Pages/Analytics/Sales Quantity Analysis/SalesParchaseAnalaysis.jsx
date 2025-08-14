import React, { useState, useEffect, useRef } from "react";
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
  Button,
} from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import DashboardService from "../../../services/DashboardService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

import InvoiceServices from "../../../services/InvoiceService";
import { CSVLink } from "react-csv";

const SalesParchaseAnalaysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesAnalysis, SetSalesAnalysis] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [filtersalesAnalysis, setFilterSalesAnalysis] = useState([]);
  const [filtersalesPurchase, setFiltersalesPurchase] = useState("sales");
  const [exportData, setExportData] = useState([]);
  const [filterValue, setFilterValue] = useState({
    unit: "",
  });
  const [startMonth, setStartMonth] = useState(() => {
    const currentMonth = new Date().getMonth(); // Get the current month (0-11)
    return currentMonth === 0 || currentMonth === 1 || currentMonth === 2
      ? currentMonth
      : 3;
  });
  const [productType, setProductType] = useState("");
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const assigned_to_users = ["sales", "purchase"];

  const generateDynamicMonths = (startMonthIndex, startYear) => {
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

  const getSaleAnlaysis = async () => {
    setIsLoading(true);

    try {
      const response =
        filtersalesPurchase === "sales"
          ? await DashboardService.getSalesAnalysis(
              startMonth + 1,
              startYear,
              productType
            )
          : await DashboardService.getPurchaseAnalysis(
              startMonth + 1,
              startYear,
              productType
            );
      SetSalesAnalysis(response.data);
      setFilterSalesAnalysis(response.data);
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
    getSaleAnlaysis();
  }, [startMonth, startYear, filterValue, filtersalesPurchase, productType]);

  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerData(response.data);

      console.log(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };
  const productOptions = ["finished-goods", "raw-materials", "consumables"];

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);
  useEffect(() => {
    let filtered = !salesAnalysis;

    if (filterValue.unit) {
      filtered = salesAnalysis.filter((item) =>
        (item.branch_name || "")
          .toLowerCase()
          .includes(filterValue.unit.toLowerCase())
      );
    }

    setFilterSalesAnalysis(filtered);
    setExportData(filtered);
    if (filterValue.unit === "") setFilterSalesAnalysis(salesAnalysis);
  }, [filterValue, salesAnalysis, filtersalesPurchase, exportData]);
  const csvLinkRef = useRef(null);

  const handelDownload = async () => {
    const data =
      filtersalesPurchase === "sales"
        ? await DashboardService.getSalesAnalysis(
            startMonth + 1,
            startYear,
            productType
          )
        : await DashboardService.getPurchaseAnalysis(
            startMonth + 1,
            startYear,
            productType
          );
    setExportData(data.data);

    setTimeout(() => {
      csvLinkRef.current.link.click();
    });
  };

  //   console.log(sellerData);
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
                value={filtersalesPurchase}
                onChange={(e, value) => setFiltersalesPurchase(value)}
                options={assigned_to_users.map((option) => option)}
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
                name="seller_unit"
                size="small"
                disablePortal
                value={filterValue.unit ? { unit: filterValue.unit } : null}
                onChange={(e, value) =>
                  setFilterValue({ unit: (value && value.unit) || "" })
                }
                options={sellerData}
                getOptionLabel={(option) => option.unit || ""}
                sx={{ minWidth: 300 }}
                label="Seller Unit"
              />

              <CustomAutocomplete
                size="small"
                disablePortal
                id="combo-box-start-year"
                sx={{ minWidth: 300 }}
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
          <Grid
            item
            md={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid md={4}>
              <CustomAutocomplete
                sx={{ minWidth: 300 }}
                size="small"
                value={productType}
                onChange={(e, value) => setProductType(value)}
                options={productOptions.map((option) => option)}
                getOptionLabel={(option) => `${option}`}
                label={"Filter By Employee"}
              />
            </Grid>
            <Grid md={4}>
              <Box>
                <h3
                  style={{
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Sales & Purchase Analysis
                </h3>
              </Box>
            </Grid>

            <Grid md={4}>
              <Button variant="contained" onClick={handelDownload}>
                Download
              </Button>
              {filtersalesAnalysis.length > 0 && (
                <CSVLink
                  data={filtersalesAnalysis}
                  filename={`Sales&PurchaseAnalysis.csv`}
                  style={{ display: "none" }}
                  ref={csvLinkRef}
                  target="_blank"
                />
              )}
            </Grid>
          </Grid>

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
                  <StyledTableCell align="center">Branch Name</StyledTableCell>

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
                </TableRow>
              </TableHead>
              <TableBody>
                {filtersalesAnalysis.length > 0 ? (
                  filtersalesAnalysis.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.branch_name || "N/A"}
                      </StyledTableCell>
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

export default SalesParchaseAnalaysis;
