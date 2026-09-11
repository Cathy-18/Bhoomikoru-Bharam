import React from 'react';
import { ChaosProvider, useChaos } from './context/AppChaosContext';
import { Header } from './components/Header';
import { ElectricFan } from './components/ElectricFan';
import { CursorFreezeOverlay } from './components/CursorFreezeOverlay';
import { PhoneCallModal } from './components/PhoneCallModal';
import { HumorToasts } from './components/HumorToasts';
import { LandingPage } from './pages/LandingPage';
import { NameStep } from './pages/steps/NameStep';
import { BlankEnergyDrainStep } from './pages/steps/BlankEnergyDrainStep';
import { PhoneStep } from './pages/steps/PhoneStep';
import { GenderStep } from './pages/steps/GenderStep';
import { PasswordStep } from './pages/steps/PasswordStep';
import { ConfirmationStep } from './pages/steps/ConfirmationStep';
import { AdFlowModal } from './pages/ad/AdFlowModal';
import { LoginPage } from './pages/LoginPage';
import { CrashScreen } from './pages/CrashScreen';

const MainContent: React.FC = () => {
  const { currentStep } = useChaos();

  if (currentStep === 'crash') {
    return <CrashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#141413] selection:bg-[#18181b] selection:text-[#faf9f5] relative">
      <Header />

      <main className="flex-1 flex flex-col justify-center relative pb-20">
        {currentStep === 'landing' && <LandingPage />}
        {currentStep === 'step-name' && <NameStep />}
        {currentStep === 'step-blank-1' && <BlankEnergyDrainStep />}
        {currentStep === 'step-phone' && <PhoneStep />}
        {currentStep === 'step-gender' && <GenderStep />}
        {currentStep === 'step-password' && <PasswordStep />}
        {currentStep === 'step-confirm' && <ConfirmationStep />}
        {currentStep === 'login' && <LoginPage />}
      </main>

      {/* Global Interactive Elements */}
      <ElectricFan />
      <CursorFreezeOverlay />
      <PhoneCallModal />
      <AdFlowModal />
      <HumorToasts />
    </div>
  );
};

export function App() {
  return (
    <ChaosProvider>
      <MainContent />
    </ChaosProvider>
  );
}

export default App;
