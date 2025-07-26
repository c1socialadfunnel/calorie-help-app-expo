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

const plans = [
  {
    key: 'steady',
    title: 'Steady',
    subtitle: '0.5 lb/week',
    description: 'Gradual, sustainable weight loss',
    price: '$9.99/month',
    features: [
      'AI Food Analysis',
      'Basic Meal Planning',
      'Progress Tracking',
      'Email Support',
    ],
    color: '#4CAF50',
  },
  {
    key: 'intensive',
    title: 'Intensive',
    subtitle: '1 lb/week',
    description: 'Balanced approach to weight loss',
    price: '$14.99/month',
    features: [
      'Everything in Steady',
      'AI Health Coach',
      'Advanced Analytics',
      'Priority Support',
    ],
    color: '#FF9800',
    popular: true,
  },
  {
    key: 'accelerated',
    title: 'Accelerated',
    subtitle: '1.5 lb/week',
    description: 'Fast-track to your goals',
    price: '$19.99/month',
    features: [
      'Everything in Intensive',
      'Custom Meal Plans',
      'Weekly Check-ins',
      'Phone Support',
    ],
    color: '#F44336',
  },
];

export default function PlanSelectionStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const handlePlanSelect = (planType: string) => {
    updateData({ planType: planType as any });
    setTimeout(nextStep, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>7 of 7</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.subtitle}>
          Select the plan that best fits your goals and lifestyle
        </Text>

        <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.key}
              style={[
                styles.planCard,
                state.data.planType === plan.key && styles.selectedPlan,
                { borderColor: plan.color },
              ]}
              onPress={() => handlePlanSelect(plan.key)}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planTitle, { color: plan.color }]}>
                    {plan.title}
                  </Text>
                  <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark" size={16} color={plan.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
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
    marginBottom: 30,
    lineHeight: 24,
  },
  plansContainer: {
    flex: 1,
  },
  planCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedPlan: {
    backgroundColor: '#f8f9fa',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#999',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
});
