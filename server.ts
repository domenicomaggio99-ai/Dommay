import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Convivo" });
});

// AI Endpoint 1: Parse Italian Utility Bills
app.post("/api/gemini/parse-bill", async (req, res) => {
  try {
    const { billText, imageBase64 } = req.body;
    if (!billText && !imageBase64) {
      return res.status(400).json({ error: "Fornisci il testo della bolletta o un'immagine." });
    }

    const prompt = `Sei un esperto di bollette e utenze domestiche italiane (Enel, Plenitude, A2A, Hera, Fastweb, TARI, Acqua).
Analizza questa bolletta o ricevuta italiana ed estrai le seguenti informazioni in formato JSON strutturato con le seguenti chiavi:
- provider (string): Nome del fornitore (es. "Enel Energia", "Plenitude", "Comune di Milano - TARI", "Fastweb")
- billType (string): Tipo utenza ("Luce", "Gas", "Wi-Fi", "TARI", "Acqua", "Condominio")
- totalAmount (number): Importo totale da pagare in Euro (es. 142.50)
- dueDate (string): Data di scadenza in formato YYYY-MM-DD
- period (string): Periodo di riferimento (es. "Gennaio - Febbraio 2026")
- quotaFissa (number): Quota fissa e commercializzazione (se individuabile, altrimenti stima 0)
- quotaConsumo (number): Quota energia/consumi (se individuabile, altrimenti totale - quotaFissa)
- podPdrCode (string): Codice POD/PDR o Numero Contratto se presente
- description (string): Breve riassunto per gli inquilini
- recommendedSplit (string): Suggerimento su come dividere la bolletta (es. "Quota fissa divisa in 4 parti uguali + consumo in base ai giorni di presenza")

Esegui l'analisi e rispondi ESCLUSIVAMENTE con un oggetto JSON valido.`;

    const parts: any[] = [{ text: prompt }];
    if (billText) {
      parts.push({ text: `Testo bolletta:\n${billText}` });
    }
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Errore analisi bolletta AI:", error);
    return res.status(500).json({ error: error.message || "Impossibile analizzare la bolletta." });
  }
});

// AI Endpoint 2: Parse Supermarket Receipt (Scontrino Spesa Comune)
app.post("/api/gemini/parse-receipt", async (req, res) => {
  try {
    const { receiptText, imageBase64 } = req.body;
    if (!receiptText && !imageBase64) {
      return res.status(400).json({ error: "Fornisci il testo o l'immagine dello scontrino." });
    }

    const prompt = `Sei un assistente per la gestione della spesa comune in un appartamento condiviso in Italia.
Analizza questo scontrino di un supermercato italiano (es. Esselunga, Conad, Coop, Eurospin, Carrefour, Lidl) ed estrai i prodotti divisi tra:
- prodottiComuni: prodotti ad uso di tutti gli inquilini (es. Carta igienica, detersivo piatti, sacchetti spazzatura, olio, sale, spezie, scottex, spugne)
- prodottiPersonali: cibi specifici, snack, bevande personali o articoli di igiene personale

Restituisci un JSON strutturato così:
{
  "supermarket": "Nome supermercato",
  "totalReceipt": number,
  "date": "YYYY-MM-DD",
  "sharedItems": [
    { "item": "Nome prodotto", "price": number, "category": "Pulizia" | "Dispensa" | "Spazzatura" | "Altro" }
  ],
  "personalItems": [
    { "item": "Nome prodotto", "price": number }
  ],
  "suggestedCommonFundExpense": number (somma dei sharedItems)
}

Rispondi ESCLUSIVAMENTE con l'oggetto JSON.`;

    const parts: any[] = [{ text: prompt }];
    if (receiptText) parts.push({ text: `Testo scontrino:\n${receiptText}` });
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg",
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Errore analisi scontrino AI:", error);
    return res.status(500).json({ error: error.message || "Impossibile analizzare lo scontrino." });
  }
});

// AI Endpoint 3: Italian Legal & Tax Advice for Rental & Condominium
app.post("/api/gemini/legal-tax-advice", async (req, res) => {
  try {
    const { userQuestion, contextType } = req.body;
    if (!userQuestion) {
      return res.status(400).json({ error: "Inserisci un quesito." });
    }

    const systemInstruction = `Sei "InquilinoBot", il massimo esperto di legislazione italiana sui contratti di locazione (Legge 431/98, 392/78), ripartizione spese Confedilizia/SUNIA, volture/subentri utenze, e detrazioni fiscali per il Modello 730 / Quadro E (spese di locazione per studenti e lavoratori, interventi straordinari del condominio).

Fornisci risposte chiare, pratiche ed in italiano impeccabile. Se richiesto, genera una bozza di messaggio formale o cordiale per WhatsApp/Email da inviare al Proprietario di Casa o all'Amministratore di Condominio.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Quesito dell'inquilino (${contextType || "generale"}): ${userQuestion}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Errore assistente legale/fiscale AI:", error);
    return res.status(500).json({ error: error.message || "Impossibile elaborare il quesito." });
  }
});

// Start Vite dev server or static serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Convivo Server attivo su http://localhost:${PORT}`);
  });
}

startServer();
