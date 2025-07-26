import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft, User } from 'lucide-react';

export default function GenderStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();

  const handleGenderSelect = (gender: 'male' | 'female') => {
    updateData({ gender });
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
          <span className="text-sm text-gray-500">1 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your gender?</h1>
          <p className="text-gray-600">This helps us calculate your personalized calorie needs</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              state.data.gender === 'male' 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleGenderSelect('male')}
          >
            <CardContent className="p-8 text-center">
              <User className={`h-12 w-12 mx-auto mb-4 ${
                state.data.gender === 'male' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                state.data.gender === 'male' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                Male
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              state.data.gender === 'female' 
                ? 'border-blue-500 bg-blue-50' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleGenderSelect('female')}
          >
            <CardContent className="p-8 text-center">
              <User className={`h-12 w-12 mx-auto mb-4 ${
                state.data.gender === 'female' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                state.data.gender === 'female' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                Female
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
