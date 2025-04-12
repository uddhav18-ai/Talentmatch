import fetch from 'node-fetch';

interface AssessmentResponse {
  score: number;
  feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  suggestions: string[];
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
}

export async function assessCode(
  code: string,
  challengeDescription: string,
  expectedFunctionality: string,
  difficultyLevel: string
): Promise<AssessmentResponse> {
  // Default response in case of failure
  const defaultResponse: AssessmentResponse = {
    score: 0,
    feedback: "Unable to assess code at this time.",
    strengths: [],
    areas_for_improvement: ["Please try again later."],
    suggestions: []
  };

  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error("Missing PERPLEXITY_API_KEY environment variable");
      return defaultResponse;
    }

    const systemPrompt = `
You are an expert code reviewer for a skills assessment platform. Your task is to evaluate a submitted code solution against a challenge description.
You must analyze the code for:
1. Correctness: Does it solve the problem described?
2. Efficiency: Is the solution optimal or are there obvious performance issues?
3. Code quality: Is it well-structured, readable, and follows best practices?
4. Edge cases: Does it handle potential edge cases?

For a ${difficultyLevel.toLowerCase()} difficulty challenge, evaluate accordingly.

Respond with a JSON object having these properties:
- score: a number from 0-100 representing overall quality
- feedback: a concise paragraph summarizing the assessment
- strengths: an array of strings listing the code's strong points
- areas_for_improvement: an array of strings listing areas that could be improved
- suggestions: an array of strings with specific suggestions for improvement

Your response must be valid JSON that can be parsed.
`;

    const userPrompt = `
Challenge Description:
${challengeDescription}

Expected Functionality:
${expectedFunctionality}

Difficulty Level: ${difficultyLevel}

Submitted Code:
\`\`\`
${code}
\`\`\`

Assess this code solution carefully and provide a detailed evaluation.
`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${await response.text()}`);
      return defaultResponse;
    }

    const data = await response.json() as PerplexityResponse;
    
    // Get the content from the response
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("No content in API response");
      return defaultResponse;
    }

    try {
      // Parse the JSON from the content
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        console.error("No JSON found in response content");
        return {
          ...defaultResponse,
          feedback: "The AI assessment service returned an invalid response format."
        };
      }
      
      const jsonContent = content.substring(jsonStart, jsonEnd);
      const assessment = JSON.parse(jsonContent) as AssessmentResponse;
      
      return {
        score: assessment.score || 0,
        feedback: assessment.feedback || defaultResponse.feedback,
        strengths: assessment.strengths || [],
        areas_for_improvement: assessment.areas_for_improvement || [],
        suggestions: assessment.suggestions || []
      };
    } catch (parseError) {
      console.error("Error parsing JSON from API response:", parseError);
      return {
        ...defaultResponse,
        feedback: "The assessment service returned data in an unexpected format."
      };
    }
  } catch (error) {
    console.error("Error in code assessment:", error);
    return defaultResponse;
  }
}