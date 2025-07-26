import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../services/supabase';

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
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'CLEAR_USER' });
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profile) {
        const userProfile: UserProfile = {
          id: profile.user_id,
          gender: profile.gender,
          heightCm: profile.height_cm,
          birthDate: profile.birth_date,
          currentWeightKg: profile.current_weight_kg,
          targetWeightKg: profile.target_weight_kg,
          activityLevel: profile.activity_level,
          planType: profile.plan_type,
          dailyCalorieTarget: profile.daily_calorie_target,
          subscriptionStatus: profile.subscription_status === 'active' ? 'pro' : 'free',
        };
        dispatch({ type: 'SET_USER', payload: userProfile });

        // Load food logs
        await loadFoodLogs(userId);
      } else {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadFoodLogs = async (userId: string) => {
    try {
      const { data: logs, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (error) throw error;

      const foodLogs: FoodLog[] = logs.map(log => ({
        id: log.id,
        foodName: log.custom_food_name,
        servingSizeG: log.serving_size_g,
        calories: log.calories,
        proteinG: log.protein_g,
        carbsG: log.carbs_g,
        fatG: log.fat_g,
        mealType: log.meal_type,
        loggedAt: log.logged_at,
      }));

      dispatch({ type: 'SET_FOOD_LOGS', payload: foodLogs });
    } catch (error) {
      console.error('Error loading food logs:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const saveUser = async (user: UserProfile) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: authUser.id,
          gender: user.gender,
          height_cm: user.heightCm,
          birth_date: user.birthDate,
          current_weight_kg: user.currentWeightKg,
          target_weight_kg: user.targetWeightKg,
          activity_level: user.activityLevel,
          plan_type: user.planType,
          daily_calorie_target: user.dailyCalorieTarget,
        });

      if (error) throw error;

      const updatedUser = { ...user, id: authUser.id };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const addFoodLog = async (foodLogData: Omit<FoodLog, 'id' | 'loggedAt'>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          user_id: authUser.id,
          custom_food_name: foodLogData.foodName,
          serving_size_g: foodLogData.servingSizeG,
          calories: foodLogData.calories,
          protein_g: foodLogData.proteinG,
          carbs_g: foodLogData.carbsG,
          fat_g: foodLogData.fatG,
          meal_type: foodLogData.mealType,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newFoodLog: FoodLog = {
        id: data.id,
        foodName: data.custom_food_name,
        servingSizeG: data.serving_size_g,
        calories: data.calories,
        proteinG: data.protein_g,
        carbsG: data.carbs_g,
        fatG: data.fat_g,
        mealType: data.meal_type,
        loggedAt: data.logged_at,
      };

      dispatch({ type: 'ADD_FOOD_LOG', payload: newFoodLog });
    } catch (error) {
      console.error('Error adding food log:', error);
      throw error;
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
