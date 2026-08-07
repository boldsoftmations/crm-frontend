import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Collapse,
  Typography,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import InventoryServices from "../../../services/InventoryService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { SalesReturnCreate } from "./SalesReturnCreate";
import CustomDateFilterPopup from "../../Components/CustomDateFilterPopup";
import { CSVLink } from "react-csv";
export const SalesReturnView = () => {
  const [open, setOpen] = useState(false);
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopupSalesReturn, setOpenPopupSalesReturn] = useState(false);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  // const [openDateFilter, setOpenDateFilter] = useState(false);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  const [openDateFilter, setOpenDateFilter] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [appliedStartDate, setAppliedStartDate] = useState(null);
  const [appliedEndDate, setAppliedEndDate] = useState(null);

  const getSalesReturnDetails = useCallback(async () => {
    try {
      setOpen(true);
      const formattedStartDate = formatDateForApi(appliedStartDate);
      const formattedEndDate = formatDateForApi(appliedEndDate);
      const response = await InventoryServices.getSalesReturnData(
        currentPage,
        searchQuery,
        formattedStartDate,
        formattedEndDate,
      );

      setSalesReturnData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery, appliedStartDate, appliedEndDate]);

  useEffect(() => {
    getSalesReturnDetails();
  }, [getSalesReturnDetails]);
  const formatDateForApi = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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

  const handleDownloadCSV = async () => {
    try {
      setOpen(true);

      const formattedStartDate = formatDateForApi(appliedStartDate);
      const formattedEndDate = formatDateForApi(appliedEndDate);

      let allSalesReturnData = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await InventoryServices.getSalesReturnData(
          page,
          searchQuery,
          formattedStartDate,
          formattedEndDate,
        );

        const results =
          response && response.data && response.data.results
            ? response.data.results
            : [];

        allSalesReturnData = [...allSalesReturnData, ...results];

        const totalCount =
          response && response.data && response.data.count
            ? response.data.count
            : 0;

        totalPages = Math.ceil(totalCount / 25);

        page++;
      } while (page <= totalPages);

      if (allSalesReturnData.length === 0) {
        return;
      }

      const headers = [
        "DATE",
        "INVOICE TYPE",
        "INVOICE NO",
        "COMPLAINT NO",
        "COMPANY",
        "GST",
        "AMOUNT",
        "TOTAL",
      ];

      const rows = allSalesReturnData.map((row) => [
        row.invoice_date || "",
        row.invoice_type || "",
        row.invoice_no || "",
        row.ccf_complain_no || "",
        row.supplier_name || "",
        row.gst || "",
        row.amount || "",
        row.total || "",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "sales_return.csv");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

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
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Sales Return
                </h3>
              </Grid>

              {/* Add Button on the right */}
              {/* Date Filter + Add Button */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenDateFilter(true)}
                >
                  Date Filter
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDownloadCSV}
                  disabled={!salesReturnData || salesReturnData.length === 0}
                >
                  Download CSV
                </Button>

                <Button
                  color="success"
                  variant="contained"
                  onClick={() => setOpenPopupSalesReturn(true)}
                >
                  Sales Return
                </Button>
              </Grid>
            </Grid>
          </Box>
          <CustomDateFilterPopup
            open={openDateFilter}
            setOpen={setOpenDateFilter}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onSubmit={() => {
              setAppliedStartDate(startDate);
              setAppliedEndDate(endDate);
              setCurrentPage(1);
              setOpenDateFilter(false);
            }}
            onError={(message) => {
              console.log(message);
            }}
          />
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
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">INVOICE TYPE</StyledTableCell>
                  <StyledTableCell align="center">INVOICE NO</StyledTableCell>
                  <StyledTableCell align="center">Complaint NO</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">GSt</StyledTableCell>
                  <StyledTableCell align="center">Amount</StyledTableCell>
                  <StyledTableCell align="center">TOTAL</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesReturnData.map((row) => (
                  <Row key={row.id} row={row} />
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
        fullScreen={true}
        title={"Create Sales Return"}
        openPopup={openPopupSalesReturn}
        setOpenPopup={setOpenPopupSalesReturn}
      >
        <SalesReturnCreate
          getSalesReturnDetails={getSalesReturnDetails}
          setOpenPopup={setOpenPopupSalesReturn}
        />
      </Popup>
    </>
  );
};

function Row(props) {
  const { row } = props;
  const [tableExpand, setTableExpand] = useState(false);

  return (
    <>
      <StyledTableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          textDecoration: row.cancelled ? "line-through" : "none",
        }}
      >
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand(!tableExpand)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.invoice_date}</StyledTableCell>
        <StyledTableCell align="center">{row.invoice_type}</StyledTableCell>
        <StyledTableCell align="center">{row.invoice_no}</StyledTableCell>
        <StyledTableCell align="center">{row.ccf_complain_no}</StyledTableCell>
        <StyledTableCell align="center">{row.supplier_name}</StyledTableCell>
        <StyledTableCell align="center">{row.gst}</StyledTableCell>
        <StyledTableCell align="center">{row.amount}</StyledTableCell>
        <StyledTableCell align="center">{row.total}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">PRODUCT CODE</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                    <TableCell align="center">AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.product}
                      </TableCell>
                      <TableCell align="center">
                        {historyRow.type_of_unit === "decimal"
                          ? historyRow.quantity
                          : Math.floor(historyRow.quantity)}
                      </TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

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
