import React, { useState, useEffect } from "react";
import InventoryServices from "../../../services/InventoryService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";
import { UpdateVendorDetails } from "./UpdateVendorDetails";
import { ContactInventoryDetails } from "../ContactInventoryDetail/ContactInventoryDetails";
import { WareHouseInventoryDetails } from "../WareHouseInventoryDetail/WareHouseInventoryDetails";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { BankInventoryDetails } from "../BanksInventoryDetail/BankInventoryDetails";

export const UpdateAllVendorDetails = (props) => {
  const [open, setOpen] = useState(false);
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Vendor" },
    { label: "Bank" },
    { label: "Contact" },
    { label: "WareHouse" },
  ];
  // All Company Details Api
  useEffect(() => {
    if (recordForEdit) getAllVendorDetailsByID();
  }, [recordForEdit]);

  const getAllVendorDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getVendorDataById(
        recordForEdit.id
      );
      setVendorData(response.data);
      setBankData(response.data.bank);
      setContactData(response.data.contacts);
      setWareHouseData(response.data.warehouse);

      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.log("company data by id error", err);
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
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div style={{ marginTop: "10px" }}>
          {activeTab === 0 && (
            <div>
              <UpdateVendorDetails
                setOpenPopup={setOpenPopup}
                getAllVendorDetails={getAllVendorDetails}
                recordForEdit={recordForEdit}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <BankInventoryDetails
                vendorData={vendorData}
                bankData={bankData}
                open={open}
                getAllVendorDetailsByID={getAllVendorDetailsByID}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <ContactInventoryDetails
                contactData={contactData}
                vendorData={vendorData}
                open={open}
                getAllVendorDetailsByID={getAllVendorDetailsByID}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <WareHouseInventoryDetails
                vendorData={vendorData}
                contactData={contactData}
                wareHousedata={wareHousedata}
                open={open}
                getAllVendorDetailsByID={getAllVendorDetailsByID}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
