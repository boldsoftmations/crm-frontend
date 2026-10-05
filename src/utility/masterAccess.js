const toGroups = (userOrGroups) => {
  if (Array.isArray(userOrGroups)) {
    return userOrGroups;
  }

  if (userOrGroups && Array.isArray(userOrGroups.groups)) {
    return userOrGroups.groups;
  }

  return [];
};

const hasAnyGroup = (userOrGroups, allowedGroups) => {
  const groups = toGroups(userOrGroups);
  return allowedGroups.some((group) => groups.includes(group));
};

const SALES_GROUPS = [
  "Sales Manager",
  "Sales Manager(Retailer)",
  "Business Development Manager",
  "Business Development Executive",
  "Sales Deputy Manager",
  "Sales Assistant Deputy Manager",
  "Sales Executive",
  "Sales Manager without Leads",
  "Sales Manager with Lead",
  "Sales Manager withouth Leads",
];

const CUSTOMER_SUCCESS_GROUPS = [
  "Customer Service",
  "Customer Relationship Manager",
  "Customer Relationship Executive",
];

const SERVICEABILITY_GROUPS = [
  ...CUSTOMER_SUCCESS_GROUPS,
  "Dispatch",
  "Factory-Mumbai-Dispatch",
  "Factory-Delhi-Dispatch",
];

const ACCOUNTS_GROUPS = [
  "Accounts",
  "Accounts Executive",
  "Accounts Billing Department",
];

const MANAGER_GROUPS = [
  "Operations & Supply Chain Manager",
  "Operations Manager",
  "Dispatch Manager",
];

const ADMIN_GROUPS = ["Director"];

export const canAdminPinMaster = (userOrGroups) =>
  hasAnyGroup(userOrGroups, ["PIN_MASTER_ADMIN", ...ACCOUNTS_GROUPS]);

export const canEditPincode = (userOrGroups) =>
  canAdminPinMaster(userOrGroups) || hasAnyGroup(userOrGroups, ["Director"]);

export const canViewPinMaster = (userOrGroups) =>
  canEditPincode(userOrGroups) ||
  hasAnyGroup(userOrGroups, ["PIN_VIEWER", ...CUSTOMER_SUCCESS_GROUPS]);

export const canUseTransporterFinder = (userOrGroups) =>
  hasAnyGroup(userOrGroups, ["TRANSPORTER_FINDER_USER", ...SALES_GROUPS]) ||
  canViewTransporterMaster(userOrGroups);

export const canUseTransporterServiceability = (userOrGroups) =>
  hasAnyGroup(userOrGroups, [
    "TRANSPORTER_SERVICEABILITY_USER",
    ...SERVICEABILITY_GROUPS,
  ]);

export const canUseTransporterAccountsAdmin = (userOrGroups) =>
  hasAnyGroup(userOrGroups, ["TRANSPORTER_ACCOUNTS_ADMIN", ...ACCOUNTS_GROUPS]);

export const canUseTransporterManager = (userOrGroups) =>
  hasAnyGroup(userOrGroups, ["TRANSPORTER_MANAGER", ...MANAGER_GROUPS]);

export const canUseTransporterAdmin = (userOrGroups) =>
  hasAnyGroup(userOrGroups, ["TRANSPORTER_ADMIN", ...ADMIN_GROUPS]);

export const canViewTransporterMaster = (userOrGroups) =>
  canUseTransporterServiceability(userOrGroups) ||
  canUseTransporterAccountsAdmin(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canEditTransporterCore = (userOrGroups) =>
  canUseTransporterAccountsAdmin(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canCreateTransporter = (userOrGroups) =>
  canUseTransporterAccountsAdmin(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canEditTransporterBranches = (userOrGroups) =>
  canUseTransporterAccountsAdmin(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canEditTransporterContacts = (userOrGroups) =>
  canUseTransporterServiceability(userOrGroups) ||
  canUseTransporterAccountsAdmin(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canViewTransporterMappings = (userOrGroups) =>
  canViewTransporterMaster(userOrGroups);

export const canEditTransporterMappings = (userOrGroups) =>
  canUseTransporterServiceability(userOrGroups) ||
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canEditTransporterCapability = (userOrGroups) =>
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canDeactivateTransporter = (userOrGroups) =>
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);

export const canViewTransporterAudit = (userOrGroups) =>
  canUseTransporterAdmin(userOrGroups);

export const canManageTransportAssignmentRequests = (userOrGroups) =>
  canUseTransporterManager(userOrGroups) ||
  canUseTransporterAdmin(userOrGroups);




  