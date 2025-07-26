import { api } from "encore.dev/api";

export interface AnalyzeFoodRequest {
  imageUrl?: string;
  description?: string;
}

export interface AnalyzeFoodResponse {
  foodName: string;
  estimatedServingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: number;
  healthInsights: string[];
  ingredients: string[];
}

// Analyzes food from image or text description using AI
export const analyzeFood = api<AnalyzeFoodRequest, AnalyzeFoodResponse>(
  { expose: true, method: "POST", path: "/analyze-food" },
  async (req) => {
    // Simulate AI food analysis
    const foodName = req.description || "Mixed meal";
    
    // Mock analysis result
    const result: AnalyzeFoodResponse = {
      foodName,
      estimatedServingSize: "150g",
      calories: Math.floor(Math.random() * 400) + 200,
      proteinG: Math.floor(Math.random() * 30) + 10,
      carbsG: Math.floor(Math.random() * 50) + 20,
      fatG: Math.floor(Math.random() * 20) + 5,
      confidence: 0.85,
      healthInsights: [
        "Good source of protein",
        "Contains healthy fats",
        "Rich in vitamins and minerals"
      ],
      ingredients: ["protein", "vegetables", "grains"]
    };

    return result;
  }
);
