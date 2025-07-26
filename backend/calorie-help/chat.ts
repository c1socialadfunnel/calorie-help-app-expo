import { api } from "encore.dev/api";

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface SendMessageResponse {
  sessionId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

// Sends a message to the AI health coach
export const sendMessage = api<SendMessageRequest, SendMessageResponse>(
  { expose: true, method: "POST", path: "/chat/send-message" },
  async (req) => {
    const sessionId = req.sessionId || `session_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId,
      role: "user",
      content: req.message,
      createdAt: timestamp,
    };

    // Simulate AI response
    const responses = [
      "That's a great question! Based on your goals, I'd recommend focusing on whole foods and balanced nutrition.",
      "For optimal results, try to include protein, healthy fats, and complex carbohydrates in each meal.",
      "Remember to stay hydrated and listen to your body's hunger cues throughout the day.",
      "Consider meal prepping to stay on track with your nutrition goals during busy days.",
      "It's important to maintain a sustainable approach to your nutrition journey.",
    ];

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      sessionId,
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      createdAt: new Date(Date.now() + 1000).toISOString(),
    };

    return {
      sessionId,
      userMessage,
      assistantMessage,
    };
  }
);
