import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const ChalanInvoiceView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState({});

  useEffect(() => {
    getInvoiceDetails(currentPage);
  }, [currentPage]);

  const getInvoiceDetails = async (page) => {
    setIsLoading(true);
    try {
      const response = await InventoryServices.getChallanInvoice(page);

      if (response && response.data.results) {
        setInvoiceData(response.data.results);
      }
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (err) {
      console.error("Error fetching invoice data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleToggle = (invoiceId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [invoiceId]: !prevOpen[invoiceId],
    }));
  };

  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Challan Invoice
            </h3>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  <StyledTableCell align="center">Toggle</StyledTableCell>
                  <StyledTableCell align="center">
                    Challan Number
                  </StyledTableCell>
                  <StyledTableCell align="center">Job Worker</StyledTableCell>
                  <StyledTableCell align="center">
                    Buyer Account
                  </StyledTableCell>
                  <StyledTableCell align="center">Invoice No</StyledTableCell>
                  <StyledTableCell align="center">
                    Service Charges
                  </StyledTableCell>
                  <StyledTableCell align="center">Service GST</StyledTableCell>
                  <StyledTableCell align="center">Total Amount</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {invoiceData.map((chalan) => (
                  <React.Fragment key={chalan.id}>
                    <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggle(chalan.id)}
                        >
                          {open[chalan.id] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.challan}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.job_worker}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.buyer_account}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.invoice_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.service_charge}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.service_gst}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.total_amount}
                      </StyledTableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={8}
                      >
                        <Collapse
                          in={open[chalan.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Products
                            </Typography>
                            <Table size="small" aria-label="products">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product</TableCell>
                                  <TableCell>Unit</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell align="right">Quantity</TableCell>
                                  <TableCell align="right">Rate</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {chalan.products.map((product) => (
                                  <TableRow key={product.product}>
                                    <TableCell component="th" scope="row">
                                      {product.product}
                                    </TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell align="right">
                                      {product.quantity}
                                    </TableCell>
                                    <TableCell align="right">
                                      {product.rate}
                                    </TableCell>
                                    <TableCell align="right">
                                      {product.amount}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0,
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
