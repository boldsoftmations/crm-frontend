import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Collapse,
  IconButton,
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
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import MasterService from "../../../services/MasterService";

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

const actionColor = (action) => {
  if (action === "CREATE") return { background: "#e6f4ea", color: "#2e7d32" };
  if (action === "UPDATE") return { background: "#fff8e1", color: "#f57f17" };
  if (action === "DELETE") return { background: "#fdecea", color: "#c62828" };
  return { background: "#f0f0f0", color: "#333" };
};

// old_value / new_value poore objects hote hain (kisi bhi table_name ke liye),
// isliye diff khud compute karna padta hai. Ye function generic hai -
// master_country ho, master_pincode ho, ya koi aur table - sab handle karega.
const computeFieldChanges = (row) => {
  const oldVal = row.old_value ? row.old_value : {};
  const newVal = row.new_value ? row.new_value : {};

  if (row.action === "CREATE") {
    // sirf new_value dikhana hai
    return Object.keys(newVal).map((field) => ({
      field,
      old: "-",
      new:
        newVal[field] !== null && newVal[field] !== undefined
          ? String(newVal[field])
          : "-",
    }));
  }

  if (row.action === "DELETE") {
    // sirf old_value dikhana hai
    return Object.keys(oldVal).map((field) => ({
      field,
      old:
        oldVal[field] !== null && oldVal[field] !== undefined
          ? String(oldVal[field])
          : "-",
      new: "-",
    }));
  }

  // UPDATE -> sirf wahi fields jo actually change hue hain
  const allKeys = Array.from(
    new Set([...Object.keys(oldVal), ...Object.keys(newVal)]),
  );

  const changed = [];
  allKeys.forEach((field) => {
    const ov = oldVal[field];
    const nv = newVal[field];
    const ovStr = ov !== null && ov !== undefined ? String(ov) : "-";
    const nvStr = nv !== null && nv !== undefined ? String(nv) : "-";
    if (ovStr !== nvStr) {
      changed.push({ field, old: ovStr, new: nvStr });
    }
  });

  return changed;
};

// master_pincode ke liye specific fields jo hum poori tarah dikhana chahte hain
// (field/old/new diff ke bajaye, ek Old row + New row wala table)
// const PINCODE_FIELDS = [
//   { key: "pincode", label: "Pincode" },
//   { key: "city", label: "City" },
//   { key: "state", label: "State" },
//   { key: "country", label: "Country" },
//   { key: "county", label: "County" },
//   { key: "postal_code_normalized", label: "Postal Code Normalized" },
//   { key: "verification_status", label: "Verification Status" },
//   { key: "is_active", label: "Is Active" },
//   { key: "source", label: "Source" },
//   { key: "deactivated_at", label: "Deactivated At" },
//   { key: "deactivation_reason", label: "Deactivation Reason" },
// ];

// const formatFieldValue = (val) => {
//   if (val === null || val === undefined || val === "") {
//     return "-";
//   }
//   if (typeof val === "boolean") {
//     return val ? "true" : "false";
//   }
//   return String(val);
// };

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const changes = computeFieldChanges(row);

  // UPDATE action tha but old_value === new_value (koi field-level diff nahi) -
  // isse user ko clear pata chalega ki ye bug nahi hai, backend ne bas
  // audit row bana di bina actual change ke.
  const isNoOpUpdate =
    row.action === "UPDATE" && changes && changes.length === 0;

  return (
    <>
      <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <StyledTableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.id}</StyledTableCell>
        <StyledTableCell align="center">{row.table_name}</StyledTableCell>
        <StyledTableCell align="center">{row.record_id}</StyledTableCell>
        <StyledTableCell align="center">
          <Chip
            label={row.action}
            size="small"
            sx={{
              ...actionColor(row.action),
              fontWeight: 600,
              fontSize: "11px",
              borderRadius: "6px",
            }}
          />
        </StyledTableCell>
        <StyledTableCell align="center">{row.changed_by}</StyledTableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Changes
              </Typography>

              {row.reason && (
                <Typography
                  variant="body2"
                  sx={{ color: "#666", marginBottom: 1 }}
                >
                  Reason: {row.reason}
                </Typography>
              )}

              <Table size="small" aria-label="changes">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">FIELD</TableCell>
                    <TableCell align="center">OLD VALUE</TableCell>
                    <TableCell align="center">NEW VALUE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changes && changes.length > 0 ? (
                    changes.map((c) => (
                      <StyledTableRow key={c.field}>
                        <StyledTableCell align="center">
                          {c.field}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ color: "#c62828" }}
                        >
                          {c.old}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ color: "#2e7d32" }}
                        >
                          {c.new}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "#999" }}
                      >
                        {isNoOpUpdate
                          ? "No field-level changes detected (old and new values are identical)"
                          : "No changes recorded"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const ViewPincodeAuditLog = () => {
  const [logData, setLogData] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const getAllPincodeAuditLogData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await MasterService.getPincodeAuditlog(page, search);
      setLogData(
        response.data && response.data.results ? response.data.results : [],
      );
      setCount(response.data && response.data.count ? response.data.count : 0);
      setHasNext(response.data && response.data.next ? true : false);
      setHasPrevious(response.data && response.data.previous ? true : false);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  }, [page, search]);

  useEffect(() => {
    getAllPincodeAuditLogData();
  }, [getAllPincodeAuditLogData]);

  const handleSearchClick = () => {
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <>
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
        <Box sx={{ marginBottom: 2 }}>
          <h3
            style={{
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            Pincode Audit Log
          </h3>
        </Box>

        <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />
          <Button variant="contained" onClick={handleSearchClick}>
            Search
          </Button>
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
            sx={{ minWidth: 700 }}
            stickyHeader
            aria-label="pincode audit log table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Table Name</StyledTableCell>
                <StyledTableCell align="center">Record ID</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
                <StyledTableCell align="center">Changed By</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {logData && logData.length > 0 ? (
                logData.map((row) => <Row key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ color: "#999", py: 4 }}
                  >
                    No audit records found
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
            marginTop: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#666" }}>
            Total records: {count}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={hasPrevious ? false : true}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={hasNext ? false : true}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ViewPincodeAuditLog;
