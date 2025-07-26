import { api } from "encore.dev/api";

export interface UserProfile {
  id: string;
  gender: "male" | "female";
  heightCm: number;
  birthDate: string;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: "sedentary" | "low_active" | "active" | "very_active";
  planType: "steady" | "intensive" | "accelerated";
  dailyCalorieTarget: number;
  subscriptionStatus: "free" | "pro";
}

export interface CreateUserProfileRequest {
  profile: UserProfile;
}

export interface CreateUserProfileResponse {
  success: boolean;
  profile: UserProfile;
}

// Creates or updates a user profile
export const createUserProfile = api<CreateUserProfileRequest, CreateUserProfileResponse>(
  { expose: true, method: "POST", path: "/user/profile" },
  async (req) => {
    // In a real implementation, this would save to a database
    return {
      success: true,
      profile: req.profile,
    };
  }
);

export interface GetUserProfileResponse {
  profile: UserProfile | null;
}

// Gets the current user's profile
export const getUserProfile = api<void, GetUserProfileResponse>(
  { expose: true, method: "GET", path: "/user/profile" },
  async () => {
    // In a real implementation, this would fetch from a database
    return {
      profile: null,
    };
  }
);
