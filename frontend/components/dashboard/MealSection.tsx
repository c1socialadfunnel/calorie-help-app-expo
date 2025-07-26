import React from 'react';
import { Plus } from 'lucide-react';
import { FoodLog } from '../../context/UserContext';
import { Button } from '@/components/ui/button';

interface MealSectionProps {
  title: string;
  meals: FoodLog[];
  onAddMeal?: () => void;
}

export default function MealSection({ title, meals, onAddMeal }: MealSectionProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm font-medium text-blue-600">{totalCalories} cal</span>
      </div>
      
      {meals.length > 0 ? (
        <div className="space-y-2">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{meal.foodName}</p>
                <p className="text-xs text-gray-500">
                  {meal.servingSizeG}g • {meal.calories} cal
                </p>
              </div>
              <div className="flex space-x-2 text-xs text-gray-500">
                <span>P: {Math.round(meal.proteinG)}g</span>
                <span>C: {Math.round(meal.carbsG)}g</span>
                <span>F: {Math.round(meal.fatG)}g</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed border-gray-300 text-blue-600 hover:bg-blue-50"
          onClick={onAddMeal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title.toLowerCase()}
        </Button>
      )}
    </div>
  );
}
