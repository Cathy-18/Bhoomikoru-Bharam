import React, { useState, useEffect } from 'react';
import { useChaos } from '../context/AppChaosContext';
import { sounds } from '../audio/soundEffects';
import confetti from 'canvas-confetti';
import { Lock, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    formData,
    handleLoginAttempt,
    setCurrentStep,
    addToast,
    handleRapidClick
  } = useChaos();

  const [username, setUsername] = useState<string>(formData.fullName || '');
  const [password, setPassword] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<{ title: string; desc: string } | null>(null);

  // Success celebration stage
  // null -> 'celebrating' -> 'unfortunately' -> 'crashing'
  const [successStage, setSuccessStage] = useState<'celebrating' | 'unfortunately' | null>(null);
  const [inputOffset, setInputOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      const offsetX = (Math.random() - 0.5) * 24;
      const offsetY = (Math.random() - 0.5) * 12;
      setInputOffset({ x: Math.round(offsetX), y: Math.round(offsetY) });
    }, 4200);

    return () => clearInterval(moveInterval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRapidClick();

    if (!username.trim() || !password.trim()) {
      sounds.playErrorBuzz();
      setErrorDetails({
        title: "INCOMPLETE SUBMISSION",
        desc: "Please provide both fields before requesting rejection."
      });
      return;
    }

    const result = handleLoginAttempt(username, password);

    if (!result.success) {
      setErrorDetails({
        title: result.message,
        desc: result.sub || "Authentication rejected."
      });
      addToast(result.message, "error");
    } else {
      // THE MOMENT OF SUCCESS
      setErrorDetails(null);
      setSuccessStage('celebrating');

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      // After 1.5 seconds, slowly change text to "Unfortunately..."
      setTimeout(() => {
        setSuccessStage('unfortunately');

        // Then crash 1.2s later
        setTimeout(() => {
          sounds.playCrashSound();
          setCurrentStep('crash');
        }, 1300);
      }, 1600);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 font-mono">
      {/* Registration notice */}
      <div className="mb-6 p-3 bg-[#f0fdf4] border-2 border-[#15803d] text-[#15803d] text-xs font-bold flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>SIGN UP SUCCESSFUL ✅ Account filed into memory.</span>
      </div>

      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#18181b] relative">
        {successStage ? (
          <div className="text-center py-8">
            {successStage === 'celebrating' ? (
              <div className="animate-wiggle">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-3xl font-black text-[#15803d] mb-1 font-cinzel">
                  SUCCESS!
                </h2>
                <p className="text-sm font-black text-[#141413] uppercase tracking-wider mb-3">
                  YOU ACTUALLY DID IT.
                </p>
                <p className="text-xs text-[#52524e] italic">
                  “After all that, you successfully logged in.”
                </p>
              </div>
            ) : (
              <div className="animate-pulse">
                <h2 className="text-2xl font-black text-[#991b1b] mb-2 font-cinzel">
                  “Unfortunately…”
                </h2>
                <p className="text-sm font-black text-[#141413] tracking-widest uppercase">
                  THE WEBSITE HAS CRASHED.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="border-b-2 border-[#18181b] pb-2 mb-4 text-xs font-bold text-[#52524e] flex justify-between">
              <span>PORTAL ACCESS</span>
              <span>GATEWAY #0</span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-3xl font-black text-[#141413] tracking-tight uppercase mb-1 font-cinzel">
              WELCOME BACK
            </h2>
            <p className="text-sm font-bold text-[#52524e] italic mb-6">
              “Unfortunately.”
            </p>

            {/* Sarcastic Error Box */}
            {errorDetails && (
              <div className="mb-6 p-4 bg-[#fee2e2] border-2 border-[#991b1b] text-[#991b1b] text-xs">
                <div className="font-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorDetails.title}</span>
                </div>
                <p className="font-medium leading-relaxed">{errorDetails.desc}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 smooth-dodge"
              style={{ transform: `translate(${inputOffset.x}px, ${inputOffset.y}px)` }}
            >
              <div>
                <label className="block text-xs font-bold uppercase text-[#141413] mb-1">
                  Designation / Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Catherine Nixon"
                    className="w-full pl-9 pr-3 py-3 bg-[#f5f3ec] border-2 border-[#18181b] text-sm font-bold text-[#141413] focus:outline-none focus:bg-[#faf9f5]"
                  />
                  <Mail className="w-4 h-4 text-[#71716a] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#141413] mb-1">
                  Confidential Passphrase
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-3 bg-[#f5f3ec] border-2 border-[#18181b] text-sm font-bold text-[#141413] focus:outline-none focus:bg-[#faf9f5]"
                  />
                  <Lock className="w-4 h-4 text-[#71716a] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#18181b] hover:bg-[#2c2b28] text-[#faf9f5] font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#991b1b] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
                >
                  ATTEMPT TO LOG IN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
