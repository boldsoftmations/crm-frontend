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
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import CapaDownload from "./CapaDownload";
import CapaImageView from "./CapaImagesView";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CreateCreditNote } from "./CreateCreditNote";
import { CreateMaterialReturn } from "./CreateMaterialReturn";
// import UpdateCAPAStatus from "./UpdateCAPAStatus";
import UpdateCAPAStatus from "./UpdateCAPAStatus";
import UpdateCapa from "./UpdateCapa";
import Updatesettlement from "./Updatesettlement";

export const CapaView = ({ defaultStatus = "", isClose = false }) => {
  const [open, setOpen] = useState(false);
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [imagesData, setImagesData] = useState(null);
  const [updateCAPAPopup, setUpdateCAPAPopup] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openSettlement, setOpenSettlement] = useState(false);
  const [openCrediNote, setOpenCrediNote] = useState(false);
  const [openMaterialReturn, setOpenMaterialReturn] = useState(false);
  const [formData, setFormData] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [openNewPopup, setOpenNewPopup] = useState(false);
  const [capaStatus, setCapaStatus] = useState(defaultStatus);
  const [openRejectPopup, setOpenRejectPopup] = useState(false);
  const statusOptions = ["Reject", "Accept", "Pending", "Closed"];

  const getAllCAPAData = useCallback(async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery,
        capaStatus,
        isClose, // false = non-closed records, true = closed records
      );
      setCCFData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching CAPA data:", error);
    } finally {
      setLoader(false);
    }
  }, [currentPage, searchQuery, capaStatus, isClose]);

  useEffect(() => {
    getAllCAPAData();
  }, [getAllCAPAData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleImageShow = (data) => {
    setImageShow(true);
    setImagesData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePopup = (setter, data = null) => {
    setRecordForEdit(data);
    setter(true);
  };

  const handleUpdateCapa = async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(recordForEdit.id, {
        sfcs: formData,
      });
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        setOpenPopup(false);
        getAllCAPAData();
      }, 400);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message || "Error Updating CAPA");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <CustomLoader open={loader} />
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

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
                  Corrective & Preventive Action List
                </h3>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "right" } }}
              >
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  options={statusOptions}
                  value={capaStatus || null}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) => {
                    setCapaStatus(value || "");
                    setCurrentPage(1);
                  }}
                  label="Filter by Status"
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": { width: 15 },
              "&::-webkit-scrollbar-track": { backgroundColor: "#f2f2f2" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa9ac" },
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
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">
                    Complaint Type
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Updated By</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CCFData.filter((item) => {
                  if (capaStatus === "Closed") return item.status === "Closed";
                  return item.status !== "Closed";
                }).map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {totalCount - (currentPage - 1) * 25 - i}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ccf_details.complain_no}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ccf_details.customer ? row.ccf_details.customer : ""}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.created_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.creation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.complain_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.updated_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box
                        display="flex"
                        gap={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes(
                            "Accounts Billing Department",
                          ) ||
                          userData.groups.includes("Director")) &&
                          row.status === "Accept" &&
                          row.sfcs === null && (
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => handlePopup(setOpenPopup, row)}
                              disabled={
                                row.ccfstatus === "Pending By Account Manager"
                              }
                            >
                              View
                            </Button>
                          )}

                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes("Director")) && (
                          <Button
                            variant="text"
                            color="primary"
                            size="small"
                            onClick={() => handlePopup(setOpenSettlement, row)}
                            disabled={
                              row.ccfstatus !== "Pending By Account Manager"
                            }
                          >
                            Update Settlement
                          </Button>
                        )}
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes(
                            "Accounts Billing Department",
                          ) ||
                          userData.groups.includes("Director")) &&
                          row.status === "Accept" &&
                          row.sfcs === "Credit" && (
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => handlePopup(setOpenCrediNote, row)}
                            >
                              Credit Note
                            </Button>
                          )}
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes(
                            "Accounts Billing Department",
                          ) ||
                          userData.groups.includes("Director")) &&
                          row.status === "Accept" &&
                          row.sfcs === "Material Return" && (
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() =>
                                handlePopup(setOpenMaterialReturn, row)
                              }
                            >
                              Material Return
                            </Button>
                          )}
                        {(userData.groups.includes("Production") ||
                          userData.groups.includes(
                            "Factory-Mumbai-OrderBook",
                          ) ||
                          userData.groups.includes("Director")) &&
                          row.status === "Pending" && (
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              onClick={() =>
                                handlePopup(setUpdateCAPAPopup, row)
                              }
                              disabled={row.status !== "Pending"}
                            >
                              Update Status
                            </Button>
                          )}
                        {(userData.groups.includes("QA") ||
                          userData.groups.includes("Director")) && (
                          <Button
                            variant="text"
                            color="success"
                            size="small"
                            onClick={() => handlePopup(setOpenNewPopup, row)}
                            disabled={
                              !row.status === "Reject" ||
                              row.status === "Accept" ||
                              row.status === "Pending" ||
                              row.status === "Closed"
                            }
                          >
                            Update CAPA
                          </Button>
                        )}
                        <Button
                          variant="text"
                          color="secondary"
                          size="small"
                          onClick={() => handlePopup(setOpenPdf, row)}
                        >
                          View pdf
                        </Button>

                        <Button
                          color="inherit"
                          variant="text"
                          className="mx-3"
                          size="small"
                          onClick={() => handleImageShow(row)}
                        >
                          Document View
                        </Button>
                      </Box>
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
        fullScreen={true}
        title="Document Preview"
        openPopup={imageShow}
        setOpenPopup={setImageShow}
      >
        <CapaImageView
          imagesData={imagesData}
          recordForEdit={recordForEdit}
          setImageShow={setImageShow}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Update Capa"
        openPopup={openNewPopup}
        setOpenPopup={setOpenNewPopup}
      >
        <UpdateCapa
          recordForEdit={recordForEdit}
          setOpenCapa={setOpenNewPopup}
          getAllCCFData={getAllCAPAData}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Create Credit Note"
        openPopup={openCrediNote}
        setOpenPopup={setOpenCrediNote}
      >
        <CreateCreditNote recordForEdit={recordForEdit} />
      </Popup>
      <Popup
        fullScreen={true}
        title="Corrective And Preventive Action View"
        openPopup={openPdf}
        setOpenPopup={setOpenPdf}
      >
        <CapaDownload recordForEdit={recordForEdit} setOpenPdf={setOpenPdf} />
      </Popup>
      <Popup
        fullScreen={true}
        title="Update Corrective And Preventive Action"
        openPopup={updateCAPAPopup}
        setOpenPopup={setUpdateCAPAPopup}
      >
        <UpdateCAPAStatus
          recordForEdit={recordForEdit}
          setUpdateCAPAPopup={setUpdateCAPAPopup}
          getAllCAPAData={getAllCAPAData}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Create Sales Material Return"
        openPopup={openMaterialReturn}
        setOpenPopup={setOpenMaterialReturn}
      >
        <CreateMaterialReturn
          recordForEdit={recordForEdit}
          setOpenMaterialReturn={setOpenMaterialReturn}
          getAllCAPAData={getAllCAPAData}
        />
      </Popup>
      <Popup
        title="Confirm Rejection"
        openPopup={openRejectPopup}
        setOpenPopup={setOpenRejectPopup}
      >
        <Typography>Are you sure you want to reject?</Typography>
        <br />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" onClick={() => setOpenRejectPopup(false)}>
            NO
          </Button>
          <Button color="error" variant="contained">
            Yes
          </Button>
        </Box>
      </Popup>
      <Popup
        maxWidth="md"
        title="Update capa settlement"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Box width={370}>
          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              disablePortal
              id="product-selector"
              options={["Credit", "Material Return"]}
              getOptionLabel={(option) => option}
              onChange={(e, value) => setFormData(value)}
              label="Suggestion for claim settlement"
            />
          </Grid>
          <Grid sx={12} style={{ marginTop: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateCapa}
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Popup>
      <Popup
        openPopup={openSettlement}
        setOpenPopup={setOpenSettlement}
        title="Update capa settlement"
      >
        <Updatesettlement
          recordForEdit={recordForEdit}
          setOpenSettlement={setOpenSettlement} // popup band karne ke liye
          getAllCAPAData={getAllCAPAData} // table refresh karne ke liye
        />
      </Popup>
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
    padding: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 6,
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
