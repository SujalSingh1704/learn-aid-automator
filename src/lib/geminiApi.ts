import { GeminiQuizRequest, GeminiQuizResponse } from "@/types/quiz";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent";

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

Important requirements for the questions:
- For multiple-choice questions, ensure all 4 options are realistic and contextually relevant to the question
- Options should be distinct from each other and represent common understanding or misconceptions about the topic
- Avoid obviously incorrect or unrelated options
- Make answer choices clear and unambiguous

Return the response as a JSON object with the following structure:
{
  "questions": [
    {
      "question": "Question text goes here?",
      "type": "multiple-choice",
      "options": [
        { "text": "First plausible answer related to the topic", "isCorrect": false },
        { "text": "Second plausible answer related to the topic", "isCorrect": false },
        { "text": "Correct answer", "isCorrect": true },
        { "text": "Fourth plausible answer related to the topic", "isCorrect": false }
      ],
      "explanation": "Detailed explanation of why the correct answer is right and why other options are incorrect"
    },
    {
      "question": "True/False question text goes here?",
      "type": "true-false",
      "options": [
        { "text": "True", "isCorrect": true },
        { "text": "False", "isCorrect": false }
      ],
      "explanation": "Explanation of why the statement is true or false, with specific context"
    }
  ]
}

Make sure each question is age-appropriate for ${data.grade} grade, accurate, educational, and aligned with typical ${data.subject} curriculum. Each question must have exactly one correct answer, and all options should be properly contextualized within the topic "${data.topic}".
`;
}
