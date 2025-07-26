import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodLog } from '../../context/UserContext';

interface MealSectionProps {
  title: string;
  meals: FoodLog[];
}

export default function MealSection({ title, meals }: MealSectionProps) {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.calories}>{totalCalories} cal</Text>
      </View>
      
      {meals.length > 0 ? (
        <View style={styles.mealsList}>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.foodName}</Text>
                <Text style={styles.mealDetails}>
                  {meal.servingSizeG}g • {meal.calories} cal
                </Text>
              </View>
              <View style={styles.macros}>
                <Text style={styles.macroText}>P: {Math.round(meal.proteinG)}g</Text>
                <Text style={styles.macroText}>C: {Math.round(meal.carbsG)}g</Text>
                <Text style={styles.macroText}>F: {Math.round(meal.fatG)}g</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#007AFF" />
          <Text style={styles.addButtonText}>Add {title.toLowerCase()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  mealsList: {
    gap: 8,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  mealDetails: {
    fontSize: 12,
    color: '#666',
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
});
