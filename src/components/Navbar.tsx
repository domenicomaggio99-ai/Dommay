import React from "react";
import {
  Home,
  Receipt,
  Sparkles,
  Wallet,
  FileCheck,
  Building2,
  User,
  ShieldCheck,
  Bot,
  Info,
} from "lucide-react";
import { HouseInfo, Inquilino } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  houseInfo: HouseInfo;
  inquilini: Inquilino[];
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  isProprietarioView: boolean;
  setIsProprietarioView: (val: boolean) => void;
  onOpenAIAssistant: () => void;
  pendingSwapsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  houseInfo,
  inquilini,
  currentUserId,
  setCurrentUserId,
  isProprietarioView,
  setIsProprietarioView,
  onOpenAIAssistant,
  pendingSwapsCount,
}) => {
  const currentUser = inquilini.find((i) => i.id === currentUserId) || inquilini[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner: Apartment info & User selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-xl tracking-wider">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                Convivo
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Modello Italiano 🇮🇹
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              {houseInfo.name} ({houseInfo.city})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Legal & Tax Assistant Button */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Assistente 730 & Legale</span>
            <span className="sm:hidden">Chiedi AI</span>
          </button>

          {/* Role View Mode Toggle */}
          <button
            onClick={() => setIsProprietarioView(!isProprietarioView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isProprietarioView
                ? "bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isProprietarioView ? "text-amber-600" : "text-slate-500"}`} />
            <span>{isProprietarioView ? "Vista Proprietario" : "Vista Inquilini"}</span>
          </button>

          {/* User Profile Selector */}
          {!isProprietarioView && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <User className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 border-none rounded-lg py-1.5 px-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {inquilini.map((inq) => (
                  <option key={inq.id} value={inq.id}>
                    {inq.name} ({inq.role === "Capocasa / Intestatario" ? "Capocasa" : "Stanza"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setActiveTab("panoramica")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "panoramica"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Home className="w-4 h-4" />
            Panoramica Casa
          </button>

          <button
            onClick={() => setActiveTab("bollette")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "bollette"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Bollette & Volture
          </button>

          <button
            onClick={() => setActiveTab("turni")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === "turni"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Turni & Differenziata
            {pendingSwapsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("fondo")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "fondo"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Fondo Cassa Spese
          </button>

          <button
            onClick={() => setActiveTab("resoconto730")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "resoconto730"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-700 hover:text-indigo-900 hover:bg-indigo-50 font-semibold"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Resoconto 730 & Proprietario
            <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded font-bold">
              PDF/CSV
            </span>
          </button>

          <button
            onClick={() => setActiveTab("regolamento")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "regolamento"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Info className="w-4 h-4" />
            Regolamento & Utili
          </button>
        </nav>
      </div>
    </header>
  );
};
