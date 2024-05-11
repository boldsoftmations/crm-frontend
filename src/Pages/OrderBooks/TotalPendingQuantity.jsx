import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomTable } from "../../Components/CustomTable";
import { Button } from "@mui/material";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "./../../Components/CustomLoader";

export const TotalPendingQuantity = () => {
  const [open, setOpen] = useState(false);
  const [totalPendingQuantity, settotalPendingQuantity] = useState([]);
  useEffect(() => {
    getTotalPendingQuantityDetails();
  }, []);

  const getTotalPendingQuantityDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getTotalPendingQuantity();
      settotalPendingQuantity(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const Tableheaders = ["PRODUCT", "TOTAL"];

  const Tabledata = totalPendingQuantity.map((row, i) => ({
    product: row.product__name,
    total: row.total,
  }));

  const header = [
    {
      label: "Product",
      key: "product__name",
    },
    {
      label: "Total",
      key: "total",
    },
  ];

  let PendingQuantity = totalPendingQuantity.map((item) => {
    return {
      product__name: item.product__name,
      total: item.total,
    };
  });

  return (
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
      <CustomLoader open={open} />
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 0.9 }}></div>
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
            Total Pending Quantity
          </h3>
        </div>
        <div style={{ flexGrow: 0.5 }} align="right">
          <CSVLink
            data={PendingQuantity}
            headers={header}
            filename={"Total Pending Quantity.csv"}
            target="_blank"
            style={{
              textDecoration: "none",
              outline: "none",
              height: "5vh",
            }}
          >
            <Button color="success" variant="contained">
              Download CSV
            </Button>
          </CSVLink>
        </div>
      </div>
      <CustomTable
        headers={Tableheaders}
        data={Tabledata}
        openInPopup={null}
        openInPopup2={null}
      />
    </div>
  );
};
