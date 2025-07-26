import { api } from "encore.dev/api";

export interface FoodLog {
  id: string;
  foodName: string;
  servingSizeG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  loggedAt: string;
}

export interface CreateFoodLogRequest {
  foodName: string;
  servingSizeG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface CreateFoodLogResponse {
  success: boolean;
  foodLog: FoodLog;
}

// Creates a new food log entry
export const createFoodLog = api<CreateFoodLogRequest, CreateFoodLogResponse>(
  { expose: true, method: "POST", path: "/food-log" },
  async (req) => {
    const foodLog: FoodLog = {
      id: `log_${Date.now()}`,
      ...req,
      loggedAt: new Date().toISOString(),
    };

    return {
      success: true,
      foodLog,
    };
  }
);

export interface GetFoodLogsResponse {
  foodLogs: FoodLog[];
}

// Gets all food logs for the current user
export const getFoodLogs = api<void, GetFoodLogsResponse>(
  { expose: true, method: "GET", path: "/food-log" },
  async () => {
    // In a real implementation, this would fetch from a database
    return {
      foodLogs: [],
    };
  }
);
