import React from "react";
import { jsPDF } from "jspdf";
import "./CertificateCard.css";

const CertificateCard = ({ cert }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /* ===============================
       BASE URL (PRODUCTION SAFE)
    =============================== */
    const BASE_URL =
      import.meta.env.VITE_ASSET_BASE_URL ||
      "http://localhost:5000";

    const logoUrl = cert?.orgLogo
      ? `${BASE_URL}${cert.orgLogo}`
      : "/lms-logo.png";

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logoUrl;

    img.onload = () => {
      /* ===============================
         BACKGROUND
      =============================== */
      doc.setFillColor(248, 249, 250);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      /* ===============================
         BORDER
      =============================== */
      const themeColor = cert.themeColor || "#2563eb";
      const r = parseInt(themeColor.substring(1, 3), 16);
      const g = parseInt(themeColor.substring(3, 5), 16);
      const b = parseInt(themeColor.substring(5, 7), 16);

      doc.setDrawColor(r, g, b);
      doc.setLineWidth(10);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      doc.setLineWidth(2);
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80);

      /* ===============================
         LOGO
      =============================== */
      const logoWidth = 140;
      const logoHeight = 140;

      doc.addImage(
        img,
        "PNG",
        pageWidth / 2 - logoWidth / 2,
        70,
        logoWidth,
        logoHeight
      );

      /* ===============================
         TITLE
      =============================== */
      doc.setFont("times", "bold");
      doc.setFontSize(32);
      doc.setTextColor(44, 62, 80);
      doc.text(
        "CERTIFICATE OF ACHIEVEMENT",
        pageWidth / 2,
        250,
        { align: "center" }
      );

      /* ===============================
         SUBTITLE
      =============================== */
      doc.setFont("times", "normal");
      doc.setFontSize(16);
      doc.setTextColor(90, 90, 90);
      doc.text(
        "THIS CERTIFICATE IS PROUDLY PRESENTED TO",
        pageWidth / 2,
        290,
        { align: "center" }
      );

      /* ===============================
         NAME
      =============================== */
      doc.setFont("times", "bold");
      doc.setFontSize(34);
      doc.setTextColor(22, 160, 133);
      doc.text(
        cert?.learnerName?.toUpperCase() || "",
        pageWidth / 2,
        340,
        { align: "center" }
      );

      /* ===============================
         COURSE TEXT
      =============================== */
      doc.setFont("times", "normal");
      doc.setFontSize(16);
      doc.setTextColor(70, 70, 70);
      doc.text(
        "In recognition of outstanding accomplishment and dedication in completing",
        pageWidth / 2,
        390,
        { align: "center" }
      );

      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80);
      doc.text(
        cert?.courseName || "",
        pageWidth / 2,
        430,
        { align: "center" }
      );

      /* ===============================
         FOOTER
      =============================== */
      doc.setFontSize(12);
      doc.setTextColor(120, 120, 120);

      doc.text(
        `Date: ${new Date(
          cert?.issueDate
        ).toLocaleDateString()}`,
        120,
        pageHeight - 120
      );

      doc.text(
        `Certificate ID: ${cert?.certificateId || ""}`,
        pageWidth / 2,
        pageHeight - 120,
        { align: "center" }
      );

      doc.text(
        "Authorized LMS Signature",
        pageWidth - 240,
        pageHeight - 120
      );

      /* ===============================
         SAVE PDF
      =============================== */
      doc.save(
        `Certificate_${cert?.courseName?.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
    };

    img.onerror = () => {
      alert("Failed to load logo image for certificate");
    };
  };

  return (
    <div className="certificate-card">
      <div className="cert-info">
        <h4>{cert?.courseName}</h4>
        <p>
          Issued on{" "}
          {new Date(cert?.issueDate).toLocaleDateString()}
        </p>
      </div>

      <button
        className="btn-download-cert"
        onClick={generatePDF}
      >
        Download Certificate
      </button>
    </div>
  );
};

export default CertificateCard;
