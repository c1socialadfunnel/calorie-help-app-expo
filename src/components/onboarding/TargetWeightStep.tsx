import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

export default function TargetWeightStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [targetWeight, setTargetWeight] = useState(state.data.targetWeightKg?.toString() || '');

  const handleNext = () => {
    const weightValue = parseFloat(targetWeight);
    if (weightValue && weightValue >= 30 && weightValue <= 300) {
      updateData({ targetWeightKg: weightValue });
      nextStep();
    }
  };

  const isValid = () => {
    const weightValue = parseFloat(targetWeight);
    return weightValue && weightValue >= 30 && weightValue <= 300;
  };

  const getWeightDifference = () => {
    const current = state.data.currentWeightKg;
    const target = parseFloat(targetWeight);
    
    if (!current || !target) return null;
    
    const diff = current - target;
    if (Math.abs(diff) < 0.1) return 'maintain';
    return diff > 0 ? 'lose' : 'gain';
  };

  const getGoalText = () => {
    const goal = getWeightDifference();
    const current = state.data.currentWeightKg;
    const target = parseFloat(targetWeight);
    
    if (!goal || !current || !target) return '';
    
    const diff = Math.abs(current - target);
    
    switch (goal) {
      case 'lose':
        return `Goal: Lose ${diff.toFixed(1)} kg`;
      case 'gain':
        return `Goal: Gain ${diff.toFixed(1)} kg`;
      case 'maintain':
        return 'Goal: Maintain current weight';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>6 of 7</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your target weight?</Text>
        <Text style={styles.subtitle}>
          This helps us create a personalized plan to reach your goals
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder="65.0"
            keyboardType="decimal-pad"
            maxLength={5}
          />
          <Text style={styles.unit}>kg</Text>
        </View>

        {getGoalText() && (
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>{getGoalText()}</Text>
          </View>
        )}

        <Text style={styles.hint}>Enter your target weight in kilograms (30-300 kg)</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isValid() && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isValid()}
        >
          <Text style={[styles.nextButtonText, !isValid() && styles.disabledButtonText]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    minWidth: 120,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 8,
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  goalContainer: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  hint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
});
