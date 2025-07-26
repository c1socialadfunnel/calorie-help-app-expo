import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { createCheckoutSession } from '../../services/api';

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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan(planType);
    updateData({ planType: planType as any });
  };

  const handleContinueWithPayment = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan to continue.');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const result = await createCheckoutSession(selectedPlan as 'steady' | 'intensive' | 'accelerated');
      
      // Open Stripe checkout
      await Linking.openURL(result.url);
      
      // For demo purposes, we'll proceed to the next step
      // In a real app, you'd wait for the webhook to confirm payment
      Alert.alert(
        'Payment Processing',
        'You will be redirected to complete your payment. After successful payment, you can continue with the setup.',
        [
          {
            text: 'Continue Setup',
            onPress: () => nextStep(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      Alert.alert('Error', error.message || 'Failed to start payment process. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSkipPayment = () => {
    Alert.alert(
      'Continue with Free Plan?',
      'You can upgrade to a premium plan anytime from your profile settings.',
      [
        { text: 'Go Back', style: 'cancel' },
        {
          text: 'Continue Free',
          onPress: () => {
            // Set a default plan for free users
            updateData({ planType: 'steady' });
            nextStep();
          },
        },
      ]
    );
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
                selectedPlan === plan.key && styles.selectedPlan,
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

              {selectedPlan === plan.key && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color={plan.color} />
                  <Text style={[styles.selectedText, { color: plan.color }]}>Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipPayment}
          disabled={isProcessingPayment}
        >
          <Text style={styles.skipButtonText}>Continue with Free Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedPlan || isProcessingPayment) && styles.disabledButton,
          ]}
          onPress={handleContinueWithPayment}
          disabled={!selectedPlan || isProcessingPayment}
        >
          {isProcessingPayment ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Subscribe & Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
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
    borderWidth: 3,
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
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  skipButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
