
import { GeminiQuizRequest, GeminiQuizResponse } from "@/types/quiz";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function callGeminiApi(
  data: GeminiQuizRequest,
  apiKey: string
): Promise<GeminiQuizResponse> {
  try {
    const prompt = createQuizPrompt(data);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    
    // Extract the JSON response from the text
    const textContent = result.candidates[0]?.content?.parts[0]?.text;
    if (!textContent) {
      throw new Error("No content returned from Gemini API");
    }
    
    // Find JSON in the response (it might be wrapped in markdown code blocks)
    let jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                    textContent.match(/```\n([\s\S]*?)\n```/) ||
                    textContent.match(/{[\s\S]*}/);

    const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
    
    try {
      return JSON.parse(jsonContent);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response:", textContent);
      throw new Error("Failed to parse Gemini response as valid JSON");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

function createQuizPrompt(data: GeminiQuizRequest): string {
  return `
Generate a ${data.difficulty} level educational quiz for ${data.grade} grade students on the topic of "${data.topic}" in the subject of "${data.subject}". 
Please create ${data.numberOfQuestions} questions total, with a mix of multiple-choice (with exactly 4 options each) and true/false questions.

Return the response as a JSON object with the following structure:
{
  "questions": [
    {
      "question": "Question text goes here?",
      "type": "multiple-choice",
      "options": [
        { "text": "Option A", "isCorrect": false },
        { "text": "Option B", "isCorrect": false },
        { "text": "Option C", "isCorrect": true },
        { "text": "Option D", "isCorrect": false }
      ],
      "explanation": "Explanation of the correct answer for learning purposes"
    },
    {
      "question": "True/False question text goes here?",
      "type": "true-false",
      "options": [
        { "text": "True", "isCorrect": true },
        { "text": "False", "isCorrect": false }
      ],
      "explanation": "Explanation of why the statement is true or false"
    }
  ]
}

Make sure each question is age-appropriate for ${data.grade} grade, accurate, educational, and aligned with typical ${data.subject} curriculum. Each question must have exactly one correct answer.
`;
}
