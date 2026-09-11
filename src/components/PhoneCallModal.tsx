import React, { useEffect } from 'react';
import { useChaos } from '../context/AppChaosContext';
import { PhoneCall, PhoneOff, PhoneIncoming, AlertCircle } from 'lucide-react';

export const PhoneCallModal: React.FC = () => {
  const { activeCall, dismissCall } = useChaos();

  useEffect(() => {
    if (!activeCall) return;
    const autoDismiss = setTimeout(() => {
      dismissCall('declined');
    }, 8500);

    return () => clearTimeout(autoDismiss);
  }, [activeCall, dismissCall]);

  if (!activeCall) return null;

  return (
    <div className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 max-w-sm w-full font-mono animate-bounce">
      <div className="bg-[#faf9f5] border-3 border-[#18181b] p-5 shadow-[6px_6px_0px_0px_#18181b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#18181b] pb-2 mb-3">
          <div className="flex items-center gap-2 text-[#991b1b] font-black text-xs uppercase tracking-wider">
            <PhoneIncoming className="w-4 h-4 animate-pulse" />
            <span>📞 INCOMING UNWANTED CALL</span>
          </div>
          <span className="text-[9px] bg-[#ebe7dc] px-1.5 py-0.5 border border-[#18181b] font-bold">
            PRIORITY: ZERO
          </span>
        </div>

        {/* Info */}
        <div className="mb-4">
          <h4 className="font-extrabold text-base text-[#141413] leading-tight">
            {activeCall.caller}
          </h4>
          <p className="text-xs font-bold text-[#52524e] mt-0.5">
            {activeCall.number}
          </p>
          <p className="text-[11px] text-[#2c2b28] italic bg-[#f5f3ec] p-2 border border-[#d4cfc4] mt-2">
            “{activeCall.reason}”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => dismissCall('declined')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#991b1b] hover:bg-[#7f1d1d] text-[#faf9f5] font-black text-xs uppercase transition-all shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>[ DECLINE ]</span>
          </button>

          <button
            onClick={() => dismissCall('accepted')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#15803d] hover:bg-[#166534] text-[#faf9f5] font-black text-xs uppercase transition-all shadow-[2px_2px_0px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>[ ACCEPT ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
