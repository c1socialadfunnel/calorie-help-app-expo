import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import GenderStep from '../components/onboarding/GenderStep';
import HeightStep from '../components/onboarding/HeightStep';
import BirthDateStep from '../components/onboarding/BirthDateStep';
import WeightStep from '../components/onboarding/WeightStep';
import ActivityLevelStep from '../components/onboarding/ActivityLevelStep';
import TargetWeightStep from '../components/onboarding/TargetWeightStep';
import PlanSelectionStep from '../components/onboarding/PlanSelectionStep';
import PlanSummaryStep from '../components/onboarding/PlanSummaryStep';

export default function OnboardingFlow() {
  const { state } = useOnboarding();

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <GenderStep />;
      case 2:
        return <HeightStep />;
      case 3:
        return <BirthDateStep />;
      case 4:
        return <WeightStep />;
      case 5:
        return <ActivityLevelStep />;
      case 6:
        return <TargetWeightStep />;
      case 7:
        return <PlanSelectionStep />;
      case 8:
        return <PlanSummaryStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderStep()}
    </div>
  );
}
