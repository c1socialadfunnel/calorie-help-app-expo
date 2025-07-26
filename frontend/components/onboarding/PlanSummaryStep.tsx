import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUser } from '../../context/UserContext';
import { ArrowLeft, CheckCircle, Camera, MessageCircle, BarChart3, Utensils } from 'lucide-react';

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
      subscriptionStatus: 'pro' as const,
    };

    await saveUser(userProfile);
  };

  const calorieTarget = calculateCalorieTarget();
  
  const getMacroTargets = () => {
    const proteinCalories = calorieTarget * 0.3;
    const carbsCalories = calorieTarget * 0.4;
    const fatCalories = calorieTarget * 0.3;
    
    return {
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fat: Math.round(fatCalories / 9),
    };
  };

  const macros = getMacroTargets();

  const getPlanDetails = () => {
    const plans = {
      steady: {
        title: 'Steady Plan',
        description: 'Gradual, sustainable weight loss',
        expectedLoss: '0.5 lb/week',
      },
      intensive: {
        title: 'Intensive Plan',
        description: 'Balanced approach to weight loss',
        expectedLoss: '1 lb/week',
      },
      accelerated: {
        title: 'Accelerated Plan',
        description: 'Fast-track to your goals',
        expectedLoss: '1.5 lb/week',
      },
    };
    
    return plans[state.data.planType!];
  };

  const planDetails = getPlanDetails();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">Summary</span>
        </div>

        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Plan is Ready!</h1>
          <p className="text-gray-600">Here's your personalized nutrition plan based on your goals</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{planDetails.title}</CardTitle>
              <p className="text-gray-600">{planDetails.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{calorieTarget}</p>
                  <p className="text-sm text-gray-600">Daily Calories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{planDetails.expectedLoss}</p>
                  <p className="text-sm text-gray-600">Expected Loss</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Macro Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 font-bold">{macros.protein}g</span>
                  </div>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">{macros.carbs}g</span>
                  </div>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">{macros.fat}g</span>
                  </div>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">AI Food Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">24/7 AI Health Coach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Progress Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Utensils className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Personalized Meal Plans</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={handleComplete} size="lg" className="px-8">
            Start My Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
