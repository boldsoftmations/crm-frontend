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
  Switch,
  Button,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { CustomPagination } from "../../../Components/CustomPagination";
import InventoryServices from "../../../services/InventoryService";
import { ChalanInvoiceCreate } from "../ChallanInvoice/ChalanInvoiceCreate";

export const ChallanRegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chalanData, setChalanData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [challanNumbers, setChallanNumbers] = useState([]);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getChalanDetails(currentPage);
  }, [currentPage]);

  const getChalanDetails = async (page) => {
    setIsLoading(true);
    try {
      const response = await InventoryServices.getChalan(page);

      if (response && response.data.results) {
        setChalanData(response.data.results);
      }
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (err) {
      handleError(err);
      console.error("Error fetching Chalan data", err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAcceptClick = async (id) => {
  //   const data = { is_accepted: true };
  //   try {
  //     await InventoryServices.updateChalan(id, data);
  //     getChalanDetails();
  //   } catch (err) {
  //     console.error("Error updating Chalan", err);
  //   }
  // };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleToggle = (chalanId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [chalanId]: !prevOpen[chalanId],
    }));
  };

  const handleChallanCreate = (chalan) => {
    setOpenPopup(true);
    setChallanNumbers(chalan);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box marginBottom="10px"></Box>
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
              Challan Register
            </h3>
            <div></div>
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
                    Buyer Account
                  </StyledTableCell>
                  <StyledTableCell align="center">Job Worker</StyledTableCell>
                  <StyledTableCell align="center">Challan No</StyledTableCell>
                  <StyledTableCell align="center">Total Amount</StyledTableCell>
                  <StyledTableCell align="center">
                    Transpotation Cost
                  </StyledTableCell>
                  <StyledTableCell align="center">Accepted</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {chalanData.map((chalan) => (
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
                        {chalan.buyer_account}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.job_worker}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.challan_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.total_amount}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {chalan.transpotation_cost}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Switch
                          checked={chalan.is_accepted}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                        <Button
                          color="primary"
                          onClick={() => handleAcceptClick(chalan.id)}
                        >
                          Accept
                        </Button>
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        {!chalan.is_accepted && (
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => handleChallanCreate(chalan)}
                          >
                            Challan Create
                          </Button>
                        )}
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
                                  <TableCell>GRN</TableCell>
                                  <TableCell>Product</TableCell>
                                  <TableCell>Unit</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Chalan</TableCell>
                                  <TableCell align="right">Quantity</TableCell>
                                  <TableCell align="right">Rate</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {chalan.products.map((product) => (
                                  <TableRow key={product.product}>
                                    <TableCell>{product.grn}</TableCell>
                                    <TableCell component="th" scope="row">
                                      {product.product}
                                    </TableCell>
                                    <TableCell>{product.unit}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.challan}</TableCell>
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
          <Popup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            title={"Create Challan Invoice"}
            fullScreen={true}
          >
            <ChalanInvoiceCreate
              currentPage={currentPage}
              setOpenPopup={setOpenPopup}
              challanNumbers={challanNumbers}
              getChalanDetails={getChalanDetails}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
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
