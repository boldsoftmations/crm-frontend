import React, { useState, useEffect, useCallback, useRef } from "react";
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
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FileSaver from "file-saver";
import CustomDate from "../../../Components/CustomDate";
import { CSVLink } from "react-csv";
export const ViewSRF = () => {
  const [open, setOpen] = useState(false);
  const [srfData, setSrfData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCustomDate, setOpenCustomDate] = useState(false);
  const [filterByDays, setFilterByDays] = useState("Today");
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [exportData, setExportData] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState("");
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const csvLinkRef = useRef(null);
  const getCustomerSRF = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await CustomerServices.getCustomerSRF(
        currentPage,
        searchQuery,
        filterByStatus,
        StartDate,
        EndDate,
      );
      setSrfData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [
    currentPage,
    searchQuery,
    startDate,
    endDate,
    filterByDays,
    filterByStatus,
  ]); // Ensure dependencies are correctly listed

  const handleExport = async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response = await CustomerServices.getCustomerSRF(
        "all",
        searchQuery,
        filterByStatus,
        StartDate,
        EndDate,
      );

      const data = [];

      response.data.forEach((row) => {
        row.srf_products.forEach((product, index) => {
          data.push({
            date: index === 0 ? row.creation_date : "",
            srf_no: index === 0 ? row.srf_no : "",
            status: index === 0 ? row.status : "",
            unit: index === 0 ? row.unit : "",
            customer: index === 0 ? row.customer : "",
            product: product.product,
            qty: product.quantity,
            lr_no: index === 0 ? row.lr_no : "",
            special_instructions: product.special_instructions,
            remark: index === 0 ? row.remark : "",
          });
        });
      });

      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading Price list", error);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      console.log(data);
      setExportData(data);

      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "Date", key: "date" },
    { label: "SRF No", key: "srf_no" },
    { label: "Status", key: "status" },
    { label: "Unit", key: "unit" },
    { label: "Customer Name", key: "customer" },
    { label: "Product", key: "product" },
    { label: "Quantity", key: "qty" },
    { label: "LR Number", key: "lr_no" },
    { label: "Remark", key: "remark" },
  ];

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

  // date filter
  const handleFilterDays = (event, value) => {
    if (value === "Custom Date") {
      setOpenCustomDate(true);
      setStartDate(new Date());
      setEndDate(new Date());
      setFilterByDays("");
      setCurrentPage(1);
    } else {
      setFilterByDays(value);
      setCurrentPage(1);
      setStartDate(null);
      setEndDate(null);
    }
  };
  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
    setEndDate(new Date());
  };
  //filter by status
  const handleFilterByStatus = (event, value) => {
    setFilterByStatus(value);
    setCurrentPage(1);
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
              <Grid item xs={12} sm={5} display="flex" gap={2}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
                <CustomAutocomplete
                  size="small"
                  sx={{ width: "100%" }}
                  disablePortal
                  id="combo-box-description"
                  value={filterByStatus}
                  onChange={handleFilterByStatus}
                  options={["Pending", "Dispatched"]}
                  getOptionLabel={(option) => option}
                  label="Filter By Date"
                />
              </Grid>
              {/* Title Text centered */}
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 700,
                  }}
                >
                  Customer Sample Request
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" gap="1rem">
                  <CustomAutocomplete
                    size="small"
                    sx={{ width: "100%" }}
                    disablePortal
                    id="combo-box-description"
                    value={filterByDays}
                    onChange={handleFilterDays}
                    options={["Today", "Custom Date"]}
                    getOptionLabel={(option) => option}
                    label="Filter By Date"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleDownload}
                    style={{
                      textAlign: "end",
                    }}
                  >
                    DownLoad
                  </Button>

                  {exportData.length > 0 && (
                    <CSVLink
                      data={exportData}
                      headers={headers}
                      ref={csvLinkRef}
                      filename="SRF_Product.csv"
                      target="_blank"
                      style={{
                        textDecoration: "none",
                        outline: "none",
                        visibility: "hidden",
                      }}
                    />
                  )}
                </Box>
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
              sx={{ minWidthwidth: 1250, mx: "auto" }}
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
                  <StyledTableCell align="center">LR NO.</StyledTableCell>
                  <StyledTableCell align="center">
                    Customer Type
                  </StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {srfData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    getCustomerSRF={getCustomerSRF}
                    handleSuccess={handleSuccess}
                    handleError={handleError}
                  />
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
        <Popup
          maxWidth="md"
          setOpenPopup={setOpenCustomDate}
          openPopup={openCustomDate}
        >
          <CustomDate
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            resetDate={getResetDate}
          />
        </Popup>
      </Grid>
    </>
  );
};

