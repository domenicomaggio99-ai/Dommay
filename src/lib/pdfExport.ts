import { jsPDF } from "jspdf";
import { HouseInfo, Inquilino, Spesa730, Bolletta } from "../types";

export function exportResoconto730PDF(
  houseInfo: HouseInfo,
  inquilini: Inquilino[],
  spese730: Spesa730[],
  bollette: Bolletta[]
) {
  const doc = new jsPDF();
  const primaryColor = [30, 64, 175]; // Royal Blue
  const darkTextColor = [31, 41, 55]; // Dark Gray
  const lightBgColor = [243, 244, 246]; // Soft Gray

  // Title Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("CONVIVO - RESOCONTO SPESE & MODELLO 730", 14, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Fiscale per Inquilini e Proprietario | Anno di Riferimento: 2025/2026`, 14, 24);

  // House & Landlord Info Box
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(14, 38, 182, 34, 3, 3, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Immobile: ${houseInfo.name}`, 18, 46);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Indirizzo: ${houseInfo.address}, ${houseInfo.postalCode} ${houseInfo.city}`, 18, 52);
  doc.text(`Contratto: ${houseInfo.contractType}`, 18, 58);
  doc.text(`Proprietario: ${houseInfo.landlordName} (${houseInfo.landlordEmail})`, 18, 64);
  doc.text(`Amministrazione Condominio: ${houseInfo.adminCondominioName}`, 110, 58);

  // Inquilini Section
  let yPos = 80;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("1. ELENCO INQUILINI & RESIDENTI IN CONDOMINIO", 14, yPos);

  yPos += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text("Nome Inquilino", 14, yPos);
  doc.text("Ruolo / Stanza", 70, yPos);
  doc.text("Email & Contatti", 130, yPos);

  doc.setLineWidth(0.3);
  doc.setDrawColor(209, 213, 219);
  doc.line(14, yPos + 2, 196, yPos + 2);

  yPos += 8;
  doc.setFont("helvetica", "normal");
  inquilini.forEach((inq) => {
    doc.text(inq.name, 14, yPos);
    doc.text(`${inq.role} (${inq.room})`, 70, yPos);
    doc.text(inq.email, 130, yPos);
    yPos += 6;
  });

  // Section 2: Spese per Modello 730 / Proprietario
  yPos += 6;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("2. RIEPILOGO SPESE DETRAIBILI & CONDOMINIALI (730 / REDDITI)", 14, yPos);

  yPos += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  
  doc.text("Categoria / Causa", 14, yPos);
  doc.text("Importo", 110, yPos);
  doc.text("A carico di", 135, yPos);
  doc.text("Detrazione", 168, yPos);

  doc.line(14, yPos + 2, 196, yPos + 2);
  yPos += 7;

  let totalLocazione = 0;
  let totalCondominioInquilino = 0;
  let totalStraordinarieProprietario = 0;

  doc.setFont("helvetica", "normal");
  spese730.forEach((spesa) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    if (spesa.category.includes("Canone")) totalLocazione += spesa.amount;
    if (spesa.category.includes("Ordinarie")) totalCondominioInquilino += spesa.amount;
    if (spesa.category.includes("Straordinarie") || spesa.category.includes("Bonus")) totalStraordinarieProprietario += spesa.amount;

    const shortCat = spesa.category.length > 42 ? spesa.category.substring(0, 40) + "..." : spesa.category;
    doc.text(shortCat, 14, yPos);
    doc.text(`€ ${spesa.amount.toFixed(2)}`, 110, yPos);
    doc.text(spesa.paidBy, 135, yPos);
    doc.text(`${spesa.deductiblePercentage}% (${spesa.deductibleFor})`, 168, yPos);

    yPos += 5;
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    doc.text(`Rif: ${spesa.documentRef || "N/A"} - ${spesa.notes || ""}`.substring(0, 95), 14, yPos);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFontSize(8);

    yPos += 6;
  });

  // Totals Box
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  yPos += 4;
  doc.setFillColor(239, 246, 255); // Soft blue tint
  doc.roundedRect(14, yPos, 182, 38, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("SINTESI FISCALE PER IL COMMERCIALISTA / CAF", 18, yPos + 8);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`• Totale Canoni Locazione Versati (Art. 16 TUIR): € ${totalLocazione.toFixed(2)} (Fino a €2.633 detraibili per studente)`, 18, yPos + 16);
  doc.text(`• Totale Oneri Accessori Condominiali Ordinari (Inquilini): € ${totalCondominioInquilino.toFixed(2)}`, 18, yPos + 22);
  doc.text(`• Totale Interventi Straordinari / Bonus Casa (Proprietario): € ${totalStraordinarieProprietario.toFixed(2)}`, 18, yPos + 28);
  doc.text(`• Quota Pro-Capite Canone Annua per ciascun inquilino (4 residenti): € ${(totalLocazione / 4).toFixed(2)}`, 18, yPos + 34);

  // Footer Signature
  yPos += 48;
  if (yPos < 270) {
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Documento generato automaticamente da Convivo - Applicazione per la Gestione Inquilini e Condominio Italia.", 14, yPos);
    doc.text(`Data di stampa: ${new Date().toLocaleDateString("it-IT")}`, 14, yPos + 5);
  }

  doc.save(`Resoconto_730_Proprietario_${houseInfo.name.replace(/\s+/g, "_")}.pdf`);
}

export function exportResocontoCSV(
  houseInfo: HouseInfo,
  spese730: Spesa730[],
  bollette: Bolletta[]
) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID;Categoria;Descrizione;Importo;Data;PagatoDa;Beneficiario;RiferimentoDocumento;Detrazione;Percentuale;Note\n";

  spese730.forEach((s) => {
    const row = [
      s.id,
      `"${s.category}"`,
      `"${s.description.replace(/"/g, '""')}"`,
      s.amount.toFixed(2),
      s.date,
      s.paidBy,
      `"${s.recipient}"`,
      `"${s.documentRef || ""}"`,
      s.deductibleFor,
      `${s.deductiblePercentage}%`,
      `"${(s.notes || "").replace(/"/g, '""')}"`,
    ].join(";");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Spese_730_Commercialista_${houseInfo.name.replace(/\s+/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
