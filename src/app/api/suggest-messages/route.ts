import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const model = 'gemma-3-1b-it';

    const prompt = `
Respond ONLY with a single-line string containing exactly three open-ended and engaging questions, separated by '||'. 
Do NOT add quotes, introductions, or extra formatting. 
Questions must be suitable for anonymous social platforms and avoid sensitive or personal topics.
`;

    const result = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('Gemini rawText:', rawText);

    // 🔍 Try splitting by '||'
    let parts = rawText.includes('||')
      ? rawText.split('||').map(q => q.trim()).filter(Boolean)
      : [];

    // 🔁 Fallback: Use regex if not enough questions found
    if (parts.length < 3) {
      parts = rawText.match(/[^?]+\?/g)?.map(q => q.trim()) ?? [];
    }

    // ❌ If still not enough valid questions, return error
    if (parts.length < 3) {
      return new NextResponse('Failed to parse 3 valid questions from the response.', {
        status: 500,
      });
    }

    // ✅ Format the final 3 questions with proper separator
    const formatted = parts.slice(0, 3).join(' || ');

    return new NextResponse(formatted, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return new NextResponse('Error generating questions', { status: 500 });
  }
}
  