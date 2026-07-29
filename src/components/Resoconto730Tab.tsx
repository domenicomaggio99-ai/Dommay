import React, { useState } from "react";
import {
  FileCheck,
  Download,
  FileSpreadsheet,
  Building,
  User,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Info,
  Euro,
  Calculator,
  HelpCircle,
} from "lucide-react";
import { HouseInfo, Inquilino, Spesa730, Bolletta } from "../types";
import { exportResoconto730PDF, exportResocontoCSV } from "../lib/pdfExport";

interface Resoconto730TabProps {
  houseInfo: HouseInfo;
  inquilini: Inquilino[];
  spese730: Spesa730[];
  bollette: Bolletta[];
  isProprietarioView: boolean;
  onAddSpesa730: (spesa: Omit<Spesa730, "id">) => void;
  onOpenAIAssistant: () => void;
}

export const Resoconto730Tab: React.FC<Resoconto730TabProps> = ({
  houseInfo,
  inquilini,
  spese730,
  bollette,
  isProprietarioView,
  onAddSpesa730,
  onOpenAIAssistant,
}) => {
  const [filterType, setFilterType] = useState<"Tutti" | "Inquilino (730)" | "Proprietario (Redditi)">("Tutti");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [category, setCategory] = useState<Spesa730["category"]>(
    "Canone di Locazione (Detrazione Art.16 TUIR)"
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<"Inquilini" | "Proprietario" | "Singolo Inquilino">("Inquilini");
  const [recipient, setRecipient] = useState("");
  const [docRef, setDocRef] = useState("");
  const [deductibleFor, setDeductibleFor] = useState<"Inquilino (730)" | "Proprietario (Redditi)" | "Nessuna">("Inquilino (730)");
  const [deductiblePct, setDeductiblePct] = useState<number>(19);
  const [notes, setNotes] = useState("");

  const filteredSpese = spese730.filter((s) => {
    if (filterType === "Tutti") return true;
    return s.deductibleFor === filterType;
  });

  // Calculate totals
  const totalLocazione = spese730
    .filter((s) => s.category.includes("Canone"))
    .reduce((acc, s) => acc + s.amount, 0);

  const totalOrdinaryCondo = spese730
    .filter((s) => s.category.includes("Ordinarie"))
    .reduce((acc, s) => acc + s.amount, 0);

  const totalExtraordinaryLandlord = spese730
    .filter((s) => s.category.includes("Straordinarie") || s.category.includes("Bonus"))
    .reduce((acc, s) => acc + s.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    onAddSpesa730({
      category,
      description,
      amount,
      date: new Date().toISOString().split("T")[0],
      paidBy,
      recipient: recipient || "Proprietario / Amministratore",
      documentRef: docRef,
      deductibleFor,
      deductiblePercentage: deductiblePct,
      notes,
    });

    setDescription("");
    setAmount(0);
    setDocRef("");
    setNotes("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: 730 Tax & Landlord Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30">
                Modulo Fiscale Italiano 🇮🇹
              </span>
              <span className="text-xs text-slate-300">
                Normativa Art. 16 TUIR & Confedilizia
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              Resoconto Spese per Proprietario & Modello 730
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Resoconto per la dichiarazione dei redditi (Quadro E - Spese detraibili) per gli inquilini studenti/lavoratori e ripartizione spese tra <strong>Inquilino (Spese Ordinarie)</strong> e <strong>Proprietario (Spese Straordinarie / Ristrutturazioni)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportResoconto730PDF(houseInfo, inquilini, spese730, bollette)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Scarica Report PDF (730)
            </button>

            <button
              onClick={() => exportResocontoCSV(houseInfo, spese730, bollette)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Esporta CSV (Excel)
            </button>
          </div>
        </div>

        {/* Quick Tax Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-200 font-semibold block">
              Detrazione Canone Studenti 🎓
            </span>
            <span className="text-white font-extrabold text-sm block">
              € {(totalLocazione / 4).toFixed(2)} / inquilino
            </span>
            <p className="text-[11px] text-slate-300">
              Detrazione IRPEF 19% fino a un massimo di €2.633 all'anno a studente (Art.16 TUIR).
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-200 font-semibold block">
              Spese Ordinarie Inquilini 🏠
            </span>
            <span className="text-white font-extrabold text-sm block">
              € {totalOrdinaryCondo.toFixed(2)}
            </span>
            <p className="text-[11px] text-slate-300">
              Pulizia scale, ascensore quota consumo, utenze e manutenzione ordinaria caldaia.
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-200 font-semibold block">
              Spese Straordinarie Proprietario 🛠️
            </span>
            <span className="text-white font-extrabold text-sm block">
              € {totalExtraordinaryLandlord.toFixed(2)}
            </span>
            <p className="text-[11px] text-slate-300">
              Sostituzione caldaia, ristrutturazione facciata, valvole termostatiche (Bonus 50%).
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Add Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Filtra per Detrazione:</span>
          {(["Tutti", "Inquilino (730)", "Proprietario (Redditi)"] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === ft
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {ft}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIAssistant}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            Consulenza Fiscale AI
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Nuova Voce Fiscale
          </button>
        </div>
      </div>

      {/* New Spesa 730 Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
        >
          <h4 className="font-bold text-slate-900 text-sm">Aggiungi Voce per 730 / Proprietario</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Categoria Fiscale</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="Canone di Locazione (Detrazione Art.16 TUIR)">
                  Canone di Locazione (Detrazione Art. 16 TUIR per Studenti/Inquilini)
                </option>
                <option value="Spese Condominiali Ordinarie (Inquilino)">
                  Spese Condominiali Ordinarie (A carico Inquilini)
                </option>
                <option value="Spese Condominiali Straordinarie (Proprietario)">
                  Spese Condominiali Straordinarie (A carico Proprietario)
                </option>
                <option value="Ristrutturazione ed Efficientamento (Bonus 50%)">
                  Ristrutturazione ed Efficientamento (Bonus Casa 50% Proprietario)
                </option>
                <option value="Manutenzione Impianti e Caldaia">
                  Manutenzione Impianti e Caldaia (Bollino Blu)
                </option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Importo (€)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Es. 1800.00"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Descrizione Dettagliata</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Es. Sostituzione valvole termostatiche condominiali"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">A Carico Di</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="Inquilini">Inquilini</option>
                <option value="Proprietario">Proprietario</option>
                <option value="Singolo Inquilino">Singolo Inquilino</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Destinato A (Detrazione per)
              </label>
              <select
                value={deductibleFor}
                onChange={(e) => setDeductibleFor(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="Inquilino (730)">Inquilino (730 / Quadro E)</option>
                <option value="Proprietario (Redditi)">Proprietario (Modello Redditi)</option>
                <option value="Nessuna">Nessuna Detrazione</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Riferimento Documento</label>
              <input
                type="text"
                value={docRef}
                onChange={(e) => setDocRef(e.target.value)}
                placeholder="Es. Fattura n. 2025/881 con bonifico parlante"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Note Aggiuntive per il Commercialista</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. Spesa detraibile al 50% in 10 rate annue"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-xs hover:bg-slate-100 cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 cursor-pointer"
            >
              Salva Voce Fiscale
            </button>
          </div>
        </form>
      )}

      {/* Table of Fiscal Expenses */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">
            Prospetto Spese Fiscamente Rilevanti ({filteredSpese.length})
          </h4>
          <span className="text-xs text-slate-500">
            Immobile: {houseInfo.name} ({houseInfo.city})
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredSpese.map((spesa) => (
            <div key={spesa.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {spesa.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        spesa.deductibleFor.includes("Inquilino")
                          ? "bg-blue-100 text-blue-800"
                          : spesa.deductibleFor.includes("Proprietario")
                          ? "bg-amber-100 text-amber-900"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {spesa.deductibleFor} ({spesa.deductiblePercentage}%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{spesa.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Beneficiario: {spesa.recipient} | Doc: {spesa.documentRef || "N/A"}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 block">
                    € {spesa.amount.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">
                    Pagato da: <strong>{spesa.paidBy}</strong>
                  </span>
                </div>
              </div>

              {spesa.notes && (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 {spesa.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
