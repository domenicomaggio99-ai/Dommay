import React, { useState } from "react";
import {
  Receipt,
  Sparkles,
  Wallet,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  Zap,
  Building2,
} from "lucide-react";
import {
  Bolletta,
  Inquilino,
  TurnoPulizia,
  WasteScheduleItem,
  SpesaFondoCassa,
  HouseInfo,
} from "../types";

interface PanoramicaTabProps {
  houseInfo: HouseInfo;
  inquilini: Inquilino[];
  bollette: Bolletta[];
  turni: TurnoPulizia[];
  wasteSchedule: WasteScheduleItem[];
  fondoCassa: SpesaFondoCassa[];
  currentUserId: string;
  onNavigateToTab: (tab: string) => void;
  onOpenNewBillModal: () => void;
  onOpenAIBillScanner: () => void;
  onToggleTurnoComplete: (id: string) => void;
  onSettleDebt: (fromInquilinoId: string, toInquilinoId: string, amount: number) => void;
}

export const PanoramicaTab: React.FC<PanoramicaTabProps> = ({
  houseInfo,
  inquilini,
  bollette,
  turni,
  wasteSchedule,
  fondoCassa,
  currentUserId,
  onNavigateToTab,
  onOpenNewBillModal,
  onOpenAIBillScanner,
  onToggleTurnoComplete,
  onSettleDebt,
}) => {
  const currentUser = inquilini.find((i) => i.id === currentUserId) || inquilini[0];
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [selectedSettle, setSelectedSettle] = useState<{
    toUser: Inquilino;
    amount: number;
  } | null>(null);

  // Compute total cassa balance
  const totalCassa = fondoCassa.reduce((acc, f) => acc + f.amount, 0);

  // Calculate Net Debts/Credits matrix among roommates
  // Map of userId -> netBalance (positive = is owed money, negative = owes money)
  const balances: Record<string, number> = {};
  inquilini.forEach((inq) => (balances[inq.id] = 0));

  // 1. Calculate from Bills
  bollette.forEach((bill) => {
    const payerId = bill.intestatarioId;
    bill.splits.forEach((split) => {
      if (!split.paid && split.inquilinoId !== payerId) {
        // split.inquilinoId owes payerId
        balances[split.inquilinoId] -= split.amount;
        balances[payerId] += split.amount;
      }
    });
  });

  // 2. Calculate from Fondo Cassa expenses
  fondoCassa.forEach((exp) => {
    const buyerId = exp.buyerId;
    const shareCount = exp.sharedWithIds.length || 1;
    const perPersonShare = exp.amount / shareCount;

    exp.sharedWithIds.forEach((sharedUser) => {
      if (sharedUser !== buyerId) {
        balances[sharedUser] -= perPersonShare;
        balances[buyerId] += perPersonShare;
      }
    });
  });

  // Today waste collection item (mocking current day in Italy)
  const currentDayName = "Martedì"; // Can match current day
  const todayWaste = wasteSchedule.find((w) => w.dayName === currentDayName);

  // Upcoming unpaid bills
  const unpaidBills = bollette.filter((b) => b.status !== "Pagata");

  // Turni progress
  const completedTurni = turni.filter((t) => t.completed).length;
  const turniProgress = turni.length > 0 ? Math.round((completedTurni / turni.length) * 100) : 0;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(type);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  return (
    <div className="space-[#1e293b] space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Building2 className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/30 text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-400/30">
              Co-Living Italia
            </span>
            <span className="text-xs text-slate-300">
              Contratto: <strong className="text-white">{houseInfo.contractType}</strong>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ciao, {currentUser.name}! 👋
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Gestisci in armonia le bollette della casa, i subentri delle utenze, il calendario della differenziata e la preparazione del <strong>Modello 730</strong> per il proprietario e gli inquilini.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenNewBillModal}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              Nuova Bolletta
            </button>

            <button
              onClick={onOpenAIBillScanner}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Scansiona Bolletta / Scontrino AI
            </button>

            <button
              onClick={() => onNavigateToTab("resoconto730")}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              Scarica Report 730 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Il Tuo Saldo
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                balances[currentUser.id] >= 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {balances[currentUser.id] >= 0 ? (
                <ArrowDownLeft className="w-5 h-5" />
              ) : (
                <ArrowUpRight className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-black ${
                balances[currentUser.id] >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {balances[currentUser.id] >= 0 ? "+" : ""}
              € {balances[currentUser.id].toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {balances[currentUser.id] > 0
                ? "Devi ricevere dai tuoi conviventi"
                : balances[currentUser.id] < 0
                ? "Hai quote da saldare in casa"
                : "Sei perfettamente in pari!"}
            </p>
          </div>
        </div>

        {/* Card 2: Unpaid Bills */}
        <div
          onClick={() => onNavigateToTab("bollette")}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bollette da Saldare
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {unpaidBills.length} <span className="text-sm font-normal text-slate-500">bollette</span>
            </div>
            <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Totale da pagare: €{" "}
              {unpaidBills.reduce((a, b) => a + b.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Card 3: Cleaning Progress */}
        <div
          onClick={() => onNavigateToTab("turni")}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pulizie Settimana
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {turniProgress}% <span className="text-xs font-normal text-slate-500">completate</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${turniProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4: Waste Tonight */}
        <div
          onClick={() => onNavigateToTab("turni")}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Differenziata Stasera
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 line-clamp-1">
              {todayWaste?.types.join(" + ") || "Nessuna stasera"}
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {todayWaste?.timeSlot || "Controlla il calendario"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Balances & Urgent Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Roommate Debt/Credit Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Resoconto Saldi Tra Inquilini (Chi deve a chi)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calcolo automatico basato su quote bollette e spese cassa comune.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {inquilini.map((inq) => {
              const net = balances[inq.id] || 0;
              const isCurrentUser = inq.id === currentUserId;

              return (
                <div
                  key={inq.id}
                  className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
                    isCurrentUser
                      ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-200"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={inq.avatar}
                      alt={inq.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Tu
                          </span>
                        )}
                        <span className="text-xs text-slate-500">({inq.role})</span>
                      </div>
                      <p className="text-xs text-slate-500">{inq.room}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div
                        className={`font-black text-sm sm:text-base ${
                          net > 0
                            ? "text-emerald-600"
                            : net < 0
                            ? "text-rose-600"
                            : "text-slate-500"
                        }`}
                      >
                        {net > 0 ? "+" : ""}€ {net.toFixed(2)}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {net > 0 ? "In credito" : net < 0 ? "In debito" : "In pari"}
                      </span>
                    </div>

                    {/* Settle button if in debt to someone or if current user owes */}
                    {!isCurrentUser && net > 0 && balances[currentUserId] < 0 && (
                      <button
                        onClick={() => setSelectedSettle({ toUser: inq, amount: Math.abs(net) })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Salda Ora
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Satispay / IBAN Pay Modal */}
          {selectedSettle && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Salda Quota a {selectedSettle.toUser.name}
                </h4>
                <button
                  onClick={() => setSelectedSettle(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Chiudi
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedSettle.toUser.satispayTag && (
                  <div className="p-3 bg-white/10 rounded-lg space-y-1.5">
                    <span className="text-slate-300 font-medium">Satispay Tag:</span>
                    <div className="flex items-center justify-between font-mono font-bold text-emerald-300">
                      <span>{selectedSettle.toUser.satispayTag}</span>
                      <button
                        onClick={() => copyToClipboard(selectedSettle.toUser.satispayTag || "", "satispay")}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {copiedIban === "satispay" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                {selectedSettle.toUser.iban && (
                  <div className="p-3 bg-white/10 rounded-lg space-y-1.5">
                    <span className="text-slate-300 font-medium">IBAN Bonifico:</span>
                    <div className="flex items-center justify-between font-mono font-bold text-blue-300 text-[11px] truncate">
                      <span className="truncate">{selectedSettle.toUser.iban}</span>
                      <button
                        onClick={() => copyToClipboard(selectedSettle.toUser.iban || "", "iban")}
                        className="p-1 hover:bg-white/20 rounded ml-1"
                      >
                        {copiedIban === "iban" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onSettleDebt(currentUserId, selectedSettle.toUser.id, selectedSettle.amount);
                  setSelectedSettle(null);
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Segna come Saldato nel Registro Casa
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Active Bills in Scadenza & House Info */}
        <div className="space-y-6">
          {/* Bills Alert Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Bollette in Scadenza
              </h3>
              <button
                onClick={() => onNavigateToTab("bollette")}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Vedi tutte ({bollette.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {unpaidBills.slice(0, 3).map((bill) => {
                const intestatario = inquilini.find((i) => i.id === bill.intestatarioId);
                return (
                  <div
                    key={bill.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{bill.title}</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        € {bill.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Intestato a: {intestatario?.name || "Casa"}</span>
                      <span className="text-amber-700 font-semibold">
                        Scade: {new Date(bill.dueDate).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick House Regolamento Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              📌 Utilità Casa Navigli
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-medium text-slate-500">Wi-Fi:</span>
                <span className="font-mono font-bold text-slate-800">{houseInfo.wifiSsid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-medium text-slate-500">Password:</span>
                <span className="font-mono font-bold text-slate-800">{houseInfo.wifiPass}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-medium text-slate-500">Orari Silenzio:</span>
                <span className="font-semibold text-slate-800">{houseInfo.quietHours}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-500">Proprietario:</span>
                <span className="font-semibold text-slate-800">{houseInfo.landlordName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
