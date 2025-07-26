import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

export interface AnalysisResult {
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

export interface ChatResponse {
  sessionId: string;
  userMessage: {
    id: string;
    session_id: string;
    role: 'user';
    content: string;
    created_at: string;
  };
  assistantMessage: {
    id: string;
    session_id: string;
    role: 'assistant';
    content: string;
    created_at: string;
  };
}

// Convert image to base64 for AI analysis
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    throw new Error('Failed to convert image to base64');
  }
};

export const analyzeFood = async (params: {
  description?: string;
  imageUri?: string;
}): Promise<AnalysisResult> => {
  try {
    let requestBody: any = {};
    
    if (params.imageUri) {
      const base64Image = await convertImageToBase64(params.imageUri);
      requestBody.imageUrl = base64Image;
    }
    
    if (params.description) {
      requestBody.description = params.description;
    }
    
    const { data, error } = await supabase.functions.invoke('analyze-food', {
      body: requestBody
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Food analysis error:', error);
    throw error;
  }
};

export const sendMessage = async (message: string, sessionId?: string): Promise<ChatResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-message', {
      body: {
        message,
        sessionId
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

export const createCheckoutSession = async (planType: 'steady' | 'intensive' | 'accelerated'): Promise<{
  sessionId: string;
  url: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        planType,
        successUrl: 'caloriehelp://payment-success',
        cancelUrl: 'caloriehelp://payment-cancel'
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

export const manageSubscription = async (): Promise<{
  success: boolean;
  url: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('manage-subscription', {
      body: {
        action: 'get_portal_url',
        returnUrl: 'caloriehelp://billing-return'
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Billing portal error:', error);
    throw error;
  }
};

export const deleteAccount = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: {}
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Delete account error:', error);
    throw error;
  }
};
