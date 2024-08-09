import React, { useCallback, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Switch,
  Button,
  Paper,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { pdf } from "@react-pdf/renderer";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import { MaterialTransferNoteCreate } from "./MaterialTransferNoteCreate";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { MaterialTransferNotePDF } from "./MaterialTransferNotePDF";
import { MaterialTransferAccept } from "./MaterialTransferAccept";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import CustomSelect from "../../../Components/CustomSelect";

export const MaterialTransferNoteView = () => {
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openAcceptPopup, setOpenAcceptPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [materialTransferNote, setMaterialTransferNote] = useState([]);
  const [materialTransferNoteByID, setMaterialTransferNoteByID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState("");
  const [filterByDays, setFilterByDays] = useState("today");
  const [sellerOption, setSellerOption] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV file downloaded successfully");
    } catch (error) {
      handleError(error);
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "USER", key: "user" },
    { label: "SELLER UNIT", key: "seller_account" },
    { label: "DATE", key: "date" },
    { label: "PRODUCT", key: "product" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "ACCEPTED", key: "accepted" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllMaterialTransferNoteData(
        "all",
        acceptedFilter,
        searchQuery,
        filterByDays
      );

      const data = response.data.map((row) => {
        return {
          user: row.user,
          seller_account: row.seller_account,
          date: row.created_on,
          product: row.product,
          unit: row.unit,
          quantity: row.quantity,
          accepted: row.accepted,
        };
      });
      setOpen(false);
      handleSuccess("Exported successfully");
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };
  const handlePrint = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <MaterialTransferNotePDF materialTransferNoteByID={data} />,
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
      handleSuccess("Exported successfully");
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
    }
  };

  const handleDownloadPdf = (item) => {
    handlePrint(item);
    setMaterialTransferNoteByID(item);
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const data = userData.groups.includes("Production Delhi")
        ? "Delhi"
        : "Maharashtra";
      const response = await InvoiceServices.getfilterSellerAccountData(data);
      setSellerOption(response.data.results);
      setOpen(false);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllMaterialTransferNoteDetails = useCallback(async () => {
    try {
      setOpen(true);

      const response = await InventoryServices.getAllMaterialTransferNoteData(
        currentPage,
        acceptedFilter,
        searchQuery,
        filterByDays
      );

      setMaterialTransferNote(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, acceptedFilter, searchQuery, filterByDays]);

  useEffect(() => {
    getAllMaterialTransferNoteDetails();
  }, [currentPage, acceptedFilter, searchQuery, filterByDays]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const clearAcceptedFilter = () => {
    setAcceptedFilter("");
  };
  const cleardaysFilter = () => setFilterByDays("");

  const handleAcceptedFilter = (event) => {
    setAcceptedFilter(event.target.value);
    setCurrentPage(1);
  };
  const handleDaysFilter = (event) => {
    setFilterByDays(event.target.value);
    setCurrentPage(1);
  };

  const handleAccept = (item) => {
    setOpenAcceptPopup(true);
    setMaterialTransferNoteByID(item);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Usage
  // const isAcceptedEdit =
  //   userData.groups.includes("Accounts") ||
  //   userData.groups.includes("Production") ||
  //   userData.groups.includes("Production Delhi");

  const isAcceptedView =
    userData.groups.includes("Director") ||
    userData.groups.includes("Stores") ||
    userData.groups.includes("Stores Delhi");

  // const filteredMaterialTransferNote = Object.keys(materialTransferNote)
  //   .filter((key) => !materialTransferNote[key].accepted)
  //   .reduce((obj, key) => {
  //     obj[key] = materialTransferNote[key];
  //     return obj;
  //   }, {});

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
              {/* Left Section: Filter and Search */}
              <Grid
                item
                xs={12}
                sm={9}
                display="flex"
                alignItems="center"
                gap="5px"
              >
                <CustomSelect
                  label="Filter By Accepted"
                  options={AcceptedOption}
                  value={acceptedFilter}
                  onChange={handleAcceptedFilter}
                  onClear={clearAcceptedFilter}
                />
                <CustomSelect
                  label="Filter By Days"
                  options={filterDays}
                  value={filterByDays}
                  onChange={handleDaysFilter}
                  onClear={cleardaysFilter}
                />
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Center Section: Title */}

              {/* Right Section: Add and Download Buttons */}
              <Grid
                item
                xs={12}
                sm={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                {(userData.groups.includes("Production") ||
                  userData.groups.includes("Director") ||
                  userData.groups.includes("Production Delhi")) && (
                  <Button
                    variant="contained"
                    onClick={() => setOpenCreatePopup(true)}
                  >
                    Add
                  </Button>
                )}
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Material Transfer Note.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Material Transfer Note
                </h3>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  <StyledTableCell align="center">User</StyledTableCell>
                  <StyledTableCell align="center">
                    Seller Account
                  </StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Accepted</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {materialTransferNote.map((mtnData) => (
                  <React.Fragment key={mtnData.id}>
                    <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <StyledTableCell align="center">
                        {mtnData.user}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.seller_account}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.created_on}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Switch
                          checked={mtnData.accepted}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {isAcceptedView && mtnData.accepted === false && (
                          <Button
                            color="success"
                            onClick={() => handleAccept(mtnData)}
                          >
                            Accept
                          </Button>
                        )}
                        <Button
                          color="primary"
                          onClick={() => handleDownloadPdf(mtnData)}
                        >
                          Downlaod
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      <Popup
        maxWidth="xl"
        title={"Create Material Transfer Note"}
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <MaterialTransferNoteCreate
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          setOpenCreatePopup={setOpenCreatePopup}
          sellerOption={sellerOption}
        />
      </Popup>

      <Popup
        maxWidth="xl"
        title={"View Material Transfer Note"}
        openPopup={openAcceptPopup}
        setOpenPopup={setOpenAcceptPopup}
      >
        <MaterialTransferAccept
          materialTransferNoteByID={materialTransferNoteByID}
          setOpenAcceptPopup={setOpenAcceptPopup}
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
        />
      </Popup>
    </>
  );
};

const AcceptedOption = [
  { label: "Accepted", value: "true" },
  { label: "Not Accepted", value: "false" },
];
const filterDays = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Month", value: "this_month" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
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
