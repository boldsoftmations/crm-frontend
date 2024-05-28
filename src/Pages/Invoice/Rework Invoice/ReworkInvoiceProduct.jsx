import React, { useEffect, useState } from "react";
import {
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "../../../Components/Popup";
import { ReworkSourceSourceViewList } from "./ReworkSourceViewList";

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

export const ReworkInvoiceProduct = ({ selectedRow, setOpenPopup }) => {
  const [openPopSourceViewList, setOpenPopSourceViewList] = useState(false);
  const [materialData, setMaterialData] = useState(selectedRow);

  const handleOpenPop = (value) => {
    console.log("Selected raw material:", value);
    setMaterialData(value);
    setOpenPopSourceViewList(true);
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper>
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
              sx={{ minWidth: 500 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRow &&
                  selectedRow.raw_materials.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          color="success"
                          variant="outlined"
                          onClick={() => handleOpenPop(row)}
                        >
                          View Source List
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        maxWidth="xl"
        title={"Source View List"}
        openPopup={openPopSourceViewList}
        setOpenPopup={setOpenPopSourceViewList}
      >
        <ReworkSourceSourceViewList selectedRow={materialData} />
      </Popup>
    </>
  );
};
