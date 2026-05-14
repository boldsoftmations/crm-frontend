import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import moment from "moment";

import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

// ================= CONSTANTS =================
const PAGE_SIZE = 25;
const STATUS_OPTIONS = ["Pending", "Completed"];

const INITIAL_SNACKBAR = {
  open: false,
  message: "",
  severity: "success",
};

// ================= STYLES =================
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#006BA1",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// ================= HELPERS =================
const getNestedValue = (obj, path, fallback) => {
  var result = obj;
  for (var i = 0; i < path.length; i++) {
    if (result === null || result === undefined) {
      return fallback !== undefined ? fallback : "";
    }
    result = result[path[i]];
  }
  return result !== null && result !== undefined
    ? result
    : fallback !== undefined
      ? fallback
      : "";
};

// ================= COMPONENT =================
const TrainingCapaView = ({ defaultStatus = "Pending" }) => {
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(
    defaultStatus || "Pending",
  );
  const [isTraining, setIsTraining] = useState(
    defaultStatus === "Completed" ? "true" : "false",
  );

  const [snackbar, setSnackbar] = useState(INITIAL_SNACKBAR);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [trainedMap, setTrainedMap] = useState({});
  const [remark, setRemark] = useState("");

  // ================= CSV EXPORT =================
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const headers = [
    { label: "SR NO", key: "sr_no" },
    { label: "COMPLAINT NO", key: "complaint_no" },
    { label: "CUSTOMER", key: "customer" },
    { label: "STATUS", key: "status" },
    { label: "TRAINING STATUS", key: "training_status" },
    { label: "REMARK", key: "training_remark" },
    { label: "DATE", key: "date" },
  ];

  // ================= API =================
  const getAllCAPAData = useCallback(async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery,
        "",
        isTraining,
      );

      var results =
        response && response.data && response.data.results
          ? response.data.results
          : [];

      var count =
        response && response.data && response.data.count
          ? response.data.count
          : 0;

      setCCFData(results);
      setTotalPages(Math.ceil(count / PAGE_SIZE));

      var map = {};
      for (var j = 0; j < results.length; j++) {
        var item = results[j];
        if (item && item.id && item.is_training) {
          map[item.id] = true;
        }
      }
      setTrainedMap(map);
    } catch (error) {
      console.error("Error fetching CAPA data:", error);
    } finally {
      setLoader(false);
    }
  }, [currentPage, searchQuery, isTraining]);

  useEffect(() => {
    getAllCAPAData();
  }, [getAllCAPAData]);

  // ================= EXPORT CSV =================
  const handleExport = async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery,
        "",
        isTraining,
      );

      var results =
        response && response.data && response.data.results
          ? response.data.results
          : [];

      var exportRows = results.map(function (row, index) {
        return {
          sr_no: index + 1,
          complaint_no:
            row && row.ccf_details && row.ccf_details.complain_no
              ? row.ccf_details.complain_no
              : "",
          customer:
            row && row.ccf_details && row.ccf_details.customer
              ? row.ccf_details.customer
              : "",
          status: row && row.status ? row.status : "",
          training_status: row && row.is_training ? "Completed" : "Pending",
          training_remark:
            row && row.training_remark ? row.training_remark : "",
          date:
            row && row.creation_date
              ? moment(row.creation_date).format("DD-MM-YYYY")
              : "",
        };
      });

      return exportRows;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error exporting CSV",
        severity: "error",
      });
      return [];
    } finally {
      setLoader(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoader(true);
      const data = await handleExport();
      if (data && data.length > 0) {
        setExportData(data);
        setTimeout(function () {
          if (csvLinkRef.current) {
            csvLinkRef.current.link.click();
          }
        }, 300);
      } else {
        setSnackbar({
          open: true,
          message: "No data available for export",
          severity: "warning",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error downloading CSV",
        severity: "error",
      });
    } finally {
      setLoader(false);
    }
  };

  // ================= UPDATE TRAINING =================
  const updateTrainingStatus = async () => {
    if (!selectedRow || !selectedRow.id) return;

    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(selectedRow.id, {
        training_remark: remark,
        is_training: true,
      });

      var successMessage =
        response && response.data && response.data.message
          ? response.data.message
          : "Training updated successfully";

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      setTrainedMap(function (prev) {
        var updated = Object.assign({}, prev);
        updated[selectedRow.id] = true;
        return updated;
      });

      setRemark("");
      setOpenPopup(false);
      getAllCAPAData();
    } catch (error) {
      var errorMessage =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : "Error updating training";

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoader(false);
    }
  };

  // ================= HANDLERS =================
  const handleSearch = function (query) {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = function () {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleStatusChange = function (_, value) {
    if (!value) return;
    setSelectedStatus(value);
    setIsTraining(value === "Completed" ? "true" : "false");
    setCurrentPage(1);
  };

  const handleSwitchChange = function (row) {
    setSelectedRow(row);
    setRemark("");
    setOpenPopup(true);
  };

  var isCompletedView = selectedStatus === "Completed";

  // ================= RENDER =================
  return (
    <>
      <CustomLoader open={loader} />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={function () {
          setSnackbar(function (prev) {
            return Object.assign({}, prev, { open: false });
          });
        }}
      />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4 }}>
          {/* Header */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  Corrective & Preventive Action List
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <CustomAutocomplete
                    fullWidth
                    size="small"
                    options={STATUS_OPTIONS}
                    getOptionLabel={function (option) {
                      return option;
                    }}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    label="Filter by Status"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handleDownload}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: "140px",
                      boxShadow: "none",
                      px: 2,
                    }}
                  >
                    Download
                  </Button>

                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename={
                      "Training_CAPA_" + moment().format("YYYY_MM_DD") + ".csv"
                    }
                    target="_blank"
                    style={{ display: "none" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Complaint No.
                  </StyledTableCell>
                  <StyledTableCell align="center">Customer</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  {isCompletedView && (
                    <StyledTableCell align="center">Remark</StyledTableCell>
                  )}
                  <StyledTableCell align="center">Training</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {CCFData.map(function (row, i) {
                  var rowId = row && row.id ? row.id : null;
                  var isTrained = Boolean(rowId && trainedMap[rowId]);

                  return (
                    <StyledTableRow key={rowId || i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>

                      <StyledTableCell align="center">
                        {getNestedValue(row, ["ccf_details", "complain_no"])}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {getNestedValue(row, ["ccf_details", "customer"])}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row && row.status ? row.status : ""}
                      </StyledTableCell>

                      {isCompletedView && (
                        <StyledTableCell align="center">
                          {row && row.training_remark
                            ? row.training_remark
                            : "—"}
                        </StyledTableCell>
                      )}

                      <StyledTableCell align="center">
                        <Switch
                          checked={isTrained}
                          disabled={isTrained}
                          onChange={function () {
                            handleSwitchChange(row);
                          }}
                          color="success"
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}

                {CCFData.length === 0 && (
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      colSpan={isCompletedView ? 6 : 5}
                      sx={{ py: 4, color: "#9e9e9e" }}
                    >
                      No records found.
                    </StyledTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={function (_, value) {
              setCurrentPage(value);
            }}
          />
        </Paper>
      </Grid>

      {/* Confirmation Popup */}
      <Popup
        title="Training Confirmation"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        size="sm"
      >
        <Box sx={{ p: 3, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
            >
              Confirm Training Completion
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", maxWidth: 350, mx: "auto" }}
            >
              Please confirm whether the training has been completed and add a
              remark.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label="Training Remark"
              placeholder="Enter training remarks..."
              variant="outlined"
              value={remark}
              onChange={function (e) {
                setRemark(e.target.value);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={function () {
                setOpenPopup(false);
                setRemark("");
              }}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={updateTrainingStatus}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Popup>
    </>
  );
};

export default TrainingCapaView;
