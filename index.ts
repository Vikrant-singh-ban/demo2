import "dotenv/config";
import { createAgent, tool } from 'langchain';
import { z } from 'zod';
import { TavilySearch } from "@langchain/tavily";

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: z.object({
        city: z.string().describe('The city to get the weather for'),
    }),
});

const tavilyTool = new TavilySearch({
    maxResults: 3, // Optional: Limit returned results
    // topic: "general", // Optional: "general", "news", or "finance"
});

const agent = createAgent({
    model: 'google-genai:gemini-3.6-flash',
    tools: [getWeather, tavilyTool],
});

// Run the agent
const response = await agent.invoke({
    messages: [
        {
            role: "user",
            content: "Tell me about this https://electrovese.com/",
        },
    ],
});

// Print the final output from the agent
const lastMessage = response.messages[response.messages.length - 1];
console.log(lastMessage.content);
