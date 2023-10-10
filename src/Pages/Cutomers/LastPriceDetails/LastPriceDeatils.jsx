import React, { useEffect, useRef, useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";

export const LastPriceDeatils = ({ recordForEdit }) => {
  const [lastPrice, setLastPrice] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    getLastPriceData();
  }, []);

  const getLastPriceData = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataByIdWithType(
        recordForEdit,
        "last_price"
      );
      setLastPrice(response.data.last_price);
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

  const TableHeader = [
    "PI",
    "Status",
    "Date",
    "Description",
    "Product",
    "Price",
    "Quantity",
  ];

  const TableData = lastPrice.map((value) => ({
    pi: value.proformainvoice,
    status: value.status,
    date: value.date,
    description: value.description,
    product: value.product,
    price: value.amount,
    quantity: value.quantity,
  }));

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
              }}
            >
              Last Price
            </h3>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={null}
          />
        </Paper>
      </Grid>
    </>
  );
};
