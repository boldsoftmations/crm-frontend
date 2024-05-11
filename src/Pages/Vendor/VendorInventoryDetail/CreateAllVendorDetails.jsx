import React, { useState, useEffect } from "react";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";
import { BankInventoryDetails } from "../BanksInventoryDetail/BankInventoryDetails";
import { ContactInventoryDetails } from "../ContactInventoryDetail/ContactInventoryDetails";
import { WareHouseInventoryDetails } from "../WareHouseInventoryDetail/WareHouseInventoryDetails";
import { useDispatch } from "react-redux";
import { getVendorName } from "../../../Redux/Action/Action";

export const CreateAllVendorDetails = (props) => {
  const { recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
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
      const response = await InventoryServices.getVendorDataById(recordForEdit);
      setVendorData(response.data);
      setBankData(response.data.bank);
      setContactData(response.data.contacts);
      setWareHouseData(response.data.warehouse);
      dispatch(getVendorName(response.data.name));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  return (
    <div>
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
              <BankInventoryDetails
                vendorData={vendorData}
                bankData={bankData}
                open={open}
                getAllVendorDetailsByID={getAllVendorDetailsByID}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <ContactInventoryDetails
                vendorData={vendorData}
                contactData={contactData}
                open={open}
                getAllVendorDetailsByID={getAllVendorDetailsByID}
              />
            </div>
          )}
          {activeTab === 2 && (
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
    </div>
  );
};
