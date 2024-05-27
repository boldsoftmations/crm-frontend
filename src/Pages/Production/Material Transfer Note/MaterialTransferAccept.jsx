import React, { memo, useState } from "react";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const MaterialTransferAccept = memo(
  ({
    materialTransferNoteByID,
    setOpenAcceptPopup,
    getAllMaterialTransferNoteDetails,
  }) => {
    const [open, setOpen] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

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
        handleSuccess(response.data || "Accepted successfully");
        setTimeout(() => {
          setOpenAcceptPopup(false);
          getAllMaterialTransferNoteDetails();
        }, 300);
      } catch (error) {
        handleError(error);
        console.log("Material Transfer Note error", error);
      } finally {
        setOpen(false);
      }
    };

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={open} />
        {/* Display errors */}
        <div className="my-4">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Date</strong>
                </td>
                <td>{materialTransferNoteByID.created_on}</td>
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
  }
);
