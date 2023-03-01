import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import React from "react";

export const OrderBookSummaryView = (props) => {
  const { orderBookSummary } = props;
  return (
    <>
      {" "}
      {/* <CustomLoader open={open} /> */}
      <Grid item xs={12}>
        {/* <ErrorMessage errRef={errRef} errMsg={errMsg} /> */}
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}></Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                View Order Book Summary
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right"></Box>
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">SELLER STATE</StyledTableCell>
                  <StyledTableCell align="center">AMOUNT</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {orderBookSummary.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.orderbook__proforma_invoice__seller_account__state}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.total_amount}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          /> */}
        </Paper>
      </Grid>
    </>
  );
};
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
