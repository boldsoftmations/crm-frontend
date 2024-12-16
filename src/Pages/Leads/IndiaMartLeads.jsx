import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import LeadServices from "../../services/LeadService";
import CustomTextField from "./../../Components/CustomTextField";
import { CustomLoader } from "./../../Components/CustomLoader";

export const IndiaMartLeads = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const currentYearMonth = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;
  const [selectedYearMonth, setSelectedYearMonth] = useState(currentYearMonth);
  const Tableheaders = [
    "Date",
    "Direct Lead",
    "Buy Lead",
    "Call Lead",
    "Total Lead",
  ];

  const getIndiaMartLeads = async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getIndiaMartLeads(selectedYearMonth);
      setData(response.data);
      setOpen(false);
    } catch (error) {
      console.error(error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getIndiaMartLeads();
  }, [selectedYearMonth]);

  const filteredData = data.filter((row) => {
    const rowDate = new Date(row.date_time__date);
    const rowYearMonth = `${rowDate.getFullYear()}-${(rowDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    return rowYearMonth === selectedYearMonth;
  });
  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <CustomTextField
              size="small"
              type="month"
              label="Filter By Month and Year"
              value={selectedYearMonth}
              onChange={(e) => setSelectedYearMonth(e.target.value)}
              sx={{ width: 200, marginRight: "15rem" }}
            />

            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              IndiaMart Leads
            </h3>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 440,
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  {Tableheaders.map((header) => (
                    <StyledTableCell key={header} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      {row.date_time__date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.direct_leads || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.buy_leads || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.call_leads || 0}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.total_leads || 0}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
