import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft, Check } from 'lucide-react';

const plans = [
  {
    key: 'steady',
    title: 'Steady',
    subtitle: '0.5 lb/week',
    description: 'Gradual, sustainable weight loss',
    features: [
      'AI Food Analysis',
      'Basic Meal Planning',
      'Progress Tracking',
      'Email Support',
    ],
    color: 'bg-green-500',
  },
  {
    key: 'intensive',
    title: 'Intensive',
    subtitle: '1 lb/week',
    description: 'Balanced approach to weight loss',
    features: [
      'Everything in Steady',
      'AI Health Coach',
      'Advanced Analytics',
      'Priority Support',
    ],
    color: 'bg-orange-500',
    popular: true,
  },
  {
    key: 'accelerated',
    title: 'Accelerated',
    subtitle: '1.5 lb/week',
    description: 'Fast-track to your goals',
    features: [
      'Everything in Intensive',
      'Custom Meal Plans',
      'Weekly Check-ins',
      'Phone Support',
    ],
    color: 'bg-red-500',
  },
];

export default function PlanSelectionStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(state.data.planType || null);

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan(planType);
    updateData({ planType: planType as any });
  };

  const handleContinue = () => {
    if (selectedPlan) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">7 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose your plan</h1>
          <p className="text-gray-600">Select the plan that best fits your goals and lifestyle</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={`cursor-pointer transition-all relative ${
                selectedPlan === plan.key
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handlePlanSelect(plan.key)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-8 h-8 ${plan.color} rounded-full mx-auto mb-2`} />
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <p className="text-sm text-gray-600">{plan.subtitle}</p>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.key && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedPlan} 
            size="lg"
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
