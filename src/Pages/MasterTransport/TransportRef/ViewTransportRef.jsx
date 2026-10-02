import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  Button,
  MenuItem,
  Stack,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomLoader } from "../../../Components/CustomLoader";
import MasterService from "../../../services/MasterService";
import { Popup } from "../../../Components/Popup";
import UpdateTransportRef from "./UpdateTransportRef";
import ResolveTransportRequest from "./ResolveTransportRequest";
import { canManageTransportAssignmentRequests } from "../../../utility/masterAccess";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 7,
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 7,
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

const STATUS_OPTIONS = [
  "",
  "Open",
  "In Progress",
  "Closed",
  "Rejected",
  "PI Dropped",
];

const statusColor = (status) => {
  if (status === "Open") return { background: "#fff8e1", color: "#f57f17" };
  if (status === "Closed") return { background: "#e6f4ea", color: "#2e7d32" };
  if (status === "Rejected") return { background: "#fdecea", color: "#c62828" };
  if (status === "In Progress") {
    return { background: "#e3f2fd", color: "#1565c0" };
  }
  if (status === "PI Dropped") {
    return { background: "#f3e5f5", color: "#6a1b9a" };
  }
  return { background: "#f0f0f0", color: "#333" };
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const dateObj = new Date(value.includes ? value.replace(" ", "T") : value);
  if (isNaN(dateObj.getTime())) {
    return value;
  }

  return dateObj.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ViewTransportRef = () => {
  const userData = useSelector((state) => state.auth.profile);

  const [transportRefData, setTransportRefData] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [recordData, setRecordData] = useState(null);

  const [openResolvePopup, setOpenResolvePopup] = useState(false);
  const [resolveRecord, setResolveRecord] = useState(null);

  const canManageRequest = canManageTransportAssignmentRequests(userData);

  const getTransportRefData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await MasterService.getTransportRefData(
        page,
        search,
        statusFilter,
      );

      setTransportRefData(
        response && response.data && response.data.results
          ? response.data.results
          : [],
      );
      setCount(
        response && response.data && response.data.count
          ? response.data.count
          : 0,
      );
      setHasNext(
        response && response.data && response.data.next ? true : false,
      );
      setHasPrevious(
        response && response.data && response.data.previous ? true : false,
      );
    } catch (error) {
      console.log(error);
      setTransportRefData([]);
      setCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setOpen(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    getTransportRefData();
  }, [getTransportRefData]);

  const handleSearchClick = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const handleEditClick = (row) => {
    setRecordData(row);
    setOpenEditPopup(true);
  };

  const handleResolveClick = (row) => {
    setResolveRecord(row);
    setOpenResolvePopup(true);
  };

  const isOpenForResolution = (row) =>
    row && (row.status === "Open" || row.status === "In Progress");

  return (
    <>
      <CustomLoader open={open} />

      <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, textAlign: "center", color: "#222" }}
          >
            Transport Assignment Requests
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "#777", mt: 0.5 }}
          >
            Surface mapping requests created automatically when a Customer PI is saved as To Be Assigned.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <TextField
            size="small"
            placeholder="Search pincode / unit / PI / status"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearchClick();
              }
            }}
            sx={{ minWidth: 300 }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 170 }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option || "all"} value={option}>
                {option || "All Statuses"}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleSearchClick}>
            Search
          </Button>

          <Button variant="outlined" onClick={handleClearFilters}>
            Clear
          </Button>

          <Button variant="outlined" onClick={getTransportRefData}>
            Refresh
          </Button>
        </Stack>

        <TableContainer
          sx={{
            maxHeight: 500,
            "&::-webkit-scrollbar": { width: 12, height: 12 },
            "&::-webkit-scrollbar-track": { backgroundColor: "#f2f2f2" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa9ac" },
          }}
        >
          <Table
            sx={{ minWidth: 1450 }}
            stickyHeader
            aria-label="transport assignment request table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Request</StyledTableCell>
                <StyledTableCell align="center">Created At</StyledTableCell>
                <StyledTableCell align="center">Unit</StyledTableCell>
                <StyledTableCell align="center">Postal Code / Pincode</StyledTableCell>
                <StyledTableCell align="center">Customer</StyledTableCell>
                <StyledTableCell align="center">PI</StyledTableCell>
                <StyledTableCell align="center">Requested By</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Assigned To</StyledTableCell>
                <StyledTableCell align="center">Remarks</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {transportRefData && transportRefData.length > 0 ? (
                transportRefData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">#{row.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {formatDateTime(row.created_at)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.unit ? row.unit : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.canonical_pincode
                            ? row.canonical_pincode
                            : row.pincode_text
                              ? row.pincode_text
                              : "-"}
                        </Typography>
                        {row.canonical_pincode && row.pincode_text && row.canonical_pincode !== row.pincode_text ? (
                          <Typography variant="caption" sx={{ color: "#777" }}>
                            Raw: {row.pincode_text}
                          </Typography>
                        ) : null}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company ? row.company : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pi_number ? row.pi_number : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.requested_by ? row.requested_by : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Chip
                        label={row.status ? row.status : "-"}
                        size="small"
                        sx={{
                          ...statusColor(row.status),
                          fontWeight: 600,
                          fontSize: "11px",
                          borderRadius: "6px",
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to ? row.assigned_to : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.remarks ? row.remarks : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {canManageRequest && isOpenForResolution(row) ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleEditClick(row)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            disabled={!row.canonical_pincode}
                            onClick={() => handleResolveClick(row)}
                          >
                            Resolve
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          {canManageRequest ? "Read only" : "View only"}
                        </Typography>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ color: "#999", py: 4 }}
                  >
                    No transporter mapping requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#666" }}>
            Total records: {count}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              disabled={!hasPrevious}
              onClick={() => setPage((previousPage) => previousPage - 1)}
            >
              Previous
            </Button>
            <Typography
              variant="body2"
              sx={{ px: 1, display: "flex", alignItems: "center" }}
            >
              Page {page}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              disabled={!hasNext}
              onClick={() => setPage((previousPage) => previousPage + 1)}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Popup
        title="Update Transport Assignment Request"
        openPopup={openEditPopup}
        setOpenPopup={setOpenEditPopup}
      >
        <UpdateTransportRef
          dataForEdit={recordData}
          setOpenEditPopup={setOpenEditPopup}
          getTransportRefData={getTransportRefData}
        />
      </Popup>

      <Popup
        title="Resolve Transport Assignment Request"
        openPopup={openResolvePopup}
        setOpenPopup={setOpenResolvePopup}
      >
        <ResolveTransportRequest
          dataForResolve={resolveRecord}
          setOpenResolvePopup={setOpenResolvePopup}
          getTransportRefData={getTransportRefData}
        />
      </Popup>
    </>
  );
};

export default ViewTransportRef;
