import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableFooter,
  Collapse,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import jsPDF from "jspdf";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { MaterialRequisitionFormCreate } from "./MaterialRequisitionFormCreate";
import { MaterialRequisitionFormUpdate } from "./MaterialRequisitionFormUpdate";
import { useSelector } from "react-redux";
import logo from "../../../Images/LOGOS3.png";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import InvoiceServices from "../../../services/InvoiceService";
import CustomDate from "../../../Components/CustomDate";

export const MaterialRequisitionFormView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [materialRequisitionData, setMaterialRequisitionData] = useState([]);
  const [materialRequisitionDataByID, setMaterialRequisitionDataByID] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const [filterByUnit, setFilterByUnit] = useState("");
  const [sellerAccountOption, setSellerAccountOption] = useState([]);
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date("2030-12-31").toISOString().split("T")[0];
  const [customDataPopup, setCustomDataPopup] = useState(false);
  const [filterByDays, setFilterByDays] = useState("today");
  const users = useSelector((state) => state.auth.profile);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV Downloaded Successfully");
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "USER", key: "user" },
    { label: "SELLER STATE", key: "seller_account" },
    { label: "DATE", key: "created_on" },
    { label: "PRODUCT", key: "product" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await InventoryServices.getAllMaterialRequisitionFormData(
          "all",
          searchQuery
        );
      } else {
        response = await InventoryServices.getAllMaterialRequisitionFormData(
          "all"
        );
      }
      // Flatten the data structure
      const ArrayData = response.data.reduce((acc, item) => {
        // Iterate over each product in the current item's products array
        const productsFlattened = item.products_data.map((product) => ({
          id: item.id, // Retain the ID for each product
          user: item.user, // Retain the user for each product
          seller_account: item.seller_account, // Retain the seller_account for each product
          created_on: item.created_on, // Retain the created_on date for each product
          product: product.product, // Extract the product name
          quantity: product.quantity, // Extract the quantity
          unit: product.unit, // Extract the unit
        }));
        // Concatenate the flattened products to the accumulator
        return acc.concat(productsFlattened);
      }, []); // Initial value of accumulator is an empty array
      setOpen(false);
      return ArrayData;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllConsStoresInventoryData();
      setStoresInventoryData(response.data);
    } catch (err) {
      console.log("err", err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllStoresInventoryDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerAccountOption(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllMaterialRequisitionFormDetails = useCallback(async () => {
    try {
      setOpen(true);
      const StartDate = startDate ? startDate.toISOString().split("T")[0] : "";
      const EndDate = endDate ? endDate.toISOString().split("T")[0] : "";
      const response =
        await InventoryServices.getAllMaterialRequisitionFormData(
          currentPage,
          searchQuery,
          filterByUnit,
          filterByDays,
          StartDate,
          EndDate
        );
      setMaterialRequisitionData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
      setOpen(false);
      console.error("error", error);
    }
  }, [
    currentPage,
    searchQuery,
    filterByUnit,
    filterByDays,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    getAllMaterialRequisitionFormDetails();
  }, [
    currentPage,
    searchQuery,
    filterByUnit,
    filterByDays,
    startDate,
    endDate,
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleFilter = (event, value) => {
    setFilterByUnit(value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Stores Accept Api
  const updateMaterialRequisitionFormDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        seller_account: data.seller_account,
        user: data.user,
        accepted: true,
        products_data: data.products_data,
      };
      await InventoryServices.updateMaterialRequisitionFormData(data.id, req);

      setOpenPopup(false);
      setOpenPopup3(false);
      getAllMaterialRequisitionFormDetails();
      handleSuccess("Material Requisition Form Accepted");
      setTimeout(() => {
        setOpen(false);
      }, 300);
    } catch (error) {
      handleError(error);
      console.log("error Store Accepting", error);
      setOpen(false);
    }
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  const handlePrint = async (data) => {
    try {
      const Total_qty =
        data.products_data.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <MyDocument materialRequisitionDataByID={data} Total_qty={Total_qty} />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `ID Number ${data.id}.pdf`;
      document.body.appendChild(link);

      // trigger the download
      link.click();

      // clean up the temporary link element
      document.body.removeChild(link);
      handleSuccess("Material Requisition Form Printed");
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
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
  const handleChange = (value) => {
    if (value === "custom_date") {
      setStartDate(new Date());
      setEndDate(new Date());
      setFilterByDays("");
      setCustomDataPopup(true);
    } else {
      setFilterByDays(value);
      setStartDate(null);
      setEndDate(null);
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
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Search Component */}
              <Grid
                item
                xs={12}
                sm={5}
                gap={2}
                display="flex"
                justifyContent="space-between"
              >
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, newValue) =>
                    handleChange(newValue ? newValue.value : "")
                  }
                  options={filterDays}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  label="Filter By Date"
                />
              </Grid>

              {/* Center Section: Title */}
              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "start",
                  }}
                >
                  Material Requisition Form
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  name="seller_unit"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  value={filterByUnit}
                  onChange={(event, value) =>
                    handleFilter("seller_unit", value)
                  }
                  options={sellerAccountOption.map((option) => option.unit)}
                  getOptionLabel={(option) => option}
                  fullWidth
                  label="Filter By Seller Unit"
                />
              </Grid>
              {/* Right Section: Download and Add Buttons */}
              <Grid
                item
                xs={12}
                sm={12}
                gap={2}
                display="flex"
                justifyContent="space-between"
              >
                {(users.groups.includes("Accounts") ||
                  users.groups.includes("Director")) && (
                  <>
                    <Button onClick={handleDownload} variant="contained">
                      Download CSV
                    </Button>
                    {exportData.length > 0 && (
                      <CSVLink
                        data={[...exportData]}
                        headers={headers}
                        ref={csvLinkRef}
                        filename="Store Inventory.csv"
                        target="_blank"
                        style={{
                          textDecoration: "none",
                          outline: "none",
                          height: "5vh",
                        }}
                      />
                    )}
                  </>
                )}
                {(users.groups.includes("Production") ||
                  users.groups.includes("Production Delhi") ||
                  users.groups.includes("Director")) && (
                  <Button
                    onClick={() => setOpenPopup2(true)}
                    variant="contained"
                    color="success"
                    style={{ marginLeft: "5px" }}
                  >
                    Add
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 360,
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">USER</StyledTableCell>
                  <StyledTableCell align="center">SELLER UNIT</StyledTableCell>
                  <StyledTableCell align="center">DATE</StyledTableCell>
                  <StyledTableCell align="center">ACCEPTED</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {materialRequisitionData.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    openInPopup={openInPopup}
                    users={users}
                    setOpenPopup3={setOpenPopup3}
                    handlePrint={handlePrint}
                    setMaterialRequisitionDataByID={
                      setMaterialRequisitionDataByID
                    }
                    updateMaterialRequisitionFormDetails={
                      updateMaterialRequisitionFormDetails
                    }
                  />
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </TableFooter>
        </Paper>
      </Grid>
      <Popup
        openPopup={customDataPopup}
        setOpenPopup={setCustomDataPopup}
        title="Date Filter"
        maxWidth="md"
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
      <Popup
        maxWidth="xl"
        title={"Create Material Requisition Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <MaterialRequisitionFormCreate
          currentPage={currentPage}
          searchQuery={searchQuery}
          storesInventoryData={storesInventoryData}
          getAllMaterialRequisitionFormDetails={
            getAllMaterialRequisitionFormDetails
          }
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"Update Material Requisition Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MaterialRequisitionFormUpdate
          currentPage={currentPage}
          searchQuery={searchQuery}
          setOpenPopup={setOpenPopup}
          storesInventoryData={storesInventoryData}
          getAllMaterialRequisitionFormDetails={
            getAllMaterialRequisitionFormDetails
          }
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"View Material Requisition Note"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        {materialRequisitionDataByID !== null && (
          <>
            <div>
              <div style={style.container}>
                <div style={styles.row}>
                  <div id="invoice">
                    <Image style={style.logo} src={logo} />
                  </div>
                  <div style={{ ...styles.cell, textAlign: "left" }}>
                    <strong>Date</strong>
                  </div>
                  <div style={styles.cell}>
                    {materialRequisitionDataByID.created_on}
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.cell, textAlign: "left" }}>
                    <strong>User</strong>
                  </div>
                  <div style={styles.cell}>
                    {materialRequisitionDataByID.user}
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ ...styles.cell, textAlign: "left" }}>
                    <strong>Seller Unit</strong>
                  </div>
                  <div style={styles.cell}>
                    {materialRequisitionDataByID.seller_account}
                  </div>
                </div>
                <div style={{ ...styles.row, ...styles.header }}>
                  <div style={styles.cell}>PRODUCT</div>
                  <div style={styles.cell}>UNIT</div>
                  <div style={styles.cell}>QUANTITY</div>
                </div>
                {materialRequisitionDataByID &&
                  materialRequisitionDataByID.products_data.map(
                    (historyRow, i) => (
                      <div style={styles.row} key={i}>
                        <div style={styles.cell}>{historyRow.product}</div>
                        <div style={styles.cell}>{historyRow.unit}</div>
                        <div style={styles.cell}>{historyRow.quantity}</div>
                      </div>
                    )
                  )}
              </div>
            </div>
            <Button
              onClick={() =>
                updateMaterialRequisitionFormDetails(
                  materialRequisitionDataByID
                )
              }
              variant="contained"
              color="success"
            >
              Accept
            </Button>
          </>
        )}
      </Popup>
    </>
  );
};

function Row(props) {
  const {
    row,
    openInPopup,
    users,
    setOpenPopup3,
    setMaterialRequisitionDataByID,
    handlePrint,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* <CustomLoader open={open} /> */}
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.id}</StyledTableCell>
        <StyledTableCell align="center">{row.user}</StyledTableCell>
        <StyledTableCell align="center">{row.seller_account}</StyledTableCell>
        <StyledTableCell align="center">{row.created_on}</StyledTableCell>
        <StyledTableCell align="center">
          <Switch
            checked={row.accepted}
            inputProps={{ "aria-label": "controlled" }}
          />
        </StyledTableCell>

        <StyledTableCell align="center">
          {(users.groups.includes("Accounts") ||
            users.groups.includes("Production") ||
            users.groups.includes("Production Delhi") ||
            users.groups.includes("Director")) &&
            row.accepted === false && (
              <Button
                onClick={() => openInPopup(row)}
                // variant="contained"
                color="success"
              >
                Edit
              </Button>
            )}

          <Button
            onClick={() => {
              handlePrint(row);
              setMaterialRequisitionDataByID(row);
            }}
            // variant="contained"
            // endIcon={<DownloadIcon />}
          >
            Download
          </Button>

          {(users.groups.includes("Stores") ||
            users.groups.includes("Stores Delhi") ||
            users.groups.includes("Director")) &&
            row.accepted === false && (
              <Button
                onClick={() => {
                  setOpenPopup3(true);
                  setMaterialRequisitionDataByID(row);
                }}
                // variant="contained"
                color="success"
              >
                View
              </Button>
            )}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Products
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">PRODUCT</TableCell>
                    <TableCell align="center">UNIT</TableCell>
                    <TableCell align="center">QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products_data.map((historyRow, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {historyRow.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {historyRow.quantity}
                      </StyledTableCell>
                    </StyledTableRow>
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
const filterDays = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Month", value: "this_month" },
  { label: "Custom Date", value: "custom_date" },
];

const style = StyleSheet.create({
  container: {
    // margin: "50pt",
    // padding: "10pt",
    border: "1pt solid #ccc",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    padding: "5pt",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    flexGrow: 1,
    textAlign: "center",
    padding: "5pt",
  },
  logo: {
    height: "auto",
    width: "100pt",
  },
  lightText: {
    color: "#777", // set the color to a light gray color
  },
});

const MyDocument = ({ materialRequisitionDataByID, Total_qty }) => (
  <Document>
    <Page style={{ fontFamily: "Helvetica", fontSize: "12pt" }}>
      <View style={{ padding: "20pt" }}>
        <View style={style.container}>
          <View style={style.row}>
            <View style={style.cell}>
              <Image style={style.logo} src={logo} />
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: "14pt", fontWeight: "semibold" }}>
                Material Requisition Form
              </Text>
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Text style={{ fontSize: "14pt", fontWeight: "semibold" }}>
                ID: {materialRequisitionDataByID.id}
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(materialRequisitionDataByID.created_on).format(
                  "DD-MM-YYYY"
                )}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>User</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialRequisitionDataByID.user}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Accepted</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialRequisitionDataByID.accepted ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Seller Unit</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialRequisitionDataByID.seller_account}
              </Text>
            </View>
          </View>
          {/* Empty row */}
          <View style={style.row}>
            <View style={style.cell}></View>
            <View style={style.cell}></View>
          </View>
          <View style={{ ...style.row, ...style.header }}>
            <View style={style.cell}>
              <Text>Sr. No.</Text>
            </View>
            <View style={style.cell}>
              <Text>PRODUCT</Text>
            </View>
            <View style={style.cell}>
              <Text>UNIT</Text>
            </View>
            <View style={style.cell}>
              <Text>QUANTITY</Text>
            </View>
          </View>
          {materialRequisitionDataByID &&
            materialRequisitionDataByID.products_data.map((historyRow, i) => (
              <View style={style.row} key={i}>
                <View style={style.cell}>
                  <Text style={style.lightText}>{i + 1}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.product}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.unit}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={style.lightText}>{historyRow.quantity}</Text>
                </View>
              </View>
            ))}
          <View
            style={{
              margin: "10px",
              textAlign: "right",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <Text style={{ ...style.lightText, marginRight: "40px" }}>
              TOTAL QTY : {Total_qty}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const styles = {
  container: {
    borderCollapse: "collapse",
    width: "100%",
    marginBottom: "1rem",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid #dee2e6",
  },
  lastRow: {
    borderBottom: "none",
  },
  header: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
  },
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    padding: "0.5rem",
    textAlign: "center",
  },
};

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
    padding: 5,
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
