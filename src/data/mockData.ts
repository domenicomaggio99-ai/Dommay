import {
  Inquilino,
  Bolletta,
  VolturaSubentro,
  ContatoreLettura,
  TurnoPulizia,
  WasteScheduleItem,
  ShiftSwapRequest,
  SpesaFondoCassa,
  Spesa730,
  HouseInfo,
} from "../types";

export const initialHouseInfo: HouseInfo = {
  name: "Appartamento Navigli - Via Broletto 14",
  address: "Via Broletto 14, Piano 3, Int. 8",
  city: "Milano (MI)",
  postalCode: "20121",
  contractType: "Studente Universitario",
  landlordName: "Dott. Roberto Brambilla",
  landlordPhone: "+39 348 7654321",
  landlordEmail: "r.brambilla.locazioni@email.it",
  landlordIban: "IT8930000001234567890123456",
  adminCondominioName: "Studio Immobiliare Visconti S.r.l.",
  adminCondominioPhone: "+39 02 8901234",
  adminCondominioEmail: "amministrazione@viscontistudio.it",
  wifiSsid: "Fastweb-Navigli-Apt8",
  wifiPass: "convivo2026!wifi",
  quietHours: "14:00 - 16:00 & 22:30 - 08:00",
};

export const initialInquilini: Inquilino[] = [
  {
    id: "inq-1",
    name: "Marco Rossi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    color: "#2563eb", // blue
    role: "Capocasa / Intestatario",
    room: "Stanza Singola A (Balcone)",
    sqm: 22,
    phone: "+39 333 1122334",
    email: "marco.rossi@studenti.unimi.it",
    iban: "IT12A0306903200100000012345",
    satispayTag: "@marcorossi99",
    activeSince: "2024-09-01",
  },
  {
    id: "inq-2",
    name: "Giulia Bianchi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    color: "#ec4899", // pink
    role: "Inquilino",
    room: "Stanza Singola B",
    sqm: 18,
    phone: "+39 340 5566778",
    email: "giulia.bianchi@polimi.it",
    satispayTag: "@giuliabianchi",
    activeSince: "2024-10-15",
  },
  {
    id: "inq-3",
    name: "Matteo Conti",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    color: "#10b981", // emerald
    role: "Inquilino",
    room: "Stanza Doppia C (Posto 1)",
    sqm: 14,
    phone: "+39 328 9988776",
    email: "matteo.conti@unibocconi.it",
    satispayTag: "@matteoconti",
    activeSince: "2025-02-01",
  },
  {
    id: "inq-4",
    name: "Sofia Moretti",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    color: "#8b5cf6", // purple
    role: "Inquilino",
    room: "Stanza Doppia C (Posto 2)",
    sqm: 14,
    phone: "+39 349 4433221",
    email: "sofia.moretti@unimi.it",
    satispayTag: "@sofiamoretti",
    activeSince: "2025-03-01",
  },
];

