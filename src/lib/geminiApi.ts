// import { GeminiQuizRequest, GeminiQuizResponse } from "@/types/quiz";

// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent";

// export async function callGeminiApi(
//   data: GeminiQuizRequest,
//   apiKey: string
// ): Promise<GeminiQuizResponse> {
//   try {
//     const prompt = createQuizPrompt(data);
    
//     const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 8192,
//         },
//       }),
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
//     }
    
//     const result = await response.json();
    
//     // Extract the JSON response from the text
//     const textContent = result.candidates[0]?.content?.parts[0]?.text;
//     if (!textContent) {
//       throw new Error("No content returned from Gemini API");
//     }
    
//     // Find JSON in the response (it might be wrapped in markdown code blocks)
//     let jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
//                     textContent.match(/```\n([\s\S]*?)\n```/) ||
//                     textContent.match(/{[\s\S]*}/);

//     const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
    
//     try {
//       return JSON.parse(jsonContent);
//     } catch (e) {
//       console.error("Failed to parse JSON from Gemini response:", textContent);
//       throw new Error("Failed to parse Gemini response as valid JSON");
//     }
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     throw error;
//   }
// }

// function createQuizPrompt(data: GeminiQuizRequest): string {
//   return `
// Generate a ${data.difficulty} level educational quiz for ${data.grade} grade students on the topic of "${data.topic}" in the subject of "${data.subject}". 
// Please create ${data.numberOfQuestions} questions total, with a mix of multiple-choice (with exactly 4 options each), long answer subjective questions, and true/false questions.

// Important requirements for the questions:
// - For multiple-choice questions, ensure all 4 options are realistic and contextually relevant to the question
// - Options should be distinct from each other and represent common understanding or misconceptions about the topic
// - Avoid obviously incorrect or unrelated options
// - Make answer choices clear and unambiguous

// Return the response as a JSON object with the following structure:
// {
//   "questions": [
//     {
//       "question": "Question text goes here?",
//       "type": "multiple-choice",
//       "options": [
//         { "text": "First plausible answer related to the topic", "isCorrect": false },
//         { "text": "Second plausible answer related to the topic", "isCorrect": false },
//         { "text": "Correct answer", "isCorrect": true },
//         { "text": "Fourth plausible answer related to the topic", "isCorrect": false }
//       ],
//       "explanation": "Detailed explanation of why the correct answer is right and why other options are incorrect"
//     },
//     {
//       "question": "True/False question text goes here?",
//       "type": "true-false",
//       "options": [
//         { "text": "True", "isCorrect": true },
//         { "text": "False", "isCorrect": false }
//       ],
//       "explanation": "Explanation of why the statement is true or false, with specific context"
//     },
//     {
//       "question": "Long answer question text goes here?",
//       "type": "long-answer",
//       "sampleAnswer": "A detailed sample answer that demonstrates the key points, concepts, and depth expected in a complete response. This should serve as a guide for evaluating student answers.",
//       "rubric": [
//         "Understanding of core concepts",
//         "Use of relevant examples",
//         "Proper explanation of relationships between ideas",
//         "Correct use of subject-specific terminology"
//       ],
//       "keyPoints": [
//         "First essential point that should be covered",
//         "Second essential point that should be covered",
//         "Additional important concepts or examples",
//         "Potential areas for critical analysis"
//       ]
//     }
//   ]
// }

// Make sure each question is age-appropriate for ${data.grade} grade, accurate, educational, and aligned with typical ${data.subject} curriculum. Each question must have exactly one correct answer, and all options should be properly contextualized within the topic "${data.topic}".
// `;
// }
// import { GeminiQuizRequest, GeminiQuizResponse } from "@/types/quiz";

// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent";

// export async function callGeminiApi(
//   data: GeminiQuizRequest,
//   apiKey: string
// ): Promise<GeminiQuizResponse> {
//   try {
//     const prompt = createQuizPrompt(data);

