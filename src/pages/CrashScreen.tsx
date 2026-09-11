import React from 'react';
import { useChaos } from '../context/AppChaosContext';
import { RotateCcw, AlertOctagon } from 'lucide-react';

export const CrashScreen: React.FC = () => {
  const { restartWebsite } = useChaos();

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0c0e] text-[#f43f5e] font-mono scanlines flex flex-col items-center justify-center p-6 select-none overflow-auto">
      {/* High-impact terminal failure container */}
      <div className="max-w-2xl w-full bg-[#121216] border-4 border-[#e11d48] p-6 sm:p-10 shadow-[8px_8px_0px_0px_#881337] relative">
        <div className="flex items-center justify-between border-b-2 border-[#e11d48]/60 pb-3 mb-6">
          <div className="flex items-center gap-2 text-[#e11d48] font-black text-xs uppercase tracking-widest">
            <AlertOctagon className="w-4 h-4 animate-spin-slow" />
            <span>CRITICAL FAULT DETECTED</span>
          </div>
          <span className="text-xs bg-[#e11d48] text-[#121216] px-2 py-0.5 font-bold uppercase">
            TERMINAL STATE
          </span>
        </div>

        {/* ASCII Skull */}
        <div className="text-center mb-6">
          <pre className="text-[#e11d48] font-black text-xs sm:text-sm leading-none inline-block mb-3 animate-glitch">
{`
       .-""""-.
      /        \\
     /_        _\\
    // \\      / \\\\
    |\\__\\    /__/|
     \\    ||    /
      \\        /
       \\  __  /
        '.__.'
`}
          </pre>
          <h1 className="text-3xl sm:text-4xl font-black text-[#e11d48] tracking-tight mb-2">
            💀 FATAL ERROR
          </h1>
          <p className="text-white text-base sm:text-lg font-black tracking-wide">
            BHOOMIKKORU BHARAM HAS STOPPED WORKING
          </p>
        </div>

        {/* Error Code, Cause, Solution */}
        <div className="p-4 bg-black/70 border border-[#e11d48]/40 text-xs text-[#fecdd3] mb-6 space-y-3 leading-relaxed">
          <div>
            <span className="text-[#e11d48] font-black block">Error Code:</span>
            <span className="font-bold text-white text-sm">000_USELESS</span>
          </div>
          <div>
            <span className="text-[#e11d48] font-black block">Cause:</span>
            <span className="font-bold text-white">User successfully logged in.</span>
          </div>
          <div>
            <span className="text-[#e11d48] font-black block">Recommended solution:</span>
            <span className="font-bold text-white italic">Don't do that again.</span>
          </div>
        </div>

        {/* SYSTEM STATUS Table */}
        <div className="p-4 bg-black/70 border border-[#e11d48]/40 text-xs text-slate-300 mb-8">
          <div className="text-[#e11d48] font-black tracking-wider uppercase mb-2">
            SYSTEM STATUS
          </div>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Website</span>
              <span className="text-[#e11d48] font-bold">DEAD</span>
            </div>
            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-amber-400 font-bold">Confused</span>
            </div>
            <div className="flex justify-between">
              <span>Fan</span>
              <span className="text-emerald-400 font-bold">Running</span>
            </div>
            <div className="flex justify-between">
              <span>Energy</span>
              <span className="text-[#71716a] font-bold">Pointless</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
              <span>User</span>
              <span className="text-rose-300 font-bold">Regretting everything</span>
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={restartWebsite}
            className="w-full sm:w-auto px-10 py-5 bg-[#e11d48] hover:bg-[#be123c] text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART MY SUFFERING</span>
          </button>
          <p className="text-xs text-[#fda4af] mt-3 italic">
            “Your previous progress has been deleted. Obviously.”
          </p>
        </div>
      </div>
    </div>
  );
};
