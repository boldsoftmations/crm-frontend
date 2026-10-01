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

const rollbackColor = (status) => {
  if (status === "Rolled Back")
    return { background: "#e6f4ea", color: "#2e7d32" };
  if (status === "Not Rolled Back")
    return { background: "#fdecea", color: "#c62828" };
  return { background: "#f0f0f0", color: "#333" };
};

// ISO string ("2026-07-24T18:02:49.912502+05:30") ko readable format me convert karta hai
const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }
  const dateObj = new Date(value);
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

function Row({ row }) {
  const [open, setOpen] = useState(false);

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
        <StyledTableCell align="center">{row.field_name}</StyledTableCell>
        <StyledTableCell align="center" sx={{ color: "#c62828" }}>
          {row.old_pincode}
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ color: "#2e7d32" }}>
          {row.new_pincode}
        </StyledTableCell>

        <StyledTableCell align="center">
          <Chip
            label={row.rollback_status}
            size="small"
            sx={{
              ...rollbackColor(row.rollback_status),
              fontWeight: 600,
              fontSize: "11px",
              borderRadius: "6px",
            }}
          />
        </StyledTableCell>
        <StyledTableCell align="center">
          {formatDateTime(row.updated_at)}
        </StyledTableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Migration Details
              </Typography>
              <Table size="small" aria-label="migration-details">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">MIGRATION BATCH ID</TableCell>
                    <TableCell align="center">PK COLUMN</TableCell>
                    <TableCell align="center">PK VALUE</TableCell>
                    <TableCell align="center">UPDATE REASON</TableCell>
                    <TableCell align="center">UPDATED BY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.migration_batch_id ? row.migration_batch_id : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pk_column ? row.pk_column : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pk_value ? row.pk_value : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.update_reason ? row.update_reason : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.updated_by ? row.updated_by : "-"}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const ViewRefrenceGeoPostal = () => {
  const [logData, setLogData] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const getRefData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await MasterService.getPincodeRefrenceData(page, search);
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
    getRefData();
  }, [getRefData]);

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
            Pincode Reference Update Log
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
            sx={{ minWidth: 900 }}
            stickyHeader
            aria-label="pincode reference log table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Table Name</StyledTableCell>
                <StyledTableCell align="center">Field Name</StyledTableCell>
                <StyledTableCell align="center">Old Pincode</StyledTableCell>
                <StyledTableCell align="center">New Pincode</StyledTableCell>
                <StyledTableCell align="center">
                  Rollback Status
                </StyledTableCell>
                <StyledTableCell align="center">Updated At</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {logData && logData.length > 0 ? (
                logData.map((row) => <Row key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ color: "#999", py: 4 }}
                  >
                    No reference update records found
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

export default ViewRefrenceGeoPostal;
