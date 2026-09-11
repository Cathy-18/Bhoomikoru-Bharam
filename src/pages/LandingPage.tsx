import React from 'react';
import { useChaos } from '../context/AppChaosContext';
import { ArrowRight, FileWarning, Clock, ShieldAlert, Stamp } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentStep, addToast, handleRapidClick } = useChaos();

  const handleStart = () => {
    handleRapidClick();
    addToast("Beginning the unnecessary journey. Prepare your nervous system.", "info", "PROCEDURE INITIATED");
    setCurrentStep('step-name');
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center px-4 py-12 bg-paper-grid">
      {/* Main Official Document Container */}
      <div className="relative max-w-3xl w-full bg-[#faf9f5] border-3 border-[#18181b] p-8 sm:p-14 shadow-[8px_8px_0px_0px_#18181b] z-10 font-mono text-center">
        {/* Official Header Badge */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#18181b] pb-3 mb-8 text-xs font-bold text-[#52524e]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#991b1b]" />
            <span className="uppercase text-[#141413]">GOVERNMENT OF USELESSNESS</span>
          </div>
          <span className="stamp-official text-xs">
            VOID • DO NOT ENTER
          </span>
          <div>REF: BB-FORM-000</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#141413] mb-3 font-cinzel">
          Bhoomikkoru Bharam
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-[#2c2b28] font-bold mb-4 font-display">
          “A completely unnecessary website.”
        </p>

        {/* Quote */}
        <div className="p-4 bg-[#f5f3ec] border-l-4 border-[#18181b] max-w-xl mx-auto mb-8 text-xs sm:text-sm text-[#42413d] italic leading-relaxed">
          “We spent several hours building this so that you can spend several minutes accomplishing nothing.”
        </div>

        {/* Big Start Button */}
        <div className="mb-6">
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-lg sm:text-xl uppercase tracking-widest transition-all shadow-[6px_6px_0px_0px_#b45309] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            <span>BEGIN WASTING TIME</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Small text below button */}
        <p className="text-xs text-[#71716a] font-bold tracking-wide uppercase mb-8">
          “No useful outcome guaranteed.”
        </p>

        {/* Secondary warning box */}
        <div className="border-2 border-[#18181b] p-5 bg-[#f5f3ec] text-left max-w-xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#991b1b] uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Estimated completion time: 10–20 minutes</span>
          </div>
          <p className="text-xs text-[#2c2b28] leading-relaxed">
            “A normal website would take 30 seconds. We found that unacceptable.”
          </p>
        </div>

        {/* Mock legal warning footer */}
        <div className="mt-10 pt-4 border-t border-[#18181b]/30 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#71716a]">
          <span className="flex items-center gap-1">
            <FileWarning className="w-3.5 h-3.5 text-[#991b1b]" />
            Regulatory Compliance: Guaranteed Negative Value
          </span>
          <span>Approved by The Council of Pointless Obstacles</span>
        </div>
      </div>
    </div>
  );
};
