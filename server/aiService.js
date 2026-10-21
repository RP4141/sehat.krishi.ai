/**
 * SEHAT-KRISHI AI — Real Agricultural AI Engine
 * Integrates directly with Google Gemini API with Vision, RAG Grounding, and Safety Rules
 */

import { config } from './config.js';
import { db } from './db.js';
import { retrieveAgriculturalContext } from './agriculturalKnowledge.js';

// Get effective API key from environment or database runtime settings
export function getActiveApiKey(clientProvidedKey = '') {
  if (clientProvidedKey && clientProvidedKey.trim().length > 10) {
    return clientProvidedKey.trim();
  }
  if (config.geminiApiKey && config.geminiApiKey.trim().length > 10) {
    return config.geminiApiKey.trim();
  }
  const dbConfig = db.getApiConfig();
  if (dbConfig && dbConfig.geminiApiKey && dbConfig.geminiApiKey.trim().length > 10) {
    return dbConfig.geminiApiKey.trim();
  }
  return '';
}

/**
 * Build grounded system instructions for the agricultural assistant
 */
function buildSystemPrompt(language = 'en', retrievedEvidence = []) {
  let langDirective = '';
  if (language === 'gu') {
    langDirective = `CRITICAL LANGUAGE REQUIREMENT (GUJARATI):
You MUST write the ENTIRE answer in 100% natural, fluent, respectful Gujarati (ગુજરાતી લિપિ).
Do NOT write sentences in English or Hindi! Every explanation, instruction, and dosage instruction must be in proper Gujarati.
Use standard Gujarati agricultural terms:
- Fertilizer -> ખાતર (યુરિયા, ડીએપી, પોટાશ)
- Disease / Pest -> પાક રોગ / જીવાત (ઇયળ, મોલો-મસી, સફેદ માખી, થ્રિપ્સ)
- Irrigation -> પિયત
- Sowing / Harvest -> વાવણી / લણણી
- Spraying -> દવાનો છંટકાવ (પંપ દીઠ માત્રા)
Even chemical names should be given with exact pump dosage in Gujarati (દા.ત. ૧૫ લિટરના પંપમાં ૨૫ મિલી).`;
  } else if (language === 'hi') {
    langDirective = `CRITICAL LANGUAGE REQUIREMENT (HINDI):
You MUST write the ENTIRE answer in 100% natural, fluent, respectful Hindi (हिन्दी / देवनागरी लिपि).
Do NOT write in English. Use standard Hindi agricultural terms (खाद, उर्वरक, कीट, रोग, सिंचाई, बुवाई, छिड़काव).
Chemical names must be given with exact pump dosage in Hindi (उदा. 15 लीटर के स्प्रे पंप में 20 मिली).`;
  } else {
    langDirective = `LANGUAGE: Respond in clear, professional, farmer-friendly English.`;
  }

  let evidenceText = '';
  if (retrievedEvidence.length > 0) {
    evidenceText = `
OFFICIAL AGRICULTURAL EVIDENCE (ICAR / KVK / STATE AGRI UNIVERSITIES):
${retrievedEvidence.map((ev, i) => `
[Source ${i + 1}: ${ev.title} - ${ev.source}]
- Crop/Topic: ${ev.crop} (${ev.category})
- Symptoms/Context: ${ev.symptoms || ''}
- Cultural/Preventive Control: ${ev.cultural_control || ''}
- Mechanical/Physical Control: ${ev.mechanical_control || ''}
- Biological Control: ${ev.biological_control || ''}
- Chemical Precautions (ETL-based): ${ev.chemical_advisory || ev.advisory || ''}
- Safety/Notes: ${ev.safety_notes || ''}
`).join('\n')}
`;
  }

  return `You are SEHAT-KRISHI AI, an elite agricultural AI consultant and senior agronomist dedicated to Indian farmers.
Your mission is to provide crystal-clear, scientifically validated, safe, and highly structured farming advice, just like Google Gemini and ChatGPT at their best.

${langDirective}

RESPONSE FORMATTING GUIDELINES (BE CRYSTAL CLEAR & WELL-STRUCTURED):
1. Use clear, bold section headers with appropriate emojis (e.g. ### 🔍 [વિશ્લેષણ / Analysis], ### 🌿 [જૈવિક પગલાં / Organic Steps], ### 🧪 [દવા અને સચોટ માત્રા / Treatment & Dosage], ### ⚠️ [સાવચેતી / Precautions]).
2. Format instructions using clean bullet points (•) and numbered steps (1., 2., 3.) so farmers can easily read or listen to them.
3. Highlight exact dosages in bold (e.g. **૧૫ લિટર પાણીમાં ૩૦ મિલી** or **15 लीटर पानी में 25 मिली**).
4. Always prioritize Cultural, Mechanical, and Biological controls before chemical pesticides.
5. NEVER invent unauthorized chemical tank mixes or off-label doses.
6. Provide differential diagnosis if symptoms could have multiple causes.
7. Always mention the Kisan Call Centre Toll-Free Helpline: 1800-180-1551.

${evidenceText}
`;
}

/**
 * Send natural language question to Gemini API
 */
