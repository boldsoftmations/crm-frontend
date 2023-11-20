import React, { useCallback, useState } from "react";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Alert, Snackbar } from "@mui/material";

export const MaterialTransferAccept = ({
  materialTransferNoteByID,
  setOpenAcceptPopup,
  getAllMaterialTransferNoteDetails,
}) => {
  const [open, setOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const extractErrorMessages = (data) => {
    let messages = [];
    if (data.errors) {
      for (const [key, value] of Object.entries(data.errors)) {
        // Assuming each key has an array of messages, concatenate them.
        value.forEach((msg) => {
          messages.push(`${key}: ${msg}`);
        });
      }
    }
    return messages;
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
    }
  }, [currentErrorIndex, errorMessages.length]);
  // Stores Accept Api
  const updateMaterialTransferNoteDetails = async (data) => {
    try {
      console.log("data", data);
      setOpen(true);
      const req = {
        seller_account: data.seller_account,
        user: data.user,
        accepted: true,
        product: data.product,
        quantity: data.quantity,
      };
      const response = await InventoryServices.updateMaterialTransferNoteData(
        data.id,
        req
      );
      setOpenAcceptPopup(false);
      getAllMaterialTransferNoteDetails();
      setOpen(false);
    } catch (error) {
      console.log("createing company detail error", error);
      const newErrors = extractErrorMessages(error.response.data);
      setErrorMessages(newErrors);
      setCurrentErrorIndex(0); // Reset the error index when new errors arrive
      setOpenSnackbar((prevOpen) => !prevOpen);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      {/* Display errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>
      <div className="my-4">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                <strong>Date</strong>
              </td>
              <td>{materialTransferNoteByID.date}</td>
            </tr>
            <tr>
              <td>
                <strong>Seller Unit</strong>
              </td>
              <td>{materialTransferNoteByID.seller_account}</td>
            </tr>
            <tr>
              <td>
                <strong>Product</strong>
              </td>
              <td>{materialTransferNoteByID.product}</td>
            </tr>
            <tr>
              <td>
                <strong>Quantity</strong>
              </td>
              <td>{materialTransferNoteByID.quantity}</td>
            </tr>
            <tr>
              <td>
                <strong>User</strong>
              </td>
              <td>{materialTransferNoteByID.user}</td>
            </tr>
            <tr>
              <td>
                <strong>Unit</strong>
              </td>
              <td>{materialTransferNoteByID.unit}</td>
            </tr>
          </tbody>
        </table>
        <div
          className="btn btn-success"
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
          onClick={() =>
            updateMaterialTransferNoteDetails(materialTransferNoteByID)
          }
        >
          Accept
        </div>
      </div>
    </>
  );
};
