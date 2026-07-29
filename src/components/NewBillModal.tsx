import React, { useState } from "react";
import { X, Plus, Receipt, Zap } from "lucide-react";
import { Bolletta, Inquilino, UtilityType } from "../types";

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquilini: Inquilino[];
  currentUserId: string;
  onAddBill: (bill: Omit<Bolletta, "id" | "createdAt">) => void;
}

export const NewBillModal: React.FC<NewBillModalProps> = ({
  isOpen,
  onClose,
  inquilini,
  currentUserId,
  onAddBill,
}) => {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("Enel Energia");
  const [utilityType, setUtilityType] = useState<UtilityType>("Luce");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [period, setPeriod] = useState("Maggio - Giugno 2026");
  const [intestatarioId, setIntestatarioId] = useState(currentUserId);
  const [podPdrCode, setPodPdrCode] = useState("");
  const [quotaFissa, setQuotaFissa] = useState<number>(0);
  const [quotaConsumo, setQuotaConsumo] = useState<number>(0);
  const [splitMethod, setSplitMethod] = useState<"Uguale" | "Mq Stanza" | "Consumo Contatore">("Uguale");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || totalAmount <= 0) return;

    // Compute splits per roommate
    const numInquilini = inquilini.length || 1;
    const perPerson = totalAmount / numInquilini;

    const splits = inquilini.map((inq) => ({
      inquilinoId: inq.id,
      amount: perPerson,
      paid: inq.id === intestatarioId, // Intestatario paid it upfront
      paidDate: inq.id === intestatarioId ? new Date().toISOString().split("T")[0] : undefined,
    }));

    onAddBill({
      title,
      provider,
      utilityType,
      totalAmount,
      dueDate,
      period,
      status: "In Scadenza",
      intestatarioId,
      podPdrCode,
      quotaFissa,
      quotaConsumo,
      splitMethod,
      splits,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-400" /> Nuova Bolletta Casa
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Titolo Bolletta</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es. Bolletta Luce Luglio"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Fornitore Utenza</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="Es. Enel Energia, Plenitude, A2A"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo Utenza</label>
              <select
                value={utilityType}
                onChange={(e) => setUtilityType(e.target.value as UtilityType)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="Luce">Luce</option>
                <option value="Gas">Gas Metano</option>
                <option value="Wi-Fi">Wi-Fi Internet</option>
                <option value="TARI">TARI Rifiuti</option>
                <option value="Acqua">Acqua</option>
                <option value="Condominio">Condominio</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Importo Totale (€)</label>
              <input
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                placeholder="Es. 148.40"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Data Scadenza Pagamento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Intestatario della Bolletta</label>
              <select
                value={intestatarioId}
                onChange={(e) => setIntestatarioId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                {inquilini.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Codice POD / PDR (Opzionale)</label>
              <input
                type="text"
                value={podPdrCode}
                onChange={(e) => setPodPdrCode(e.target.value)}
                placeholder="Es. IT001E123456"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Periodo di Riferimento</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Es. Maggio - Giugno 2026"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Note o Dettagli per gli Inquilini</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Es. Quota fissa divisa in 4 parti uguali"
              className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold hover:bg-slate-100 cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 cursor-pointer"
            >
              Crea e Dividi Bolletta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
