import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '../../context/OnboardingContext';
import { Utensils, Camera, MessageCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Utensils,
    title: 'Smart Meal Planning',
    description: 'Get personalized meal recommendations based on your goals and preferences.',
  },
  {
    icon: Camera,
    title: 'AI Food Analysis',
    description: 'Simply take a photo of your meal and let AI analyze the nutritional content.',
  },
  {
    icon: MessageCircle,
    title: 'AI Health Coach',
    description: '24/7 nutrition guidance from your personal AI health coach.',
  },
];

export default function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <Utensils className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Calorie.Help</h1>
          <p className="text-xl text-gray-600">Your AI-powered nutrition companion</p>
        </div>

        <div className="grid gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={nextStep} size="lg" className="px-8">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
