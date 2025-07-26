import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';

const activityLevels = [
  {
    key: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: 'laptop',
  },
  {
    key: 'low_active',
    title: 'Low Active',
    description: 'Light exercise 1-3 days/week',
    icon: 'walk',
  },
  {
    key: 'active',
    title: 'Active',
    description: 'Moderate exercise 3-5 days/week',
    icon: 'bicycle',
  },
  {
    key: 'very_active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    icon: 'fitness',
  },
];

export default function ActivityLevelStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const handleActivitySelect = (activityLevel: string) => {
    updateData({ activityLevel: activityLevel as any });
    setTimeout(nextStep, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>5 of 7</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your activity level?</Text>
        <Text style={styles.subtitle}>
          This helps us calculate how many calories you burn daily
        </Text>

        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.optionButton,
                state.data.activityLevel === level.key && styles.selectedOption,
              ]}
              onPress={() => handleActivitySelect(level.key)}
            >
              <View style={styles.optionContent}>
                <Ionicons
                  name={level.icon as any}
                  size={24}
                  color={state.data.activityLevel === level.key ? '#007AFF' : '#666'}
                />
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionTitle,
                    state.data.activityLevel === level.key && styles.selectedOptionTitle,
                  ]}>
                    {level.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    state.data.activityLevel === level.key && styles.selectedOptionDescription,
                  ]}>
                    {level.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionDescription: {
    color: '#007AFF',
  },
});
