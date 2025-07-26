import React, { createContext, useContext, useReducer } from 'react';

interface OnboardingData {
  gender?: 'male' | 'female';
  heightCm?: number;
  birthDate?: string;
  currentWeightKg?: number;
  targetWeightKg?: number;
  activityLevel?: 'sedentary' | 'low_active' | 'active' | 'very_active';
  planType?: 'steady' | 'intensive' | 'accelerated';
}

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
}

type OnboardingAction =
  | { type: 'UPDATE_DATA'; payload: Partial<OnboardingData> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' };

const initialState: OnboardingState = {
  data: {},
  currentStep: 0,
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculateCalorieTarget: () => number;
} | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const updateData = (data: Partial<OnboardingData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const calculateCalorieTarget = (): number => {
    const { gender, heightCm, currentWeightKg, birthDate, activityLevel, planType } = state.data;
    
    if (!gender || !heightCm || !currentWeightKg || !birthDate || !activityLevel || !planType) {
      return 2000; // Default value
    }

    // Calculate age
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      low_active: 1.375,
      active: 1.55,
      very_active: 1.725,
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Apply plan-based deficit
    const planDeficits = {
      steady: 250,    // 0.5 lb/week
      intensive: 500, // 1 lb/week
      accelerated: 750, // 1.5 lb/week
    };
    
    const targetCalories = Math.round(tdee - planDeficits[planType]);
    
    // Ensure minimum calories
    return Math.max(targetCalories, gender === 'male' ? 1500 : 1200);
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        dispatch,
        updateData,
        nextStep,
        prevStep,
        calculateCalorieTarget,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
