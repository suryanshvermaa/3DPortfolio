import Groq from "groq-sdk";
import { redis } from "../api/config";
export interface IChat{
    messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    timeoutHandle?: NodeJS.Timeout;
}

export async function getSession(sessionId: string): Promise<IChat | undefined> {
  try {
    const data = await redis.get(sessionId);
    if (!data) return undefined;
    
    // Check if data is already an object
    if (typeof data === 'object') {
      return data as IChat;
    }
    
    // Otherwise parse it
    return JSON.parse(String(data));
  } catch (error) {
    console.error('Error getting session:', error);
    return undefined;
  }
}

export async function setSession(sessionId: string, data: IChat): Promise<void> {
  try {
    // Remove timeoutHandle before storing (can't serialize functions)
    const sessionData = {
      messages: data.messages
    };
    await redis.set(sessionId, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error setting session:', error);
    throw error;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(sessionId);
}