export const initialBollette: Bolletta[] = [
  {
    id: "bol-1",
    title: "Bolletta Luce - Enel Energia",
    provider: "Enel Energia S.p.A.",
    utilityType: "Luce",
    totalAmount: 148.40,
    dueDate: "2026-08-10",
    period: "Maggio - Giugno 2026",
    status: "In Scadenza",
    intestatarioId: "inq-1", // Marco Rossi
    podPdrCode: "IT001E12345678",
    quotaFissa: 32.00,
    quotaConsumo: 116.40,
    splitMethod: "Uguale",
    splits: [
      { inquilinoId: "inq-1", amount: 37.10, paid: true, paidDate: "2026-07-25" },
      { inquilinoId: "inq-2", amount: 37.10, paid: false },
      { inquilinoId: "inq-3", amount: 37.10, paid: true, paidDate: "2026-07-28" },
      { inquilinoId: "inq-4", amount: 37.10, paid: false },
    ],
    notes: "Include conguaglio estivo e canone TV Rai addebitato su intestatario.",
    createdAt: "2026-07-20",
  },
  {
    id: "bol-2",
    title: "Gas Metano - Eni Plenitude",
    provider: "Eni Plenitude S.p.A.",
    utilityType: "Gas",
    totalAmount: 92.00,
    dueDate: "2026-08-15",
    period: "Maggio - Giugno 2026",
    status: "Da Saldare",
    intestatarioId: "inq-2", // Giulia Bianchi
    podPdrCode: "00881234567890",
    quotaFissa: 24.00,
    quotaConsumo: 68.00,
    splitMethod: "Uguale",
    splits: [
      { inquilinoId: "inq-1", amount: 23.00, paid: false },
      { inquilinoId: "inq-2", amount: 23.00, paid: true, paidDate: "2026-07-22" },
      { inquilinoId: "inq-3", amount: 23.00, paid: false },
      { inquilinoId: "inq-4", amount: 23.00, paid: false },
    ],
    notes: "Consumi ridotti per acqua calda e cucina.",
    createdAt: "2026-07-21",
  },
  {
    id: "bol-3",
    title: "Internet Fibra - Fastweb Casa",
    provider: "Fastweb S.p.A.",
    utilityType: "Wi-Fi",
    totalAmount: 29.95,
    dueDate: "2026-08-01",
    period: "Luglio 2026",
    status: "Pagata",
    intestatarioId: "inq-1",
    quotaFissa: 29.95,
    quotaConsumo: 0,
    splitMethod: "Uguale",
    splits: [
      { inquilinoId: "inq-1", amount: 7.49, paid: true, paidDate: "2026-07-20" },
      { inquilinoId: "inq-2", amount: 7.49, paid: true, paidDate: "2026-07-21" },
      { inquilinoId: "inq-3", amount: 7.49, paid: true, paidDate: "2026-07-22" },
      { inquilinoId: "inq-4", amount: 7.48, paid: true, paidDate: "2026-07-20" },
    ],
    notes: "Addebito diretto RID su conto di Marco Rossi.",
    createdAt: "2026-07-15",
  },
  {
    id: "bol-4",
    title: "TARI Tassa Rifiuti 2026 - Rata 1",
    provider: "Comune di Milano - Settore Tributi",
    utilityType: "TARI",
    totalAmount: 240.00,
    dueDate: "2026-09-30",
    period: "Anno 2026 (1a Tranche Modello F24)",
    status: "In Scadenza",
    intestatarioId: "inq-1",
    quotaFissa: 120.00,
    quotaConsumo: 120.00,
    splitMethod: "Uguale",
    splits: [
      { inquilinoId: "inq-1", amount: 60.00, paid: true, paidDate: "2026-07-10" },
      { inquilinoId: "inq-2", amount: 60.00, paid: false },
      { inquilinoId: "inq-3", amount: 60.00, paid: false },
      { inquilinoId: "inq-4", amount: 60.00, paid: false },
    ],
    notes: "Codice Tributo F24: 3944 - Rifiuti Urbani. Da pagare entro il 30 Settembre.",
    createdAt: "2026-07-01",
  }
];

export const initialVolture: VolturaSubentro[] = [
  {
    id: "vol-1",
    utilityType: "Luce",
    provider: "Enel Energia",
    previousHeader: "Ex Inquilino Luca Neri",
    newHeader: "Marco Rossi",
    date: "2024-09-05",
    cost: 58.50, // Voltura commerciale + marca da bollo
    status: "Completata",
    documents: ["Carta d'Identità", "Codice Fiscale", "Contratto Locazione Registrato Agenzia Entrate", "Modulo Voltura Signed"],
    notes: "Costo voltura diviso al 50% tra subentrante e casa (€29.25 a testa).",
  },
  {
    id: "vol-2",
    utilityType: "Gas",
    provider: "Eni Plenitude",
    previousHeader: "Ex Inquilino Luca Neri",
    newHeader: "Giulia Bianchi",
    date: "2024-10-18",
    cost: 49.00,
    status: "Completata",
    documents: ["Autolettura Contatore PDR", "Documento d'identità"],
    notes: "Lettura contatore iniziale: 4321 Sm3 registrata al momento del cambio.",
  },
  {
    id: "vol-3",
    utilityType: "TARI",
    provider: "Comune di Milano",
    previousHeader: "Proprietario R. Brambilla",
    newHeader: "Marco Rossi (Dichiarazione Occupanti 4 Persone)",
    date: "2025-01-10",
    cost: 16.00,
    status: "Completata",
    documents: ["Modulo TARI Utenze Domestiche", "Elenco Codici Fiscali Inquilini"],
    notes: "Registrato numero di occupanti effettivo: 4 persone.",
  }
];

