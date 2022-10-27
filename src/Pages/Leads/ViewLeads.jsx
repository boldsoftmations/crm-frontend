import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

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
  TextField,
  Box,
  IconButton,
  TableContainer,
  TableFooter,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";
import LeadServices from "./../../services/LeadService";

import SearchIcon from "@mui/icons-material/Search";
import "../CommonStyle.css";
import CustomAxios from "../../services/api";
import ReactPaginate from "react-paginate";
import { getLocalAccessToken } from "../../services/TokenService";
import { getallLeads } from "../../Redux/Action/Action";

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

export const Viewleads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pageCount, setpageCount] = useState(0);

  const getleads = async () => {
    try {
      setOpen(true);

      let response = await LeadServices.getAllLeads();
      if (response) {
        setLeads(response.data.results);

        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
        setOpen(false);
      }
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
    getleads();
  }, []);

  const getSearchData = async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getAllSearchLeads(searchQuery);
      if (response) {
        setLeads(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getleads();
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const fetchComments = async (currentPage) => {
    if (searchQuery) {
      const res = await CustomAxios.get(
        `https://crmbackend-glutape.herokuapp.com/api/lead/list-lead/?page=${currentPage}&search=${searchQuery}`
      );

      const data = await res.data;
      console.log("data", data);
      return data;
    } else {
      const res = await CustomAxios.get(
        `https://crmbackend-glutape.herokuapp.com/api/lead/list-lead/?page=${currentPage}`
      );
      const data = await res.data;
      console.log("data", data);
      return data;
    }
  };

  const handlePageClick = async (data) => {
    try {
      setOpen(true);

      let currentPage = data.selected + 1;
      const token = getLocalAccessToken();

      const commentsFormServer = await fetchComments(currentPage, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(commentsFormServer.results);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="Auth-form-container">
        <div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </div>

      <Grid item xs={12}>
        <p
          style={{
            width: "100%",
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
          <Box display="flex">
            <Box flexGrow={0.9} align="left">
              <TextField
                onChange={(e) => setSearchQuery(e.target.value)}
                name="search"
                size="small"
                label="Search"
                variant="outlined"
                sx={{ backgroundColor: "#ffffff" }}
              />
              <IconButton
                onClick={getSearchData}
                size="small"
                variant="outlined"
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box flexGrow={2} align="center">
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Leads
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                component={Link}
                to="/leads/create-lead"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
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
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">EMAIL</StyledTableCell>
                  <StyledTableCell align="center">
                    ALTERNATE CONTACT
                  </StyledTableCell>
                  <StyledTableCell align="center">ASSIGNED TO</StyledTableCell>
                  <StyledTableCell align="center">COMPANY NAME</StyledTableCell>

                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.lead_id ? row.lead_id : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name ? row.name : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.contact ? row.contact : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.email ? row.email : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.alternate_contact ? row.alternate_contact : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.assigned_to ? row.assigned_to : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company ? row.company : "-"}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          component={Link}
                          to={"/leads/update-lead/" + row.lead_id}
                          variant="contained"
                          color="primary"
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
          >
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </TableFooter>
        </Paper>
      </Grid>
    </>
  );
};
