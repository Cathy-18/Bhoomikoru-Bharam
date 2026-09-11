import React, { useState, useEffect } from 'react';
import { useChaos } from '../../context/AppChaosContext';
import { ProgressBar } from '../../components/ProgressBar';
import { sounds } from '../../audio/soundEffects';
import { ArrowRight, Shuffle, CheckCircle2 } from 'lucide-react';

interface GenderOption {
  id: string;
  label: string;
  subtitle: string;
}

const INITIAL_OPTIONS: GenderOption[] = [
  { id: 'male', label: 'Male', subtitle: 'Standard carbon-based biological classification' },
  { id: 'female', label: 'Female', subtitle: 'Standard carbon-based biological classification' },
  { id: 'nonbinary', label: 'Non-Binary', subtitle: 'Outside the traditional binary axis' },
  { id: 'walmart_bag', label: 'Walmart Shopping Bag (Heavy-Duty, 20L)', subtitle: 'Recyclable high-density polyethylene carrier' },
  { id: 'apache_helicopter', label: 'AH-64 Apache Attack Helicopter', subtitle: 'Equipped with 30mm M230 chain gun and Hellfire missiles' },
  { id: 'microwave', label: 'Microwave Oven (800W, Defrost Mode)', subtitle: 'Heats lukewarm coffee unevenly in 45 seconds' },
  { id: 'bluetooth_device', label: 'Bluetooth Device in Pairing Mode', subtitle: 'Searching for nearby headphones... Connection failed' },
  { id: 'unbuttered_toast', label: 'Single Slice of Unbuttered Toast', subtitle: 'Dry, slightly burnt on one corner, emotionally neutral' },
  { id: 'quantum_cat', label: 'Quantum Entangled Cat', subtitle: 'Simultaneously exists in superposition until observed' },
  { id: 'prefer_not', label: 'Prefer Not to Say', subtitle: 'Too mysterious for this application' }
];

export const GenderStep: React.FC = () => {
  const {
    formData,
    setFormData,
    setCurrentStep,
    drainEnergy,
    setHasEnteredData,
    triggerSarcasm,
    addToast,
    handleRapidClick
  } = useChaos();

  const [selectedGender, setSelectedGender] = useState<string>(formData.gender || '');
  const [options, setOptions] = useState<GenderOption[]>(INITIAL_OPTIONS);
  const [shuffleNotice, setShuffleNotice] = useState<boolean>(false);

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setOptions((prev) => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
      setShuffleNotice(true);
      setTimeout(() => setShuffleNotice(false), 1400);
    }, 4500);

    return () => clearInterval(shuffleInterval);
  }, []);

  const handleSelect = (id: string) => {
    sounds.playTypoBlip();
    setSelectedGender(id);
    setHasEnteredData((prev) => ({ ...prev, gender: true }));
  };

  const handleContinue = () => {
    handleRapidClick();

    if (!selectedGender) {
      sounds.playErrorBuzz();
      triggerSarcasm('mistake');
      return;
    }

    triggerSarcasm('success');
    setFormData((prev) => ({ ...prev, gender: selectedGender }));
    drainEnergy(12);
    setCurrentStep('step-password');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-mono">
      <ProgressBar />

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-10 shadow-[6px_6px_0px_0px_#18181b] relative">
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e]">
          <span className="text-[#991b1b] font-black">MANDATORY SECTION C</span>
          {shuffleNotice ? (
            <span className="text-[#b45309] font-black animate-pulse flex items-center gap-1">
              <Shuffle className="w-3.5 h-3.5" /> OPTIONS RESHUFFLED FOR EQUITY
            </span>
          ) : (
            <span>PAGE 03 OF UNKNOWN</span>
          )}
        </div>

        {/* Dramatic Phase Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
          PHASE 03 — A VERY IMPORTANT QUESTION
        </h2>
        <p className="text-sm font-bold text-[#52524e] italic mb-6">
          “Probably.”
        </p>

        {/* Radio Options with swapping */}
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 micro-scrollbar mb-8">
          {options.map((opt) => {
            const isSelected = selectedGender === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`flex items-start gap-3 p-3 border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#f5f3ec] border-[#18181b] shadow-[3px_3px_0px_0px_#18181b]'
                    : 'bg-[#faf9f5] border-[#d4cfc4] hover:border-[#18181b]'
                }`}
              >
                <div className="mt-0.5 relative flex items-center justify-center">
                  <div
                    className={`w-4 h-4 border-2 border-[#18181b] flex items-center justify-center ${
                      isSelected ? 'bg-[#18181b]' : 'bg-[#faf9f5]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-[#faf9f5]" />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#141413]">
                      {opt.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />}
                  </div>
                  <p className="text-[10px] text-[#52524e] mt-0.5">
                    {opt.subtitle}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Sarcastic Submit Button */}
        <div className="pt-4 border-t-2 border-[#18181b] flex items-center justify-end">
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-8 py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#15803d] hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            <span>Proceed Anyway</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
