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
import { useUser } from '../../context/UserContext';

export default function PlanSummaryStep() {
  const { state, prevStep, calculateCalorieTarget } = useOnboarding();
  const { saveUser } = useUser();

  const handleComplete = async () => {
    const calorieTarget = calculateCalorieTarget();
    
    const userProfile = {
      id: Date.now().toString(),
      gender: state.data.gender!,
      heightCm: state.data.heightCm!,
      birthDate: state.data.birthDate!,
      currentWeightKg: state.data.currentWeightKg!,
      targetWeightKg: state.data.targetWeightKg!,
      activityLevel: state.data.activityLevel!,
      planType: state.data.planType!,
      dailyCalorieTarget: calorieTarget,
      subscriptionStatus: 'pro' as const, // For demo purposes, set to pro
    };

    await saveUser(userProfile);
  };

  const calorieTarget = calculateCalorieTarget();
  
  const getMacroTargets = () => {
    // Standard macro split: 30% protein, 40% carbs, 30% fat
    const proteinCalories = calorieTarget * 0.3;
    const carbsCalories = calorieTarget * 0.4;
    const fatCalories = calorieTarget * 0.3;
    
    return {
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      carbs: Math.round(carbsCalories / 4),
      fat: Math.round(fatCalories / 9), // 9 calories per gram
    };
  };

  const macros = getMacroTargets();

  const getPlanDetails = () => {
    const plans = {
      steady: {
        title: 'Steady Plan',
        description: 'Gradual, sustainable weight loss',
        deficit: '250 calories/day',
        expectedLoss: '0.5 lb/week',
      },
      intensive: {
        title: 'Intensive Plan',
        description: 'Balanced approach to weight loss',
        deficit: '500 calories/day',
        expectedLoss: '1 lb/week',
      },
      accelerated: {
        title: 'Accelerated Plan',
        description: 'Fast-track to your goals',
        deficit: '750 calories/day',
        expectedLoss: '1.5 lb/week',
      },
    };
    
    return plans[state.data.planType!];
  };

  const planDetails = getPlanDetails();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Summary</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          <Text style={styles.title}>Your Plan is Ready!</Text>
          <Text style={styles.subtitle}>
            Here's your personalized nutrition plan based on your goals
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>{planDetails.title}</Text>
          <Text style={styles.cardDescription}>{planDetails.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calorieTarget}</Text>
              <Text style={styles.statLabel}>Daily Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{planDetails.expectedLoss}</Text>
              <Text style={styles.statLabel}>Expected Loss</Text>
            </View>
          </View>
        </View>

        <View style={styles.macrosCard}>
          <Text style={styles.cardTitle}>Daily Macro Targets</Text>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.macroValue}>{macros.protein}g</Text>
              </View>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#4ECDC4' }]}>
                <Text style={styles.macroValue}>{macros.carbs}g</Text>
              </View>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: '#45B7D1' }]}>
                <Text style={styles.macroValue}>{macros.fat}g</Text>
              </View>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.cardTitle}>What's Included</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="camera" size={20} color="#007AFF" />
              <Text style={styles.featureText}>AI Food Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubble" size={20} color="#007AFF" />
              <Text style={styles.featureText}>24/7 AI Health Coach</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Progress Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="restaurant" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Personalized Meal Plans</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Start My Journey</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  stepIndicator: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  macrosCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresList: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
