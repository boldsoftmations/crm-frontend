import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { CustomPagination } from "../../Components/CustomPagination";

import ProductForecastService from "../../services/ProductForecastService";
import { Popup } from "./../../Components/Popup";
import { ForecastUpdate } from "./../Cutomers/ForecastDetails/ForecastUpdate";
import { ProductForecastAssignTo } from "./ProductForecastAssignTo";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomDownloadLoader } from "../../Components/CustomDownloadLoader";
import { CustomLoader } from "../../Components/CustomLoader";

export const CustomerHavingForecastView = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [salesPersonByFilter, setSalesPersonByFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerHavingForecast, setCustomerHavingForecast] = useState([]);

  const [forecastDataByID, setForecastDataByID] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);

  const [isPrinting, setIsPrinting] = useState(false);
  const UserData = useSelector((state) => state.auth.profile);
  const assignedOption = UserData.sales_customer_user_forecast || [];

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedMB, setDownloadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [DownloadOpen, setDownloadOpen] = useState(false);
  console.log("userData is :", UserData);
  // Get the current date, month, and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // Calculate the previous and next months
  const lastMonth1 = (currentMonth - 2 + 12) % 12;
  const lastMonth2 = (currentMonth - 1 + 12) % 12;
  const nextMonth1 = (currentMonth + 1) % 12;
  const nextMonth2 = (currentMonth + 2) % 12;
  const nextMonth3 = (currentMonth + 3) % 12;
  const isSupplyChain = UserData.groups.includes(
    "Operations & Supply Chain Manager",
  );
  const emails = [
    "admin@glutape.com",
    "rajeev@glutape.com",
    "gaurav@glutape.com",
    "arjun@glutape.com",
    "pruthvi@glutape.com",
    "anuradha@glutape.com",
    "vivek_production@glutape.com",
    "vivek2@glutape.com",
    "managerwithoutlead@glutape.com",
    "biraj@glutape.com",
    "rushilsalian13@glutape.com",
    "it1@glutape.com",
  ];
  // Define the months array
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
      setCustomerHavingForecast([]);
    };

    const afterPrint = () => {
      setIsPrinting(false);
      // Fetch the data again and update the companyData state
      getAllCustomerForecastDetails();
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
  const date = new Date().getDate();
  console.log("date is : ", date);

  useEffect(() => {
    const savedEndTime = localStorage.getItem("csvDownloadEndTime_having"); // different key!
    if (savedEndTime) {
      const remaining = Math.floor(
        (parseInt(savedEndTime) - Date.now()) / 1000,
      );
      if (remaining > 0) {
        setIsDisabled(true);
        setCountdown(remaining);
      } else {
        localStorage.removeItem("csvDownloadEndTime_having");
      }
    }
  }, []);

  useEffect(() => {
    if (!isDisabled) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          localStorage.removeItem("csvDownloadEndTime_having");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDisabled]);

  // ❌ Remove handleExport entirely
  // ✅ Replace handleDownload with this:

  const handleDownload = async () => {
    try {
      setDownloadOpen(true);
      setIsDisabled(true);
      setDownloadProgress(0);
      setDownloadedMB(0);
      setTotalMB(0);

      const response = await ProductForecastService.getAllCustomerHavingDataCsv(
        "csv",
        {
          responseType: "blob",
          onDownloadProgress: (event) => {
            const loaded = (event.loaded / 1024 / 1024).toFixed(2);
            setDownloadedMB(loaded);
            if (event.total) {
              const total = (event.total / 1024 / 1024).toFixed(2);
              const percent = Math.round((event.loaded / event.total) * 100);
              setTotalMB(total);
              setDownloadProgress(percent);
            }
          },
        },
      );
      console.log("Response is : ", response.data);

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "customer_having_forecast.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      handleSuccess("CSV downloaded successfully");

      const endTime = Date.now() + 900 * 1000;
      localStorage.setItem("csvDownloadEndTime_having", endTime.toString());
      setCountdown(900);
      setIsDisabled(true);
    } catch (error) {
      handleError(error);
      setIsDisabled(false);
    } finally {
      setDownloadOpen(false);
      setDownloadProgress(0);
    }
  };

  const getAllCustomerForecastDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductForecastService.getAllCustomerHavingData(
        currentPage,
        salesPersonByFilter,
        searchQuery,
      );
      setCustomerHavingForecast(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      handleError(error);
      console.error("Error fetching Customer Having Forecast", error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, salesPersonByFilter, searchQuery]);

  useEffect(() => {
    getAllCustomerForecastDetails();
  }, [currentPage, salesPersonByFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = useCallback(
    (item) => {
      const matchedForecast = customerHavingForecast.find(
        (forecast) => forecast.id === item.id,
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup(true);
    },
    [customerHavingForecast],
  );

  const handleAssignTo = useCallback(
    (item) => {
      const matchedForecast = customerHavingForecast.find(
        (forecast) => forecast.id === item.id,
      );
      setForecastDataByID(matchedForecast);
      setOpenPopup2(true);
    },
    [customerHavingForecast],
  );

  const handleFilterChange = (value) => {
    setSalesPersonByFilter(value);
    // getAllCustomerForecastDetails(currentPage, value, searchQuery);
  };

  // Get the unique index_position values to use as column headers
  // const indexPositions = [
  //   ...new Set(
  //     customerHavingForecast &&
  //       customerHavingForecast.flatMap((row) =>
  //         row.product_forecast.map((rowData) => rowData.index_position),
  //       ),
  //   ),
  // ];
  // console.log("index position :", indexPositions);

  // // Sort the index_positions array in ascending order
  // indexPositions.sort((a, b) => a - b);
  const indexPositions = [0, 1, 2, 3, 4, 5];

  //decimal helper function
  const formatToTwoDecimal = (value) => {
    return value !== null && value !== undefined
      ? Number(value).toFixed(2)
      : "0.00";
  };
  return (
    <div>
      <Helmet>
        <style>
          {`
            @media print {
              html, body {
                filter: ${isPrinting ? "blur(10px)" : "none"} !important;
              }
            }
          `}
        </style>
      </Helmet>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <CustomDownloadLoader
        open={DownloadOpen}
        downloadedMB={downloadedMB}
        totalMB={totalMB}
        downloadProgress={downloadProgress}
      />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              {!UserData.groups.includes("Sales Executive") && (
                <Grid item xs={12} sm={3}>
                  <CustomAutocomplete
                    size="small"
                    sx={{ minWidth: 150 }}
                    onChange={(event, value) => handleFilterChange(value)}
                    value={salesPersonByFilter}
                    options={
                      isSupplyChain
                        ? emails
                        : assignedOption.length > 0 &&
                          assignedOption
                            .filter(
                              (option) =>
                                option.groups.includes("Sales Manager") || // option.groups === "Sales Manager" ||
                                option.groups.includes("Sales Executive") ||
                                option.groups.includes(
                                  "Sales Deputy Manager",
                                ) ||
                                option.groups.includes(
                                  "Sales Assistant Deputy Manager",
                                ) ||
                                option.groups.includes(
                                  "Sales Manager(Retailer)",
                                ) ||
                                option.groups.includes("Customer Service") || // option.groups === "Customer Service" ||
                                option.groups.includes("Director") ||
                                option.groups.includes(
                                  "Customer Relationship Executive",
                                ),
                            )
                            .map((option) => option.email)
                    }
                    getOptionLabel={(option) => option}
                    label="Filter By Sales Person"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownload}
                  disabled={isDisabled}
                >
                  {downloadProgress > 0 && downloadProgress < 100
                    ? totalMB > 0
                      ? `Downloading... ${downloadedMB} MB / ${totalMB} MB (${downloadProgress}%)`
                      : `Downloading... ${downloadedMB} MB`
                    : isDisabled
                      ? `Download available in ${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
                      : "Download CSV"}
                </Button>
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
              Customer Having Forecast
            </h3>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 520, // 👈 was 440, gives more breathing room
              overflowX: "auto", // 👈 ensure horizontal scroll works
              "&::-webkit-scrollbar": {
                width: 15,
                height: 8, // 👈 add horizontal scrollbar height
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
                borderRadius: 4, // 👈 subtle rounded scrollbar
              },
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                    COMPANY
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                    SALES PERSON
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                    PRODUCT
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                    {` ${months[lastMonth1]} - ${
                      lastMonth1 < currentMonth ? currentYear : currentYear - 1
                    }`}
                    <br />
                    ACTUAL
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      borderRight: "2px solid #fff !important",
                    }}
                  >
                    {` ${months[lastMonth1]} - ${
                      lastMonth1 < currentMonth ? currentYear : currentYear - 1
                    }`}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                    }}
                  >
                    {` ${months[lastMonth2]} - ${
                      lastMonth2 < currentMonth ? currentYear : currentYear - 1
                    }`}{" "}
                    <br />
                    ACTUAL
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      borderRight: "2px solid #fff !important",
                    }}
                  >
                    {` ${months[lastMonth2]} - ${
                      lastMonth2 < currentMonth ? currentYear : currentYear - 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                    }}
                  >
                    {`${months[currentMonth]} - ${currentYear}`} <br />
                    ACTUAL
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      borderRight: "2px solid #fff !important",
                    }}
                  >
                    {`${months[currentMonth]} - ${currentYear}`} <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      borderRight: "2px solid #fff !important",
                    }}
                  >
                    {` ${months[nextMonth1]} - ${
                      nextMonth1 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      borderRight: "2px solid #fff !important",
                    }}
                  >
                    {` ${months[nextMonth2]} - ${
                      nextMonth2 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{ minWidth: 80, borderRight: "2px solid #fff" }}
                  >
                    {` ${months[nextMonth3]} - ${
                      nextMonth3 > currentMonth ? currentYear : currentYear + 1
                    }`}{" "}
                    <br />
                    FORECAST
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{ minWidth: 80, borderRight: "2px solid #fff" }}
                  >
                    Action
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {customerHavingForecast &&
                  customerHavingForecast.map((row) => (
                    <StyledTableRow>
                      <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                        {row.assign_to_email.join(",")}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                        {row.product}
                      </StyledTableCell>
                      {indexPositions.map((position) => {
                        const rowData = row.product_forecast.find(
                          (data) => data.index_position === position,
                        );

                        if (position <= 2) {
                          return (
                            <React.Fragment key={position}>
                              <TableCell
                                align="center"
                                sx={{ padding: "6px 8px", fontSize: 14 }}
                              >
                                {rowData
                                  ? formatToTwoDecimal(rowData.actual)
                                  : "0.00"}
                              </TableCell>

                              <TableCell
                                align="center"
                                sx={{
                                  padding: "6px 8px",
                                  fontSize: 14,
                                  borderRight: "2px solid #ccc !important",
                                }}
                              >
                                {rowData
                                  ? formatToTwoDecimal(rowData.forecast)
                                  : "0.00"}
                              </TableCell>
                            </React.Fragment>
                          );
                        }

                        return (
                          <TableCell
                            key={`${position}-forecast`}
                            align="center"
                            sx={{
                              padding: "6px 8px",
                              fontSize: 14,
                              borderRight:
                                position < 5
                                  ? "2px solid #ccc !important"
                                  : "none",
                            }}
                          >
                            {rowData
                              ? formatToTwoDecimal(rowData.forecast)
                              : "0.00"}
                          </TableCell>
                        );
                      })}
                      <StyledTableCell align="center" sx={{ minWidth: 80 }}>
                        <Button
                          sx={{ color: "#1976d2" }}
                          onClick={() => handleEditClick(row)}
                          // disabled={date >= 20}
                        >
                          View
                        </Button>
                        <Button
                          sx={{ color: "#28a745" }}
                          onClick={() => handleAssignTo(row)}
                        >
                          Assign To
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Update Forecast Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <ForecastUpdate
          getAllCompanyDetailsByID={getAllCustomerForecastDetails}
          setOpenPopup={setOpenPopup}
          forecastDataByID={forecastDataByID}
        />
      </Popup>
      <Popup
        title={"Product Forecast Assign To"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <ProductForecastAssignTo
          getAllCompanyDetailsByID={getAllCustomerForecastDetails}
          setOpenPopup2={setOpenPopup2}
          forecastDataByID={forecastDataByID}
        />
      </Popup>
    </div>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: "8px 6px", // 👈 was 0
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "6px 8px", // 👈 was 0
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
