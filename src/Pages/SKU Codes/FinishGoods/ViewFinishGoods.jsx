import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import "../../CommonStyle.css";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateFinishGoods } from "./CreateFinishGoods";
import { UpdateFinishGoods } from "./UpdateFinishGoods";
import { useDispatch } from "react-redux";
import {
  getBasicUnitData,
  getBrandData,
  getColourData,
  getPackingUnitData,
  getUnitData,
} from "../../../Redux/Action/Action";
import { getProductCodeData } from "./../../../Redux/Action/Action";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomLoader } from "../../../Components/CustomLoader";

export const ViewFinishGoods = () => {
  const dispatch = useDispatch();
  const [finishGood, setFinishGood] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
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
    { label: "FINISH GOODS", key: "name" },
    { label: "PRODUCT CODE", key: "productcode" },
    { label: "COLOR", key: "color" },
    { label: "UNIT", key: "unit" },
    { label: "UNIT QUANTITY", key: "unit_quantity" },
    { label: "BASIC UNIT", key: "basic_unit" },
    { label: "BRAND", key: "brand" },
    { label: "SIZE", key: "size" },
    { label: "DESCRIPTION", key: "description" },
    { label: "SHELF LIFE", key: "shelf_life" },
    { label: "ADD.DESCRIPTION", key: "additional_description" },
    { label: "PACKING UNIT", key: "packing_unit" },
    { label: "PACKING UNIT QUANTITY", key: "packing_unit_quantity" },
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
        response = await ProductService.getAllFinishGoods("all", searchQuery);
      } else {
        response = await ProductService.getAllFinishGoods("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          productcode: row.productcode,
          color: row.color,
          unit: row.unit,
          unit_quantity: row.unit_quantity,
          basic_unit: row.basic_unit,
          brand: row.brand,
          size: row.size,
          description: row.description,
          shelf_life: row.shelf_life,
          additional_description: row.additional_description,
          packing_unit: row.packing_unit,
          packing_unit_quantity: row.packing_unit_quantity,
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

  useEffect(() => {
    getPackingUnits();
    getBrandList();
    getColours();
    getproductCodes();
    getUnits();
    getBasicUnit();
  }, []);

  const getPackingUnits = async () => {
    try {
      const res = await ProductService.getAllPackingUnit("all");
      dispatch(getPackingUnitData(res.data));
    } catch (err) {
      console.log("error PackingUnit finishGoods", err);
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

  const getColours = async () => {
    try {
      const res = await ProductService.getAllColour("all");
      dispatch(getColourData(res.data));
    } catch (err) {
      console.log("err Colour FinishGoods :>> ", err);
    }
  };

  const getproductCodes = async () => {
    try {
      const res = await ProductService.getAllProductCode("all");
      dispatch(getProductCodeData(res.data));
    } catch (err) {
      console.log("error ProductCode finishGoods", err);
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

  const getBasicUnit = async () => {
    try {
      const res = await ProductService.getAllBasicUnit("all");
      dispatch(getBasicUnitData(res.data));
    } catch (err) {
      console.log("error :>> ", err);
    }
  };

  useEffect(() => {
    getFinishGoods(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getFinishGoods = useCallback(async (page, query) => {
    try {
      setOpen(true);
      const response = await ProductService.getAllFinishGoods(page, query);
      setFinishGood(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

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
    const data = finishGood.find((data) => data.id === item.id);
    setRecordForEdit(data || {}); // Ensures an object is set, even if no match is found
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "FINISH GOODS",
    "UNIT",
    "BRAND",
    "PRODUCT CODE",
    "DESCRIPTION",
    "SHELF LIFE",
    "HSN CODE",
    "GST%",
    "ACTION",
  ];

  const TableData = finishGood.map((value) => ({
    id: value.id,
    name: value.name,
    unit: value.unit,
    brand: value.brand,
    productcode: value.productcode,
    description: value.description,
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
                Finish Goods
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
                  filename="Finish Goods.csv"
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
        title={"Create FinishGoods"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateFinishGoods
          getFinishGoods={getFinishGoods}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update FinishGoods"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateFinishGoods
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getFinishGoods={getFinishGoods}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
