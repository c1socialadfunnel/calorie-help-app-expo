import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/common/ProgressBar';
import MacroCard from '../components/dashboard/MacroCard';
import MealSection from '../components/dashboard/MealSection';
import Navigation from '../components/layout/Navigation';
import { Camera, MessageCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, getTodaysCalories, getTodaysMacros, getTodaysFoodLogs } = useUser();

  if (!user) {
    return null;
  }

  const todaysCalories = getTodaysCalories();
  const todaysMacros = getTodaysMacros();
  const todaysFoodLogs = getTodaysFoodLogs();
  const calorieProgress = (todaysCalories / user.dailyCalorieTarget) * 100;

  const groupedMeals = {
    breakfast: todaysFoodLogs.filter(log => log.mealType === 'breakfast'),
    lunch: todaysFoodLogs.filter(log => log.mealType === 'lunch'),
    dinner: todaysFoodLogs.filter(log => log.mealType === 'dinner'),
    snack: todaysFoodLogs.filter(log => log.mealType === 'snack'),
  };

  const getMotivationalMessage = () => {
    const messages = {
      steady: "Steady progress leads to lasting results! 🌱",
      intensive: "You're crushing your intensive plan! 💪",
      accelerated: "Accelerated progress, amazing dedication! 🚀",
    };
    return messages[user.planType];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning! 👋</h1>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {user.subscriptionStatus === 'pro' ? 'PRO' : 'FREE'}
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="mb-6">
          <CardContent className="p-4 text-center">
            <p className="text-gray-700 font-medium">{getMotivationalMessage()}</p>
          </CardContent>
        </Card>

        {/* Calorie Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-blue-600">
                {todaysCalories} / {user.dailyCalorieTarget}
              </p>
              <p className="text-sm text-gray-600">calories</p>
            </div>
            <ProgressBar progress={calorieProgress} />
            <p className="text-sm text-gray-600 text-center mt-2">
              {Math.max(0, user.dailyCalorieTarget - todaysCalories)} calories remaining
            </p>
          </CardContent>
        </Card>

        {/* Macros */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Macronutrients</h2>
          <div className="flex space-x-2">
            <MacroCard
              title="Protein"
              value={todaysMacros.protein}
              unit="g"
              color="bg-red-500"
            />
            <MacroCard
              title="Carbs"
              value={todaysMacros.carbs}
              unit="g"
              color="bg-green-500"
            />
            <MacroCard
              title="Fat"
              value={todaysMacros.fat}
              unit="g"
              color="bg-blue-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/ai-food-logger">
            <Button className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <Camera className="h-5 w-5" />
              <span className="text-sm">AI Calorie Count</span>
            </Button>
          </Link>
          <Link to="/ai-coach">
            <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Ask Coach</span>
            </Button>
          </Link>
        </div>

        {/* Meals */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Meals</h2>
          <MealSection title="Breakfast" meals={groupedMeals.breakfast} />
          <MealSection title="Lunch" meals={groupedMeals.lunch} />
          <MealSection title="Dinner" meals={groupedMeals.dinner} />
          <MealSection title="Snacks" meals={groupedMeals.snack} />
        </div>
      </div>

      <Navigation />
    </div>
  );
}
