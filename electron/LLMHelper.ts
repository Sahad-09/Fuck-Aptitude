import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import fs from "fs"

export class LLMHelper {
  private model: GenerativeModel
  private readonly systemPrompt = `You are an expert aptitude test solver. Your primary task is to solve aptitude problems quickly and accurately. For multiple choice questions, provide the correct answer with a brief, clear explanation. Focus on logical reasoning, mathematical accuracy, and efficient problem-solving techniques. Always be direct and concise.`
  private readonly maxRetries = 3
  private readonly retryDelay = 2000 // 2 seconds

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.1,
        topP: 0.8,
        topK: 10
      }
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async retryApiCall<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error: any) {
        lastError = error
        console.log(`[LLMHelper] Attempt ${attempt} failed:`, error.message)

        if (error.message?.includes('overloaded') || error.message?.includes('503')) {
          if (attempt < this.maxRetries) {
            const delay = this.retryDelay * attempt // Exponential backoff
            console.log(`[LLMHelper] Retrying in ${delay}ms...`)
            await this.sleep(delay)
            continue
          }
        }

        // If it's not a rate limit error, don't retry
        if (!error.message?.includes('overloaded') && !error.message?.includes('503')) {
          throw error
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  private async fileToGenerativePart(imagePath: string) {
    try {
      const imageData = await fs.promises.readFile(imagePath)
      // Detect mime type based on file extension
      const mimeType = this.getMimeType(imagePath)
      return {
        inlineData: {
          data: imageData.toString("base64"),
          mimeType
        }
      }
    } catch (error) {
      console.error(`[LLMHelper] Error reading file ${imagePath}:`, error)
      throw new Error(`Failed to read image file: ${imagePath}`)
    }
  }

  private getMimeType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop()
    switch (ext) {
      case 'png': return 'image/png'
      case 'jpg':
      case 'jpeg': return 'image/jpeg'
      case 'gif': return 'image/gif'
      case 'webp': return 'image/webp'
      default: return 'image/png'
    }
  }

  private cleanJsonResponse(text: string): string {
    // Remove markdown code block syntax if present
    text = text.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
    // Remove any leading/trailing whitespace
    text = text.trim();
    return text;
  }

  public async extractProblemFromImages(imagePaths: string[]) {
    if (!imagePaths || imagePaths.length === 0) {
      throw new Error("No image paths provided")
    }

    return this.retryApiCall(async () => {
      try {
        const imageParts = await Promise.all(
          imagePaths.map(path => this.fileToGenerativePart(path))
        )

        const prompt = `${this.systemPrompt}

Analyze the aptitude problem(s) in these images and extract the information in JSON format:

{
  "problem_statement": "The exact question or problem from the image",
  "problem_type": "Type of aptitude problem (e.g., logical reasoning, quantitative, verbal, spatial)",
  "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
  "key_concepts": ["concept1", "concept2"],
  "difficulty_level": "easy/medium/hard",
  "has_valid_problem": true
}

If no clear aptitude problem is found, return:
{
  "problem_statement": "No clear aptitude problem detected in the image",
  "problem_type": "unknown",
  "options": [],
  "key_concepts": [],
  "difficulty_level": "unknown",
  "has_valid_problem": false
}

Important: Return ONLY the JSON object without markdown formatting. Focus on the clearest/main problem if multiple are present.`

        const result = await this.model.generateContent([prompt, ...imageParts])
        const response = await result.response
        const text = this.cleanJsonResponse(response.text())
        const parsed = JSON.parse(text)

        console.log("[LLMHelper] Successfully extracted problem info:", parsed)
        return parsed
      } catch (error) {
        console.error("[LLMHelper] Error in extractProblemFromImages:", error)
        throw error
      }
    })
  }

  public async generateSolution(problemInfo: any) {
    if (!problemInfo || !problemInfo.problem_statement) {
      throw new Error("No problem info available - problem_statement is required")
    }

    if (!problemInfo.has_valid_problem) {
      return {
        solution: {
          correct_answer: "N/A",
          answer_value: "No valid problem detected",
          explanation: "The provided image does not contain a clear aptitude problem to solve",
          solving_steps: ["Unable to identify a problem in the image"],
          time_to_solve: "N/A",
          tips: "Ensure the image contains a clear aptitude question with readable text"
        }
      }
    }

    return this.retryApiCall(async () => {
      const prompt = `${this.systemPrompt}

Solve this aptitude problem:
${JSON.stringify(problemInfo, null, 2)}

Provide your solution in this JSON format:
{
  "solution": {
    "correct_answer": "The correct option (e.g., 'A', 'B', 'C', 'D')",
    "answer_value": "The actual value/content of the correct answer",
    "explanation": "Brief 2-3 sentence explanation of the solution method",
    "solving_steps": ["Step 1: brief description", "Step 2: brief description"],
    "time_to_solve": "estimated time in seconds for average test-taker",
    "tips": "One quick tip or shortcut for similar problems"
  }
}

Focus on:
- Identifying the correct answer quickly
- Providing clear, logical reasoning
- Mentioning any shortcuts or patterns
- Being concise but complete

Important: Return ONLY the JSON object without markdown formatting.`

      console.log("[LLMHelper] Calling Gemini LLM for aptitude solution...");
      try {
        const result = await this.model.generateContent(prompt)
        console.log("[LLMHelper] Gemini LLM returned result.");
        const response = await result.response
        const text = this.cleanJsonResponse(response.text())
        const parsed = JSON.parse(text)
        console.log("[LLMHelper] Parsed LLM response:", parsed)
        return parsed
      } catch (error) {
        console.error("[LLMHelper] Error in generateSolution:", error);
        throw error;
      }
    })
  }

  public async debugSolutionWithImages(problemInfo: any, currentCode: string, debugImagePaths: string[]) {
    if (!problemInfo || !problemInfo.problem_statement) {
      throw new Error("No problem info available for debugging")
    }

    return this.retryApiCall(async () => {
      try {
        const imageParts = await Promise.all(
          debugImagePaths.map(path => this.fileToGenerativePart(path))
        )

        const prompt = `${this.systemPrompt}

Review this aptitude problem solution:
Original problem: ${JSON.stringify(problemInfo, null, 2)}
Current solution: ${currentCode}

Additional context from images provided. Analyze and provide corrected solution:

{
  "solution": {
    "correct_answer": "The correct option (e.g., 'A', 'B', 'C', 'D')",
    "answer_value": "The actual value/content of the correct answer",
    "explanation": "Brief explanation of the correct solution",
    "error_analysis": "What was wrong with the previous solution",
    "solving_steps": ["Step 1: brief description", "Step 2: brief description"],
    "verification": "How to verify this answer is correct"
  }
}

Important: Return ONLY the JSON object without markdown formatting.`

        const result = await this.model.generateContent([prompt, ...imageParts])
        const response = await result.response
        const text = this.cleanJsonResponse(response.text())
        const parsed = JSON.parse(text)
        console.log("[LLMHelper] Parsed debug LLM response:", parsed)
        return parsed
      } catch (error) {
        console.error("[LLMHelper] Error debugging solution with images:", error)
        throw error
      }
    })
  }

  public async analyzeAudioFile(audioPath: string) {
    try {
      const audioData = await fs.promises.readFile(audioPath);
      const audioPart = {
        inlineData: {
          data: audioData.toString("base64"),
          mimeType: "audio/mp3"
        }
      };
      const prompt = `${this.systemPrompt}

Listen to this audio clip and identify if it contains an aptitude problem or test question. If so:

1. Transcribe the question accurately
2. Identify the problem type (logical, quantitative, verbal, etc.)
3. If it's a multiple choice question, note the options
4. Provide the correct answer with brief explanation

If it's not an aptitude problem, briefly describe what the audio contains and suggest how it might be used for test preparation.

Be direct and concise in your response.`;

      const result = await this.model.generateContent([prompt, audioPart]);
      const response = await result.response;
      const text = response.text();
      return { text, timestamp: Date.now() };
    } catch (error) {
      console.error("Error analyzing audio file:", error);
      throw error;
    }
  }

  public async analyzeAudioFromBase64(data: string, mimeType: string) {
    try {
      const audioPart = {
        inlineData: {
          data,
          mimeType
        }
      };
      const prompt = `${this.systemPrompt}

Listen to this audio and identify any aptitude problems or test questions. Provide:

1. Question transcription (if present)
2. Problem type and difficulty
3. Correct answer with brief reasoning
4. Any test-taking tips relevant to this type of problem

Keep your response concise and focused on problem-solving.`;

      const result = await this.model.generateContent([prompt, audioPart]);
      const response = await result.response;
      const text = response.text();
      return { text, timestamp: Date.now() };
    } catch (error) {
      console.error("Error analyzing audio from base64:", error);
      throw error;
    }
  }

  public async analyzeImageFile(imagePath: string) {
    return this.retryApiCall(async () => {
      try {
        const imageData = await fs.promises.readFile(imagePath);
        const mimeType = this.getMimeType(imagePath)
        const imagePart = {
          inlineData: {
            data: imageData.toString("base64"),
            mimeType
          }
        };

        const prompt = `${this.systemPrompt}

Analyze this image for aptitude problems or test questions. Provide:

1. Question text (if readable)
2. Problem type (logical reasoning, quantitative, verbal, spatial, etc.)
3. Available options (if multiple choice)
4. Correct answer with brief explanation
5. Quick solving tip or pattern recognition

If the image contains diagrams, charts, or visual elements relevant to the problem, describe how they factor into the solution.

If no clear aptitude problem is found, briefly describe what the image contains and suggest how it might be used for test preparation.

Be concise and focus on delivering the correct answer efficiently.`;

        const result = await this.model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        return { text, timestamp: Date.now() };
      } catch (error) {
        console.error("[LLMHelper] Error analyzing image file:", error);
        throw error;
      }
    })
  }
}