import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import ProductService from "../../../services/ProductService";
import { Popup } from "../../../Components/Popup";
import { CreateConsumable } from "./CreateConsumable";
import { UpdateConsumable } from "./UpdateConsumable";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { useDispatch } from "react-redux";
import { getBrandData, getUnitData } from "../../../Redux/Action/Action";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";

export const ViewConsumable = () => {
  const dispatch = useDispatch();
  const [consumable, setConsumable] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState([]);
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
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
    { label: "CONSUMABLE", key: "name" },
    { label: "UNIT", key: "unit" },
    { label: "BRAND", key: "brand" },
    { label: "SIZE", key: "size" },
    { label: "DESCRIPTION", key: "description" },
    { label: "ADD.DESCRIPTION", key: "additional_description" },
    { label: "SHELF LIFE", key: "shelf_life" },
    { label: "HSN CODE", key: "hsn_code" },
    { label: "GST%", key: "gst" },
    { label: "SGST", key: "sgst" },
    { label: "CGST", key: "cgst" },
    { label: "TYPE", key: "type" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await ProductService.getAllConsumable("all", searchQuery);
      } else {
        response = await ProductService.getAllConsumable("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          unit: row.unit,
          brand: row.brand,
          size: row.size,
          description: row.description,
          additional_description: row.additional_description,
          shelf_life: row.shelf_life,
          hsn_code: row.hsn_code,
          gst: row.gst,
          sgst: row.sgst,
          cgst: row.cgst,
          type: row.type,
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

  const getBrandList = async () => {
    try {
      const res = await ProductService.getAllBrand("all");
      dispatch(getBrandData(res.data));
    } catch (err) {
      console.log("error finishGoods :>> ", err);
    }
  };

  const getUnits = async () => {
    try {
      const res = await ProductService.getAllUnit("all");
      dispatch(getUnitData(res.data));
    } catch (err) {
      console.log("error unit finishGoods", err);
    }
  };

  const getYesDescriptionData = async () => {
    try {
      const res = await ProductService.getYesDescription();
      console.log("desc res", res);
      setDescriptionOptions(res.data);
    } catch (error) {
      console.log("error in Description Api", error);
    }
  };

  useEffect(() => {
    getBrandList();
    getUnits();
    getYesDescriptionData();
  }, []);

  const getconsumables = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllConsumable(
        currentPage,
        searchQuery
      );
      setConsumable(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    getconsumables();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (item) => {
    const data = consumable.find((data) => data.id === item.id);
    setRecordForEdit(data || {}); // Ensures an object is set, even if no match is found
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "CONSUMABLE",
    "UNIT",
    "BRAND",
    "SIZE",
    "ADDITIONAL DESC",
    "SHELF LIFE",
    "HSN CODE",
    "GST%",
    "ACTION",
  ];

  const TableData = consumable.map((value) => ({
    id: value.id,
    name: value.name,
    unit: value.unit,
    brand: value.brand,
    size: value.size,
    additional_description: value.additional_description,
    shelf_life: value.shelf_life,
    hsn_code: value.hsn_code,
    gst: value.gst,
  }));
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              p: 2,
            }}
          >
            {/* Search Component on the left */}
            <Box sx={{ flexGrow: 1, flexBasis: "40%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            {/* Title Text centered */}
            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Consumable
              </h3>
            </Box>

            {/* Add Button on the right */}
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: "40%",
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
                gap: "20px",
              }}
            >
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
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
                  filename="Consumable.csv"
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
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Create Consumable"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateConsumable
          getconsumables={getconsumables}
          setOpenPopup={setOpenPopup2}
          descriptionOptions={descriptionOptions}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Consumable"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateConsumable
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getconsumables={getconsumables}
          descriptionOptions={descriptionOptions}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
