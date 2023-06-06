import React, { useState, useEffect } from "react";
import { BankDetails } from "../BankDetails/BankDetails";
import { ContactDetails } from "../ContactDetails/ContactDetails";
import { WareHouseDetails } from "../WareHouseDetails/WareHouseDetails";
import { UpdateCompanyDetails } from "./UpdateCompanyDetails";
import CustomerServices from "../../../services/CustomerService";
import { SecurityChequesDetails } from "../SecurityCheckDetails/SecurityChequesDetails";
import { ForecastView } from "../ForecastDetails/ForecastView";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";

export const UpdateAllCompanyDetails = (props) => {
  const [open, setOpen] = useState(false);
  const { setOpenPopup, getAllCompanyDetails, recordForEdit, product } = props;
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [securityChequedata, setSecurityChequeData] = useState([]);
  const [forecastdata, setForecastData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Company" },
    { label: "Bank" },
    { label: "Contact" },
    { label: "WareHouse" },
    { label: "Security Cheques" },
    { label: "Forecast" },
  ];
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
      setForecastData(response.data.forecast);

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
              <UpdateCompanyDetails
                setOpenPopup={setOpenPopup}
                getAllCompanyDetails={getAllCompanyDetails}
                recordForEdit={recordForEdit}
                product={product}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <BankDetails
                bankData={bankData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <ContactDetails
                contactData={contactData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <WareHouseDetails
                contactData={contactData}
                wareHousedata={wareHousedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <SecurityChequesDetails
                securityChequedata={securityChequedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <ForecastView
                forecastdata={forecastdata}
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
