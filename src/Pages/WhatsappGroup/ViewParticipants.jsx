import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { WhatsappServices } from "../../services/Whatsapp";
export const ViewParticipants = ({ selectedData }) => {
  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getParticipants = async () => {
    try {
      setOpen(true);
      const res = await WhatsappServices.getParticipants(selectedData.name);
      setParticipants(res.data);
    } catch (err) {
      setAlertMsg({
        message: err.response.data.error || "Failed to get participants",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getParticipants();
  }, []);

  const handleRemoveDelete = async (data) => {
    const payload = { customer: selectedData.name, users: [data.contact] };
    try {
      setOpen(true);
      const res = await WhatsappServices.RemoveParticipantsMembers(payload);
      console.log(res);
      setTimeout(() => {
        if (res.status === 200) {
          setAlertMsg({
            message: res.data.message,
            severity: "success",
            open: true,
          });
          getParticipants();
        }
      }, 1000);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.error,
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const handlePromoteAdmintoMembers = async (data) => {
    const payload = { customer: selectedData.name, users: [data.contact] };
    try {
      setOpen(true);
      const res = await WhatsappServices.promoteAdmintoMembers(payload);
      setTimeout(() => {
        if (res.status === 200) {
          setAlertMsg({
            message: res.data.message,
            severity: "success",
            open: true,
          });
          getParticipants();
        }
      }, 1000);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.error,
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const handleAddMemberinGroup = async () => {
    const payload = { company: selectedData.name };
    try {
      setOpen(true);
      const res = await WhatsappServices.AddParticipantsMembers(payload);
      setTimeout(() => {
        if (res.status === 200) {
          setAlertMsg({
            message: res.data.message,
            severity: "success",
            open: true,
          });
          getParticipants();
        }
      }, 1000);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.error,
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const Tableheaders = ["Name", "Contact", "Member Type", "Rank", "Action"];

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={10} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 600,
                  }}
                >
                  Participants
                </h3>
              </Grid>
              <Grid item xs={12} sm={2} alignItems={"end"}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleAddMemberinGroup}
                >
                  Add participants
                </Button>
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 350,
              "&::-webkit-scrollbar": {
                width: 10,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
                borderRadius: 5,
              },
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {Tableheaders.map((header) => {
                    return (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {participants &&
                  participants.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {`+${row.contact}`}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.rank}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={4}
                        >
                          {row.type === "Glutape" && row.rank === "member" && (
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              onClick={() => handlePromoteAdmintoMembers(row)}
                            >
                              Promote Admin
                            </Button>
                          )}
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveDelete(row)}
                          >
                            Remove
                          </Button>
                        </Box>
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
    padding: 2,
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
