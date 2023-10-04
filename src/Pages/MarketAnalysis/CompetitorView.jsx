import React, { useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CompetitorUpdate } from "./CompetitorUpdate";
import { Popup } from "./../../Components/Popup";
import { ErrorMessage } from "./../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../Components/CustomSearch";
import { CustomLoader } from "./../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
import { CustomTable } from "../../Components/CustomTable";
import CustomerServices from "../../services/CustomerService";
import { CompetitorCreate } from "./CompetitorCreate";

export const CompetitorView = () => {
  const [allCompetitors, setAllCompetitors] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getCompetitors();
  }, []);

  const getCompetitors = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await CustomerServices.getAllPaginateCompetitors(
          currentPage
        );
        setAllCompetitors(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await CustomerServices.getAllCompetitors();
        setAllCompetitors(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
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

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await CustomerServices.getAllSearchCompetitors(
        filterSearch
      );
      if (response) {
        setAllCompetitors(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getCompetitors();
        setSearchQuery("");
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      if (searchQuery) {
        const response =
          await CustomerServices.getCompetitorsPaginatewithSearch(
            page,
            searchQuery
          );
        if (response) {
          setAllCompetitors(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getCompetitors();
          setSearchQuery("");
        }
      } else {
        const response = await CustomerServices.getAllPaginateCompetitors(page);
        setAllCompetitors(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getCompetitors();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };
  const TableHeader = ["ID", "Competitor", "ACTION"];
  const TableData = allCompetitors && allCompetitors.map((value) => value);

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={searchQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </Box>
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
                Competitor
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Competitor"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CompetitorCreate
          getCompetitors={getCompetitors}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Competitor"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CompetitorUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getCompetitors={getCompetitors}
        />
      </Popup>
    </>
  );
};
