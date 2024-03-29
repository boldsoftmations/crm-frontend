import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import "../../CommonStyle.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  styled,
  Box,
  TableContainer,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";

import ProductService from "../../../services/ProductService";

import { Popup } from "./../../../Components/Popup";
import { CreateBasicUnit } from "./CreateBasicUnit";
import { UpdateBasicUnit } from "./UpdateBasicUnit";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";

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

export const ViewBasicUnit = () => {
  const [basicUnit, setBasicUnit] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const getBasicUnit = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllBasicUnit();
      setBasicUnit(response.data.results);

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
    getBasicUnit();
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllSearchBasicUnit(filterSearch);

      if (response) {
        setBasicUnit(response.data.results);
      } else {
        getBasicUnit();
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getBasicUnit();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = ["ID", "BASIC UNIT", "SHORT NAME", "ACTION"];
  const TableData = basicUnit.map((value) => value);

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
                Basic Unit
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Link>
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Link>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Basic Unit"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateBasicUnit
          getBasicUnit={getBasicUnit}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Basic Unit"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBasicUnit
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getBasicUnit={getBasicUnit}
        />
      </Popup>
    </>
  );
};
