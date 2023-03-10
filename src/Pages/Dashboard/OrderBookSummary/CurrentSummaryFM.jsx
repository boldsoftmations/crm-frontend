import React, { useEffect, useState } from "react";
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
export const CurrentSummaryFM = (props) => {
  const { currentOrderBookSummaryFM } = props;
  const [sum, setSum] = useState(0);
  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  function calculateSum(data) {
    let sum = 0;
    data.forEach((row) => {
      sum += row.total_amount;
    });
    setSum(sum);
  }

  useEffect(() => {
    calculateSum(currentOrderBookSummaryFM);
  }, [currentOrderBookSummaryFM]);


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
                Current Order Book(Finish Goods)
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
                  <StyledTableCell align="center">
                    PRODUCT DESC.
                  </StyledTableCell>
                  <StyledTableCell align="center">QTY</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">TOTAL AMOUNT</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {currentOrderBookSummaryFM.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.product__description__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.total_quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product__unit__name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {numberFormat(row.total_amount)}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
                <StyledTableRow>
                  <StyledTableCell align="center">Total</StyledTableCell>
                  <StyledTableCell colSpan={2}></StyledTableCell>
                  <StyledTableCell align="center">
                    {numberFormat(sum)}
                  </StyledTableCell>
                </StyledTableRow>
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
