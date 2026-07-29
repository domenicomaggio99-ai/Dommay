export type UtilityType = "Luce" | "Gas" | "Wi-Fi" | "TARI" | "Acqua" | "Condominio" | "Altro";

export type RoleType = "Inquilino" | "Capocasa / Intestatario" | "Proprietario";

export interface Inquilino {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: RoleType;
  room: string;
  sqm?: number;
  phone: string;
  email: string;
  iban?: string;
  satispayTag?: string;
  activeSince: string;
}

export interface BillSplit {
  inquilinoId: string;
  amount: number;
  paid: boolean;
  paidDate?: string;
}

export interface Bolletta {
  id: string;
  title: string;
  provider: string;
  utilityType: UtilityType;
  totalAmount: number;
  dueDate: string;
  period: string;
  status: "In Scadenza" | "Pagata" | "Da Saldare";
  intestatarioId: string;
  podPdrCode?: string;
  quotaFissa?: number;
  quotaConsumo?: number;
  splitMethod: "Uguale" | "Mq Stanza" | "Consumo Contatore";
  splits: BillSplit[];
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface VolturaSubentro {
  id: string;
  utilityType: UtilityType;
  provider: string;
  previousHeader: string;
  newHeader: string;
  date: string;
  cost: number;
  status: "In Corso" | "Completata" | "Richiesta";
  documents: string[];
  notes: string;
}

export interface ContatoreLettura {
  id: string;
  utilityType: "Luce" | "Gas" | "Acqua";
  readingDate: string;
  value: number;
  unit: "kWh" | "Sm3" | "m³";
  recordedBy: string;
  notes?: string;
}

export interface TurnoPulizia {
  id: string;
  zone: "Bagno Principale" | "Cucina e Piano Cottura" | "Soggiorno e Ingresso" | "Pattumiera e Differenziata";
  assignedToId: string;
  weekRange: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface WasteScheduleItem {
  id: string;
  dayName: "Lunedì" | "Martedì" | "Mercoledì" | "Giovedì" | "Venerdì" | "Sabato" | "Domenica";
  types: ("Organico / Umido" | "Carta e Cartone" | "Plastica e Lattine" | "Vetro" | "Secco Indifferenziato")[];
  iconColor: string;
  timeSlot: string;
  instructions: string;
}

export interface ShiftSwapRequest {
  id: string;
  cleaningId: string;
  requesterId: string;
  targetId: string;
  status: "In Attesa" | "Accettata" | "Rifiutata";
  reason: string;
  date: string;
}

export interface SpesaFondoCassa {
  id: string;
  title: string;
  amount: number;
  buyerId: string;
  date: string;
  category: "Pulizia Casa" | "Cucina & Spezie" | "Manutenzione Minore" | "Spazzatura" | "Altro";
  sharedWithIds: string[];
  supermarket?: string;
}

export interface Spesa730 {
  id: string;
  category: 
    | "Canone di Locazione (Detrazione Art.16 TUIR)"
    | "Spese Condominiali Ordinarie (Inquilino)"
    | "Spese Condominiali Straordinarie (Proprietario)"
    | "Ristrutturazione ed Efficientamento (Bonus 50%)"
    | "Manutenzione Impianti e Caldaia";
  description: string;
  amount: number;
  date: string;
  paidBy: "Inquilini" | "Proprietario" | "Singolo Inquilino";
  payerName?: string;
  recipient: string;
  documentRef?: string;
  deductibleFor: "Inquilino (730)" | "Proprietario (Redditi)" | "Nessuna";
  deductiblePercentage: number;
  notes?: string;
}

export interface HouseInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  contractType: "Studente Universitario" | "Transitorio" | "Canone Concordato 3+2" | "Libero 4+4";
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  landlordIban: string;
  adminCondominioName: string;
  adminCondominioPhone: string;
  adminCondominioEmail: string;
  wifiSsid: string;
  wifiPass: string;
  quietHours: string;
}
