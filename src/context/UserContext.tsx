import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  gender: 'male' | 'female';
  heightCm: number;
  birthDate: string;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'low_active' | 'active' | 'very_active';
  planType: 'steady' | 'intensive' | 'accelerated';
  dailyCalorieTarget: number;
  subscriptionStatus: 'free' | 'pro';
}

export interface FoodLog {
  id: string;
  foodName: string;
  servingSizeG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
}

interface UserState {
  user: UserProfile | null;
  foodLogs: FoodLog[];
  isLoading: boolean;
}

type UserAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_FOOD_LOGS'; payload: FoodLog[] }
  | { type: 'ADD_FOOD_LOG'; payload: FoodLog }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_USER' };

const initialState: UserState = {
  user: null,
  foodLogs: [],
  isLoading: true,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FOOD_LOGS':
      return { ...state, foodLogs: action.payload };
    case 'ADD_FOOD_LOG':
      return { ...state, foodLogs: [...state.foodLogs, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null, foodLogs: [] };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  saveUser: (user: UserProfile) => Promise<void>;
  addFoodLog: (foodLog: Omit<FoodLog, 'id' | 'loggedAt'>) => Promise<void>;
  getTodaysFoodLogs: () => FoodLog[];
  getTodaysCalories: () => number;
  getTodaysMacros: () => { protein: number; carbs: number; fat: number };
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_profile');
      const foodLogsData = await AsyncStorage.getItem('food_logs');
      
      if (userData) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(userData) });
      }
      
      if (foodLogsData) {
        dispatch({ type: 'SET_FOOD_LOGS', payload: JSON.parse(foodLogsData) });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveUser = async (user: UserProfile) => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const addFoodLog = async (foodLogData: Omit<FoodLog, 'id' | 'loggedAt'>) => {
    try {
      const newFoodLog: FoodLog = {
        ...foodLogData,
        id: Date.now().toString(),
        loggedAt: new Date().toISOString(),
      };
      
      const updatedLogs = [...state.foodLogs, newFoodLog];
      await AsyncStorage.setItem('food_logs', JSON.stringify(updatedLogs));
      dispatch({ type: 'ADD_FOOD_LOG', payload: newFoodLog });
    } catch (error) {
      console.error('Error adding food log:', error);
    }
  };

  const getTodaysFoodLogs = () => {
    const today = new Date().toDateString();
    return state.foodLogs.filter(log => 
      new Date(log.loggedAt).toDateString() === today
    );
  };

  const getTodaysCalories = () => {
    return getTodaysFoodLogs().reduce((total, log) => total + log.calories, 0);
  };

  const getTodaysMacros = () => {
    const todaysLogs = getTodaysFoodLogs();
    return todaysLogs.reduce(
      (totals, log) => ({
        protein: totals.protein + log.proteinG,
        carbs: totals.carbs + log.carbsG,
        fat: totals.fat + log.fatG,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        saveUser,
        addFoodLog,
        getTodaysFoodLogs,
        getTodaysCalories,
        getTodaysMacros,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return {
    user: context.state.user,
    foodLogs: context.state.foodLogs,
    isLoading: context.state.isLoading,
    saveUser: context.saveUser,
    addFoodLog: context.addFoodLog,
    getTodaysFoodLogs: context.getTodaysFoodLogs,
    getTodaysCalories: context.getTodaysCalories,
    getTodaysMacros: context.getTodaysMacros,
  };
}
