import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  // TableFooter,
  TableHead,
  TableRow,
  Typography,
  Chip,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CustomLoader } from "../../../Components/CustomLoader";
import InvoiceServices from "../../../services/InvoiceService";

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
        <StyledTableCell align="center">{row.created_at}</StyledTableCell>
        <StyledTableCell align="center">{row.app_name}</StyledTableCell>
        <StyledTableCell align="center">{row.model_name}</StyledTableCell>
        <StyledTableCell align="center">{row.object_id}</StyledTableCell>
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
        <StyledTableCell align="center">{row.changed_by_name}</StyledTableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Changes
              </Typography>
              <Table size="small" aria-label="changes">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">FIELD</TableCell>
                    <TableCell align="center">OLD VALUE</TableCell>
                    <TableCell align="center">NEW VALUE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.changes && Object.keys(row.changes).length > 0 ? (
                    Object.entries(row.changes).map(([field, val]) => (
                      <StyledTableRow key={field}>
                        <StyledTableCell align="center">
                          {field}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ color: "#c62828" }}
                        >
                          {val.old !== null && val.old !== undefined
                            ? String(val.old)
                            : "-"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{ color: "#2e7d32" }}
                        >
                          {val.new !== null && val.new !== undefined
                            ? String(val.new)
                            : "-"}
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
                        No changes recorded
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

const AuditRportView = (props) => {
  const [getAllAuditreportData, setAllAuditReportData] = useState([]);
  const [open, setOpen] = useState(false);

  const getAuditReportData = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAuditReportData();
      setAllAuditReportData(response.data && response.data.results);
    } catch (e) {
      console.log(e);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAuditReportData();
  }, []);

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
            Audit Report
          </h3>
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
            aria-label="audit report table"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Date & Time</StyledTableCell>
                <StyledTableCell align="center">App Name</StyledTableCell>
                <StyledTableCell align="center">Model</StyledTableCell>
                <StyledTableCell align="center">Object ID</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
                <StyledTableCell align="center">Changed By</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {getAllAuditreportData && getAllAuditreportData.length > 0 ? (
                getAllAuditreportData.map((row) => (
                  <Row key={row.id} row={row} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
      </Paper>
    </>
  );
};

export default AuditRportView;
