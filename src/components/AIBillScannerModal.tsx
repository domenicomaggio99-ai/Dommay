import React, { useState } from "react";
import { Sparkles, Upload, X, FileText, CheckCircle2, Zap, Receipt } from "lucide-react";

interface AIBillScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedBill: (billData: any) => void;
  onApplyParsedReceipt: (receiptData: any) => void;
}

export const AIBillScannerModal: React.FC<AIBillScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedBill,
  onApplyParsedReceipt,
}) => {
  const [scanType, setScanType] = useState<"bill" | "receipt">("bill");
  const [pastedText, setPastedText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunScan = async () => {
    if (!pastedText && !imageBase64) return;
    setLoading(true);
    setErrorMsg(null);
    setParsedResult(null);

    const endpoint = scanType === "bill" ? "/api/gemini/parse-bill" : "/api/gemini/parse-receipt";
    const payload = scanType === "bill"
      ? { billText: pastedText, imageBase64 }
      : { receiptText: pastedText, imageBase64 };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setParsedResult(data.data);
      } else {
        setErrorMsg(data.error || "Impossibile estrarre i dati con l'IA.");
      }
    } catch (err: any) {
      setErrorMsg("Errore di connessione al server per l'analisi AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!parsedResult) return;

    if (scanType === "bill") {
      onApplyParsedBill(parsedResult);
    } else {
      onApplyParsedReceipt(parsedResult);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className="font-bold text-sm">Scanner AI Bollette & Scontrini</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Scan Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setScanType("bill");
                setParsedResult(null);
              }}
              className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                scanType === "bill" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Bolletta Utenza (Enel/Plenitude/Fastweb)
            </button>

            <button
              onClick={() => {
                setScanType("receipt");
                setParsedResult(null);
              }}
              className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                scanType === "receipt" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-500" />
              Scontrino Spesa Comune
            </button>
          </div>

          {/* Upload or Paste options */}
          {!parsedResult && (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="ai-file-upload"
                />
                <label htmlFor="ai-file-upload" className="cursor-pointer space-y-1 block">
                  <Upload className="w-6 h-6 mx-auto text-slate-400" />
                  <span className="font-bold text-slate-700 block">Carica foto del documento</span>
                  <span className="text-[11px] text-slate-400">Formati supportati: JPG, PNG, WEBP</span>
                </label>
              </div>

              {imageBase64 && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-900 flex items-center justify-center">
                  <img src={imageBase64} alt="Preview" className="h-full object-contain" />
                  <button
                    onClick={() => setImageBase64(null)}
                    className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full text-[10px]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Oppure incolla il testo della bolletta/scontrino:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={3}
                  placeholder={
                    scanType === "bill"
                      ? "Incolla il testo dell'email o del PDF della bolletta Enel / Plenitude / Fastweb..."
                      : "Incolla la lista articoli dello scontrino Esselunga / Conad..."
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-[11px]"
                ></textarea>
              </div>

              <button
                onClick={handleRunScan}
                disabled={loading || (!pastedText && !imageBase64)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Analisi AI in corso..." : "Analizza con Gemini AI"}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl font-semibold border border-rose-200">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Parsed Result Display */}
          {parsedResult && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dati Estratti dall'IA
                </h4>
                <button
                  onClick={() => setParsedResult(null)}
                  className="text-[11px] text-slate-500 hover:underline font-semibold"
                >
                  Riesegui
                </button>
              </div>

              {scanType === "bill" ? (
                <div className="space-y-1.5 text-slate-700">
                  <p>Fornitore: <strong>{parsedResult.provider || "N/A"}</strong></p>
                  <p>Tipo Utenza: <strong>{parsedResult.billType || "Luce"}</strong></p>
                  <p>Importo Totale: <strong className="text-emerald-700 font-extrabold">€ {parsedResult.totalAmount || "0.00"}</strong></p>
                  <p>Scadenza: <strong>{parsedResult.dueDate || "In scadenza"}</strong></p>
                  <p className="text-[11px] text-slate-500 italic">💡 {parsedResult.recommendedSplit}</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-700">
                  <p>Supermercato: <strong>{parsedResult.supermarket || "Supermercato"}</strong></p>
                  <p>Spesa Prodotti Comuni: <strong className="text-emerald-700 font-extrabold">€ {parsedResult.suggestedCommonFundExpense || "0.00"}</strong></p>
                  <div className="pt-2">
                    <span className="font-bold block mb-1">Articoli Comuni Trovati:</span>
                    <div className="space-y-1">
                      {parsedResult.sharedItems?.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between bg-white p-1.5 rounded border">
                          <span>• {it.item}</span>
                          <span className="font-bold">€ {it.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleConfirmAndAdd}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Conferma e Inserisci in Casa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
