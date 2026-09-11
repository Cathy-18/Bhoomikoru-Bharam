import React from 'react';
import { useChaos } from '../context/AppChaosContext';
import { Zap, Volume2, VolumeX, Building2, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentStep, 
    energy, 
    openAdFlow, 
    isMuted, 
    toggleMute 
  } = useChaos();

  if (currentStep === 'crash') return null;

  const getEnergyStatus = () => {
    if (energy > 60) return { label: 'QUOTA COMPLIANT', color: 'bg-emerald-600', text: 'text-emerald-900' };
    if (energy > 25) return { label: 'INSUFFICIENT RESERVES', color: 'bg-amber-500', text: 'text-amber-900' };
    return { label: 'ENERGY CRITICAL (YOUR FAULT)', color: 'bg-rose-600 animate-pulse', text: 'text-rose-900' };
  };

  const status = getEnergyStatus();

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#18181b] bg-[#f5f3ec] px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Official Department Emblem & Titles */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#18181b] bg-[#18181b] text-[#faf9f5] flex items-center justify-center font-cinzel font-black text-xl shadow-[2px_2px_0px_0px_#18181b]">
            <Building2 className="w-5 h-5 text-[#faf9f5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base lg:text-lg tracking-tight text-[#141413] font-cinzel">
                Bhoomikkoru Bharam
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#ebe7dc] text-[#18181b] border border-[#18181b]">
                FORM BB-2026/VOID
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#52524e] tracking-tight">
              Dept. of Redundant Digital Processes • “We deliberately didn't make it simple.”
            </p>
          </div>
        </div>

        {/* Right Controls: Energy Bar & Audio */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Official Energy Quota Meter */}
          <div className="flex items-center gap-3 bg-[#faf9f5] border-2 border-[#18181b] px-3 py-1.5 shadow-[2px_2px_0px_0px_#18181b]">
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#141413] gap-2">
                <span className="flex items-center gap-1 uppercase">
                  <Zap className={`w-3 h-3 ${energy < 30 ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                  STAMINA QUOTA
                </span>
                <span>{energy}%</span>
              </div>
              <div className="w-24 sm:w-32 h-2.5 bg-[#ebe7dc] border border-[#18181b] overflow-hidden mt-1 p-[1px]">
                <div
                  className={`h-full transition-all duration-500 ${status.color}`}
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>

            {/* Watch Ad Button */}
            <button
              onClick={openAdFlow}
              className="flex items-center gap-1.5 text-xs font-mono font-black uppercase px-2.5 py-1.5 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0px_0px_#b45309] cursor-pointer"
              title="Watch Ad to Gain Energy Quota"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Earn Energy Quota</span>
              <span className="sm:hidden">+Ad</span>
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 bg-[#faf9f5] border-2 border-[#18181b] text-[#18181b] hover:bg-[#ebe7dc] transition-all shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5"
            title={isMuted ? "Unmute Sarcastic Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