export const initialLetture: ContatoreLettura[] = [
  {
    id: "let-1",
    utilityType: "Luce",
    readingDate: "2026-07-01",
    value: 14520,
    unit: "kWh",
    recordedBy: "Marco Rossi",
    notes: "Lettura contatore elettronico F1/F2/F3 effettuata il 1 del mese.",
  },
  {
    id: "let-2",
    utilityType: "Gas",
    readingDate: "2026-07-01",
    value: 4892,
    unit: "Sm3",
    recordedBy: "Giulia Bianchi",
    notes: "PDR 00881234567890 - Foto salvata in galleria.",
  },
  {
    id: "let-3",
    utilityType: "Acqua",
    readingDate: "2026-06-30",
    value: 382,
    unit: "m³",
    recordedBy: "Matteo Conti",
    notes: "Contatore acqua fredda/calda nel bagno cieco.",
  },
];

export const initialTurni: TurnoPulizia[] = [
  {
    id: "tur-1",
    zone: "Bagno Principale",
    assignedToId: "inq-2", // Giulia
    weekRange: "28 Lug - 03 Aug 2026",
    dueDate: "2026-08-02",
    completed: false,
    notes: "Pulizia sanitari, box doccia con anticalcare e lavaggio pavimento.",
  },
  {
    id: "tur-2",
    zone: "Cucina e Piano Cottura",
    assignedToId: "inq-3", // Matteo
    weekRange: "28 Lug - 03 Aug 2026",
    dueDate: "2026-08-02",
    completed: true,
    completedAt: "2026-07-29T11:00:00Z",
    notes: "Sgrassato piano a induzione, svuotato filtro lavastoviglie.",
  },
  {
    id: "tur-3",
    zone: "Soggiorno e Ingresso",
    assignedToId: "inq-4", // Sofia
    weekRange: "28 Lug - 03 Aug 2026",
    dueDate: "2026-08-02",
    completed: false,
    notes: "Aspirapolvere, spolvero tavolo da studio e riordino scarpe.",
  },
  {
    id: "tur-4",
    zone: "Pattumiera e Differenziata",
    assignedToId: "inq-1", // Marco
    weekRange: "28 Lug - 03 Aug 2026",
    dueDate: "2026-08-02",
    completed: true,
    completedAt: "2026-07-28T21:30:00Z",
    notes: "Portati giù i bidoni dell'Umido e Vetro nel cortile interno.",
  }
];

export const initialWasteSchedule: WasteScheduleItem[] = [
  {
    id: "w-1",
    dayName: "Lunedì",
    types: ["Organico / Umido", "Carta e Cartone"],
    iconColor: "#16a34a",
    timeSlot: "Esporre entro le 22:00 di Domenica",
    instructions: "Usare solo sacchetti compostabili in Mater-Bi. Carta piegata e pressata nel bidone bianco.",
  },
  {
    id: "w-2",
    dayName: "Martedì",
    types: ["Plastica e Lattine"],
    iconColor: "#eab308",
    timeSlot: "Esporre entro le 22:00 di Lunedì",
    instructions: "Sacchi gialli trasparenti forniti dal Comune di Milano. Sciacquare bottiglie e lattine.",
  },
  {
    id: "w-3",
    dayName: "Mercoledì",
    types: ["Organico / Umido", "Vetro"],
    iconColor: "#0284c7",
    timeSlot: "Esporre entro le 22:00 di Martedì",
    instructions: "Bottiglie e vasetti nel bidone verde in cortile. No lampadine o ceramica.",
  },
  {
    id: "w-4",
    dayName: "Giovedì",
    types: ["Secco Indifferenziato"],
    iconColor: "#6b7280",
    timeSlot: "Esporre entro le 22:00 di Mercoledì",
    instructions: "Sacco neutro ben chiuso. Nessun materiale riciclabile all'interno.",
  },
  {
    id: "w-5",
    dayName: "Venerdì",
    types: ["Organico / Umido", "Plastica e Lattine"],
    iconColor: "#16a34a",
    timeSlot: "Esporre entro le 22:00 di Giovedì",
    instructions: "Ultima raccolta settimanale plastica prima del weekend.",
  },
  {
    id: "w-6",
    dayName: "Sabato",
    types: ["Carta e Cartone"],
    iconColor: "#3b82f6",
    timeSlot: "Esporre entro le 07:00 di Sabato mattina",
    instructions: "Cartoni grandi della spesa / pacchi Amazon appiattiti.",
  },
  {
    id: "w-7",
    dayName: "Domenica",
    types: [],
    iconColor: "#9ca3af",
    timeSlot: "Nessuna raccolta prevista",
    instructions: "Riposo del servizio AMSA.",
  }
];

