import React, { useEffect } from "react";
import moment from "moment";
import InvoiceServices from "../../../services/InvoiceService";

// ── Modern color palette ─────────────────────────────────────────────────────
const C = {
  primary: "#0066cc",
  primaryLight: "#e6f2ff",
  primaryBorder: "#4d94ff",
  primaryDark: "#003d99",
  primaryGradient: "linear-gradient(135deg, #0066cc 0%, #0052a3 100%)",
  success: "#16a34a",
  successLight: "#dcfce7",
  successBorder: "#86efac",
  successDark: "#15803d",
  successGradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
  error: "#dc2626",
  errorLight: "#fee2e2",
  errorBorder: "#fca5a5",
  errorDark: "#991b1b",
  errorGradient: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  warning: "#ea580c",
  warningLight: "#fed7aa",
  warningBorder: "#fdba74",
  warningDark: "#b45309",
  warningGradient: "linear-gradient(135deg, #ea580c 0%, #b45309 100%)",
  info: "#4f46e5",
  infoLight: "#e0e7ff",
  infoBorder: "#a5b4fc",
  infoDark: "#312e81",
  divider: "#e5e7eb",
  bgPage: "#f8fafc",
  bgCard: "#ffffff",
  bgHover: "#f3f4f6",
  text1: "#1f2937",
  text2: "#6b7280",
  text3: "#9ca3af",
  textLight: "#d1d5db",
  shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  shadowXl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
// Flow: Under Review → Pending Capa Approval → Approval By Account Manager
//       → Pending Note → Closed
// Side states: Capa Revision Required (loops back), Rejected (terminal)
const STATUS_CFG = {
  // ── Main flow ─────────────────────────────────────────────────────────────
  "Under Review": {
    dot: C.info,
    bg: C.infoLight,
    color: C.infoDark,
    border: C.infoBorder,
    icon: "🔍",
    label: "Under Review",
  },
  "Pending Capa Approval": {
    dot: C.primary,
    bg: C.primaryLight,
    color: C.primaryDark,
    border: C.primaryBorder,
    icon: "⏳",
    label: "Pending Approval",
  },
  "Pending By Account Manager": {
    dot: C.primary,
    bg: C.primaryLight,
    color: C.primaryDark,
    border: C.primaryBorder,
    icon: "👤",
    label: "Manager Approval",
  },
  "Pending Note": {
    dot: C.warning,
    bg: C.warningLight,
    color: C.warningDark,
    border: C.warningBorder,
    icon: "📝",
    label: "Pending Note",
  },
  Closed: {
    dot: C.success,
    bg: C.successLight,
    color: C.successDark,
    border: C.successBorder,
    icon: "✓",
    label: "Closed",
  },
  // ── Side / terminal states ────────────────────────────────────────────────
  "Capa Revision Required": {
    dot: C.error,
    bg: C.errorLight,
    color: C.errorDark,
    border: C.errorBorder,
    icon: "🔄",
    label: "Revision Required",
  },
  Rejected: {
    dot: C.error,
    bg: C.errorLight,
    color: C.errorDark,
    border: C.errorBorder,
    icon: "✕",
    label: "Rejected",
  },
  // ── Legacy / fallback statuses (kept for old records) ────────────────────
  "CAPA Created": {
    dot: C.warning,
    bg: C.warningLight,
    color: C.warningDark,
    border: C.warningBorder,
    icon: "📋",
    label: "CAPA Created",
  },
  Approved: {
    dot: C.success,
    bg: C.successLight,
    color: C.successDark,
    border: C.successBorder,
    icon: "✓",
    label: "Approved",
  },
  "Pending Approval by Account Manager": {
    dot: C.primary,
    bg: C.primaryLight,
    color: C.primaryDark,
    border: C.primaryBorder,
    icon: "⏳",
    label: "Pending AM Approval",
  },
  "Account Manager Approval": {
    dot: C.success,
    bg: C.successLight,
    color: C.successDark,
    border: C.successBorder,
    icon: "✓",
    label: "Approved by AM",
  },
  // ── Flow indicator pills ──────────────────────────────────────────────────
  "IN Progress": {
    dot: C.warning,
    bg: C.warningLight,
    color: C.warningDark,
    border: C.warningBorder,
    icon: "⏳",
    label: "In Progress",
  },
  Completed: {
    dot: C.success,
    bg: C.successLight,
    color: C.successDark,
    border: C.successBorder,
    icon: "✓",
    label: "Completed",
  },
};

// ── FLOW_STEPS: the 5-step main progress bar ─────────────────────────────────
// Side states (Capa Revision Required, Rejected) are NOT in the stepper.
// "Capa Revision Required" loops back to "Pending Capa Approval" (shown as retry badge).
// "Rejected" is terminal — shown via isRejected banner, not a step.
const FLOW_STEPS = [
  "Under Review",
  "Pending Capa Approval",
  "Approved",
  "Pending By Account Manager",
  "Pending Note",
  "Closed",
];

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Helper components ────────────────────────────────────────────────────────
const Pill = ({ label, bg, color, border, small, icon }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: small ? 4 : 6,
      fontSize: small ? 11 : 12,
      fontWeight: 600,
      padding: small ? "4px 10px" : "6px 14px",
      borderRadius: 20,
      whiteSpace: "nowrap",
      background: bg,
      color,
      border: `1.5px solid ${border}`,
      transition: "all 0.2s ease",
      boxShadow: C.shadowSm,
      cursor: "default",
    }}
  >
    {icon && <span style={{ fontSize: small ? 10 : 11 }}>{icon}</span>}
    {label}
  </span>
);

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: C.text3,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <div
      style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }}
    />
    {children}
  </div>
);

