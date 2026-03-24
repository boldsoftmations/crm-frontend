import React, { useCallback, useEffect, useRef, useState } from "react";
import InventoryServices from "./../../../services/InventoryService";
import { CSVLink } from "react-csv";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Popup } from "../../../Components/Popup";
import CustomDateFilterPopup from "../../../Components/CustomDateFilterPopup";

export const DailyProductionReport = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dailyProductionReport, setDailyProductionReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date()); // set default value as current date

  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customDatePopup, setCustomDatePopup] = useState(false);
  // Headers for CSV export
  const headers = [
    { label: "Date", key: "created_on" },
    { label: "Seller Account", key: "seller_account" },
    { label: "BOM", key: "bom" },
    { label: "Product", key: "product" },
    { label: "Description", key: "description" },
    { label: "Brand", key: "brand" },
    { label: "Unit", key: "unit" },
    { label: "Quantity", key: "quantity" },
    { label: "Rate", key: "rate" },
    { label: "Amount", key: "amount" },
  ];

  // Fetch data for CSV download
  const handleExport = async () => {
    setOpen(true);
    try {
      const response = await InventoryServices.getAllDailyProductionReport(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        "all",
        searchQuery,
      );
      const data = response.data.map((row) => ({
        created_on: row.created_on,
        seller_account: row.seller_account,
        bom: row.bom,
        product: row.product,
        description: row.description,
        brand: row.brand,
        unit: row.unit,
        quantity: row.quantity,
        rate: row.rate.toFixed(2),
        amount: row.amount,
      }));
      setExportData(data);
      setTimeout(() => csvLinkRef.current.link.click(), 0);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = () => handleExport();

  const getDailyProductionReport = useCallback(
    async (page = currentPage, search = searchQuery) => {
      setOpen(true);
      try {
        const response = await InventoryServices.getAllDailyProductionReport(
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0],
          page,
          search,
        );
        setDailyProductionReport(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [searchQuery, startDate, endDate, currentPage],
  );

  useEffect(() => {
    getDailyProductionReport(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const Tabledata = dailyProductionReport.map((row) => ({
    id: row.id,
    created_on: row.created_on,
    seller_account: row.seller_account,
    bom: row.bom,
    product: row.product,
    description: row.description,
    brand: row.brand,
    unit: row.unit,
    quantity: row.quantity,
    rate: row.rate.toFixed(2),
    amount: row.amount,
  }));

  const Tableheaders = [
    "Id",
    "Date",
    "Seller Account",
    "BOM",
    "Product",
    "Description",
    "Brand",
    "Unit",
    "Quantity",
    "Rate",
    "Amount",
  ];
  const handleViewPopup = (row) => {
    setSelectedRow(row);
    setOpenDetailsPopup(true);
  };

  // const handleClosePopup = () => {
  //   setOpenDetailsPopup(false);
  //   setSelectedRow(null);
  // };

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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, width: "100%" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Date Filters and Search */}
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                alignItems="center"
                gap={2}
              >
                {/* Grid item for the start date */}

                {/* Grid item for the SearchComponent */}
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Center Section: Title */}
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Daily Production Report
                </h3>
              </Grid>

              {/* Right Section: Download Button */}
              <Grid
                item
                xs={12}
                sm={4}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Grid item>
                  <Button variant="contained" onClick={handleDownload}>
                    Download CSV
                  </Button>
                </Grid>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Daily Production Report.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setCustomDatePopup(true)}
                  >
                    Select Date
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={handleViewPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
            Isviewable={false}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        openPopup={openDetailsPopup}
        maxWidth="xl"
        setOpenPopup={setOpenDetailsPopup}
        title="Daily Production Report Details"
      >
        <Row row={selectedRow} setOpen={setOpen} />
        {/* <CustomTable
          headers={Tableheaders}
          data={[selectedRow]}
          openInPopup={null}
          openInPopup2={null}
          openInPopup3={null}
          openInPopup4={null}
        /> */}
      </Popup>

      <CustomDateFilterPopup
        open={customDatePopup}
        setOpen={setCustomDatePopup}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        startDate={startDate}
        endDate={endDate}
        onSubmit={() => {
          setCustomDatePopup(false);
          getDailyProductionReport(1, searchQuery); // Fetch data for the first page with the new date range
        }}
      />
    </>
  );
};

const Row = ({ row, setOpen }) => {
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState(null);
  const getDailyRepoert = async () => {
    setOpen(true);
    const response = await InventoryServices.getDailyReportData(row.id);
    setData(response.data.products);
    setAllData(response.data);
    setOpen(false);
    // console.log(response.data);
  };
  useEffect(() => {
    getDailyRepoert();
  }, []);
  // getDailyRepoert();
  const Tableheaders2 = [
    "Production Entry ID",
    "Product Name",
    "Quantity",
    "Rate",
    "Amount",
  ];

  return (
    <>
      <TableContainer
        sx={{
          maxHeight: 440,
          "&::-webkit-scrollbar": {
            width: 0,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f2f2f2",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#aaa9ac",
          },
        }}
      >
        <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {Tableheaders2.map((header, i) => {
                return (
                  <StyledTableCell key={i} align="center">
                    {header}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">
                    {row.production_entry_id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.product__name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.rate}</StyledTableCell>
                  <StyledTableCell align="center">{row.amount}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        style={{
          marginTop: "10px",
          display: "flex",
          alignContent: "center",
          justifyContent: "end",
          paddingRight: "50px",
        }}
      >
        <p>
          <b>Total Amount</b> : {allData && allData.total_amount}
        </p>
      </Box>
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
