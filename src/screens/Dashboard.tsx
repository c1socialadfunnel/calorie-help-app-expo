import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/common/ProgressBar';
import MacroCard from '../components/dashboard/MacroCard';
import MealSection from '../components/dashboard/MealSection';

export default function Dashboard() {
  const navigation = useNavigation();
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>
              {user.subscriptionStatus === 'pro' ? 'PRO' : 'FREE'}
            </Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
        </View>

        {/* Calorie Progress */}
        <View style={styles.calorieCard}>
          <Text style={styles.cardTitle}>Daily Calories</Text>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieCount}>
              {todaysCalories} / {user.dailyCalorieTarget}
            </Text>
            <Text style={styles.calorieLabel}>calories</Text>
          </View>
          <ProgressBar progress={calorieProgress} color="#007AFF" />
          <Text style={styles.remainingCalories}>
            {Math.max(0, user.dailyCalorieTarget - todaysCalories)} calories remaining
          </Text>
        </View>

        {/* Macros */}
        <View style={styles.macrosContainer}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <View style={styles.macrosRow}>
            <MacroCard
              title="Protein"
              value={todaysMacros.protein}
              unit="g"
              color="#FF6B6B"
            />
            <MacroCard
              title="Carbs"
              value={todaysMacros.carbs}
              unit="g"
              color="#4ECDC4"
            />
            <MacroCard
              title="Fat"
              value={todaysMacros.fat}
              unit="g"
              color="#45B7D1"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AIFoodLogger' as never)}
          >
            <Ionicons name="camera" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>AI Calorie Count</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AI Coach' as never)}
          >
            <Ionicons name="chatbubble" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Ask Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Meals */}
        <View style={styles.mealsContainer}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <MealSection title="Breakfast" meals={groupedMeals.breakfast} />
          <MealSection title="Lunch" meals={groupedMeals.lunch} />
          <MealSection title="Dinner" meals={groupedMeals.dinner} />
          <MealSection title="Snacks" meals={groupedMeals.snack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subscriptionBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  motivationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  motivationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  calorieCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  calorieInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  remainingCalories: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  macrosContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  mealsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
});
