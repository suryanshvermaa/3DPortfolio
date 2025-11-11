import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(messages: Groq.Chat.Completions.ChatCompletionMessageParam[]) {
    return await groq.chat.completions.create({
        messages: messages,
        model: "openai/gpt-oss-120b", //OpenAI GPT-OSS 120B
        temperature: 1.0,
        tool_choice: "auto",
        tools: [
            {
                type: "function",
                function: {
                    name: "getOverview",
                    description: "Provides a welcome message and overview of what the portfolio assistant can help with, including available topics and example questions."
                }
            },
            {
                type: "function",
                function: {
                    name: "getSkillsOverview",
                    description: "Returns Suryansh's technical skills organized by category: Languages, Frontend, Backend, Databases, Cloud & DevOps, and Tools."
                }
            },
            {
                type: "function",
                function: {
                    name: "getExperienceOverview",
                    description: "Provides an overview of Suryansh's professional experience, expertise areas, and work background."
                }
            },
            {
                type: "function",
                function: {
                    name: "getProjectsOverview",
                    description: "Lists Suryansh's featured projects including SCS Cloud Platform, ExpressPro, Event Management App, and the 3D Portfolio website with brief descriptions."
                }
            },
            {
                type: "function",
                function: {
                    name: "getSCSCloudDetails",
                    description: "Provides detailed information about the SCS Cloud Platform project including features (HLS transcoding, static hosting, object storage), tech stack, and architecture highlights."
                }
            },
            {
                type: "function",
                function: {
                    name: "getContactInfo",
                    description: "Returns information about how to contact Suryansh including email, LinkedIn, GitHub, and resume download options."
                }
            },
            {
                type: "function",
                function: {
                    name: "getGitHubStats",
                    description: "Provides information about Suryansh's GitHub statistics, coding activity, LeetCode stats, and where to find detailed statistics in the portfolio."
                }
            },
            {
                type: "function",
                function: {
                    name: "getArchitectureDiagrams",
                    description: "Describes the architecture diagrams available in the portfolio including hosting architecture, SCS Cloud Platform design, and HLS transcoding pipeline."
                }
            },
            {
                type: "function",
                function:{
                    name:"getEducationOverview",
                    description:"Provides an overview of Suryansh's educational background including degrees, institutions, and relevant coursework."
                }
            }
        ]
    });
}