//     const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 8192
//         }
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
//     }

//     const result = await response.json();
//     const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//     if (!rawText) {
//       throw new Error("No content returned from Gemini API");
//     }

//     console.log("📦 Gemini raw output:", rawText);

//     // Extract only the JSON from the response
//     let jsonContent: string | null = null;

//     // Prefer content inside a ```json block
//     const matchJsonBlock = rawText.match(/```json\s*([\s\S]*?)```/i);
//     if (matchJsonBlock) {
//       jsonContent = matchJsonBlock[1];
//     } else {
//       // Fallback: match any top-level JSON object
//       const matchPlainJson = rawText.match(/{[\s\S]*}/);
//       if (matchPlainJson) {
//         jsonContent = matchPlainJson[0];
//       }
//     }

//     if (!jsonContent) {
//       console.error("❌ No valid JSON found in Gemini response.");
//       throw new Error("Gemini response did not contain valid JSON format.");
//     }

//     try {
//       return JSON.parse(jsonContent) as GeminiQuizResponse;
//     } catch (parseErr) {
//       console.error("❌ Failed to parse JSON:", jsonContent);
//       throw new Error("Failed to parse Gemini response as valid JSON");
//     }
//   } catch (error) {
//     console.error("🚨 Error calling Gemini API:", error);
//     throw error;
//   }
// }

// function createQuizPrompt(data: GeminiQuizRequest): string {
//   return `
// Generate a ${data.difficulty} level educational quiz for ${data.grade} grade students on the topic of "${data.topic}" in the subject of "${data.subject}". 
// Please create ${data.numberOfQuestions} questions total, with a mix of multiple-choice (with exactly 4 options each), long answer subjective questions, and true/false questions.

// Important requirements:
// - Multiple-choice questions must have 4 realistic, distinct, contextually relevant answers
// - Each must include a correct answer and explanation
// - Long-answer questions must include a sample answer, rubric, and key points
// - Return only a valid JSON object (do not use markdown formatting or preface text)

// Use this format:
// {
//   "questions": [
//     {
//       "question": "...",
//       "type": "multiple-choice" | "true-false" | "long-answer",
//       "options": [{ "text": "...", "isCorrect": true/false }],
//       "explanation": "...",
//       "sampleAnswer": "...",
//       "rubric": ["..."],
//       "keyPoints": ["..."]
//     }
//   ]
// }

