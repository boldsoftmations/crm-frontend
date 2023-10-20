import React, { useState } from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import axios from "axios";
import { CustomLoader } from "../../../Components/CustomLoader";

export const KycFields = ({ formData, setFormData }) => {
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "ifsc_code" && value.length === 11) {
      validateIFSC(value);
    } else {
      updateFormData(name, value);
    }
  };

  const updateFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      kyc: { ...prev.kyc, [name]: value },
    }));
  };

  const validateIFSC = async (ifsc) => {
    try {
      setOpen(true);
      const { data } = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      const { BANK, BRANCH, CITY, STATE, ADDRESS } = data;

      setFormData((prev) => ({
        ...prev,
        kyc: {
          ...prev.kyc,
          ifsc_code: ifsc, // <-- Add this line
          name: BANK,
          branch: BRANCH,
          city: CITY,
          state: STATE,
          address: ADDRESS,
        },
      }));
      setErrMsg("");
    } catch (error) {
      const errorMessage =
        error.response.status === 404
          ? "Please enter a valid IFSC code."
          : "Error fetching bank details. Please try again later.";
      setErrMsg(errorMessage);
    } finally {
      setOpen(false);
    }
  };

  const bankFields = [
    { label: "Account No", name: "account_number" },
    {
      label: "IFSC Code",
      name: "ifsc_code",
      error: errMsg,
      helperText: errMsg,
    },
    {
      label: "Bank Name",
      name: "name",
      disabled: true,
    },
    {
      label: "Branch",
      name: "branch",
      disabled: true,
    },
    {
      label: "Bank City",
      name: "city",
      disabled: true,
    },
    {
      label: "Bank State",
      name: "state",
      disabled: true,
    },
    {
      label: "Bank Address",
      name: "address",
      disabled: true,
    },
    { label: "PAN Card No", name: "pan_card_number" },
    { label: "Aadhar Card No", name: "aadhar_card_number" },
    { label: "Passport Number", name: "passport_number" },
    { label: "Driving License Number", name: "dl_number" },
  ];

  return (
    <>
      <CustomLoader open={open} />
      {bankFields.map((field, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <CustomTextField
            fullWidth
            size="small"
            onChange={handleChange}
            value={formData.kyc[field.name]}
            InputLabelProps={{
              shrink: formData.kyc[field.name] ? true : undefined,
              ...field.InputLabelProps,
            }}
            {...field}
          />
        </Grid>
      ))}
    </>
  );
};
