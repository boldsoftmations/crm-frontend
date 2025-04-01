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
import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import CapaDownload from "./CapaDownload";
import CapaImageView from "./CapaImagesView";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import UpdateCAPA from "./UpdateCAPA";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CreateCreditNote } from "./CreateCreditNote";
import { CreateMaterialReturn } from "./CreateMaterialReturn";

export const CapaView = () => {
  const [open, setOpen] = useState(false);
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [imagesData, setImagesData] = useState(null);
  const [updateCAPAPopup, setUpdateCAPAPopup] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openCrediNote, setOpenCrediNote] = useState(false);
  const [openMaterialReturn, setOpenMaterialReturn] = useState(false);
  const [formData, setFormData] = useState("");
  const userData = useSelector((state) => state.auth.profile);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // ✅ Fetch CAPA Data
  const getAllCAPAData = useCallback(async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery
      );
      setCCFData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      console.error("Error fetching CAPA data:", error);
    } finally {
      setLoader(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    getAllCAPAData();
  }, [getAllCAPAData]);

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
        setOpenPopup(false); // Close the form dialog if submission is successful
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
                  Corrective & Preventive Action List
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {[
                    "Complaint No.",
                    "Customer",
                    "Created By",
                    "Date",
                    "Complaint Type",
                    "Status",
                    "Updated By",
                    "Action",
                  ].map((head, index) => (
                    <StyledTableCell key={index} align="center">
                      {head}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CCFData.map((row, i) => (
                  <StyledTableRow key={i}>
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
                          userData.groups.includes("Director")) &&
                          row.status === "Accept" &&
                          row.sfcs === null && (
                            <Button
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={() => handlePopup(setOpenPopup, row)}
                            >
                              View
                            </Button>
                          )}
                        {(userData.groups.includes("Accounts") ||
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
                        {(userData.groups.includes("QA") ||
                          userData.groups.includes("Director")) &&
                          row.status === "Pending" && (
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              onClick={() =>
                                handlePopup(setUpdateCAPAPopup, row)
                              }
                            >
                              Update
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
                        {!userData.groups.includes("Accounts") && (
                          <Button
                            color="inherit"
                            variant="text"
                            className="mx-3"
                            size="small"
                            onClick={() => handleImageShow(row.document)}
                          >
                            Document View
                          </Button>
                        )}
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
        <CapaImageView imagesData={imagesData} setImageShow={setImageShow} />
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
        <UpdateCAPA
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
