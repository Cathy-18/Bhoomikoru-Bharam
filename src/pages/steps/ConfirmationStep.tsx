import React from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { sounds } from '../../audio/soundEffects';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const ConfirmationStep: React.FC = () => {
  const {
    formData,
    energy,
    setCurrentStep,
    openAdFlow,
    addToast,
    triggerSarcasm,
    handleRapidClick
  } = useChaos();

  const REQUIRED_ENERGY = 70;

  const handleFinalSubmit = () => {
    handleRapidClick();

    if (energy < REQUIRED_ENERGY) {
      sounds.playErrorBuzz();
      triggerSarcasm('energy_low');
      addToast("“Insufficient Energy. Please watch another completely unnecessary advertisement.”", "error");
      return;
    }

    sounds.playSuccessChime();
    addToast("✓ SIGN UP SUCCESSFUL. Redirecting to unavoidable rejection.", "info");
    setTimeout(() => {
      setCurrentStep('login');
    }, 1100);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#18181b] relative">
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e]">
          <span className="text-[#991b1b] font-black">FINAL BUREAUCRATIC CHECKPOINT</span>
          <span>PAGE 05 OF 05</span>
        </div>

        {/* Dramatic Phase Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
          PHASE 05 — CONFIRM YOUR DECISION
        </h2>
        <p className="text-sm font-bold text-[#52524e] italic mb-1">
          “You can still leave.”
        </p>
        <p className="text-xs text-[#991b1b] font-black uppercase tracking-wider mb-6">
          “We recommend leaving.”
        </p>

        {/* Summary Card */}
        <div className="p-4 bg-[#f5f3ec] border-2 border-[#18181b] space-y-3 mb-6 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-[#18181b]/20">
            <span className="text-[#52524e] font-bold">Designation (Name)</span>
            <span className="font-black text-[#141413]">{formData.fullName || "Unspecified Citizen"}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#18181b]/20">
            <span className="text-[#52524e] font-bold">Telecommunication String</span>
            <span className="font-black text-[#141413]">+91 {formData.phone || "0000000000"}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-[#18181b]/20">
            <span className="text-[#52524e] font-bold">Selected Classification</span>
            <span className="font-black text-[#141413]">{formData.gender || "Unspecified"}</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-[#52524e] font-bold">Verification Token</span>
            <span className="font-black text-[#15803d]">Confirmed (Subject to immediate deletion)</span>
          </div>
        </div>

        {/* Energy Check */}
        <div className={`p-4 border-2 mb-8 ${
          energy < REQUIRED_ENERGY
            ? 'bg-[#fee2e2] border-[#991b1b] text-[#991b1b]'
            : 'bg-[#f0fdf4] border-[#15803d] text-[#15803d]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              {energy < REQUIRED_ENERGY ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 shrink-0" />
              )}
              <div>
                <span className="uppercase font-black block">
                  Stamina Quota: {energy}% (Threshold: {REQUIRED_ENERGY}%)
                </span>
                <p className="mt-0.5 text-[11px] font-medium opacity-90">
                  {energy < REQUIRED_ENERGY
                    ? "“Insufficient Energy. Please watch another completely unnecessary advertisement.”"
                    : "Sufficient stamina detected to attempt registration."}
                </p>
              </div>
            </div>

            {energy < REQUIRED_ENERGY && (
              <button
                onClick={openAdFlow}
                className="px-3 py-1.5 bg-[#991b1b] text-[#faf9f5] font-black text-xs uppercase shadow-[2px_2px_0px_0px_#18181b] ml-2 cursor-pointer"
              >
                Watch Ad
              </button>
            )}
          </div>
        </div>

        {/* Sarcastic Submit Button */}
        <div className="pt-4 border-t-2 border-[#18181b] flex items-center justify-end">
          <button
            onClick={handleFinalSubmit}
            disabled={energy < REQUIRED_ENERGY}
            className={`flex items-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-wider transition-all ${
              energy >= REQUIRED_ENERGY
                ? 'bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] shadow-[4px_4px_0px_0px_#15803d] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer'
                : 'bg-[#ebe7dc] text-[#a8a29e] border border-[#d4cfc4] cursor-not-allowed'
            }`}
          >
            <span>Surprisingly, Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
