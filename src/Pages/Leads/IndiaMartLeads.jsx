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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
export const IndiaMartLeads = () => {
  const currentMonth = new Date().getMonth() + 1;
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

  useEffect(() => {
    getIndiaMartLeads();
  }, [selectedYearMonth]);

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
