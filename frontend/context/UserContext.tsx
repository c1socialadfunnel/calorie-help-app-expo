import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
  isAuthenticated: boolean;
}

type UserAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_FOOD_LOGS'; payload: FoodLog[] }
  | { type: 'ADD_FOOD_LOG'; payload: FoodLog }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'CLEAR_USER' };

const initialState: UserState = {
  user: null,
  foodLogs: [],
  isLoading: true,
  isAuthenticated: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'SET_FOOD_LOGS':
      return { ...state, foodLogs: action.payload };
    case 'ADD_FOOD_LOG':
      return { ...state, foodLogs: [...state.foodLogs, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null, foodLogs: [], isAuthenticated: false };
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveUser: (user: UserProfile) => Promise<void>;
  addFoodLog: (foodLog: Omit<FoodLog, 'id' | 'loggedAt'>) => Promise<void>;
  getTodaysFoodLogs: () => FoodLog[];
  getTodaysCalories: () => number;
  getTodaysMacros: () => { protein: number; carbs: number; fat: number };
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedFoodLogs = localStorage.getItem('foodLogs');
        
        if (savedUser) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'SET_USER', payload: user });
          
          if (savedFoodLogs) {
            const foodLogs = JSON.parse(savedFoodLogs);
            dispatch({ type: 'SET_FOOD_LOGS', payload: foodLogs });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Simulate sign up
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  const signIn = async (email: string, password: string) => {
    // Simulate sign in
    await new Promise(resolve => setTimeout(resolve, 1000));
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('foodLogs');
    dispatch({ type: 'CLEAR_USER' });
  };

  const saveUser = async (user: UserProfile) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'SET_USER', payload: user });
  };

  const addFoodLog = async (foodLogData: Omit<FoodLog, 'id' | 'loggedAt'>) => {
    const newFoodLog: FoodLog = {
      ...foodLogData,
      id: Date.now().toString(),
      loggedAt: new Date().toISOString(),
    };

    const updatedFoodLogs = [...state.foodLogs, newFoodLog];
    localStorage.setItem('foodLogs', JSON.stringify(updatedFoodLogs));
    dispatch({ type: 'ADD_FOOD_LOG', payload: newFoodLog });
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
        signUp,
        signIn,
        signOut,
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
    isAuthenticated: context.state.isAuthenticated,
    signUp: context.signUp,
    signIn: context.signIn,
    signOut: context.signOut,
    saveUser: context.saveUser,
    addFoodLog: context.addFoodLog,
    getTodaysFoodLogs: context.getTodaysFoodLogs,
    getTodaysCalories: context.getTodaysCalories,
    getTodaysMacros: context.getTodaysMacros,
  };
}
