import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export default function TargetWeightStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [targetWeight, setTargetWeight] = useState(state.data.targetWeightKg?.toString() || '');

  const handleNext = () => {
    const weightValue = parseFloat(targetWeight);
    if (weightValue && weightValue >= 30 && weightValue <= 300) {
      updateData({ targetWeightKg: weightValue });
      nextStep();
    }
  };

  const isValid = () => {
    const weightValue = parseFloat(targetWeight);
    return weightValue && weightValue >= 30 && weightValue <= 300;
  };

  const getWeightDifference = () => {
    const current = state.data.currentWeightKg;
    const target = parseFloat(targetWeight);
    
    if (!current || !target) return null;
    
    const diff = current - target;
    if (Math.abs(diff) < 0.1) return 'maintain';
    return diff > 0 ? 'lose' : 'gain';
  };

  const getGoalText = () => {
    const goal = getWeightDifference();
    const current = state.data.currentWeightKg;
    const target = parseFloat(targetWeight);
    
    if (!goal || !current || !target) return '';
    
    const diff = Math.abs(current - target);
    
    switch (goal) {
      case 'lose':
        return `Goal: Lose ${diff.toFixed(1)} kg`;
      case 'gain':
        return `Goal: Gain ${diff.toFixed(1)} kg`;
      case 'maintain':
        return 'Goal: Maintain current weight';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">6 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your target weight?</h1>
          <p className="text-gray-600">This helps us create a personalized plan to reach your goals</p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="65.0"
              className="text-center text-4xl font-bold border-0 border-b-2 border-blue-600 rounded-none bg-transparent focus:ring-0 w-32"
              min="30"
              max="300"
              step="0.1"
            />
            <span className="text-2xl font-semibold text-gray-600">kg</span>
          </div>
          
          {getGoalText() && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">{getGoalText()}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-4">Enter your target weight in kilograms (30-300 kg)</p>
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
