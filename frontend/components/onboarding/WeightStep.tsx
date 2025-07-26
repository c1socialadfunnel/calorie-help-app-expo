import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export default function WeightStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [weight, setWeight] = useState(state.data.currentWeightKg?.toString() || '');

  const handleNext = () => {
    const weightValue = parseFloat(weight);
    if (weightValue && weightValue >= 30 && weightValue <= 300) {
      updateData({ currentWeightKg: weightValue });
      nextStep();
    }
  };

  const isValid = () => {
    const weightValue = parseFloat(weight);
    return weightValue && weightValue >= 30 && weightValue <= 300;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">4 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your current weight?</h1>
          <p className="text-gray-600">This helps us track your progress and calculate your calorie needs</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70.5"
              className="text-center text-4xl font-bold border-0 border-b-2 border-blue-600 rounded-none bg-transparent focus:ring-0 w-32"
              min="30"
              max="300"
              step="0.1"
            />
            <span className="text-2xl font-semibold text-gray-600">kg</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">Enter your weight in kilograms (30-300 kg)</p>
        </div>

        <Button 
          onClick={handleNext} 
          disabled={!isValid()} 
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
