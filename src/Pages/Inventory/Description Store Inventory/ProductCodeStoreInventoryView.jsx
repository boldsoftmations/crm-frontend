import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import InventoryServices from "../../../services/InventoryService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { Popup } from "../../../Components/Popup";
import { AllProductStoreInventoryView } from "./AllProductStoreInventoryView";

export const ProductCodeStoreInventoryView = ({ idForEdit }) => {
  console.log("idforedit", idForEdit);
  const [detailsData, setDetailsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const fetchConsStoreProductDetails = async () => {
    try {
      setOpen(true);
      const payload = {
        description: idForEdit.description,
        seller_account: idForEdit.unit,
      };
      const response =
        await InventoryServices.getProductCodeStoresInventoryDetails(payload); // Assuming InventoryServices has a method for this
      setDetailsData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchConsStoreProductDetails();
  }, [idForEdit]);

  const handleRowClick = (item) => {
    console.log("seus");
    setSelectedRow(item);
    setOpenPopup(true);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <TableContainer
            sx={{
              maxHeight: 360,
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
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">RATE</StyledTableCell>
                  <StyledTableCell align="center">TOTAL AMOUNT</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {detailsData.map((row, i) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pending_quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.rate}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.total_amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleRowClick(row)}>
                        Product
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        maxWidth="xl"
        title={"Consolidate Product"}
      >
        <AllProductStoreInventoryView
          idForEdit={idForEdit}
          selectedRow={selectedRow}
          setOpenCreatePopup={setOpenPopup}
        />
      </Popup>
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
