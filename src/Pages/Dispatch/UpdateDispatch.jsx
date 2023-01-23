import React from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { CustomButton } from "./../../Components/CustomButton";
import InvoiceServices from "../../services/InvoiceService";

export const UpdateDispatch = (props) => {
    const [open, setOpen] = useState(false);
  const { idData, getAllDispatchDetails, setOpenPopup } = props;
  console.log("idData :>> ", idData);
  const [inputValue, setInputValue] = useState([]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const createLeadsData = async (e) => {
    try {
      e.preventDefault();
        setOpen(true);
      const data = {
        sales_invoice: idData.sales_invoice,
        transporter: inputValue.transporter,
        lr_number: inputValue.lr_number,
      };
      await InvoiceServices.updateDispatched(idData.id, data);
      getAllDispatchDetails();
      setOpenPopup(false);
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
        setOpen(false);
    }
  };

  return (
    <div>
      {" "}
      <Box component="form" noValidate onSubmit={(e) => createLeadsData(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Sales Invoice"
              variant="outlined"
              value={idData.sales_invoice}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="transporter"
              size="small"
              label="Transporter"
              variant="outlined"
              value={inputValue.transporter}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="lr_number"
              size="small"
              label="LR Number"
              variant="outlined"
              value={inputValue.lr_number}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          text={"Submit"}
        />
      </Box>
    </div>
  );
};
