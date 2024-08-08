import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import Hr from "../../../services/Hr";
import { OfferStatusUpdate } from "./OfferStatusUpdate";
import { CustomLoader } from "../../../Components/CustomLoader";

export const OfferStatusView = () => {
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoader(true);
      const response = await Hr.getOfferStatus();
      setOffers(response.data.results);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={12}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Box flexGrow={1} display="flex" justifyContent="center">
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
            }}
          >
            Offer Status
          </h3>
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
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Candidate Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Phone Number</StyledTableCell>
                <StyledTableCell align="center">Designation</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">Stage</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Joining Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.contact}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.designation}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.location}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.stage}</StyledTableCell>
                  <StyledTableCell align="center">{row.status}</StyledTableCell>
                  <StyledTableCell align="center">{row.doj}</StyledTableCell>

                  <StyledTableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleClickOpen(row)}
                    >
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Offer Status Update</DialogTitle>
          <DialogContent>
            <OfferStatusUpdate
              row={selectedRow}
              closeDialog={handleClose}
              onUpdateComplete={fetchOffers}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Grid>
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
