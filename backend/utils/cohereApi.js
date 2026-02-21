import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function generateText(prompt, max_tokens = 150) {
  try {
    console.log('Sending prompt to Cohere:', prompt.substring(0, 100) + '...');
    
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: prompt,
      max_tokens,
      temperature: 0.3, 
    });
    
    console.log('Cohere response received');
    return response.text?.trim() || "";
  } catch (error) {
    console.error("❌ Cohere AI error:", error);
    return "";
  }
}

export const getMovieRecommendationCriteria = async (moodOrPrompt) => {

  const prompt = `
You are a movie recommendation system. Based on the user's mood: "${moodOrPrompt}", 
suggest movie criteria in JSON format.

Rules:
- genre must be one of: Action, Comedy, Drama, Horror, Romance, Sci-Fi, Thriller, Adventure, Fantasy
- keywords should be 2-3 comma-separated mood-related words
- max_runtime should be between 90 and 180

Return ONLY valid JSON, no other text:
{
  "genre": "Genre name",
  "keywords": "keyword1, keyword2",
  "max_runtime": 120
}

Example for "happy": {"genre": "Comedy", "keywords": "funny, uplifting", "max_runtime": 105}
Example for "action": {"genre": "Action", "keywords": "exciting, adventure", "max_runtime": 150}
`;
  
  const aiResponse = await generateText(prompt, 250);
  console.log('Raw AI response:', aiResponse);

  try {
    const jsonMatch = aiResponse.match(/\{.*\}/s);
    const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
    
    const parsed = JSON.parse(jsonString);
    const result = {
      genre: parsed.genre || "",
      keywords: parsed.keywords || "",
      max_runtime: parsed.max_runtime || 120
    };
    
    console.log('Parsed criteria:', result);
    return result;
  } catch (error) {
    console.error("Failed to parse AI response:", aiResponse);
    
    // Enhanced default values based on mood
    const moodLower = moodOrPrompt.toLowerCase();
    const defaults = {
      'happy': { genre: "Comedy", keywords: "funny, uplifting", max_runtime: 105 },
      'joyful': { genre: "Comedy", keywords: "funny, uplifting", max_runtime: 105 },
      'action': { genre: "Action", keywords: "exciting, adventure", max_runtime: 140 },
      'exciting': { genre: "Action", keywords: "exciting, adventure", max_runtime: 140 },
      'romantic': { genre: "Romance", keywords: "love, romantic", max_runtime: 115 },
      'love': { genre: "Romance", keywords: "love, romantic", max_runtime: 115 },
      'scary': { genre: "Horror", keywords: "scary, thriller", max_runtime: 105 },
      'horror': { genre: "Horror", keywords: "scary, thriller", max_runtime: 105 },
      'comedy': { genre: "Comedy", keywords: "funny, humor", max_runtime: 100 },
      'funny': { genre: "Comedy", keywords: "funny, humor", max_runtime: 100 },
      'drama': { genre: "Drama", keywords: "emotional, serious", max_runtime: 135 },
      'sci-fi': { genre: "Science Fiction", keywords: "futuristic, technology", max_runtime: 130 },
      'thriller': { genre: "Thriller", keywords: "suspense, mystery", max_runtime: 125 },
    };
    
    // Find matching default
    for (const [key, value] of Object.entries(defaults)) {
      if (moodLower.includes(key)) {
        console.log(`Using default for "${key}":`, value);
        return value;
      }
    }
    
    // Ultimate fallback
    return { genre: "Popular", keywords: "popular", max_runtime: 120 };
  }
};

export const getMovieSummary = async (plot) => {
  if (!plot) return "No plot available";
  
  const prompt = `Summarize this movie plot in 2-3 sentences:\n${plot}`;
  return await generateText(prompt, 1000);
};