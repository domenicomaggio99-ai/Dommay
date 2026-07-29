import React, { useState } from "react";
import { Bot, Send, Sparkles, X, User, Copy, Check, ShieldCheck } from "lucide-react";

interface Assistente730ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Assistente730Modal: React.FC<Assistente730ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; text: string }[]
  >([
    {
      sender: "ai",
      text: "Ciao! Sono **InquilinoBot**, il tuo assistente AI esperto di contratti di locazione in Italia, ripartizione spese Confedilizia/SUNIA, volture utenze e detrazioni per il Modello 730. Come posso aiutarti oggi?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const sampleQuestions = [
    "Chi deve pagare la manutenzione della caldaia e il controllo fumi?",
    "Come funziona la detrazione 730 per studenti universitari fuori sede?",
    "Scrivi un messaggio cordiale al proprietario per la riparazione del condizionatore.",
    "Come si divide la voltura di luce e gas in caso di subentro?",
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/legal-tax-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuestion: q, contextType: "Inquilini e 730" }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Mi dispiace, si è verificato un errore durante la consultazione dell'assistente AI.",
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Impossibile connettersi al servizio AI. Assicurati che il server sia attivo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">InquilinoBot AI</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Esperto Legale & Fiscale Locazioni Italia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  AI
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] space-y-1.5 shadow-2xs ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white font-medium rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none leading-relaxed"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.sender === "ai" && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => copyMessage(m.text, idx)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copiato!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copia Risposta
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {m.sender === "user" && (
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                  Tu
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 italic p-2 text-xs">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              InquilinoBot sta elaborando la risposta legale/fiscale...
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
            Suggeriti:
          </span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chiedi sull'affitto, 730, volture o spese condominiali..."
            className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-xs cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
