import React, { useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomSearch } from "../../../Components/CustomSearch";
import { Popup } from "../../../Components/Popup";
import { UserProfileUpdate } from "./UserProfileUpdate";

export const UserProfileView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();
  const [state, setState] = useState({
    open: false,
    userProfiles: [], // Change this to an array
    searchQuery: "",
  });

  useEffect(() => {
    getAllUserProfileData();
  }, []);

  const getAllUserProfileData = async () => {
    setState((prev) => ({ ...prev, open: true }));
    try {
      const response = await UserProfileService.getAllUserProfileData();
      if (response.data) {
        setState((prev) => ({
          ...prev,
          userProfiles: response.data, // Assign the entire array here
          open: false,
        }));
      }
    } catch (err) {
      console.error("error profile", err);
      setState((prev) => ({ ...prev, open: false }));
    }
  };

  const handleInputChange = (event) => {
    setState((prev) => ({ ...prev, searchQuery: event.target.value }));
  };

  const styles = {
    container: {
      padding: "16px",
      margin: "16px",
      boxShadow: "0px 3px 6px #00000029",
      borderRadius: "4px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "rgb(255, 255, 255)",
    },
    header: {
      textAlign: "left",
      marginBottom: "1em",
      fontSize: "24px",
      color: "rgb(34, 34, 34)",
      fontWeight: 800,
    },
  };

  const Tableheaders = [
    "ID",
    "FIRST NAME",
    "LAST NAME",
    "PERSONAL CONTACT",
    "PERSONAL EMAIL",
    "DATE OF JOINING",
    "ACTION",
  ];

  const shouldDisplayUserProfile = () => {
    const searchString = state.searchQuery.toLowerCase();
    return state.userProfiles.some((user) =>
      Object.values(user.personal || {}).some((value) =>
        String(value).toLowerCase().includes(searchString)
      )
    );
  };

  const data = state.userProfiles.map((user) => ({
    id: user.id,
    first_name: user.personal.first_name || "-",
    last_name: user.personal.last_name || "-",
    phone_number: user.personal.contact || "-", // Adjust as per your actual data structure
    personal_email: user.personal.email || "-",
    date_of_joining: user.personal.date_of_joining || "-",
  }));

  const openInPopup = (item) => {
    console.log("item", item);
    setIDForEdit(item.id);
    setOpenPopup(true);
  };

  return (
    <>
      <CustomLoader open={state.open} />
      <div style={styles.container}>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.9 }}>
            <CustomSearch
              filterSelectedQuery={state.searchQuery}
              handleInputChange={handleInputChange}
              getResetData={() =>
                setState((prev) => ({ ...prev, searchQuery: "" }))
              }
            />
          </div>
          <div style={{ flexGrow: 2 }}>
            <h3 style={styles.header}>User Profile</h3>
          </div>
        </div>
        {shouldDisplayUserProfile() ? (
          <CustomTable
            headers={Tableheaders}
            data={data}
            openInPopup={openInPopup}
          />
        ) : (
          <p>No results found for the search query.</p>
        )}
      </div>
      <Popup
        fullScreen={true}
        title={"Update User Profile"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserProfileUpdate
          setOpenPopup={setOpenPopup}
          IDForEdit={IDForEdit}
          getAllUserProfileData={getAllUserProfileData}
        />
      </Popup>
    </>
  );
};