export async function askFarmingAssistant({
  question,
  language = 'en',
  crop = '',
  conversationHistory = [],
  clientApiKey = ''
}) {
  if (!question || !question.trim()) {
    return {
      success: false,
      error: 'EMPTY_QUESTION',
      message: 'Please provide a farming question or crop symptom description.'
    };
  }

  const apiKey = getActiveApiKey(clientApiKey);
  if (!apiKey) {
    return {
      success: false,
      error: 'API_KEY_REQUIRED',
      message: 'Google Gemini API key is required. Please set GEMINI_API_KEY in your .env file or configure it through the "Configure API Key" button in the navigation bar to enable real AI generation.'
    };
  }

  // 1. Retrieve grounded agricultural evidence (RAG)
  const retrievedEvidence = retrieveAgriculturalContext(question, crop);

  // 2. Build system instructions
  const systemPrompt = buildSystemPrompt(language, retrievedEvidence);

  // 3. Prepare message payload for Gemini
  // Use currently active Gemini models in priority order
  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      // Build contents array supporting recent history
      const contents = [];

      // Add system prompt context as first user turn
      contents.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nFarmer Question:\n${question}` }]
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.25,
            topP: 0.9,
            maxOutputTokens: 2048
          }
        }),
        signal: AbortSignal.timeout(20000)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = (data.error && data.error.message) || `HTTP error ${response.status}`;
        console.warn(`Model ${model} failed: ${errorMsg}`);
        lastError = errorMsg;
        if (response.status === 400 && errorMsg.includes('API key')) {
          return {
            success: false,
            error: 'INVALID_API_KEY',
            message: `The provided Gemini API Key is invalid or expired: ${errorMsg}`
          };
        }
        continue; // Try fallback model
      }

      const candidate = data.candidates && data.candidates[0];
      const answerText = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;

      if (!answerText) {
        return {
          success: false,
          error: 'EMPTY_RESPONSE',
          message: 'The AI model returned an empty response. Please rephrase your agricultural question.'
        };
      }

      return {
        success: true,
        modelUsed: model,
        answer: answerText,
        sources: retrievedEvidence.map((ev) => ({
          title: ev.title,
          source: ev.source,
          lastVerified: ev.lastVerified
        })),
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.warn(`Attempt with ${model} error:`, err.message);
      lastError = err.message;
    }
  }

  return {
    success: false,
    error: 'AI_PROVIDER_ERROR',
    message: `Unable to generate AI farming response from Google Gemini: ${lastError || 'Service timeout'}. Please verify your API key and network connection.`
  };
}

/**
 * Analyze crop photograph using Gemini Vision
 */
export async function analyzeCropPhoto({
  imageBuffer,
  mimeType = 'image/jpeg',
  crop = '',
  symptoms = '',
  language = 'en',
  clientApiKey = ''
}) {
  if (!imageBuffer) {
    return {
      success: false,
      error: 'NO_IMAGE',
      message: 'Please provide or upload a valid crop photograph.'
    };
  }

  const apiKey = getActiveApiKey(clientApiKey);
  if (!apiKey) {
    return {
      success: false,
      error: 'API_KEY_REQUIRED',
      message: 'Google Gemini API key is required to analyze crop photographs with Vision AI. Configure your key via .env or in the top navigation.'
    };
  }

  const base64Data = imageBuffer.toString('base64');
  const retrievedEvidence = retrieveAgriculturalContext(symptoms || 'leaf disease spot blight', crop);

  const promptText = `
You are the SEHAT-KRISHI AI Crop Doctor, specialized in agricultural computer vision and phytopathology.
Analyze this crop photograph carefully.

Context provided by farmer:
- Crop name: ${crop || 'Not specified (identify from photo)'}
- Observed symptoms: ${symptoms || 'Visual inspection requested'}
- Language for response: ${language === 'hi' ? 'Hindi' : language === 'gu' ? 'Gujarati' : 'English'}

Provide a rigorous, structured diagnosis following this EXACT format:
1. Plant & Growth Stage Identification: What crop is visible and what part (leaf, stem, fruit, boll, root)?
2. Visual Observations: Describe exact lesions, discoloration, wilting, insect damage, or necrotic rings visible.
3. Possible Diagnosis & Differential Diagnoses: List the primary probable disease/pest, plus 1-2 alternatives if ambiguous.
4. Diagnostic Confidence Level: High / Moderate / Tentative (State why, and note any visual limitations like blur or lighting).
5. Immediate Low-Risk Actions: Cultural / mechanical steps the farmer should take today (e.g. sanitation, water management).
6. Evidence-Supported Integrated Management: Recommended biological / safe chemical options with safety precautions.
7. Crucial Follow-Up Questions: What information should the farmer check next in the field?
8. Reference: Recommended KVK / Agricultural University contact for physical laboratory confirmation.
`;

  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-pro-latest'
  ];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              },
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 2048
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = (data.error && data.error.message) || `HTTP error ${response.status}`;
        lastError = errorMsg;
        console.warn(`Vision model ${model} failed: ${errorMsg}`);
        continue;
      }

      const candidate = data.candidates && data.candidates[0];
      const answerText = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;

      if (!answerText) {
        return {
          success: false,
          error: 'EMPTY_VISION_RESPONSE',
          message: 'The vision model processed the image but did not generate a diagnostic report. Please ensure the crop leaf or pest is clearly focused.'
        };
      }

      return {
        success: true,
        modelUsed: model,
        diagnosis: answerText,
        sources: retrievedEvidence.map((ev) => ({
          title: ev.title,
          source: ev.source
        })),
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.warn(`Vision error with ${model}:`, err.message);
      lastError = err.message;
    }
  }

  return {
    success: false,
    error: 'VISION_API_ERROR',
    message: `Crop photo analysis failed: ${lastError || 'Network timeout'}. Please verify your Gemini API key has vision access enabled.`
  };
}
