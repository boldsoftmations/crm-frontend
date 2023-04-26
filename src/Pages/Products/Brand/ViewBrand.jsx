import React, { useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateBrand } from "./CreateBrand";
import { UpdateBrand } from "./UpdateBrand";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomLoader } from "./../../../Components/CustomLoader";
import "../../CommonStyle.css";
import { CustomTable } from "../../../Components/CustomTable";

export const ViewBrand = () => {
  const [brand, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const getBrandList = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllBrand();
      setBrand(response.data.results);

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
    getBrandList();
  }, []);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      const response = await ProductService.getAllSearchBrand(filterSearch);

      if (response) {
        setBrand(response.data.results);
      } else {
        getBrandList();
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getBrandList();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = ["ID", "BRAND", "SHORT NAME", "ACTION"];
  const TableData = brand.map((value) => value);
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
                Brand
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
        </Paper>
      </Grid>
      <Popup
        title={"Create Brand"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateBrand getBrandList={getBrandList} setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        title={"Update Brand"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBrand
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getBrandList={getBrandList}
        />
      </Popup>
    </>
  );
};
