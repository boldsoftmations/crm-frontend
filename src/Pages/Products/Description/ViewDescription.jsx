import React, { useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateDescription } from "./CreateDescription";
import { UpdateDescription } from "./UpdateDescription";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import "../../CommonStyle.css";
import { CSVLink } from "react-csv";

export const ViewDescription = () => {
  const [description, setDescription] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "DESCRIPTION", key: "name" },
    { label: "CONSUMABLE", key: "consumable" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await ProductService.getDescriptionPaginateWithSearch(
          "all",
          searchQuery
        );
      } else {
        response = await ProductService.getDescriptionPaginate("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          consumable: row.consumable,
        };
      });

      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const getDescriptions = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await ProductService.getDescriptionPaginate(
          currentPage
        );
        setDescription(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getAllDescription();
        setDescription(response.data.results);
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
    getDescriptions();
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllSearchDescription(
        filterSearch
      );

      if (response) {
        setDescription(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getDescriptions();
        setSearchQuery();
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const handlePageChange = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response = await ProductService.getDescriptionPaginateWithSearch(
          page,
          searchQuery
        );
        if (response) {
          setDescription(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getDescriptions();
          setSearchQuery();
        }
      } else {
        const response = await ProductService.getDescriptionPaginate(page);
        setDescription(response.data.results);
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
    getDescriptions();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = ["ID", "DESCRIPTION", "CONSUMABLE", "ACTION"];

  const TableData = description.map((value) => ({
    id: value.id,
    name: value.name,
    consumable: value.consumable,
  }));
  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
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
                Description
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
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Description.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
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
            handlePageClick={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Description"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateDescription
          getDescriptions={getDescriptions}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Description"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateDescription
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getDescriptions={getDescriptions}
        />
      </Popup>
    </>
  );
};
