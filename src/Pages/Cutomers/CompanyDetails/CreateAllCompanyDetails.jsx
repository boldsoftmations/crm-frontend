import React, { useState, useEffect } from "react";
import CustomerServices from "../../../services/CustomerService";
import { BankDetails } from "./../BankDetails/BankDetails";
import { ContactDetails } from "./../ContactDetails/ContactDetails";
import { WareHouseDetails } from "./../WareHouseDetails/WareHouseDetails";
import { SecurityChequesDetails } from "./../SecurityCheckDetails/SecurityChequesDetails";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";

export const CreateAllCompanyDetails = (props) => {
  const { recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [securityChequedata, setSecurityChequeData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Bank" },
    { label: "Contact" },
    { label: "WareHouse" },
    { label: "Security Cheques" },
  ];
  // const dispatch = useDispatch();
  // All Company Details Api
  useEffect(() => {
    if (recordForEdit) getAllCompanyDetailsByID();
  }, [recordForEdit]);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      setBankData(response.data.bank);
      setContactData(response.data.contacts);
      setWareHouseData(response.data.warehouse);
      setSecurityChequeData(response.data.security_cheque);
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
              <BankDetails
                bankData={bankData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <ContactDetails
                contactData={contactData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <WareHouseDetails
                contactData={contactData}
                wareHousedata={wareHousedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <SecurityChequesDetails
                securityChequedata={securityChequedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
