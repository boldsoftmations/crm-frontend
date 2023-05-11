import React, { useState } from "react";
import moment from "moment";
import LeadServices from "../../services/LeadService";
export const FollowupDone = (props) => {
  const { DoneFollowup, setOpenModal, getFollowUp } = props;
  const [open, setOpen] = useState(false);
  const AllFollowUpDone = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        id: DoneFollowup[0].id,
        leads: DoneFollowup[0].leads,
        current_date: DoneFollowup[0].current_date,
        next_followup_date: DoneFollowup[0].next_followup_date,
        notes: DoneFollowup[0].notes,
        user: DoneFollowup[0].user,
        is_followed_up: true,
      };
      await LeadServices.createFollowUps(DoneFollowup[0].id, data);

      setOpenModal(false);
      getFollowUp();
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err creating follwups", err);
    }
  };
  return (
    <>
      <div className="my-4">
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                <strong>ID :</strong>
              </td>
              <td> {DoneFollowup ? DoneFollowup.id : ""}</td>
            </tr>
            <tr>
              <td>
                <strong>LEADS :</strong>
              </td>
              <td>{DoneFollowup ? DoneFollowup.leads : ""}</td>
            </tr>
            <tr>
              <td>
                <strong>COMPANY :</strong>
              </td>
              <td>{DoneFollowup ? DoneFollowup.company : ""}</td>
            </tr>
            <tr>
              <td>
                <strong>NOTES :</strong>
              </td>
              <td>{DoneFollowup ? DoneFollowup.notes : ""}</td>
            </tr>
            <tr>
              <td>
                <strong>CURRENT DATE :</strong>
              </td>
              <td>
                {moment(DoneFollowup ? DoneFollowup.current_date : "-").format(
                  "DD/MM/YYYY h:mm:ss"
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong>NEXT FOLLOWUP DATE :</strong>
              </td>
              <td>
                {" "}
                {moment(
                  DoneFollowup ? DoneFollowup.next_followup_date : "-"
                ).format("DD/MM/YYYY")}
              </td>
            </tr>
            <tr>
              <td>
                <strong>USER :</strong>
              </td>
              <td> {DoneFollowup ? DoneFollowup.user : ""}</td>
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
          onClick={(e) => AllFollowUpDone(e)}
        >
          Accept
        </div>
      </div>
    </>
  );
};
