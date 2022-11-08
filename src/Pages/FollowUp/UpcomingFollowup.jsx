import React, { useEffect, useState, useRef } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
  styled,
  Box,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import LeadServices from "../../services/LeadService";
import moment from "moment";
import { Popup } from "./../../Components/Popup";
import { UpdateLeads } from "./../Leads/UpdateLeads";
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const UpcomingFollowup = () => {
  const [upcomingFollowUp, setUpcomingFollowUp] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [followupId, setFollowupId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const upcomingData = upcomingFollowUp.filter((item) => {
    if (item.id == followupId) {
      return item;
    }
  });

  const handleClose = () => {
    setOpenModal(false);
  };

  const SubmitId = (id) => {
    setFollowupId(id);
    setOpenModal(true);
  };

  const getFollowUp = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllFollowUp();

      setUpcomingFollowUp(res.data.upcoming_followups);
      console.log("followUp :>> ", res.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  useEffect(() => {
    getFollowUp();
  }, []);

  const UpcomingFollowUps = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        id: upcomingData[0].id,
        leads: upcomingData[0].leads,
        current_date: upcomingData[0].current_date,
        next_followup_date: upcomingData[0].next_followup_date,
        notes: upcomingData[0].notes,
        user: upcomingData[0].user,
        is_followed_up: true,
      };
      await LeadServices.createFollowUps(followupId, data);

      setOpenModal(false);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err creating follwups", err);
    }
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Assigned To
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {upcomingData ? (
            <>
              {upcomingData.map((row, i) => {
                return (
                  <Grid container spacing={2} key={i}>
                    <Grid item xs={12} sm={6}>
                      ID : {row.id}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      LEADS : {row.leads}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      NOTES : {row.notes}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      CUURENT DATE :{" "}
                      {moment(row.current_date ? row.current_date : "-").format(
                        "DD/MM/YYYY h:mm:ss"
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      NEXT FOLLOWUP DATE :{" "}
                      {moment(
                        row.next_followup_date ? row.next_followup_date : "-"
                      ).format("DD/MM/YYYY")}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      USER : {row.user}
                    </Grid>
                  </Grid>
                );
              })}
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            onClick={(e) => UpcomingFollowUps(e)}
            sx={{ mt: 3, mb: 2, textAlign: "right" }}
          >
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Upcoming FollowUp */}
      <Grid item xs={12}>
        <p
          style={{
            // width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            backgroundColor: errMsg ? "red" : "offscreen",
            textAlign: "center",
            color: "white",
            textTransform: "capitalize",
          }}
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent={"center"}>
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Upcoming FollowUp
            </h3>
          </Box>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">LEADS</StyledTableCell>
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>

                  <StyledTableCell align="center">USER</StyledTableCell>
                  <StyledTableCell align="center">CURRENT DATE</StyledTableCell>
                  <StyledTableCell align="center">
                    NEXT FOLLOWUP DATE
                  </StyledTableCell>
                  <StyledTableCell align="center">NOTE</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingFollowUp.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.id ? row.id : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.leads ? row.leads : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name ? row.name : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company ? row.company : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.user ? row.user : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {moment(
                          row.current_date ? row.current_date : "-"
                        ).format("DD/MM/YYYY h:mm:ss")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {moment(
                          row.next_followup_date ? row.next_followup_date : "-"
                        ).format("DD/MM/YYYY")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.notes ? row.notes : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => openInPopup(row.leads)}
                        >
                          View
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          onClick={(e) => SubmitId(row.id)}
                        >
                          Done
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getleads={getFollowUp}
        />
      </Popup>
    </>
  );
};
