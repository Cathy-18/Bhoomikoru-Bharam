import React, { useEffect, useState } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { BatteryWarning, ArrowRight, ZapOff, AlertTriangle } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

export const BlankEnergyDrainStep: React.FC = () => {
  const { energy, drainEnergy, setCurrentStep, openAdFlow, addToast, triggerSarcasm, handleRapidClick } = useChaos();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (energy > 15) {
        drainEnergy(energy - 10);
        sounds.playErrorBuzz();
        triggerSarcasm('energy_low');
      }
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    handleRapidClick();

    if (energy < 40) {
      sounds.playErrorBuzz();
      addToast("ENERGY CRITICAL: You are running out of energy. This is somehow your problem.", "error");
      return;
    }

    triggerSarcasm('success');
    setCurrentStep('step-phone');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-dashed border-[#18181b] p-8 sm:p-14 text-center shadow-[6px_6px_0px_0px_#18181b]">
        <div className="w-14 h-14 mx-auto border-2 border-[#18181b] bg-[#fee2e2] flex items-center justify-center text-[#991b1b] mb-4">
          <ZapOff className="w-7 h-7 animate-pulse" />
        </div>

        <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-[#18181b] text-[#faf9f5] px-2 py-0.5 mb-3">
          MANDATORY EXISTENTIAL PAUSE
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] mb-2 font-cinzel">
          This page is intentionally blank.
        </h2>

        <p className="text-xs text-[#52524e] max-w-md mx-auto mb-6 leading-relaxed">
          While you were staring at this empty screen, the website silently drained your stamina quota to simulate realistic institutional delays.
        </p>

        {/* Energy Quota Warning */}
        <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] max-w-md mx-auto mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1 text-[#991b1b]">
              <AlertTriangle className="w-4 h-4" />
              Required Quota to Proceed:
            </span>
            <span>40% minimum</span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold mb-3">
            <span>Your Current Stamina:</span>
            <span className={energy < 40 ? "text-[#991b1b] font-black animate-pulse" : "text-[#15803d]"}>
              {energy}%
            </span>
          </div>

          {energy < 40 ? (
            <div className="border-t border-[#18181b]/20 pt-2">
              <p className="text-xs text-[#991b1b] font-bold mb-3">
                “Insufficient Energy. Please watch another completely unnecessary advertisement.”
              </p>
              <button
                onClick={openAdFlow}
                className="w-full py-2.5 px-4 bg-[#b45309] hover:bg-[#92400e] text-[#faf9f5] font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_#18181b] cursor-pointer"
              >
                [ WATCH AD TO COMPLY WITH QUOTA ]
              </button>
            </div>
          ) : (
            <div className="border-t border-[#18181b]/20 pt-2 text-[#15803d] text-xs font-bold">
              ✓ Quota fulfilled. You may proceed to further suffering.
            </div>
          )}
        </div>

        {/* Sarcastic Buttons */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            disabled={energy < 40}
            className={`flex items-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-wider transition-all ${
              energy >= 40
                ? 'bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] shadow-[4px_4px_0px_0px_#15803d] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer'
                : 'bg-[#ebe7dc] text-[#a8a29e] border border-[#d4cfc4] cursor-not-allowed'
            }`}
          >
            <span>Waste More Time</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
