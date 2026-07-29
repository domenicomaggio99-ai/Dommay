import React from "react";
import {
  Info,
  Building2,
  Phone,
  Mail,
  Wifi,
  Clock,
  Shield,
  KeyRound,
  AlertTriangle,
  UserCheck,
  FileText,
} from "lucide-react";
import { HouseInfo } from "../types";

interface RegolamentoTabProps {
  houseInfo: HouseInfo;
}

export const RegolamentoTab: React.FC<RegolamentoTabProps> = ({ houseInfo }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-3">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" />
          Regolamento di Casa & Contatti Condominio
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Tutte le informazioni essenziali sull'appartamento di {houseInfo.name}, orari di rispetto del condominio, credenziali della casa e numeri utili di emergenza.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House Rules */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Regolamento Condominiale & Convivenza
          </h4>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" /> Orari di Silenzio Condominiale:
              </span>
              <p className="text-slate-600">
                {houseInfo.quietHours}. Rispetta i vicini del palazzo, specialmente nelle ore notturne.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900">
                🗑️ Raccolta Differenziata e Bidoni:
              </span>
              <p className="text-slate-600">
                Non lasciare sacchetti di spazzatura sui pianerottoli. I bidoni della differenziata vanno esposti nel cortile interno negli orari stabiliti dall'AMSA.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900">
                👥 Ospiti Notturni e Feste:
              </span>
              <p className="text-slate-600">
                Comunicare sul gruppo WhatsApp della casa se ci sono ospiti per la notte. Le feste vanno concordate con anticipo con tutti gli inquilini.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-slate-900">
                🧹 Manutenzione e Pulizie:
              </span>
              <p className="text-slate-600">
                I turni di pulizia settimanali sono obbligatori per garantire l'igiene negli spazi comuni (cucina, bagno e soggiorno).
              </p>
            </div>
          </div>
        </div>

        {/* Contacts & WiFi */}
        <div className="space-y-6">
          {/* WiFi Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-blue-600" />
              Rete Internet Fibra Casa
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Nome Rete (SSID):</span>
                <span className="font-mono font-bold text-slate-900">{houseInfo.wifiSsid}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-medium">Password Wi-Fi:</span>
                <span className="font-mono font-bold text-blue-700">{houseInfo.wifiPass}</span>
              </div>
            </div>
          </div>

          {/* Contacts Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              Contatti Utili & Amministrazione
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  Proprietario: {houseInfo.landlordName}
                </span>
                <p className="text-slate-600">Telefono: {houseInfo.landlordPhone}</p>
                <p className="text-slate-600">Email: {houseInfo.landlordEmail}</p>
                <p className="text-slate-500 font-mono text-[11px] truncate">
                  IBAN Affitto: {houseInfo.landlordIban}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-slate-900 block">
                  Amministratore Condominio: {houseInfo.adminCondominioName}
                </span>
                <p className="text-slate-600">Telefono: {houseInfo.adminCondominioPhone}</p>
                <p className="text-slate-600">Email: {houseInfo.adminCondominioEmail}</p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <span className="font-bold text-rose-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Emergenze H24
                </span>
                <p className="text-rose-800">Pronto Intervento Idraulico / Fabbro: +39 02 5551234</p>
                <p className="text-rose-800">Numero Unico Emergenze Italia: 112</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
