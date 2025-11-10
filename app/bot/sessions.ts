import Groq from "groq-sdk";
import { redis } from "../api/config";
export interface IChat{
    messages: Groq.Chat.Completions.ChatCompletionMessageParam[];
    timeoutHandle?: NodeJS.Timeout;
}

export async function getSession(sessionId: string): Promise<IChat | undefined> {
  const data = await redis.get(sessionId);
  return data ? JSON.parse(String(data)) : undefined;
}

export async function setSession(sessionId: string, data: IChat): Promise<void> {
  await redis.set(sessionId, JSON.stringify(data));
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(sessionId);
}