function Row({ row, getCustomerSRF, handleError, handleSuccess }) {
  const [tableExpand, setTableExpand] = useState(false);
  const [recordData, setRecordData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openUpdateStatusPopup, setOpenUpdateStatusPopup] = useState(false);
  const [inputValue, setInputValue] = useState();
  useEffect(() => {
    if (recordData) {
      setInputValue({
        special_instructions: recordData.special_instructions || "",
        quantity: recordData.quantity || "",
        status: recordData.status || "",
      });
    }
  }, [recordData]);

  const [openUpdateProductStatusPopup, setOpenUpdateProductStatusPopup] =
    useState(false);
  const userData = useSelector((state) => state.auth.profile);

  const handleOpenPop = (data) => {
    setOpenUpdateStatusPopup(true);
    setRecordData(data);
  };

  const handleUpdateProductStatusPopup = (data) => {
    setOpenUpdateProductStatusPopup(true);
    setRecordData(data);
  };

  const handleInputchange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //download odf
  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "semi bold");
    doc.text(`SRF No: ${data.srf_no}`, 105, 20, {
      align: "center",
    });

    const { customer, address, contact_details, srf_products } = data;

    const startY = 40;
    const leftX = 14;
    const rightX = 150; // Push contact details further right
    const lineHeight = 8;

    // Left Block: Customer Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:", leftX, startY);
    doc.setFont("helvetica", "normal");

    const wrapAddress = doc.splitTextToSize(
      `Address: ${address.address}`,
      120, // Wider wrap area
    );

    const customerLines = [
      `Name: ${customer}`,
      ...wrapAddress,
      `City: ${address.city}`,
      `State: ${address.state}`,
      `Country: ${address.country}`,
      `Pincode: ${address.pincode}`,
      `Spacial Instructions: ${srf_products.map(
        (item) => item.special_instructions || "N/A",
      )}`,
    ];

    customerLines.forEach((line, i) => {
      doc.text(line, leftX, startY + lineHeight * (i + 1));
    });

    // Right Block: Contact Details (aligned to right corner)
    doc.setFont("helvetica", "bold");
    doc.text("Contact Details:", rightX, startY);
    doc.setFont("helvetica", "normal");

    const contactLines = [
      `Name: ${contact_details.name}`,
      `Contact: ${contact_details.contact}`,
      `Created By: ${data.created_by}`,
    ];

    contactLines.forEach((line, i) => {
      doc.text(line, rightX, startY + lineHeight * (i + 1));
    });

    // Calculate max Y to start table
    const linesCount = Math.max(customerLines.length, contactLines.length);
    const tableStartY = startY + (linesCount + 2) * lineHeight;

    const headers = [["#", "Product", "Unit", "Quantity"]];

    const filterProduct = data.srf_products.filter(
      (item, id) => item.status === "Available",
    );

    const rows = filterProduct.map((item, index) => [
      index + 1,
      item.product,
      item.unit,
      item.quantity,
    ]);
    autoTable(doc, {
      startY: tableStartY,
      head: headers,
      body: rows,
      styles: {
        fontSize: 10,
        halign: "center",
      },
      headStyles: {
        fillColor: "#ccc",
        textColor: "black",
        cellPadding: 3, // 👈 This adds padding in the header cells
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: "white",
        textColor: "black",
      },
      margin: { left: 14, right: 14 },
    });

    // Footer
    doc.setFontSize(11);
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.text("Authorized Signature: ______________________", leftX, footerY);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, footerY);

    doc.save(`SRF-${data.srf_no}.pdf`);
  };

  //update products

  const updateSRFProduct = async (id, data, close) => {
    try {
      setOpen(true);
      const res = await CustomerServices.updateSRFProduct(id, data);
      if (res.status === 200) {
        const message = res.data.message;
        handleSuccess(message);
        setTimeout(() => {
          close(false);
          getCustomerSRF();
        }, 500);
      }
    } catch (e) {
      handleError(e.response.data.message || "Expected Error");
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  //download lr image
  const handleClickLRCOPY = async (data) => {
    let url = data.lr_image ? data.lr_image : "";
    FileSaver.saveAs(url, "image");
  };
  return (
    <>
      <CustomLoader open={open} />
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
        <StyledTableCell align="center">{row.lr_no}</StyledTableCell>
        <StyledTableCell align="center">{row.content_type}</StyledTableCell>
        <StyledTableCell align="center">
          {" "}
          {(userData.groups.includes("Production") ||
            userData.groups.includes("Director") ||
            userData.groups.includes("QA") ||
            userData.groups.includes("Operations & Supply Chain Manager") ||
            userData.groups.includes("Sales Executive") ||
            userData.groups.includes("Customer Service")) && (
            <>
              <Button
                variant="text"
                size="small"
                color="primary"
                onClick={() => handleOpenPop(row)}
                disabled={userData.groups.includes(
                  "Operations & Supply Chain Manager",
                )}
              >
                View
              </Button>
              <Button
                variant="text"
                size="small"
                color="secondary"
                onClick={() => generatePDF(row)}
              >
                Download
              </Button>
              {row && (
                <Button
                  variant="text"
                  size="small"
                  sx={{ visibility: row.lr_no ? "visible" : "hidden" }}
                  color="success"
                  onClick={() => handleClickLRCOPY(row)}
                >
                  LR
                </Button>
              )}
            </>
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
                    {[
                      "Product",
                      "Unit",
                      "Quantity",
                      "Status",
                      "Special Intructions",
                      "Action",
                    ].map((header, i) => (
                      <TableCell
                        align="center"
                        style={{ color: "white" }}
                        key={i}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.srf_products.map((rows, index) => (
                    <TableRow
                      key={rows.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f1f8ff" : "#ffffff", // Alternating row colors
                      }}
                    >
                      <TableCell align="center">{rows.product}</TableCell>
                      <TableCell align="center">{rows.unit}</TableCell>
                      <TableCell align="center">
                        {rows.type_of_unit === "decimal"
                          ? rows.quantity
                          : Math.floor(rows.quantity)}
                      </TableCell>
                      <TableCell align="center">{rows.status}</TableCell>
                      <TableCell align="center">
                        {rows.special_instructions}
                      </TableCell>
                      <TableCell align="center">
                        {row.status === "Pending" && (
                          <Button
                            variant="text"
                            size="small"
                            color="success"
                            onClick={() => handleUpdateProductStatusPopup(rows)}
                            disabled={userData.groups.includes(
                              "Operations & Supply Chain Manager",
                            )}
                          >
                            View
                          </Button>
                        )}
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
      <Popup
        openPopup={openUpdateProductStatusPopup}
        setOpenPopup={setOpenUpdateProductStatusPopup}
        title="Update Product Status"
        maxWidth="md"
      >
        <Grid item xs={12} sm={12} mb={2}>
          <CustomAutocomplete
            size="small"
            disablePortal
            options={["Not Available"]}
            value={(inputValue && inputValue.status) || ""}
            onChange={(e, value) =>
              setInputValue((prev) => ({
                ...prev,
                status: value,
              }))
            }
            getOptionLabel={(option) => option}
            sx={{ minWidth: 300 }}
            label="Product Status"
          />
        </Grid>
        <Grid item xs={12} sm={12} mb={2}>
          <CustomTextField
            fullWidth
            name="quantity"
            size="small"
            label="Quantity"
            variant="outlined"
            value={(inputValue && inputValue.quantity) || ""}
            onChange={handleInputchange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomTextField
            fullWidth
            name="special_instructions"
            size="small"
            label="Special Instructions"
            variant="outlined"
            value={(inputValue && inputValue.special_instructions) || ""}
            onChange={handleInputchange}
          />
        </Grid>

        <Button
          onClick={() =>
            updateSRFProduct(
              recordData && recordData.id,
              inputValue,
              setOpenUpdateProductStatusPopup,
            )
          }
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
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