export const initialSwaps: ShiftSwapRequest[] = [
  {
    id: "sw-1",
    cleaningId: "tur-1",
    requesterId: "inq-2", // Giulia
    targetId: "inq-4", // Sofia
    status: "In Attesa",
    reason: "Ho l'esame di Analisi Matematica Venerdì e vorrei scambiare il turno del bagno.",
    date: "2026-07-28",
  }
];

export const initialFondoCassa: SpesaFondoCassa[] = [
  {
    id: "fc-1",
    title: "Carta Igienica Scottex 12x + Detersivo Piatti Sgrassante",
    amount: 18.50,
    buyerId: "inq-2", // Giulia
    date: "2026-07-24",
    category: "Pulizia Casa",
    supermarket: "Esselunga Viale Papiniano",
    sharedWithIds: ["inq-1", "inq-2", "inq-3", "inq-4"],
  },
  {
    id: "fc-2",
    title: "Olio EVO 2L + Sale Fino/Grosso + Sacchetti Spazzatura AMSA 50L",
    amount: 24.90,
    buyerId: "inq-1", // Marco
    date: "2026-07-18",
    category: "Cucina & Spezie",
    supermarket: "Conad City",
    sharedWithIds: ["inq-1", "inq-2", "inq-3", "inq-4"],
  },
  {
    id: "fc-3",
    title: "Cambio 3 Lampadine LED B22 Soggiorno + Filtro Calcare Rubinetto",
    amount: 16.00,
    buyerId: "inq-3", // Matteo
    date: "2026-07-12",
    category: "Manutenzione Minore",
    supermarket: "Leroy Merlin / Brico",
    sharedWithIds: ["inq-1", "inq-2", "inq-3", "inq-4"],
  }
];

export const initialSpese730: Spesa730[] = [
  {
    id: "sp730-1",
    category: "Canone di Locazione (Detrazione Art.16 TUIR)",
    description: "Canone di locazione per studente universitario fuori sede (4 quote da €450/mese per 12 mesi = €21.600 totale annuo).",
    amount: 21600.00,
    date: "2025-12-31",
    paidBy: "Inquilini",
    recipient: "Dott. Roberto Brambilla (Proprietario)",
    documentRef: "Contratto di Locazione Registrato Agenzia Entrate n. 2024/MI/99812",
    deductibleFor: "Inquilino (730)",
    deductiblePercentage: 19, // 19% fino a max 2.633€ per studenti fuori sede
    notes: "Ogni studente residente può detrarre fino a €2.633 sul proprio Modello 730 / Quadro E / Rigo E8-E10 codice 18.",
  },
  {
    id: "sp730-2",
    category: "Spese Condominiali Ordinarie (Inquilino)",
    description: "Servizio di pulizia scale, ascensore quota consumo, energia elettrica parti comuni e giardinaggio corte.",
    amount: 1440.00,
    date: "2025-12-15",
    paidBy: "Inquilini",
    recipient: "Studio Immobiliare Visconti S.r.l. (Amministratore)",
    documentRef: "Consuntivo Gestione Condominiale Ordinaria Anno 2025",
    deductibleFor: "Nessuna",
    deductiblePercentage: 0,
    notes: "A carico integrale degli inquilini in base alla Tabella Confedilizia G. Oneri accessori spettanti alla conduzione.",
  },
  {
    id: "sp730-3",
    category: "Ristrutturazione ed Efficientamento (Bonus 50%)",
    description: "Sostituzione caldaia a condensazione condominiale e valvole termostatiche nei radiatori dell'appartamento.",
    amount: 3200.00,
    date: "2025-11-20",
    paidBy: "Proprietario",
    recipient: "TermoIdraulica Lombarda S.n.c.",
    documentRef: "Fattura Elettronica n. FE-2025-442 con Bonifico Parlante",
    deductibleFor: "Proprietario (Redditi)",
    deductiblePercentage: 50,
    notes: "Spesa Straordinaria di competenza esclusiva del Proprietario. Detrazione IRPEF 50% in 10 rate annuali per il proprietario.",
  },
  {
    id: "sp730-4",
    category: "Manutenzione Impianti e Caldaia",
    description: "Revisione annuale caldaia autonoma, controllo fumi e bollino blu regionale CURIT.",
    amount: 110.00,
    date: "2026-03-10",
    paidBy: "Inquilini",
    recipient: "Assistenza Caldaie Milano S.r.l.",
    documentRef: "Ricevuta Fiscale n. 2026/092 + Libretto d'Impianto",
    deductibleFor: "Nessuna",
    deductiblePercentage: 0,
    notes: "Controllo fumi e manutenzione ordinaria a carico degli inquilini per legge.",
  }
];
