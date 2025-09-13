
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { Lesson } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative and engaging title for the lesson." },
    introduction: { type: Type.STRING, description: "A simple, one-paragraph introduction to the topic for a 10-year-old student." },
    keyConcepts: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of 3-5 key concepts or vocabulary words, each explained simply."
    },
    detailedExplanation: { type: Type.STRING, description: "A detailed, easy-to-understand explanation of the topic, broken into paragraphs." },
    funFact: { type: Type.STRING, description: "An interesting and surprising fun fact related to the topic." },
    quiz: {
      type: Type.ARRAY,
      description: "A quiz with 3-4 multiple-choice questions to test understanding.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING, description: "The exact text of the correct option." },
          explanation: { type: Type.STRING, description: "A brief explanation for why the correct answer is right." },
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },
  },
  required: ["title", "introduction", "keyConcepts", "detailedExplanation", "funFact", "quiz"],
};

export const generateLesson = async (subject: string, topic: string): Promise<Lesson> => {
  const prompt = `Generate a complete lesson plan about "${topic}" in the subject of ${subject}. The target audience is a 10-year-old student in a rural school, so make the language simple, engaging, and encouraging. The output must strictly follow the provided JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text;
    const lessonData = JSON.parse(jsonText);
    
    // Basic validation to ensure the data structure is as expected.
    if (!lessonData.title || !Array.isArray(lessonData.quiz)) {
        throw new Error("Invalid lesson format received from API.");
    }

    return lessonData as Lesson;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Failed to generate lesson. The topic might be too complex or there was a network issue.");
  }
};


export const createChatSession = (topic: string) => {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and patient teacher helping a young student understand "${topic}". Keep your answers simple, encouraging, and directly related to the topic. Do not go off-topic.`,
            temperature: 0.8,
        },
    });

    return {
        sendMessageStream: async function* (message: string) {
            const stream = await chat.sendMessageStream({ message });
            for await (const chunk of stream) {
                yield chunk.text;
            }
        }
    };
};