// Strictly return ONLY the JSON object.
// `.trim();
// }
import { GeminiQuizRequest, GeminiQuizResponse } from "@/types/quiz";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function callGeminiApi(
  data: GeminiQuizRequest,
  apiKey: string
): Promise<GeminiQuizResponse> {
  try {
    const prompt = createQuizPrompt(data);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${errorData.error?.message || response.statusText}`
      );
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      throw new Error("No content returned from Gemini API");
    }

    console.log("📦 Gemini raw output:", rawText);

    // Try to extract valid JSON
    let jsonContent: string | null = null;

    // Prefer ```json fenced block
    const matchJsonBlock = rawText.match(/```json\s*([\s\S]*?)```/i);
    if (matchJsonBlock) {
      jsonContent = matchJsonBlock[1];
    } else {
      // Fallback: match top-level JSON object
      const matchPlainJson = rawText.match(/{[\s\S]*}/);
      if (matchPlainJson) {
        jsonContent = matchPlainJson[0].trim();

        // Sanitize: remove trailing commas
        jsonContent = jsonContent.replace(/,\s*([}\]])/g, "$1");
      }
    }

    if (!jsonContent) {
      console.error("❌ No valid JSON found. Full response:\n", rawText);
      throw new Error("Gemini response did not contain valid JSON format.");
    }

    try {
      const parsed = JSON.parse(jsonContent);
      return parsed as GeminiQuizResponse;
    } catch (parseErr) {
      // Fallback: try to fix common issues (remove trailing commas, fix curly quotes, remove non-JSON text, fix single quotes, remove newlines, remove markdown, fix unquoted keys, collapse whitespace, fix NaN/Infinity, remove comments, fallback to eval)
      let sanitized = jsonContent
        .replace(/^[^\{]*/, '') // remove anything before first {
        .replace(/[^\}]*$/, '') // remove anything after last }
        .replace(/```[a-zA-Z]*|```/g, '') // remove markdown code fences
        .replace(/\/\*.*?\*\//gs, '') // remove block comments
        .replace(/\/\/.*(?=[\n\r])/g, '') // remove line comments
        .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
        .replace(/[“”‘’]/g, '"') // replace curly quotes with normal quotes
        .replace(/'/g, '"') // replace single quotes with double quotes
        .replace(/\bNaN\b/g, 'null') // replace NaN with null
        .replace(/\bInfinity\b/g, 'null') // replace Infinity with null
        .replace(/\r?\n|\r/g, ' ') // remove newlines
        .replace(/\s+/g, ' '); // collapse whitespace
      // Attempt to quote unquoted keys (very basic, not perfect)
      sanitized = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      // Remove any trailing commas before closing brackets/braces
      sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');
      // Try to extract the first valid JSON object if multiple are present
      const firstCurly = sanitized.indexOf('{');
      const lastCurly = sanitized.lastIndexOf('}');
      if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        sanitized = sanitized.substring(firstCurly, lastCurly + 1);
      }
      try {
        const parsed = JSON.parse(sanitized);
        return parsed as GeminiQuizResponse;
      } catch (err2) {
        // As a last resort, try using eval (unsafe, but can recover from some LLM mistakes)
        try {
          // eslint-disable-next-line no-eval
          const parsed = eval('(' + sanitized + ')');
          return parsed as GeminiQuizResponse;
        } catch (err3) {
          console.error("❌ Failed to parse JSON after sanitization:\n", sanitized);
          // Log the original Gemini output for debugging
          console.error("❌ Original Gemini output:\n", rawText);
          throw new Error("Failed to parse Gemini response as valid JSON");
        }
      }
    }
  } catch (error) {
    console.error("🚨 Error calling Gemini API:", error);
    throw error;
  }
}

