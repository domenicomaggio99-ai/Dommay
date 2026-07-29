import React, { useState } from "react";
import {
  Receipt,
  Zap,
  Flame,
  Wifi,
  Trash2,
  Droplets,
  Building,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Gauge,
  FileCheck,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  Bolletta,
  Inquilino,
  VolturaSubentro,
  ContatoreLettura,
  UtilityType,
} from "../types";

interface BolletteVoltureTabProps {
  bollette: Bolletta[];
  volture: VolturaSubentro[];
  letture: ContatoreLettura[];
  inquilini: Inquilino[];
  currentUserId: string;
  onOpenNewBillModal: () => void;
  onOpenAIBillScanner: () => void;
  onToggleSplitPaid: (billId: string, inquilinoId: string) => void;
  onAddLettura: (lettura: Omit<ContatoreLettura, "id">) => void;
  onAddVoltura: (voltura: Omit<VolturaSubentro, "id">) => void;
}

export const BolletteVoltureTab: React.FC<BolletteVoltureTabProps> = ({
  bollette,
  volture,
  letture,
  inquilini,
  currentUserId,
  onOpenNewBillModal,
  onOpenAIBillScanner,
  onToggleSplitPaid,
  onAddLettura,
  onAddVoltura,
}) => {
  const [subTab, setSubTab] = useState<"bollette" | "volture" | "letture">("bollette");

  // Form states for new Lettura
  const [showLetturaForm, setShowLetturaForm] = useState(false);
  const [newLetturaType, setNewLetturaType] = useState<"Luce" | "Gas" | "Acqua">("Luce");
  const [newLetturaVal, setNewLetturaVal] = useState<number>(0);
  const [newLetturaNotes, setNewLetturaNotes] = useState<string>("");

  // Form states for new Voltura
  const [showVolturaForm, setShowVolturaForm] = useState(false);
  const [vType, setVType] = useState<UtilityType>("Luce");
  const [vProvider, setVProvider] = useState("Enel Energia");
  const [vOld, setVOld] = useState("");
  const [vNew, setVNew] = useState("Marco Rossi");
  const [vCost, setVCost] = useState<number>(58.5);

  const getUtilityIcon = (type: UtilityType) => {
    switch (type) {
      case "Luce":
        return <Zap className="w-5 h-5 text-amber-500" />;
      case "Gas":
        return <Flame className="w-5 h-5 text-orange-500" />;
      case "Wi-Fi":
        return <Wifi className="w-5 h-5 text-blue-500" />;
      case "TARI":
        return <Trash2 className="w-5 h-5 text-emerald-500" />;
      case "Acqua":
        return <Droplets className="w-5 h-5 text-cyan-500" />;
      default:
        return <Building className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleCreateLettura = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLetturaVal <= 0) return;

    const currentUser = inquilini.find((i) => i.id === currentUserId);
    const unit = newLetturaType === "Luce" ? "kWh" : newLetturaType === "Gas" ? "Sm3" : "m³";

    onAddLettura({
      utilityType: newLetturaType,
      readingDate: new Date().toISOString().split("T")[0],
      value: newLetturaVal,
      unit,
      recordedBy: currentUser?.name || "Inquilino",
      notes: newLetturaNotes,
    });

    setShowLetturaForm(false);
    setNewLetturaVal(0);
    setNewLetturaNotes("");
  };

  const handleCreateVoltura = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVoltura({
      utilityType: vType,
      provider: vProvider,
      previousHeader: vOld || "Ex Inquilino",
      newHeader: vNew,
      date: new Date().toISOString().split("T")[0],
      cost: vCost,
      status: "In Corso",
      documents: ["Carta d'Identità", "Codice Fiscale", "Contratto Locazione"],
      notes: "Subentro richiesto per aggiornamento intestazione.",
    });

    setShowVolturaForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex space-x-2">
          <button
            onClick={() => setSubTab("bollette")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === "bollette"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Bollette Attive ({bollette.length})
          </button>

          <button
            onClick={() => setSubTab("volture")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === "volture"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-500" />
            Volture & Subenti ({volture.length})
          </button>

          <button
            onClick={() => setSubTab("letture")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === "letture"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Gauge className="w-4 h-4 text-blue-500" />
            Contatori & Letture
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIBillScanner}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Analizza Bolletta AI
          </button>

          {subTab === "bollette" && (
            <button
              onClick={onOpenNewBillModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuova Bolletta
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BOLLETTE */}
      {subTab === "bollette" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bollette.map((bill) => {
              const intestatario = inquilini.find((i) => i.id === bill.intestatarioId);

              return (
                <div
                  key={bill.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                >
                  {/* Bill Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-slate-100">
                        {getUtilityIcon(bill.utilityType)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{bill.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{bill.provider}</p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        bill.status === "Pagata"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : bill.status === "In Scadenza"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>

                  {/* Amounts & Periods */}
                  <div className="p-3.5 bg-slate-50 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Importo Totale</span>
                      <span className="text-slate-900 font-black text-base">
                        € {bill.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Scadenza</span>
                      <span className="text-slate-800 font-bold">
                        {new Date(bill.dueDate).toLocaleDateString("it-IT")}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-slate-400 font-medium block">Intestatario</span>
                      <span className="text-blue-700 font-bold truncate block">
                        {intestatario?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Italian Specifics: POD/PDR & Quota Fissa vs Consumo */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-y border-slate-100 py-2">
                    {bill.podPdrCode && (
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Codice: {bill.podPdrCode}
                      </span>
                    )}
                    {bill.quotaFissa !== undefined && bill.quotaConsumo !== undefined && (
                      <span className="text-[11px]">
                        Quota fissa: €{bill.quotaFissa.toFixed(2)} | Consumo: €
                        {bill.quotaConsumo.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Roommate Quote Breakdown */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Ripartizione Quote ({bill.splitMethod}):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {bill.splits.map((s) => {
                        const roommate = inquilini.find((i) => i.id === s.inquilinoId);
                        const isPaid = s.paid;

                        return (
                          <div
                            key={s.inquilinoId}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                              isPaid
                                ? "bg-emerald-50/60 border-emerald-200"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: roommate?.color || "#94a3b8" }}
                              ></span>
                              <span className="font-bold text-slate-800">{roommate?.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">
                                € {s.amount.toFixed(2)}
                              </span>

                              <button
                                onClick={() => onToggleSplitPaid(bill.id, s.inquilinoId)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  isPaid
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                                }`}
                              >
                                {isPaid ? "Pagato ✓" : "Segna Pagato"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {bill.notes && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                      💡 {bill.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: VOLTURE & SUBENTRI */}
      {subTab === "volture" && (
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                Gestione Volture, Subentri e Cambi Intestatario Utenze
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                In Italia, quando un inquilino subentra in un appartamento, le bollette (Luce, Gas, TARI) vanno volturate. Il costo standard della voltura (circa €58,50 per la luce e €49 per il gas) può essere diviso equamente tra chi subentra e la casa.
              </p>
            </div>

            <button
              onClick={() => setShowVolturaForm(!showVolturaForm)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {showVolturaForm ? "Chiudi Modulo" : "+ Nuova Voltura / Subentro"}
            </button>
          </div>

          {showVolturaForm && (
            <form
              onSubmit={handleCreateVoltura}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm"
            >
              <h4 className="font-bold text-slate-900 text-sm">Registra Richiesta Voltura</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo Utenza</label>
                  <select
                    value={vType}
                    onChange={(e) => setVType(e.target.value as UtilityType)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="Luce">Luce (Elettricità)</option>
                    <option value="Gas">Gas Metano</option>
                    <option value="Wi-Fi">Internet Wi-Fi</option>
                    <option value="TARI">TARI Rifiuti</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fornitore</label>
                  <input
                    type="text"
                    value={vProvider}
                    onChange={(e) => setVProvider(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vecchio Intestatario</label>
                  <input
                    type="text"
                    value={vOld}
                    onChange={(e) => setVOld(e.target.value)}
                    placeholder="Es. Ex Inquilino Luca Neri"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nuovo Intestatario</label>
                  <input
                    type="text"
                    value={vNew}
                    onChange={(e) => setVNew(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 cursor-pointer"
                >
                  Salva Voltura
                </button>
              </div>
            </form>
          )}

          {/* Volture List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volture.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getUtilityIcon(v.utilityType)}
                    <span className="font-bold text-slate-900 text-sm">
                      Voltura {v.utilityType} - {v.provider}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {v.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Da (Vecchio Intestatario):</span>
                    <span className="font-semibold text-slate-800">{v.previousHeader}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">A (Nuovo Intestatario):</span>
                    <span className="font-bold text-blue-700">{v.newHeader}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1">
                    <span className="text-slate-500">Costo Pratica + Marca da Bollo:</span>
                    <span className="font-black text-slate-900">€ {v.cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Documenti Necessari:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {v.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {v.notes && <p className="text-xs text-slate-500 italic">💡 {v.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LETTURE CONTATORI */}
      {subTab === "letture" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                Registro Autoletture Contatori (Luce, Gas, Acqua)
              </h4>
              <p className="text-xs text-slate-500">
                L'autolettura evita i conguagli stimati e ti fa pagare solo i consumi reali.
              </p>
            </div>

            <button
              onClick={() => setShowLetturaForm(!showLetturaForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {showLetturaForm ? "Chiudi Modulo" : "+ Nuova Autolettura"}
            </button>
          </div>

          {showLetturaForm && (
            <form
              onSubmit={handleCreateLettura}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm"
            >
              <h4 className="font-bold text-slate-900 text-sm">Inserisci Lettura Contatore</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contatore</label>
                  <select
                    value={newLetturaType}
                    onChange={(e) => setNewLetturaType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="Luce">Luce (kWh)</option>
                    <option value="Gas">Gas Metano (Sm3)</option>
                    <option value="Acqua">Acqua (m³)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Valore Numerico</label>
                  <input
                    type="number"
                    value={newLetturaVal}
                    onChange={(e) => setNewLetturaVal(Number(e.target.value))}
                    placeholder="Es. 14520"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Note / Foto</label>
                  <input
                    type="text"
                    value={newLetturaNotes}
                    onChange={(e) => setNewLetturaNotes(e.target.value)}
                    placeholder="Es. Lettura contatore di inizio mese"
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Salva Autolettura
              </button>
            </form>
          )}

          {/* Letture Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {letture.map((letItem) => (
              <div
                key={letItem.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {letItem.utilityType === "Luce" ? (
                      <Zap className="w-4 h-4 text-amber-500" />
                    ) : letItem.utilityType === "Gas" ? (
                      <Flame className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Droplets className="w-4 h-4 text-cyan-500" />
                    )}
                    Contatore {letItem.utilityType}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(letItem.readingDate).toLocaleDateString("it-IT")}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl text-center space-y-1">
                  <div className="text-3xl font-black text-slate-900">
                    {letItem.value}{" "}
                    <span className="text-sm font-semibold text-slate-500">{letItem.unit}</span>
                  </div>
                  <span className="text-xs text-slate-500 block">
                    Registrata da: <strong>{letItem.recordedBy}</strong>
                  </span>
                </div>

                {letItem.notes && <p className="text-xs text-slate-500">💡 {letItem.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
