import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Camera, Upload, Loader2 } from 'lucide-react';

interface AnalysisResult {
  foodName: string;
  estimatedServingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: number;
  healthInsights: string[];
}

export default function AIFoodLogger() {
  const navigate = useNavigate();
  const { addFoodLog } = useUser();
  const { toast } = useToast();
  const [textDescription, setTextDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeFood = async (description: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: AnalysisResult = {
        foodName: description || 'Mixed meal',
        estimatedServingSize: '150g',
        calories: Math.floor(Math.random() * 400) + 200,
        proteinG: Math.floor(Math.random() * 30) + 10,
        carbsG: Math.floor(Math.random() * 50) + 20,
        fatG: Math.floor(Math.random() * 20) + 5,
        confidence: 0.85,
        healthInsights: [
          'Good source of protein',
          'Contains healthy fats',
          'Rich in vitamins and minerals'
        ],
      };
      
      setAnalysisResult(mockResult);
    } catch (error: any) {
      console.error('Error analyzing food:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze food. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeFood(`Image of ${file.name}`);
    }
  };

  const handleTextAnalysis = () => {
    if (!textDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a food description.',
        variant: 'destructive',
      });
      return;
    }
    analyzeFood(textDescription);
  };

  const logFood = async () => {
    if (!analysisResult) return;

    try {
      await addFoodLog({
        foodName: analysisResult.foodName,
        servingSizeG: parseFloat(analysisResult.estimatedServingSize.replace(/[^\d.]/g, '')) || 100,
        calories: analysisResult.calories,
        proteinG: analysisResult.proteinG,
        carbsG: analysisResult.carbsG,
        fatG: analysisResult.fatG,
        mealType: selectedMealType,
      });

      toast({
        title: 'Success',
        description: 'Food logged successfully!',
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error logging food:', error);
      toast({
        title: 'Error',
        description: 'Failed to log food. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4">AI Food Logger</h1>
        </div>

        {!analysisResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Take a Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-6 w-6" />
                    <span>Camera</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload</span>
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <span className="text-gray-500">OR</span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Describe Your Food</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., Grilled chicken breast with rice and vegetables"
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleTextAnalysis}
                  disabled={!textDescription.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Analyze Food
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{analysisResult.foodName}</h3>
                  <p className="text-gray-600">Serving: {analysisResult.estimatedServingSize}</p>
                  <p className="text-blue-600 text-sm">Confidence: {Math.round(analysisResult.confidence * 100)}%</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Calories:</span>
                    <span className="font-semibold text-blue-600">{analysisResult.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Protein:</span>
                    <span className="font-semibold text-blue-600">{analysisResult.proteinG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Carbs:</span>
                    <span className="font-semibold text-blue-600">{analysisResult.carbsG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Fat:</span>
                    <span className="font-semibold text-blue-600">{analysisResult.fatG}g</span>
                  </div>
                </div>

                {analysisResult.healthInsights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Health Insights:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysisResult.healthInsights.map((insight, index) => (
                        <li key={index}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meal Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                    <Button
                      key={mealType}
                      variant={selectedMealType === mealType ? 'default' : 'outline'}
                      onClick={() => setSelectedMealType(mealType)}
                      className="capitalize"
                    >
                      {mealType}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setAnalysisResult(null)}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button onClick={logFood} className="flex-1">
                Log Food
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
