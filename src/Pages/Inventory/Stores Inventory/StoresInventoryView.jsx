import React, { useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomSearchWithButton } from "./../../../Components/CustomSearchWithButton";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { Popup } from "../../../Components/Popup";
import { StoresInventoryCreate } from "./StoresInventoryCreate";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

export const StoresInventoryView = () => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

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
    { label: "PRODUCT", key: "product" },
    { label: "SELLER STATE", key: "seller_account" },
    { label: "DESCRIPTION", key: "description" },
    { label: "DATE", key: "created_on" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "PENDING QUANTITY", key: "pending_quantity" },
    { label: "RATE", key: "rate" },
    { label: "AMOUNT", key: "amount" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (filterSelectedQuery) {
        response = await InventoryServices.getAllStoresInventoryDataPaginate(
          "all",
          filterSelectedQuery
        );
      } else {
        response = await InventoryServices.getStoresInventoryPaginateData(
          "all"
        );
      }
      const data = response.data.map((row) => {
        return {
          product: row.product,
          seller_account: row.seller_account,
          description: row.description,
          created_on: row.created_on,
          unit: row.unit,
          quantity: row.quantity,
          pending_quantity: row.pending_quantity,
          rate: row.rate,
          amount: row.amount,
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
    getAllStoresInventoryDetails();
  }, []);

  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getStoresInventoryPaginateData(currentPage)
        : await InventoryServices.getAllStoresInventoryData();
      setStoresInventoryData(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
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
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response =
          await InventoryServices.getAllSearchStoresInventoryData(filterSearch);
        setStoresInventoryData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllStoresInventoryDetails();
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
        ? await InventoryServices.getAllStoresInventoryDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getStoresInventoryPaginateData(page);

      if (response) {
        setStoresInventoryData(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllStoresInventoryDetails();
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
    getAllStoresInventoryDetails();
  };

  const Tableheaders = [
    "PRODUCT",
    "SELLER STATE",
    "DESCRIPTION",
    "DATE",
    "UNIT",
    "QUANTITY",
    "PENDING QUANTITY",
    "RATE",
    "AMOUNT",
  ];

  const Tabledata = storesInventoryData.map((row, i) => ({
    product: row.product,
    seller_account: row.seller_account,
    description: row.description,
    created_on: row.created_on,
    unit: row.unit,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    rate: row.rate,
    amount: row.amount,
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
                Stores Inventory
              </h3>
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              <Button onClick={handleDownload} variant="contained">
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={[...exportData]}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Store Inventory.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
              {userData.groups.includes("Accounts") && (
                <Button
                  onClick={() => setOpenPopup(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
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
      <Popup
        maxWidth="xl"
        title={"Create Stores Inventory"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <StoresInventoryCreate
          setOpenPopup={setOpenPopup}
          getAllStoresInventoryDetails={getAllStoresInventoryDetails}
        />
      </Popup>
    </>
  );
};
