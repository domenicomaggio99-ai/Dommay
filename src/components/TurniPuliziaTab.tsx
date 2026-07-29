import React, { useState } from "react";
import {
  Sparkles,
  Trash2,
  CheckCircle2,
  ArrowRightLeft,
  Calendar,
  Clock,
  UserCheck,
  Send,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import {
  TurnoPulizia,
  WasteScheduleItem,
  ShiftSwapRequest,
  Inquilino,
} from "../types";

interface TurniPuliziaTabProps {
  turni: TurnoPulizia[];
  wasteSchedule: WasteScheduleItem[];
  swaps: ShiftSwapRequest[];
  inquilini: Inquilino[];
  currentUserId: string;
  onToggleTurnoComplete: (id: string) => void;
  onRequestSwap: (swap: Omit<ShiftSwapRequest, "id">) => void;
  onRespondSwap: (swapId: string, accept: boolean) => void;
}

export const TurniPuliziaTab: React.FC<TurniPuliziaTabProps> = ({
  turni,
  wasteSchedule,
  swaps,
  inquilini,
  currentUserId,
  onToggleTurnoComplete,
  onRequestSwap,
  onRespondSwap,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"turni" | "differenziata" | "scambi">("turni");
  const [selectedTurnoForSwap, setSelectedTurnoForSwap] = useState<TurnoPulizia | null>(null);
  const [swapTargetId, setSwapTargetId] = useState<string>("");
  const [swapReason, setSwapReason] = useState<string>("");

  const currentUser = inquilini.find((i) => i.id === currentUserId) || inquilini[0];

  const handleSendSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurnoForSwap || !swapTargetId) return;

    onRequestSwap({
      cleaningId: selectedTurnoForSwap.id,
      requesterId: currentUserId,
      targetId: swapTargetId,
      status: "In Attesa",
      reason: swapReason || "Chiedo gentilmente uno scambio per impegni accademici/lavorativi.",
      date: new Date().toISOString().split("T")[0],
    });

    setSelectedTurnoForSwap(null);
    setSwapReason("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab("turni")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "turni"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Turni Pulizia Settimanali
          </button>

          <button
            onClick={() => setActiveSubTab("differenziata")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "differenziata"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Trash2 className="w-4 h-4 text-emerald-500" />
            Calendario Differenziata Italia
          </button>

          <button
            onClick={() => setActiveSubTab("scambi")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeSubTab === "scambi"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            Richieste Scambio ({swaps.length})
            {swaps.some((s) => s.status === "In Attesa") && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TURNI DI PULIZIA */}
      {activeSubTab === "turni" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {turni.map((t) => {
              const assignee = inquilini.find((i) => i.id === t.assignedToId);
              const isAssignedToMe = t.assignedToId === currentUserId;

              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs transition-all space-y-4 ${
                    t.completed
                      ? "border-emerald-200 bg-emerald-50/20"
                      : isAssignedToMe
                      ? "border-blue-300 ring-2 ring-blue-400/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                        style={{ backgroundColor: assignee?.color || "#2563eb" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{t.zone}</h4>
                        <p className="text-xs text-slate-500">
                          Assegnato a: <strong>{assignee?.name}</strong>{" "}
                          {isAssignedToMe && "(Tu)"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        t.completed
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                    >
                      {t.completed ? "Pulito ✓" : "Da Pulire"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    📋 <strong>Istruzioni:</strong> {t.notes}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Entro: {new Date(t.dueDate).toLocaleDateString("it-IT")}
                    </span>

                    <div className="flex items-center gap-2">
                      {!t.completed && isAssignedToMe && (
                        <button
                          onClick={() => setSelectedTurnoForSwap(t)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          🔄 Chiedi Scambio
                        </button>
                      )}

                      <button
                        onClick={() => onToggleTurnoComplete(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          t.completed
                            ? "bg-emerald-600 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {t.completed ? "Ripristina" : "Segna Pulito ✓"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swap Modal Form */}
          {selectedTurnoForSwap && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-bold text-slate-900 text-base">
                    Richiedi Scambio Turno: {selectedTurnoForSwap.zone}
                  </h4>
                  <button
                    onClick={() => setSelectedTurnoForSwap(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSendSwap} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Scegli Inquilino a cui chiedere il cambio:
                    </label>
                    <select
                      value={swapTargetId}
                      onChange={(e) => setSwapTargetId(e.target.value)}
                      required
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                    >
                      <option value="">-- Seleziona Inquilino --</option>
                      {inquilini
                        .filter((i) => i.id !== currentUserId)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.room})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Motivazione (es. Esame o Turno di Lavoro):
                    </label>
                    <textarea
                      value={swapReason}
                      onChange={(e) => setSwapReason(e.target.value)}
                      rows={3}
                      placeholder="Spiega brevemente il motivo dello scambio..."
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTurnoForSwap(null)}
                      className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 cursor-pointer"
                    >
                      Invia Richiesta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CALENDARIO DIFFERENZIATA ITALIA */}
      {activeSubTab === "differenziata" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 shadow-md">
            <h4 className="font-bold text-base flex items-center gap-2 text-emerald-400">
              <Trash2 className="w-5 h-5" />
              Calendario Raccolta Differenziata Comunale (Modello Italia / AMSA)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Italia le multe per errata differenziata sono elevate! Segui il calendario della casa per l'esposizione serale dei bidoni in cortile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wasteSchedule.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-slate-900 text-base">{w.dayName}</span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {w.timeSlot}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Frazioni da Esporre:
                  </span>
                  {w.types.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Nessuna raccolta prevista</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {w.types.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg text-white shadow-2xs"
                          style={{
                            backgroundColor:
                              t.includes("Organico")
                                ? "#15803d" // green
                                : t.includes("Carta")
                                ? "#2563eb" // blue
                                : t.includes("Plastica")
                                ? "#eab308" // yellow
                                : t.includes("Vetro")
                                ? "#0284c7" // cyan
                                : "#4b5563", // gray
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 {w.instructions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RICHIESTE SCAMBIO TURNO */}
      {activeSubTab === "scambi" && (
        <div className="space-y-4">
          {swaps.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
              Nessuna richiesta di scambio al momento.
            </div>
          ) : (
            <div className="space-y-3">
              {swaps.map((s) => {
                const reqUser = inquilini.find((i) => i.id === s.requesterId);
                const targetUser = inquilini.find((i) => i.id === s.targetId);
                const turno = turni.find((t) => t.id === s.cleaningId);

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {reqUser?.name} ➔ {targetUser?.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold ${
                            s.status === "Accettata"
                              ? "bg-emerald-100 text-emerald-800"
                              : s.status === "Rifiutata"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Zona: <strong>{turno?.zone}</strong> | Data: {s.date}
                      </p>
                      <p className="text-xs text-slate-500 italic">"{s.reason}"</p>
                    </div>

                    {s.status === "In Attesa" && s.targetId === currentUserId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRespondSwap(s.id, false)}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Rifiuta
                        </button>
                        <button
                          onClick={() => onRespondSwap(s.id, true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Accetta Scambio
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