const Card = ({ children, style, highlightBorder }) => (
  <div
    style={{
      background: C.bgCard,
      borderRadius: 12,
      border: highlightBorder
        ? `2px solid ${C.primary}`
        : `1px solid ${C.divider}`,
      padding: "24px",
      boxShadow: highlightBorder ? C.shadowMd : C.shadowSm,
      transition: "all 0.2s ease",
      ...style,
    }}
  >
    {children}
  </div>
);

const DetailRow = ({ label, value, color, last, icon }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: last ? "none" : `1px solid ${C.divider}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      <span style={{ fontSize: 13, color: C.text2, fontWeight: 500 }}>
        {label}
      </span>
    </div>
    <span style={{ fontSize: 14, fontWeight: 600, color: color || C.text1 }}>
      {value}
    </span>
  </div>
);

const StatTile = ({ label, value, color, bg, last, trend }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      borderRadius: 10,
      background: bg,
      marginBottom: last ? 0 : 10,
      border: `1px solid ${C.divider}`,
      transition: "all 0.2s ease",
      cursor: "pointer",
      boxShadow: C.shadowSm,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = C.shadowMd;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = C.shadowSm;
    }}
  >
    <span style={{ fontSize: 13, color: C.text2, fontWeight: 500 }}>
      {label}
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color }}>{value}</span>
      {trend && (
        <span style={{ fontSize: 12, color: C.text3, fontWeight: 500 }}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

// ── Image Lightbox Modal ─────────────────────────────────────────────────────
const LightboxModal = ({ doc, allDocs, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(
    allDocs.findIndex((d) => d.id === doc.id),
  );
  const current = allDocs[currentIndex];

  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        setCurrentIndex(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < allDocs.length - 1)
        setCurrentIndex(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, onClose, allDocs.length]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bgCard,
          borderRadius: 16,
          boxShadow: C.shadowXl,
          overflow: "hidden",
          maxWidth: "92vw",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          minWidth: 320,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${C.divider}`,
            background: C.bgCard,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>
              {current.media_type === "Photo" ? "🖼️" : "📄"}
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text1 }}>
                {current.media_type} #{currentIndex + 1}
              </div>
              {allDocs.length > 1 && (
                <div style={{ fontSize: 11, color: C.text3 }}>
                  {currentIndex + 1} of {allDocs.length}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href={current.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                color: C.primary,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${C.primaryBorder}`,
                background: C.primaryLight,
              }}
            >
              ↗ Open original
            </a>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1px solid ${C.divider}`,
                background: C.bgPage,
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.text2,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image area */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a2e",
            minHeight: 240,
            position: "relative",
          }}
        >
          {current.media_type === "Photo" ? (
            <img
              src={current.file}
              alt={`Attachment ${currentIndex + 1}`}
              style={{
                maxWidth: "80vw",
                maxHeight: "68vh",
                borderRadius: 10,
                objectFit: "contain",
                display: "block",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                <span role="img" aria-label="document">
                  📄
                </span>
              </div>
              <div style={{ fontSize: 14, color: "#aaa", marginBottom: 20 }}>
                Preview not available for this file type.
              </div>
              <a
                href={current.file}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.primaryBorder,
                  textDecoration: "none",
                }}
              >
                Open file ↗
              </a>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        {allDocs.length > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderTop: `1px solid ${C.divider}`,
              background: C.bgCard,
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${C.divider}`,
                background: currentIndex === 0 ? C.bgPage : C.bgCard,
                color: currentIndex === 0 ? C.text3 : C.text1,
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              ← Previous
            </button>

            <div style={{ display: "flex", gap: 6 }}>
              {allDocs.map((d, idx) => (
                <div
                  key={d.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      idx === currentIndex
                        ? `2px solid ${C.primary}`
                        : `2px solid ${C.divider}`,
                    flexShrink: 0,
                    background: C.bgPage,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.15s ease",
                  }}
                >
                  {d.media_type === "Photo" ? (
                    <img
                      src={d.file}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{ fontSize: 16 }}
                      role="img"
                      aria-label="document"
                    >
                      📄
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentIndex((p) => Math.min(allDocs.length - 1, p + 1))
              }
              disabled={currentIndex === allDocs.length - 1}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: 8,
                border: `1px solid ${C.divider}`,
                background:
                  currentIndex === allDocs.length - 1 ? C.bgPage : C.bgCard,
                color: currentIndex === allDocs.length - 1 ? C.text3 : C.text1,
                cursor:
                  currentIndex === allDocs.length - 1
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Data transformation helper ───────────────────────────────────────────────
export const transformRecordToCapaProps = (record) => {
  const rawTimeline = (record.status_details || []).map((item, index) => {
    const sc = STATUS_CFG[item.status] || STATUS_CFG["Under Review"];
    return {
      id: item.id,
      status: item.status,
      title: sc.label || item.status,
      description:
        index === 0
          ? `Complaint logged: ${record.complaint || record.problem || "—"}. Complaint No: ${record.complain_no}`
          : item.status === "Pending Capa Approval"
            ? `CAPA created and submitted to factory manager for approval by ${item.created_by_name || item.created_by}.`
            : item.status === "Capa Revision Required"
              ? `Factory manager returned the CAPA for revision. Revised by ${item.created_by_name || item.created_by}.`
              : item.status === "Pending By Account Manager"
                ? `Factory manager approved the CAPA. Forwarded to Account Manager for final approval by ${item.created_by_name || item.created_by}.`
                : item.status === "Pending Note"
                  ? `Accounts team notified to process CN/DN by ${item.created_by_name || item.created_by}.`
                  : item.status === "Rejected"
                    ? `Account Manager rejected the CAPA. This CCF is now closed. Action by ${item.created_by_name || item.created_by}.`
                    : item.status === "Closed"
                      ? `Accounts completed CN/DN. This CCF is now closed by ${item.created_by_name || item.created_by}.`
                      : `Status updated to "${item.status}" by ${item.created_by_name || item.created_by}.`,
      remark: item.remark || null,
      user: item.created_by_name || item.created_by || "Unknown",
      role: item.created_by_designation || "—",
      date: item.creation_date,
      _synthetic: false,
    };
  });

  // Inject a synthetic "Account Manager Approved" entry just before every "Pending Note" entry
  const timelineData = [];
  rawTimeline.forEach((entry) => {
    if (entry.status === "Pending Note") {
      timelineData.push({
        id: entry.id + "_am_approved",
        status: "Approved",
        title: "Account Manager Approved",
        description: `Account Manager reviewed and approved the CAPA. Proceeding to CN/DN by ${entry.user}.`,
        remark: null,
        user: entry.user,
        role: entry.role,
        date: entry.date,
        _synthetic: true,
      });
    }
    timelineData.push(entry);
  });

  return {
    capaId: record.complain_no,
    capaTitle: `${record.complain_type} — ${record.department}`,
    assignedTo: record.customer,
    createdDate: record.creation_date,
    currentStatus: record.ccfstatus,
    timelineData,
    recordForEdit: record,
  };
};

// ── Attachment Card (reusable) ───────────────────────────────────────────────
const AttachmentItem = ({ doc, index, total, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 8,
      border: `1px solid ${C.divider}`,
      marginBottom: index < total - 1 ? 8 : 0,
      background: C.bgPage,
      transition: "all 0.2s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.primaryLight;
      e.currentTarget.style.borderColor = C.primaryBorder;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = C.bgPage;
      e.currentTarget.style.borderColor = C.divider;
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 6,
        overflow: "hidden",
        flexShrink: 0,
        background: C.bgHover,
        border: `1px solid ${C.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {doc.media_type === "Photo" ? (
        <img
          src={doc.file}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: 20 }} role="img" aria-label="document">
          📄
        </span>
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.primary }}>
        {doc.media_type} #{index + 1}
      </div>
      <div style={{ fontSize: 11, color: C.text3 }}>Click to view</div>
    </div>
    <span
      style={{ fontSize: 14, color: C.text3, flexShrink: 0 }}
      role="img"
      aria-label="view"
    >
      🔍
    </span>
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
export const CapaStatusView = ({
  recordForEdit = {},
  setOpenCapa,
  capaId,
  capaTitle,
  assignedTo,
  createdDate,
  currentStatus,
  timelineData = [],
}) => {
  const [invoices, setInvoices] = React.useState([]);
  const [lightboxDoc, setLightboxDoc] = React.useState(null);
  const [lightboxDocs, setLightboxDocs] = React.useState([]);

  const getInvoicesDetails = async () => {
    try {
      const response = await InvoiceServices.getInvoiceByCustomerAndSellerUnit(
        recordForEdit.customer,
        recordForEdit.unit,
      );
      setInvoices(response.data.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getInvoicesDetails();
  }, []);

  console.log("data is :", recordForEdit);

  const invoiceNos = recordForEdit.invoices;

  const invoiceDates = invoices
    .filter(function (inv) {
      return invoiceNos.indexOf(inv.invoice_no) !== -1;
    })
    .map(function (inv) {
      return inv.generation_date;
    });

  console.log("invoiceDates:", invoiceDates);

  const derived = React.useMemo(() => {
    if (recordForEdit && recordForEdit.ccfstatus && !currentStatus) {
      return transformRecordToCapaProps(recordForEdit);
    }
    return null;
  }, [recordForEdit, currentStatus]);

  const _capaId =
    capaId !== undefined
      ? capaId
      : derived && derived.capaId !== undefined
        ? derived.capaId
        : "—";
  const _capaTitle =
    capaTitle !== undefined
      ? capaTitle
      : derived && derived.capaTitle !== undefined
        ? derived.capaTitle
        : "—";
  const _assignedTo =
    assignedTo !== undefined
      ? assignedTo
      : derived && derived.assignedTo !== undefined
        ? derived.assignedTo
        : "—";
  const _createdDate =
    createdDate !== undefined
      ? createdDate
      : derived && derived.creation_date !== undefined
        ? derived.creation_date
        : moment().format("YYYY-MM-DD");
  const _currentStatus =
    currentStatus !== undefined
      ? currentStatus
      : derived && derived.currentStatus !== undefined
        ? derived.currentStatus
        : "Under Review";
  const _timelineData =
    timelineData && timelineData.length
      ? timelineData
      : derived && derived.timelineData
        ? derived.timelineData
        : [];
  const _record = recordForEdit
    ? recordForEdit
    : derived && derived.recordForEdit
      ? derived.recordForEdit
      : {};

  const _currentStatusNorm = (_currentStatus || "").trim();
  const activeStep = FLOW_STEPS.indexOf(_currentStatusNorm);
  const cfg = STATUS_CFG[_currentStatusNorm] || STATUS_CFG["Under Review"];
  // "Rejected" = terminal (AM rejected, flow stops)
  // "Capa Revision Required" = loops back, shown separately
  const isRejected = _currentStatusNorm === "Rejected";
  const isRevision = _currentStatusNorm === "Capa Revision Required";
  const daysOpen = moment().diff(moment(_createdDate), "days");

  const stepRetryCount = {};
  (_record.status_details || []).forEach((item) => {
    if (FLOW_STEPS.indexOf(item.status) !== -1) {
      stepRetryCount[item.status] = (stepRetryCount[item.status] || 0) + 1;
    }
  });

  const priorityCfg =
    _record.priority === "Critical"
      ? { bg: C.errorLight, color: C.errorDark, border: C.errorBorder }
      : _record.priority === "High"
        ? { bg: C.warningLight, color: C.warningDark, border: C.warningBorder }
        : { bg: C.successLight, color: C.successDark, border: C.successBorder };

  const allDocs = _record.document || [];

  const capaDetails = _record.capa_details || {};
  const capaDocs = capaDetails.document || [];

  const openLightbox = (doc, docs) => {
    setLightboxDoc(doc);
    setLightboxDocs(docs);
  };

  const closeLightbox = () => {
    setLightboxDoc(null);
    setLightboxDocs([]);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: C.bgPage,
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Lightbox */}
      {lightboxDoc && lightboxDocs.length > 0 && (
        <LightboxModal
          doc={lightboxDoc}
          allDocs={lightboxDocs}
          onClose={closeLightbox}
        />
      )}

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          height: 56,
          background: C.bgCard,
          borderBottom: `1px solid ${C.divider}`,
          position: "sticky",
          top: -16,
          zIndex: 100,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>
            {_capaId}
          </span>
          <span style={{ width: 1, height: 18, background: C.divider }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: C.text1 }}>
            {_capaTitle}
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill
            label={_currentStatus}
            bg={cfg.bg}
            color={cfg.color}
            border={cfg.border}
          />
        </div>
      </div>

      {/* Body grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
          padding: "24px 32px",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stepper */}
          <Card>
            <SectionLabel>Process flow</SectionLabel>

            {isRejected && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.errorLight,
                  border: "1px solid " + C.errorBorder,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 18 }}>✕</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.errorDark,
                    }}
                  >
                    Rejected by Account Manager
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.errorDark, opacity: 0.8 }}
                  >
                    This CCF has been rejected and the flow has stopped.
                  </div>
                </div>
              </div>
            )}
            {isRevision && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.warningLight,
                  border: "1px solid " + C.warningBorder,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 18 }} role="img" aria-label="revision">
                  🔄
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.warningDark,
                    }}
                  >
                    Revision Required
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.warningDark, opacity: 0.8 }}
                  >
                    Factory manager returned the CAPA for revision. Awaiting
                    resubmission.
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {FLOW_STEPS.map((label, i) => {
                const done = activeStep !== -1 && i < activeStep;
                const active = i === activeStep;
                const last = i === FLOW_STEPS.length - 1;
                const scfg = STATUS_CFG[label];
                return (
                  <React.Fragment key={label}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: 34,
                          height: 34,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 700,
                            position: "relative",
                            zIndex: 1,
                            background: done
                              ? C.success
                              : active
                                ? scfg.dot
                                : C.bgPage,
                            border:
                              done || active
                                ? "none"
                                : "1px solid " + C.divider,
                            color: done || active ? "#fff" : C.text3,
                            boxShadow: active ? "0 0 0 4px " + scfg.bg : "none",
                          }}
                        >
                          {done
                            ? "\u2713"
                            : active && scfg.dot === C.success
                              ? "\u2713"
                              : scfg.icon}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          marginTop: 6,
                          textAlign: "center",
                          maxWidth: 72,
                          lineHeight: 1.3,
                          color: done ? C.success : active ? scfg.dot : C.text3,
                          fontWeight: active || done ? 600 : 400,
                        }}
                      >
                        {scfg.label || label}
                      </div>
                      {(stepRetryCount[label] || 0) > 1 && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 9,
                            fontWeight: 700,
                            background: C.warningLight,
                            color: C.warningDark,
                            border: `1px solid ${C.warningBorder}`,
                            borderRadius: 8,
                            padding: "1px 6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          x{stepRetryCount[label]}
                        </div>
                      )}
                    </div>
                    {!last && (
                      <div
                        style={{
                          flex: 1,
                          height: 2,
                          margin: "0 -1px",
                          marginTop: 17,
                          alignSelf: "flex-start",
                          background: done ? C.success : C.divider,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 18,
                paddingTop: 14,
                borderTop: `1px solid ${C.divider}`,
              }}
            >
              <span
                style={{ fontSize: 11, color: C.text3, alignSelf: "center" }}
              >
                Current flow:
              </span>
              {(_currentStatus !== "Closed"
                ? ["IN Progress"]
                : ["Completed"]
              ).map((s) => {
                const sc = STATUS_CFG[s];
                return (
                  <Pill
                    key={s}
                    label={s}
                    bg={sc.bg}
                    color={sc.color}
                    border={sc.border}
                    small
                  />
                );
              })}
            </div>
          </Card>

          {/* Complaint details card */}
          {_record.complain_no && (
            <Card>
              <SectionLabel>Complaint details</SectionLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 24px",
                }}
              >
                <DetailRow label="Complaint No." value={_record.complain_no} />
                <DetailRow
                  label="Complaint Type"
                  value={_record.complain_type || "—"}
                />
                <DetailRow
                  label="Complain For"
                  value={_record.complain_for || "—"}
                />
                <DetailRow
                  label="Source"
                  value={_record.source_of_complaint || "—"}
                />
                <DetailRow
                  label="Application"
                  value={_record.application || "—"}
                />
                <DetailRow label="Problem" value={_record.problem || "—"} />
                {(_record.batch_nos || []).length > 0 && (
                  <DetailRow
                    label="Invoice date"
                    value={invoiceDates ? invoiceDates.join(", ") : ""}
                  />
                )}
                {(_record.invoices || []).length > 0 && (
                  <DetailRow
                    label="Invoice(s)"
                    value={_record.invoices.join(", ")}
                  />
                )}
                <DetailRow label="Unit" value={_record.unit || "—"} last />
              </div>
              {_record.unit_address && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 0",
                    borderTop: `1px solid ${C.divider}`,
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: C.text3, fontWeight: 500 }}
                  >
                    Unit Address:{" "}
                  </span>
                  <span style={{ fontSize: 13, color: C.text1 }}>
                    {_record.unit_address}
                  </span>
                </div>
              )}
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <SectionLabel>Activity log</SectionLabel>
            {_timelineData.length === 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: C.text3,
                  textAlign: "center",
                  padding: "24px 0",
                }}
              >
                No activity recorded yet.
              </div>
            )}
            {(() => {
              const seenCount = {};
              return _timelineData.map((item, index) => {
                const isLast = index === _timelineData.length - 1;
                const sc =
                  STATUS_CFG[item.status] || STATUS_CFG["Under Review"];

                const isSynthetic = item._synthetic === true;
                seenCount[item.status] = (seenCount[item.status] || 0) + 1;
                const occurrence = seenCount[item.status];
                const isRetry = !isSynthetic && occurrence > 1;
                const dotColor = isSynthetic
                  ? C.success
                  : isRetry
                    ? C.warning
                    : sc.dot;
                const dotShadow = isSynthetic
                  ? "0 0 0 3px " + C.successLight
                  : isRetry
                    ? "0 0 0 3px " + C.warningLight
                    : "none";

                return (
                  <div key={item.id} style={{ display: "flex", gap: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 20,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: dotColor,
                          marginTop: 6,
                          flexShrink: 0,
                          boxShadow: dotShadow,
                        }}
                      />
                      {!isLast && (
                        <div
                          style={{
                            width: 2,
                            flex: 1,
                            background: C.divider,
                            margin: "4px 0",
                            minHeight: 28,
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        background: isSynthetic
                          ? C.successLight
                          : isRetry
                            ? "#fffbeb"
                            : C.bgPage,
                        border:
                          "1px solid " +
                          (isSynthetic
                            ? C.successBorder
                            : isRetry
                              ? C.warningBorder
                              : C.divider),
                        borderRadius: 8,
                        padding: "14px 16px",
                        marginBottom: isLast ? 0 : 14,
                        borderLeft:
                          "3px solid " +
                          (isSynthetic
                            ? C.success
                            : isRetry
                              ? C.warning
                              : sc.dot),
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: isSynthetic ? C.successDark : C.text1,
                            }}
                          >
                            {isSynthetic ? "✓ " : ""}
                            {item.title}
                          </span>
                          {isSynthetic && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                background: C.success,
                                color: "#fff",
                                borderRadius: 4,
                                padding: "2px 7px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                              }}
                            >
                              Approved
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: C.text3,
                            fontFamily: "monospace",
                            whiteSpace: "nowrap",
                            marginLeft: 12,
                          }}
                        >
                          {moment(item.date, "DD-MM-YYYY HH:mm:ss").format(
                            "DD MMM YYYY · h:mm A",
                          )}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 13,
                          color: C.text2,
                          lineHeight: 1.6,
                          margin: "0 0 10px",
                        }}
                      >
                        {item.description}
                      </p>

                      {item.remark && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            background:
                              item.status === "Capa Revision Required" ||
                              item.status === "Rejected"
                                ? C.errorLight
                                : C.infoLight,
                            border:
                              "1px solid " +
                              (item.status === "Capa Revision Required" ||
                              item.status === "Rejected"
                                ? C.errorBorder
                                : C.infoBorder),
                            borderRadius: 6,
                            padding: "8px 12px",
                            marginBottom: 12,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              flexShrink: 0,
                              marginTop: 1,
                            }}
                          >
                            {item.status === "Capa Revision Required" ||
                            item.status === "Rejected"
                              ? "🚫"
                              : "💬"}
                          </span>
                          <div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color:
                                  item.status === "Capa Revision Required" ||
                                  item.status === "Rejected"
                                    ? C.errorDark
                                    : C.infoDark,
                                display: "block",
                                marginBottom: 2,
                              }}
                            >
                              Reason
                            </span>
                            <span
                              style={{
                                fontSize: 13,
                                color: C.text1,
                                fontWeight: 500,
                              }}
                            >
                              {item.remark}
                            </span>
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: 10,
                          borderTop: `1px solid ${C.divider}`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.border}`,
                            }}
                          >
                            {initials(item.user)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: C.text1,
                              }}
                            >
                              {item.user}
                            </div>
                            <div style={{ fontSize: 11, color: C.text3 }}>
                              {item.role}
                            </div>
                          </div>
                        </div>
                        <Pill
                          label={item.status}
                          bg={sc.bg}
                          color={sc.color}
                          border={sc.border}
                          small
                        />
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </Card>
        </div>

        {/* RIGHT column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Case details */}
          <Card>
            <SectionLabel>Case details</SectionLabel>
            <DetailRow label="CAPA ID" value={_capaId} />
            <DetailRow label="Customer" value={_assignedTo} />
            <DetailRow
              label="Created"
              value={
                _record.updated_date
                  ? moment(_record.updated_date, [
                      "YYYY-MM-DD",
                      "DD-MM-YYYY HH:mm:ss",
                    ]).format("DD MMM YYYY")
                  : "—"
              }
            />
            <DetailRow
              label="Updated"
              value={moment(_createdDate, [
                "YYYY-MM-DD",
                "DD-MM-YYYY HH:mm:ss",
              ]).format("DD MMM YYYY")}
            />
            <DetailRow label="Department" value={_record.department || "—"} />
            <DetailRow
              label="Priority"
              value={_record.priority || "—"}
              color={priorityCfg.color}
              last
            />
          </Card>

          {/* All statuses — CHANGE 3: added both new statuses between Approved and Pending Note */}
          <Card>
            <SectionLabel>All statuses</SectionLabel>
            {[
              "Under Review",
              "Pending Capa Approval",
              "Capa Revision Required",
              "Approved",
              "Pending By Account Manager",
              "Rejected",
              "Pending Note",
              "Closed",
            ].map((s) => {
              const sc = STATUS_CFG[s];
              const isCurr = s === _currentStatusNorm;
              return (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: 6,
                    marginBottom: 4,
                    background: isCurr ? sc.bg : "transparent",
                    border: isCurr
                      ? `1px solid ${sc.border}`
                      : "1px solid transparent",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isCurr ? sc.dot : C.divider,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        color: isCurr ? sc.color : C.text3,
                        fontWeight: isCurr ? 600 : 400,
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {isCurr && (
                    <span
                      style={{ fontSize: 10, fontWeight: 700, color: sc.color }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Stats */}
          <Card>
            <SectionLabel>Summary</SectionLabel>
            <StatTile
              label="Current stage"
              value={
                activeStep !== -1
                  ? `${activeStep + 1} of ${FLOW_STEPS.length}`
                  : "—"
              }
              color={isRejected ? C.error : C.primary}
              bg={isRejected ? C.errorLight : C.primaryLight}
            />
            <StatTile
              label="Steps remaining"
              value={
                activeStep !== -1 ? FLOW_STEPS.length - activeStep - 1 : "—"
              }
              color={C.warning}
              bg={C.warningLight}
            />
            <StatTile
              label="Days open"
              value={`${daysOpen}d`}
              color={daysOpen > 7 ? C.error : C.success}
              bg={daysOpen > 7 ? C.errorLight : C.successLight}
            />
            <StatTile
              label="Status updates"
              value={(_record.status_details || []).length}
              color={C.info}
              bg={C.infoLight}
              last
            />
          </Card>

          {/* CAPA Attachments */}
          {capaDocs.length > 0 && (
            <Card>
              <SectionLabel>CAPA Attachments</SectionLabel>
              {capaDocs.map((doc, i) => (
                <AttachmentItem
                  key={doc.id}
                  doc={doc}
                  index={i}
                  total={capaDocs.length}
                  onClick={() => openLightbox(doc, capaDocs)}
                />
              ))}
            </Card>
          )}

          {/* Complaint Attachments */}
          {allDocs.length > 0 && (
            <Card>
              <SectionLabel>Attachments</SectionLabel>
              {allDocs.map((doc, i) => (
                <AttachmentItem
                  key={doc.id}
                  doc={doc}
                  index={i}
                  total={allDocs.length}
                  onClick={() => openLightbox(doc, allDocs)}
                />
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Usage ─────────────────────────────────────────────────────────────────────
//   <CapaStatusView recordForEdit={apiRecord} />
