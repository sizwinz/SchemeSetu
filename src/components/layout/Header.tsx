import React from "react";
import { Landmark, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-mosje-navy text-white shadow-sm border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-mosje-saffron p-2 rounded-lg text-white">
            <Landmark className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">SchemeSetu</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MoSJE Concessional Finance
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Ministry of Social Justice and Empowerment: Affirmative Action Credit Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-300">
          <div className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1.5 rounded-full border border-slate-700">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>NSFDC Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