function createQuizPrompt(data: GeminiQuizRequest): string {
  return [
    `Generate a ${data.difficulty} level educational quiz for ${data.grade} grade students on the topic of "${data.topic}" in the subject of "${data.subject}".`,
    `Please create ${data.numberOfQuestions} questions total, with exactly the following breakdown:`,
    data.questionTypeCounts ? Object.entries(data.questionTypeCounts).map(([type, count]) => `- ${type}: ${count}`).join('\n') : '',
    '',
    'Strict requirements:',
    '- Multiple-choice questions: 4 realistic, distinct, contextually relevant answers, each with a correct answer and explanation.',
    '- True/false questions: must have an options array with two objects: [{"text": "True", "isCorrect": true/false}, {"text": "False", "isCorrect": true/false}].',
    `- Long-answer questions for technical and analytical subjects (grade appropriate):
      * Mathematics: Proofs, derivations, and problem-solving with step-by-step solutions
      * Physics: Numerical problems, derivations, and theoretical explanations
      * Chemistry: Chemical equations, numerical problems, and theoretical explanations
      * Biology (grade 11+): Experimental analysis, process explanations, and theoretical concepts
      * Computer Science (grade 8+): Algorithm implementation, code analysis, problem-solving
      * Geography (grade 8+): Data analysis, map interpretation, climate calculations
      * Economics (grade 11+): Mathematical models, data interpretation, statistical analysis
      * Statistics (grade 11+): Data analysis, probability calculations, statistical tests
      Include both theoretical long-answer questions AND practical/analytical questions where appropriate.`,
    `- For technical/analytical questions in these subjects:
      * Mathematics/Physics/Chemistry: Include step-by-step solutions, formulas, calculations
      * Computer Science: Include pseudocode/code, algorithm steps, complexity analysis
      * Geography: Include data analysis steps, map reading techniques, calculations
      * Economics/Statistics: Include formula application, data interpretation steps
      * Show working process and explain reasoning for each major step
      * Include relevant principles, formulas, or methodologies used`,
    `- Long-answer questions for other subjects and lower grades: Focus on explanations, analysis, and comprehensive responses.`,
    '- All long-answer questions must include an empty options: [] array, a sampleAnswer, a rubric array, and a keyPoints array.',
    '- For all questions, always include the options field (even if empty for long-answer), and all fields must be present for each question.',
    '- Return ONLY a valid, minified JSON object (no markdown, no code blocks, no explanations, no extra text).',
    '',
    'Format:',
    `For technical/analytical questions, use these structures based on subject:

    Mathematics:
    {
      "question": "Prove/Solve...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Step-by-step mathematical solution with clear reasoning",
      "rubric": ["Mathematical accuracy", "Proof structure", "Solution steps", "Notation"],
      "keyPoints": ["Initial approach", "Key theorems/methods", "Critical steps", "Conclusion"]
    }

    Physics:
    {
      "question": "Solve/Explain/Derive...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Step-by-step solution including formulas, calculations, and physical principles",
      "rubric": ["Physical concept understanding", "Mathematical accuracy", "Problem-solving approach", "Units and dimensions"],
      "keyPoints": ["Relevant formulas", "Assumptions made", "Solution steps", "Final answer with units"]
    }

    Chemistry:
    {
      "question": "Solve/Balance/Calculate...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Step-by-step solution with chemical equations and calculations",
      "rubric": ["Chemical concept accuracy", "Equation balancing", "Calculation steps", "Unit conversion"],
      "keyPoints": ["Chemical equations", "Stoichiometry", "Key reactions", "Numerical solution"]
    }

    Biology (11+):
    {
      "question": "Explain process/Analyze experiment...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Detailed explanation with scientific principles and analysis",
      "rubric": ["Scientific accuracy", "Process understanding", "Data analysis", "Technical terminology"],
      "keyPoints": ["Key principles", "Process steps", "Analysis methods", "Conclusions"]
    }

    Computer Science (8+):
    {
      "question": "Implement/Analyze/Debug...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Algorithm implementation with pseudocode/code and complexity analysis",
      "rubric": ["Algorithm correctness", "Code efficiency", "Implementation clarity", "Problem-solving approach"],
      "keyPoints": ["Problem analysis", "Algorithm design", "Implementation steps", "Complexity/Performance"]
    }

    Geography (8+):
    {
      "question": "Analyze/Calculate/Interpret...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Step-by-step analysis of geographical data or map interpretation",
      "rubric": ["Data interpretation", "Calculation accuracy", "Analysis methodology", "Geographic reasoning"],
      "keyPoints": ["Data/Map analysis", "Calculation steps", "Geographic principles", "Conclusions"]
    }

    Economics/Statistics (11+):
    {
      "question": "Calculate/Analyze/Model...",
      "type": "long-answer",
      "options": [],
      "sampleAnswer": "Statistical analysis or economic model application with calculations",
      "rubric": ["Statistical/Economic concepts", "Calculation accuracy", "Analysis methodology", "Data interpretation"],
      "keyPoints": ["Formula selection", "Calculation process", "Data analysis", "Result interpretation"]
    }`,
    '',
    'Basic format:',
    '{"questions":[{"question":"...","type":"multiple-choice"|"true-false"|"long-answer","options":[{"text":"...","isCorrect":true/false}],"explanation":"...","sampleAnswer":"...","rubric":["..."],"keyPoints":["..."]}]}',
    '',
    'Strictly return ONLY the JSON object, starting with \'{\' and ending with \'\'}\'.'
  ].join('\n');
}
