import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { PanoramicaTab } from "./components/PanoramicaTab";
import { BolletteVoltureTab } from "./components/BolletteVoltureTab";
import { TurniPuliziaTab } from "./components/TurniPuliziaTab";
import { FondoCassaTab } from "./components/FondoCassaTab";
import { Resoconto730Tab } from "./components/Resoconto730Tab";
import { RegolamentoTab } from "./components/RegolamentoTab";
import { Assistente730Modal } from "./components/Assistente730Modal";
import { AIBillScannerModal } from "./components/AIBillScannerModal";
import { NewBillModal } from "./components/NewBillModal";

import {
  initialHouseInfo,
  initialInquilini,
  initialBollette,
  initialVolture,
  initialLetture,
  initialTurni,
  initialWasteSchedule,
  initialSwaps,
  initialFondoCassa,
  initialSpese730,
} from "./data/mockData";

import {
  Bolletta,
  VolturaSubentro,
  ContatoreLettura,
  TurnoPulizia,
  ShiftSwapRequest,
  SpesaFondoCassa,
  Spesa730,
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("panoramica");
  const [currentUserId, setCurrentUserId] = useState("inq-1"); // Marco Rossi by default
  const [isProprietarioView, setIsProprietarioView] = useState(false);

  // Modals
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAIBillScannerOpen, setIsAIBillScannerOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);

  // Persistent State with localStorage
  const [houseInfo] = useState(initialHouseInfo);
  const [inquilini] = useState(initialInquilini);

  const [bollette, setBollette] = useState<Bolletta[]>(() => {
    const saved = localStorage.getItem("convivo_bollette");
    return saved ? JSON.parse(saved) : initialBollette;
  });

  const [volture, setVolture] = useState<VolturaSubentro[]>(() => {
    const saved = localStorage.getItem("convivo_volture");
    return saved ? JSON.parse(saved) : initialVolture;
  });

  const [letture, setLetture] = useState<ContatoreLettura[]>(() => {
    const saved = localStorage.getItem("convivo_letture");
    return saved ? JSON.parse(saved) : initialLetture;
  });

  const [turni, setTurni] = useState<TurnoPulizia[]>(() => {
    const saved = localStorage.getItem("convivo_turni");
    return saved ? JSON.parse(saved) : initialTurni;
  });

  const [wasteSchedule] = useState(initialWasteSchedule);

  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>(() => {
    const saved = localStorage.getItem("convivo_swaps");
    return saved ? JSON.parse(saved) : initialSwaps;
  });

  const [fondoCassa, setFondoCassa] = useState<SpesaFondoCassa[]>(() => {
    const saved = localStorage.getItem("convivo_fondo_cassa");
    return saved ? JSON.parse(saved) : initialFondoCassa;
  });

  const [spese730, setSpese730] = useState<Spesa730[]>(() => {
    const saved = localStorage.getItem("convivo_spese_730");
    return saved ? JSON.parse(saved) : initialSpese730;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("convivo_bollette", JSON.stringify(bollette));
  }, [bollette]);

  useEffect(() => {
    localStorage.setItem("convivo_volture", JSON.stringify(volture));
  }, [volture]);

  useEffect(() => {
    localStorage.setItem("convivo_letture", JSON.stringify(letture));
  }, [letture]);

  useEffect(() => {
    localStorage.setItem("convivo_turni", JSON.stringify(turni));
  }, [turni]);

  useEffect(() => {
    localStorage.setItem("convivo_swaps", JSON.stringify(swaps));
  }, [swaps]);

  useEffect(() => {
    localStorage.setItem("convivo_fondo_cassa", JSON.stringify(fondoCassa));
  }, [fondoCassa]);

  useEffect(() => {
    localStorage.setItem("convivo_spese_730", JSON.stringify(spese730));
  }, [spese730]);

  // Handlers
  const handleAddBill = (newBill: Omit<Bolletta, "id" | "createdAt">) => {
    const bill: Bolletta = {
      ...newBill,
      id: `bol-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBollette((prev) => [bill, ...prev]);
  };

  const handleToggleSplitPaid = (billId: string, inquilinoId: string) => {
    setBollette((prev) =>
      prev.map((b) => {
        if (b.id !== billId) return b;
        const updatedSplits = b.splits.map((s) => {
          if (s.inquilinoId !== inquilinoId) return s;
          const nextPaid = !s.paid;
          return {
            ...s,
            paid: nextPaid,
            paidDate: nextPaid ? new Date().toISOString().split("T")[0] : undefined,
          };
        });

        const allPaid = updatedSplits.every((s) => s.paid);
        return {
          ...b,
          splits: updatedSplits,
          status: allPaid ? "Pagata" : "In Scadenza",
        };
      })
    );
  };

  const handleAddLettura = (newLettura: Omit<ContatoreLettura, "id">) => {
    const item: ContatoreLettura = {
      ...newLettura,
      id: `let-${Date.now()}`,
    };
    setLetture((prev) => [item, ...prev]);
  };

  const handleAddVoltura = (newVoltura: Omit<VolturaSubentro, "id">) => {
    const item: VolturaSubentro = {
      ...newVoltura,
      id: `vol-${Date.now()}`,
    };
    setVolture((prev) => [item, ...prev]);
  };

  const handleToggleTurnoComplete = (turnoId: string) => {
    setTurni((prev) =>
      prev.map((t) => {
        if (t.id !== turnoId) return t;
        const nextComp = !t.completed;
        return {
          ...t,
          completed: nextComp,
          completedAt: nextComp ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const handleRequestSwap = (newSwap: Omit<ShiftSwapRequest, "id">) => {
    const item: ShiftSwapRequest = {
      ...newSwap,
      id: `sw-${Date.now()}`,
    };
    setSwaps((prev) => [item, ...prev]);
  };

  const handleRespondSwap = (swapId: string, accept: boolean) => {
    setSwaps((prev) =>
      prev.map((s) => {
        if (s.id !== swapId) return s;
        return {
          ...s,
          status: accept ? "Accettata" : "Rifiutata",
        };
      })
    );

    if (accept) {
      const targetSwap = swaps.find((s) => s.id === swapId);
      if (targetSwap) {
        setTurni((prev) =>
          prev.map((t) => {
            if (t.id !== targetSwap.cleaningId) return t;
            return {
              ...t,
              assignedToId: targetSwap.targetId,
            };
          })
        );
      }
    }
  };

  const handleAddSpesaCassa = (newSpesa: Omit<SpesaFondoCassa, "id">) => {
    const item: SpesaFondoCassa = {
      ...newSpesa,
      id: `fc-${Date.now()}`,
    };
    setFondoCassa((prev) => [item, ...prev]);
  };

  const handleAddSpesa730 = (newSpesa: Omit<Spesa730, "id">) => {
    const item: Spesa730 = {
      ...newSpesa,
      id: `sp730-${Date.now()}`,
    };
    setSpese730((prev) => [item, ...prev]);
  };

  const handleSettleDebt = (fromInquilinoId: string, toInquilinoId: string, amount: number) => {
    // Mark splits as paid to settle debt
    setBollette((prev) =>
      prev.map((b) => {
        if (b.intestatarioId === toInquilinoId) {
          const updatedSplits = b.splits.map((s) => {
            if (s.inquilinoId === fromInquilinoId) {
              return { ...s, paid: true, paidDate: new Date().toISOString().split("T")[0] };
            }
            return s;
          });
          return { ...b, splits: updatedSplits };
        }
        return b;
      })
    );
  };

  // AI Scanner callbacks
  const handleApplyParsedBill = (parsed: any) => {
    const numInquilini = inquilini.length || 1;
    const total = parsed.totalAmount || 100;

    const newBill: Bolletta = {
      id: `bol-${Date.now()}`,
      title: `${parsed.billType || "Utenza"} - ${parsed.provider || "Fornitore"}`,
      provider: parsed.provider || "Fornitore Italia",
      utilityType: parsed.billType || "Luce",
      totalAmount: total,
      dueDate: parsed.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      period: parsed.period || "Mese Corrente",
      status: "In Scadenza",
      intestatarioId: currentUserId,
      podPdrCode: parsed.podPdrCode || "",
      quotaFissa: parsed.quotaFissa || 0,
      quotaConsumo: parsed.quotaConsumo || total,
      splitMethod: "Uguale",
      splits: inquilini.map((inq) => ({
        inquilinoId: inq.id,
        amount: total / numInquilini,
        paid: inq.id === currentUserId,
        paidDate: inq.id === currentUserId ? new Date().toISOString().split("T")[0] : undefined,
      })),
      notes: parsed.description || "Analizzata ed inserita con l'Assistente AI di Convivo.",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBollette((prev) => [newBill, ...prev]);
    setActiveTab("bollette");
  };

  const handleApplyParsedReceipt = (parsed: any) => {
    const amount = parsed.suggestedCommonFundExpense || parsed.totalReceipt || 20;

    const newSpesa: SpesaFondoCassa = {
      id: `fc-${Date.now()}`,
      title: `Spesa ${parsed.supermarket || "Supermercato"} (${parsed.sharedItems?.length || 1} prodotti comuni)`,
      amount,
      buyerId: currentUserId,
      date: new Date().toISOString().split("T")[0],
      category: "Pulizia Casa",
      supermarket: parsed.supermarket || "Supermercato",
      sharedWithIds: inquilini.map((i) => i.id),
    };

    setFondoCassa((prev) => [newSpesa, ...prev]);
    setActiveTab("fondo");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        houseInfo={houseInfo}
        inquilini={inquilini}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
        isProprietarioView={isProprietarioView}
        setIsProprietarioView={setIsProprietarioView}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        pendingSwapsCount={swaps.filter((s) => s.status === "In Attesa").length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "panoramica" && (
          <PanoramicaTab
            houseInfo={houseInfo}
            inquilini={inquilini}
            bollette={bollette}
            turni={turni}
            wasteSchedule={wasteSchedule}
            fondoCassa={fondoCassa}
            currentUserId={currentUserId}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenNewBillModal={() => setIsNewBillModalOpen(true)}
            onOpenAIBillScanner={() => setIsAIBillScannerOpen(true)}
            onToggleTurnoComplete={handleToggleTurnoComplete}
            onSettleDebt={handleSettleDebt}
          />
        )}

        {activeTab === "bollette" && (
          <BolletteVoltureTab
            bollette={bollette}
            volture={volture}
            letture={letture}
            inquilini={inquilini}
            currentUserId={currentUserId}
            onOpenNewBillModal={() => setIsNewBillModalOpen(true)}
            onOpenAIBillScanner={() => setIsAIBillScannerOpen(true)}
            onToggleSplitPaid={handleToggleSplitPaid}
            onAddLettura={handleAddLettura}
            onAddVoltura={handleAddVoltura}
          />
        )}

        {activeTab === "turni" && (
          <TurniPuliziaTab
            turni={turni}
            wasteSchedule={wasteSchedule}
            swaps={swaps}
            inquilini={inquilini}
            currentUserId={currentUserId}
            onToggleTurnoComplete={handleToggleTurnoComplete}
            onRequestSwap={handleRequestSwap}
            onRespondSwap={handleRespondSwap}
          />
        )}

        {activeTab === "fondo" && (
          <FondoCassaTab
            fondoCassa={fondoCassa}
            inquilini={inquilini}
            currentUserId={currentUserId}
            onAddSpesaCassa={handleAddSpesaCassa}
            onOpenAIBillScanner={() => setIsAIBillScannerOpen(true)}
          />
        )}

        {activeTab === "resoconto730" && (
          <Resoconto730Tab
            houseInfo={houseInfo}
            inquilini={inquilini}
            spese730={spese730}
            bollette={bollette}
            isProprietarioView={isProprietarioView}
            onAddSpesa730={handleAddSpesa730}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          />
        )}

        {activeTab === "regolamento" && <RegolamentoTab houseInfo={houseInfo} />}
      </main>

      {/* Global Modals */}
      <Assistente730Modal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      <AIBillScannerModal
        isOpen={isAIBillScannerOpen}
        onClose={() => setIsAIBillScannerOpen(false)}
        onApplyParsedBill={handleApplyParsedBill}
        onApplyParsedReceipt={handleApplyParsedReceipt}
      />

      <NewBillModal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        inquilini={inquilini}
        currentUserId={currentUserId}
        onAddBill={handleAddBill}
      />
    </div>
  );
}
