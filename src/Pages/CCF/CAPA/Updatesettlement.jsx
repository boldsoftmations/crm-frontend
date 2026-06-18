import React, { useState } from "react";
import CustomerServices from "../../../services/CustomerService";

const Updatesettlement = ({
  recordForEdit,
  setOpenSettlement,
  getAllCAPAData,
}) => {
  const [loader, setLoader] = useState(false);
  const [action, setAction] = useState(null); // "Accept" | "Reject"
  const [remark, setRemark] = useState("");

  const handleSubmit = async () => {
    const formData =
      action === "Accept"
        ? {
            ccf_status: "Pending Note",
            remark: null,
            status: "Accept",
          }
        : {
            ccf_status: "Rejected",
            status: "Reject",
            remark: remark,
          };

    setLoader(true);
    const response = await CustomerServices.UpdateCapa(
      recordForEdit.id,
      formData,
    );
    setLoader(false);

    if (response) {
      getAllCAPAData();
      setOpenSettlement(false);
    }
  };

  return (
    <div>
      <h3>Update Settlement</h3>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button
          onClick={() => setAction("Accept")}
          style={{
            background: action === "Accept" ? "green" : "#eee",
            color: action === "Accept" ? "#fff" : "#000",
            padding: "8px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => {
            setAction("Reject");
            setRemark("");
          }}
          style={{
            background: action === "Reject" ? "red" : "#eee",
            color: action === "Reject" ? "#fff" : "#000",
            padding: "8px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </div>

      {/* Remark field - only on Reject */}
      {action === "Reject" && (
        <div style={{ marginBottom: "16px" }}>
          <label>Remark *</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={3}
            placeholder="Enter rejection reason..."
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
      )}

      {/* Submit */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmit}
          disabled={
            !action || loader || (action === "Reject" && remark.trim() === "")
          }
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "8px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loader ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={() => setOpenSettlement(false)}
          style={{
            padding: "8px 24px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Updatesettlement;
