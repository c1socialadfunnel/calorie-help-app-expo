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

export default function HeightStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [height, setHeight] = useState(state.data.heightCm?.toString() || '');

  const handleNext = () => {
    const heightValue = parseInt(height);
    if (heightValue && heightValue >= 100 && heightValue <= 250) {
      updateData({ heightCm: heightValue });
      nextStep();
    }
  };

  const isValid = () => {
    const heightValue = parseInt(height);
    return heightValue && heightValue >= 100 && heightValue <= 250;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>2 of 7</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your height?</Text>
        <Text style={styles.subtitle}>
          We need this to calculate your BMR and daily calorie needs
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="170"
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.unit}>cm</Text>
        </View>

        <Text style={styles.hint}>Enter your height in centimeters (100-250 cm)</Text>
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
