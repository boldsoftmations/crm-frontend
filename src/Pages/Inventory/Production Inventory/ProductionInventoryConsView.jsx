import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import InventoryServices from "../../../services/InventoryService";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomSearch } from "../../../Components/CustomSearch";

export const ProductionInventoryConsView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [productionInventoryData, setProductionInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllProductionInventoryDetails();
  }, []);

  const getAllProductionInventoryDetails = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getAllConsProductionInventoryData();

      setProductionInventoryData(response.data);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResetClick = () => {
    setSearchQuery("");
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = productionInventoryData.filter((row) =>
    row.product__name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Tableheaders = ["PRODUCT", "SELLER UNIT", "UNIT", "QUANTITY"];

  const headers = [
    { label: "PRODUCT", key: "product" },
    { label: "SELLER UNIT", key: "seller_account" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
  ];

  const data = filteredData.map((row) => {
    return {
      product: row.product__name,
      seller_account: row.seller_account,
      unit: row.product__unit,
      quantity: row.quantity,
    };
  });

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
              <CustomSearch
                filterSelectedQuery={searchQuery}
                handleInputChange={handleSearchChange}
                getResetData={handleResetClick}
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
                Production Inventory Cons
              </h3>
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              <CSVLink
                data={data}
                headers={headers}
                filename={"Production Inventory Consolidate.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
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
                >
                  Download CSV
                </div>
              </CSVLink>
            </div>
          </div>
          <CustomTable
            headers={Tableheaders}
            data={data}
            openInPopup={null}
            openInPopup2={null}
          />
        </div>
      </div>
    </>
  );
};
