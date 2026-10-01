import { Box, Grid, TextField, Button } from "@mui/material";
// import { Button } from "bootstrap";
import React from "react";

const MergePincodeEdit = ({ recordForEdit }) => {
  const [inputValue, setInputValue] = React.useState({
    postal_code: (recordForEdit && recordForEdit.postal_code) || "",
    merge_code: "",
  });
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandle = (e) => {
    e.preventDefault();
    console.log("Data is:", inputValue);
  };

  return (
    <Box>
      <Grid
        component="form"
        noValidate
        onSubmit={onSubmitHandle}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pin Code"
              name="postal_code"
              size="small"
              value={inputValue.postal_code}
              onChange={handleOnChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Merge Code"
              name="merge_code"
              size="small"
              value={inputValue.merge_code}
              onChange={handleOnChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MergePincodeEdit;
