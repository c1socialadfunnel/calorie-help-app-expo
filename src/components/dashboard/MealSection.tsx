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
    shadow