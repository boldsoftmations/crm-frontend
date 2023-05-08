import React, { useEffect, useRef, useState } from "react";
import { CSVDownload } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";

export const ProductionInventoryGAndLView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [productionInventoryData, setProductionInventoryData] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [exportData, setExportData] = useState([]);

  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
  };

  const headers = [
    { label: "PRODUCT", key: "product" },
    { label: "GAIN/LOSS", key: "gnl" },
    { label: "DATE", key: "date" },
    { label: "UNIT", key: "unit" },
    { label: "EXPECTED QUANTITY", key: "expected_quantity" },
    { label: "ACTUAL QUANTITY", key: "actual_quantity" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (filterSelectedQuery) {
        response =
          await InventoryServices.getProductionGAndLInventoryPaginateData(
            "all",
            filterSelectedQuery
          );
      } else {
        response =
          await InventoryServices.getProductionGAndLInventoryPaginateData(
            "all"
          );
      }
      const data = response.data.map((row) => {
        return {
          product: row.product,
          gnl: row.gnl,
          date: row.created_on,
          unit: row.unit,
          expected_quantity: row.expected_quantity,
          actual_quantity: row.actual_quantity,
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

  const handleInputChange = () => {
    setFilterSelectedQuery(filterSelectedQuery);
    getSearchData(filterSelectedQuery);
  };

  useEffect(() => {
    getAllProductionInventoryDetails();
  }, []);

  const getAllProductionInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getProductionGAndLInventoryPaginateData(
            currentPage
          )
        : await InventoryServices.getAllProductionGAndLInventoryData();

      setProductionInventoryData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setOpen(false);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response =
          await InventoryServices.getAllSearchProductionGAndLInventoryData(
            filterSearch
          );
        setProductionInventoryData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllProductionInventoryDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await InventoryServices.getProductionGAndLInventoryPaginateData(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getProductionGAndLInventoryPaginateData(page);
      if (response) {
        setProductionInventoryData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllProductionInventoryDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = () => {
    setFilterSelectedQuery("");
    getAllProductionInventoryDetails();
  };

  const Tableheaders = [
    "PRODUCT",
    "GAIN/LOSS",
    "DATE",
    "UNIT",
    "EXPECTED QUANTITY",
    "ACTUAL QUANTITY",
  ];

  const Tabledata = productionInventoryData.map((row, i) => ({
    product: row.product,
    gnl: row.gnl,
    date: row.created_on,
    unit: row.unit,
    expected_quantity: row.expected_quantity,
    actual_quantity: row.actual_quantity,
  }));

  return (
    <>
      <CustomLoader open={open} />

      <div>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />

        <div
          style={{
            padding: "16px",
            margin: "16px",
            boxShadow: "0px 3px 6px #00000029",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
          }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 0.9 }}>
              <CustomSearchWithButton
                filterSelectedQuery={filterSelectedQuery}
                setFilterSelectedQuery={setFilterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </div>
            <div style={{ flexGrow: 2 }}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Production Inventory G&L
              </h3>
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              <div
                className="btn btn-primary"
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  margin: "10px",
                  fontSize: "0.875rem",
                  minWidth: "64px",
                  fontWeight: 500,
                  lineHeight: 1.75,
                  borderRadius: "4px",
                  letterSpacing: "0.02857em",
                  textTransform: "uppercase",
                  boxShadow:
                    "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleDownload}
              >
                Download CSV
              </div>
              {exportData.length > 0 && (
                <CSVDownload
                  data={exportData}
                  headers={headers}
                  target="_blank"
                  filename="Current Month forecast.csv"
                />
              )}
            </div>
          </div>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
          />

          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </>
  );
};
