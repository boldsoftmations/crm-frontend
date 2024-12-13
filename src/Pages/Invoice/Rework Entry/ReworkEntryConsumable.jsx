import React, { useState } from "react";
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


export const ReworkEntryConsumable = ({ selectedRow }) => {
  const [openPopSourceViewList, setOpenPopSourceViewList] = useState(false);
  const [materialData, setMaterialData] = useState(selectedRow);

  const handleOpenPopUp = (value) => {
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
                  selectedRow.consumable.map((row, index) => (
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
                          color="primary"
                          variant="outlined"
                          onClick={() => handleOpenPopUp(row)}
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
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
