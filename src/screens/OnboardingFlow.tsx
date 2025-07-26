import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import WelcomeScreens from '../components/onboarding/WelcomeScreens';
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
