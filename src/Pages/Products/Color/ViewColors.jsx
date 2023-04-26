import React, { useEffect, useRef, useState } from "react";

import "../../CommonStyle.css";

import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductService from "../../../services/ProductService";
import { CreateColor } from "./CreateColor";
import { UpdateColor } from "./UpdateColor";
import { Popup } from "./../../../Components/Popup";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";

export const ViewColors = () => {
  const [allColor, setAllColor] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const getColours = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await ProductService.getAllPaginateColour(currentPage);
        setAllColor(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getAllColour();
        setAllColor(response.data.results);
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

  useEffect(() => {
    getColours();
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllSearchColour(filterSearch);
      if (response) {
        setAllColor(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getColours();
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
        const response = await ProductService.getColourPaginatewithSearch(
          page,
          searchQuery
        );
        if (response) {
          setAllColor(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getColours();
          setSearchQuery("");
        }
      } else {
        const response = await ProductService.getAllPaginateColour(page);
        setAllColor(response.data.results);
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
    getColours();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };
  const TableHeader = ["ID", "COLOUR", "ACTION"];
  const TableData = allColor.map((value) => value);

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
                Colour
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
        title={"Create Colour"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateColor getColours={getColours} setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        title={"Update Colour"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateColor
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getColours={getColours}
        />
      </Popup>
    </>
  );
};
