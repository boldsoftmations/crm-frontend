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
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { Popup } from "../../../Components/Popup";
import UpdateSRFStatus from "./UpdataSRFStatus";
import { useSelector } from "react-redux";

export const ViewSRF = () => {
  const [open, setOpen] = useState(false);
  const [srfData, setSrfData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getCustomerSRF = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCustomerSRF(
        currentPage,
        searchQuery
      );
      setSrfData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getCustomerSRF();
  }, [getCustomerSRF]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
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
              <Grid item xs={12} sm={4}>
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
                sx={{ textAlign: { xs: "center", md: "end" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Sample Request
                </h3>
              </Grid>
            </Grid>
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
              sx={{ width: 1200, mx: "auto" }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">SRF No</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">
                    Customer Type
                  </StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {srfData.map((row) => (
                  <Row key={row.id} row={row} getCustomerSRF={getCustomerSRF} />
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
    </>
  );
};

function Row({ row, getCustomerSRF }) {
  const [tableExpand, setTableExpand] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [openUpdateStatusPopup, setOpenUpdateStatusPopup] = useState(false);
  const userData = useSelector((state) => state.auth.profile);

  const handleOpenPop = (data) => {
    setOpenUpdateStatusPopup(true);
    setRecordData(data);
  };

  return (
    <>
      <StyledTableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          textDecoration: row.cancelled ? "line-through" : "none",
        }}
      >
        {/* Expand/Collapse Button */}
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand((prev) => !prev)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        {/* Row Name */}
        <StyledTableCell align="center">{row.srf_no}</StyledTableCell>
        <StyledTableCell align="center">{row.creation_date}</StyledTableCell>
        <StyledTableCell align="center">{row.unit}</StyledTableCell>
        <StyledTableCell align="center">{row.customer}</StyledTableCell>
        <StyledTableCell align="center">{row.created_by}</StyledTableCell>
        <StyledTableCell align="center">{row.status}</StyledTableCell>
        <StyledTableCell align="center">{row.content_type}</StyledTableCell>
        <StyledTableCell align="center">
          {" "}
          {(userData.groups.includes("Production") ||
            userData.groups.includes("Director") ||
            userData.groups.includes("QA") ||
            userData.groups.includes("Customer Service")) && (
            <Button
              variant="text"
              size="small"
              color="primary"
              onClick={() => handleOpenPop(row)}
            >
              View
            </Button>
          )}
        </StyledTableCell>
      </StyledTableRow>

      {/* Expandable Content */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Table size="small" aria-label="activity-options">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#88a6cf" }}>
                    {" "}
                    {/* Heading background */}
                    <TableCell align="center" style={{ color: "white" }}>
                      Product
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      Unit
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      Quantity
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      Special Instructions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.srf_products.map((option, index) => (
                    <TableRow
                      key={option.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f1f8ff" : "#ffffff", // Alternating row colors
                      }}
                    >
                      <TableCell align="center">{option.product}</TableCell>
                      <TableCell align="center">{option.unit}</TableCell>
                      <TableCell align="center">{option.quantity}</TableCell>
                      <TableCell align="center">
                        {option.special_instructions}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popup
        openPopup={openUpdateStatusPopup}
        setOpenPopup={setOpenUpdateStatusPopup}
        title="Update Status"
        maxWidth="sm"
      >
        <UpdateSRFStatus
          setOpenPopup={setOpenUpdateStatusPopup}
          recordData={recordData}
          getCustomerSRF={getCustomerSRF}
        />
      </Popup>
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
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 3,
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
