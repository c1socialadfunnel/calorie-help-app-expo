import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft, Laptop, PersonStanding, Bike, Zap } from 'lucide-react';

const activityLevels = [
  {
    key: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: Laptop,
  },
  {
    key: 'low_active',
    title: 'Low Active',
    description: 'Light exercise 1-3 days/week',
    icon: PersonStanding,
  },
  {
    key: 'active',
    title: 'Active',
    description: 'Moderate exercise 3-5 days/week',
    icon: Bike,
  },
  {
    key: 'very_active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    icon: Zap,
  },
];

export default function ActivityLevelStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const handleActivitySelect = (activityLevel: string) => {
    updateData({ activityLevel: activityLevel as any });
    setTimeout(nextStep, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">5 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your activity level?</h1>
          <p className="text-gray-600">This helps us calculate how many calories you burn daily</p>
        </div>

        <div className="space-y-4">
          {activityLevels.map((level) => (
            <Card
              key={level.key}
              className={`cursor-pointer transition-all ${
                state.data.activityLevel === level.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleActivitySelect(level.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <level.icon className={`h-6 w-6 ${
                    state.data.activityLevel === level.key ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      state.data.activityLevel === level.key ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {level.title}
                    </h3>
                    <p className={`text-sm ${
                      state.data.activityLevel === level.key ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {level.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
