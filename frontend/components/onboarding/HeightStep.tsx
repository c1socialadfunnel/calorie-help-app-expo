import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export default function HeightStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [height, setHeight] = useState(state.data.heightCm?.toString() || '');

  const handleNext = () => {
    const heightValue = parseInt(height);
    if (heightValue && heightValue >= 100 && heightValue <= 250) {
      updateData({ heightCm: heightValue });
      nextStep();
    }
  };

  const isValid = () => {
    const heightValue = parseInt(height);
    return heightValue && heightValue >= 100 && heightValue <= 250;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">2 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your height?</h1>
          <p className="text-gray-600">We need this to calculate your BMR and daily calorie needs</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              className="text-center text-4xl font-bold border-0 border-b-2 border-blue-600 rounded-none bg-transparent focus:ring-0 w-32"
              min="100"
              max="250"
            />
            <span className="text-2xl font-semibold text-gray-600">cm</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">Enter your height in centimeters (100-250 cm)</p>
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
