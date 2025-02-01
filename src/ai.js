import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, 
but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

// ✅ Correct way to access environment variables in Vite
const HF_ACCESS_TOKEN = import.meta.env.VITE_HF_ACCESS_TOKEN;

if (!HF_ACCESS_TOKEN) {
    console.error("Hugging Face API token is missing. Set VITE_HF_ACCESS_TOKEN in your .env file.");
}

const hf = new HfInference(HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
    if (!HF_ACCESS_TOKEN) {
        return "Error: Missing Hugging Face API token.";
    }

    if (!Array.isArray(ingredientsArr) || ingredientsArr.length === 0) {
        return "Error: No ingredients provided.";
    }

    const ingredientsString = ingredientsArr.join(", ");

    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });

        console.log("API Response:", response);

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error("Invalid response from Hugging Face API");
        }

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Error fetching recipe:", err);
        return `Error: ${err.message}`;
    }
}
