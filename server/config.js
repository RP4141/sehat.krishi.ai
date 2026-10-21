import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  sessionSecret: process.env.SESSION_SECRET || 'sehat-krishi-secret-2026',
};
