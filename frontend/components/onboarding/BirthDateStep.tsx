import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '../../context/OnboardingContext';
import { ArrowLeft } from 'lucide-react';

export default function BirthDateStep() {
  const { state, updateData, nextStep, prevStep } = useOnboarding();
  const [birthDate, setBirthDate] = useState(state.data.birthDate || '');

  const handleNext = () => {
    if (isValid()) {
      updateData({ birthDate });
      nextStep();
    }
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const isValid = () => {
    if (!birthDate) return false;
    const age = getAge(birthDate);
    return age >= 13 && age <= 120;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span className="text-sm text-gray-500">3 of 8</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">When were you born?</h1>
          <p className="text-gray-600">Your age helps us calculate your metabolic rate more accurately</p>
        </div>

        <div className="mb-8">
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="text-center text-lg"
            max={new Date().toISOString().split('T')[0]}
            min="1900-01-01"
          />
          {birthDate && (
            <div className="text-center mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">Age: {getAge(birthDate)} years</p>
            </div>
          )}
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
