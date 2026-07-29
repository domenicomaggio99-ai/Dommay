import React, { useState } from "react";
import {
  Wallet,
  ShoppingBag,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  Zap,
} from "lucide-react";
import { SpesaFondoCassa, Inquilino } from "../types";

interface FondoCassaTabProps {
  fondoCassa: SpesaFondoCassa[];
  inquilini: Inquilino[];
  currentUserId: string;
  onAddSpesaCassa: (spesa: Omit<SpesaFondoCassa, "id">) => void;
  onOpenAIBillScanner: () => void;
}

export const FondoCassaTab: React.FC<FondoCassaTabProps> = ({
  fondoCassa,
  inquilini,
  currentUserId,
  onAddSpesaCassa,
  onOpenAIBillScanner,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<
    "Pulizia Casa" | "Cucina & Spezie" | "Manutenzione Minore" | "Spazzatura" | "Altro"
  >("Pulizia Casa");
  const [supermarket, setSupermarket] = useState("");

  const totalSpent = fondoCassa.reduce((acc, f) => acc + f.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    onAddSpesaCassa({
      title,
      amount,
      buyerId: currentUserId,
      date: new Date().toISOString().split("T")[0],
      category,
      supermarket: supermarket || "Supermercato",
      sharedWithIds: inquilini.map((i) => i.id),
    });

    setTitle("");
    setAmount(0);
    setSupermarket("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Metric */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Fondo Cassa Spese Comuni
            </span>
          </div>
          <h3 className="text-2xl font-black">Cassa Casa & Spesa Condivisa</h3>
          <p className="text-xs text-emerald-200 leading-relaxed">
            Acquisti di gruppo per prodotti di pulizia, spezie, olio, lampadine e materiale per la casa. Il costo viene suddiviso automaticamente tra tutti gli inquilini.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1 min-w-[200px]">
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">
            Totale Speso Fondo Cassa
          </span>
          <div className="text-3xl font-black text-white">€ {totalSpent.toFixed(2)}</div>
          <span className="text-[11px] text-emerald-300 block">
            Quota pro-capite: € {(totalSpent / (inquilini.length || 1)).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          Registro Spese Comuni ({fondoCassa.length})
        </h4>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIBillScanner}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            📷 Scansiona Scontrino AI
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Aggiungi Spesa
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
        >
          <h4 className="font-bold text-slate-900 text-sm">Registra Spesa Comune</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Descrizione Prodotti</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es. Carta igienica 12x + Detersivo"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Importo Scontrino (€)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Es. 18.50"
                required
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="Pulizia Casa">Pulizia Casa</option>
                <option value="Cucina & Spezie">Cucina & Spezie</option>
                <option value="Manutenzione Minore">Manutenzione Minore</option>
                <option value="Spazzatura">Spazzatura</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Supermercato / Negozio</label>
              <input
                type="text"
                value={supermarket}
                onChange={(e) => setSupermarket(e.target.value)}
                placeholder="Es. Esselunga, Conad, Coop"
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
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 cursor-pointer"
            >
              Salva in Cassa
            </button>
          </div>
        </form>
      )}

      {/* Spese List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fondoCassa.map((spesa) => {
          const buyer = inquilini.find((i) => i.id === spesa.buyerId);
          const perPerson = spesa.amount / (spesa.sharedWithIds.length || 1);

          return (
            <div
              key={spesa.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{spesa.title}</h4>
                  <p className="text-xs text-slate-500">
                    Acquistato da: <strong>{buyer?.name}</strong> • {spesa.supermarket || "Negozio"}
                  </p>
                </div>

                <span className="text-base font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  € {spesa.amount.toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-500">Quota a testa (4 inquilini):</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  € {perPerson.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                <span>Categoria: {spesa.category}</span>
                <span>Data: {new Date(spesa.date).toLocaleDateString("it-IT")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
