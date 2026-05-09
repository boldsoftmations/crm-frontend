import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { CustomPagination } from "../../../Components/CustomPagination";
import CreateCCF from "./CreateCCF";
import SearchComponent from "../../../Components/SearchComponent ";
import CustomerServices from "../../../services/CustomerService";
import ImageView from "../CAPA/ImageView";
import ComplainPdf from "../CAPA/ComplaintPdf";
import CreateCapa from "../CAPA/CreateCapa";
import { useSelector } from "react-redux";
import UpdateCCF from "./UpdateCCF";
import { CapaStatusView } from "./CapaStatusView";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const CCFView = () => {
  const [open, setOpen] = useState(false);
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCCF, setOpenCCF] = useState(false);
  const [updateCCF, setUpdateCCF] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [openCapa, setOpenCapa] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  const [ViewData, setViewData] = useState(null);
  const [openStatusPopup, setOpenStatusPopup] = useState(false);
  const [recordForStatus, setRecordForStatus] = useState(null);
  const [openRejectConfirm, setOpenRejectConfirm] = useState(false);
  const [recordForReject, setRecordForReject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("active");

  const allowedRoles = [
    "Director",
    "Operations & Supply Chain Manager",
    "Sales Executive",
    "Sales Manager",
    "Sales Manager(Retailer)",
  ];
  const userData = useSelector((state) => state.auth.profile);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllCCFData = useCallback(async () => {
    try {
      setOpen(true);
      const isActiveParam = activeFilter === "active" ? true : false;
      const response = await CustomerServices.getAllCCFData(
        currentPage,
        searchQuery,
        isActiveParam,
      );
      setCCFData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery, activeFilter]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getAllCCFData();
  }, [currentPage, searchQuery, activeFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const openStatusPopupHandler = (row) => {
    setOpenStatusPopup(true);
    setRecordForStatus(row);
  };

  const handleRejectClick = (row) => {
    setRecordForReject(row);
    setOpenRejectConfirm(true);
  };

  const handleConfirmReject = async () => {
    try {
      setOpen(true);
      await CustomerServices.CCFUpdate(recordForReject.id, {
        is_active: false,
      });
      setOpenRejectConfirm(false);
      setRecordForReject(null);
      getAllCCFData();
      setOpen(false);
    } catch (error) {
      handleError(error);
      setOpen(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const updateCCFData = (row) => {
    setViewData(row);
    setUpdateCCF(true);
  };

  const handleImageShow = (data) => {
    setImageShow(true);
    setImagesData(data);
  };
  const handledownloadpdf = (data) => {
    setPdfData(data);
    setOpenPdf(true);
  };

  const handledOpenCapa = (data) => {
    setRecordForEdit(data);
    setOpenCapa(true);
  };

  const handleupdateInactive = async () => {
    try {
      setOpen(true);
      await CustomerServices.CCFUpdate(ViewData.id, { is_active: true });
      getAllCCFData();
      setOpen(false);
    } catch (error) {
      handleError(error);
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
              <Grid item xs={12} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Filter Dropdown */}
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  id="status-filter"
                  label="Status"
                  value={activeFilter}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setActiveFilter(newValue);
                      setCurrentPage(1);
                    }
                  }}
                  options={["active", "inactive"]}
                  getOptionLabel={(option) =>
                    option === "active" ? "Active" : "Inactive"
                  }
                  fullWidth
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={3}
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
                  Customer Complaint Form{" "}
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                {(userData.groups.includes("Director") ||
                  userData.groups.includes("Sales Executive") ||
                  userData.groups.includes("Sales Manager") ||
                  userData.groups.includes("Sales Manager(Retailer)")) && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setOpenCCF(true)}
                  >
                    Create CCF
                  </Button>
                )}
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">No</StyledTableCell>
                  <StyledTableCell align="center">
                    Complaint No.
                  </StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">
                    Complaint Type
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Creation Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Complaint</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Priority</StyledTableCell>
                  <StyledTableCell align="center">
                    Compaint Source
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Invoices</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CCFData &&
                  CCFData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.complain_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.department}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.customer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.complain_type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.creation_date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.complaint}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.priority}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.source_of_complaint}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.ccfstatus}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.invoices.map((invoice, index) => (
                          <span key={index}>
                            {invoice}
                            {index < row.invoices.length - 1 && (
                              <span style={{ margin: "0 5px" }}>|</span>
                            )}
                          </span>
                        ))}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          color="info"
                          variant="text"
                          size="small"
                          onClick={() => handleImageShow(row.document)}
                        >
                          Document View
                        </Button>

                        {allowedRoles.some(function (role) {
                          return userData.groups.includes(role);
                        }) && (
                          <Button
                            color="primary"
                            variant="text"
                            onClick={() => updateCCFData(row)}
                            disabled={
                              row.ccfstatus !== "Under Review" ||
                              userData.groups.includes("Customer Service") ||
                              row.is_active === false
                            }
                          >
                            Update
                          </Button>
                        )}
                        <Button
                          color="secondary"
                          variant="text"
                          size="small"
                          onClick={() => handledownloadpdf(row)}
                        >
                          DownLoad
                        </Button>
                        {(userData.groups.includes("Director") ||
                          userData.groups.includes("QA")) &&
                          row.is_closed === false && (
                            <Button
                              color="success"
                              size="small"
                              onClick={() => handledOpenCapa(row)}
                              disabled={
                                userData.groups.includes(
                                  "Customer Service",
                                  "Operations & Supply Chain Manager",
                                ) ||
                                row.ccfstatus !==
                                  ("Under Review" || "CAPA Created") ||
                                row.is_active === false
                              }
                            >
                              Create CAPA
                            </Button>
                          )}

                        <Button
                          color="success"
                          onClick={() => openStatusPopupHandler(row)}
                          size="small"
                        >
                          Status View
                        </Button>

                        {(userData.groups.includes("Director") ||
                          userData.groups.includes("QA") ||
                          userData.groups.includes(
                            "Operations & Supply Chain Manager",
                          ) ||
                          userData.groups.includes("Customer Service")) && (
                          <Button
                            color="error"
                            variant="text"
                            size="small"
                            onClick={() => handleRejectClick(row)}
                            disabled={
                              // row.ccfstatus !== "Under Review" ||
                              row.is_active === false ||
                              userData.groups.includes("Customer Service")
                            }
                          >
                            Reject
                          </Button>
                        )}
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
        <Popup
          fullScreen={true}
          title="Create CCF"
          openPopup={openCCF}
          setOpenPopup={setOpenCCF}
        >
          <CreateCCF getAllCCFData={getAllCCFData} setOpenCCF={setOpenCCF} />
        </Popup>
        <Popup
          fullScreen={true}
          title="Update CCF"
          openPopup={updateCCF}
          setOpenPopup={setUpdateCCF}
        >
          <UpdateCCF
            ViewData={ViewData}
            getAllCCFData={getAllCCFData}
            setOpenCCF={setUpdateCCF}
          />
        </Popup>
        <Popup
          fullScreen={true}
          title="Document Preview"
          openPopup={imageShow}
          setOpenPopup={setImageShow}
        >
          <ImageView imagesData={imagesData} setImageShow={setImageShow} />
        </Popup>

        <Popup
          fullScreen={true}
          title="Download Pdf"
          openPopup={openPdf}
          setOpenPopup={setOpenPdf}
        >
          <ComplainPdf pdfData={pdfData} setOpenPdf={setOpenPdf} />
        </Popup>
        <Popup
          fullScreen={true}
          title="Corrective And Preventive Action Form"
          openPopup={openCapa}
          setOpenPopup={setOpenCapa}
        >
          <CreateCapa
            recordForEdit={recordForEdit}
            getAllCCFData={getAllCCFData}
            setOpenCapa={setOpenCapa}
          />
        </Popup>

        <Popup
          fullScreen={true}
          title="CCF Tracking Status"
          openPopup={openStatusPopup}
          setOpenPopup={setOpenStatusPopup}
        >
          <CapaStatusView
            setOpenCapa={setOpenCapa}
            recordForEdit={recordForStatus}
          />
        </Popup>

        <Popup
          title="Confirm Rejection"
          openPopup={openRejectConfirm}
          setOpenPopup={setOpenRejectConfirm}
        >
          <Box sx={{ p: 3, textAlign: "center" }}>
            <p>Are you sure you want to reject this complaint?</p>
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmReject}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenRejectConfirm(false)}
              >
                No
              </Button>
            </Box>
          </Box>
        </Popup>
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
