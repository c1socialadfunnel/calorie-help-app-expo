import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

export default function GenderStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const handleGenderSelect = (gender: 'male' | 'female') => {
    updateData({ gender });
    setTimeout(nextStep, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>1 of 7</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your gender?</Text>
        <Text style={styles.subtitle}>
          This helps us calculate your personalized calorie needs
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              state.data.gender === 'male' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelect('male')}
          >
            <Ionicons 
              name="man" 
              size={40} 
              color={state.data.gender === 'male' ? '#007AFF' : '#666'} 
            />
            <Text style={[
              styles.optionText,
              state.data.gender === 'male' && styles.selectedOptionText,
            ]}>
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              state.data.gender === 'female' && styles.selectedOption,
            ]}
            onPress={() => handleGenderSelect('female')}
          >
            <Ionicons 
              name="woman" 
              size={40} 
              color={state.data.gender === 'female' ? '#007AFF' : '#666'} 
            />
            <Text style={[
              styles.optionText,
              state.data.gender === 'female' && styles.selectedOptionText,
            ]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 16,
    paddingVertical: 40,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  selectedOptionText: {
    color: '#007AFF',
  },
});
