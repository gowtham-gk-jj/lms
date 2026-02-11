import React from "react";
import { jsPDF } from "jspdf";
import "./CertificateCard.css";

const CertificateCard = ({ cert }) => {

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      /* ===============================
         PRODUCTION SAFE BASE URL
      =============================== */
      const BASE_URL =
        import.meta.env.VITE_ASSET_BASE_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        "";

      const logoUrl = cert?.orgLogo
        ? `${BASE_URL}/${cert.orgLogo.replace(/^\/+/, "")}`
        : null;

      let base64Logo = null;

      /* ===============================
         LOAD LOGO SAFELY
      =============================== */
      if (logoUrl) {
        try {
          const response = await fetch(logoUrl);

          if (response.ok) {
            const blob = await response.blob();

            base64Logo = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        } catch (err) {
          console.warn("Logo failed to load. Continuing without logo.");
        }
      }

      /* ===============================
         BACKGROUND
      =============================== */
      doc.setFillColor(248, 249, 250);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      /* ===============================
         BORDER
      =============================== */
      const themeColor = cert?.themeColor || "#2563eb";

      const r = parseInt(themeColor.substring(1, 3), 16);
      const g = parseInt(themeColor.substring(3, 5), 16);
      const b = parseInt(themeColor.substring(5, 7), 16);

      doc.setDrawColor(r, g, b);
      doc.setLineWidth(10);
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

      doc.setLineWidth(2);
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80);

      /* ===============================
         LOGO (OPTIONAL)
      =============================== */
      if (base64Logo) {
        const format = base64Logo.includes("image/jpeg")
          ? "JPEG"
          : "PNG";

        doc.addImage(
          base64Logo,
          format,
          pageWidth / 2 - 70,
          70,
          140,
          140
        );
      }

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
         COURSE
      =============================== */
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
        `Date: ${
          cert?.issueDate
            ? new Date(cert.issueDate).toLocaleDateString()
            : ""
        }`,
        120,
        pageHeight - 120
      );

      doc.text(
        `Certificate ID: ${cert?.certificateId || ""}`,
        pageWidth / 2,
        pageHeight - 120,
        { align: "center" }
      );

      doc.save(
        `Certificate_${
          cert?.courseName?.replace(/\s+/g, "_") || "Course"
        }.pdf`
      );

    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Something went wrong while generating certificate.");
    }
  };

  return (
    <div className="certificate-card">
      <div className="cert-info">
        <h4>{cert?.courseName}</h4>
        <p>
          Issued on{" "}
          {cert?.issueDate
            ? new Date(cert.issueDate).toLocaleDateString()
            : ""}
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
