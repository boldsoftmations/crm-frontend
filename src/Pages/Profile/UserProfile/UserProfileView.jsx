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
  const [isLoading, setIsLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllUserProfileData();
  }, []);

  const getAllUserProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await UserProfileService.getAllUserProfileData();
      if (response.data) {
        setUserProfiles(response.data);
      }
    } catch (err) {
      console.error("error profile", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const Tableheaders = [
    "ID",
    "FIRST NAME",
    "LAST NAME",
    "PERSONAL CONTACT",
    "PERSONAL EMAIL",
    "DATE OF BIRTH",
    "DATE OF JOINING",
    "ACTION",
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const filteredUserProfiles = userProfiles.filter((user) =>
    Object.values(user.personal || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const data = filteredUserProfiles.map((user) => ({
    id: user.id,
    first_name: user.personal.first_name || "-",
    last_name: user.personal.last_name || "-",
    phone_number: user.personal.contact || "-",
    personal_email: user.personal.email || "-",
    date_of_birth: user.personal.date_of_birth
      ? formatDate(user.personal.date_of_birth)
      : "-",
    date_of_joining: user.personal.date_of_joining
      ? formatDate(user.personal.date_of_joining)
      : "-",
  }));

  const openInPopup = (item) => {
    console.log("item", item);
    setIDForEdit(item.id);
    setOpenPopup(true);
  };

  return (
    <>
      <CustomLoader open={isLoading} />
      <div style={styles.container}>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 0.9 }}>
            <CustomSearch
              filterSelectedQuery={searchQuery}
              handleInputChange={handleInputChange}
              getResetData={() => setSearchQuery("")}
            />
          </div>
          <div style={{ flexGrow: 2 }}>
            <h3 style={styles.header}>User Profile</h3>
          </div>
        </div>
        {filteredUserProfiles.length > 0 ? (
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
