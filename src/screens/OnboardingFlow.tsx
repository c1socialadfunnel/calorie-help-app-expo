import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import WelcomeScreens from '../components/onboarding/WelcomeScreens';
import OnboardingAuthScreen from '../components/onboarding/OnboardingAuthScreen';
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
        return <WelcomeScreens />;
      case 1:
        return <OnboardingAuthScreen />;
      case 2:
        return <GenderStep />;
      case 3:
        return <HeightStep />;
      case 4:
        return <BirthDateStep />;
      case 5:
        return <WeightStep />;
      case 6:
        return <ActivityLevelStep />;
      case 7:
        return <TargetWeightStep />;
      case 8:
        return <PlanSelectionStep />;
      case 9:
        return <PlanSummaryStep />;
      default:
        return <WelcomeScreens />;
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
