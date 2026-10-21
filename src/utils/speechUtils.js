/**
 * SEHAT-KRISHI AI — Voice Speech Recognition & Text-To-Speech (TTS) Engine
 * Designed for Indian farmers speaking Gujarati, Hindi, or English
 */

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && Boolean(window.speechSynthesis);
}

/**
 * Start listening via Microphone using Web Speech API
 */
export function startListening({
  language = 'gu',
  onStart = () => {},
  onResult = () => {},
  onError = () => {},
  onEnd = () => {}
}) {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Brave.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Language mapping
  const langCodes = {
    gu: 'gu-IN',
    hi: 'hi-IN',
    en: 'en-IN'
  };
  recognition.lang = langCodes[language] || 'gu-IN';
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    onStart();
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    const isFinal = event.results[event.results.length - 1].isFinal;
    onResult(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    onError(event.error === 'not-allowed' ? 'Microphone permission denied. Please allow microphone access.' : `Speech error: ${event.error}`);
  };

  recognition.onend = () => {
    onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    onError(err.message);
    return null;
  }
}

/**
 * Clean markdown symbols for natural speech playback
 */
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/[#*_~`]/g, '') // Remove markdown syntax
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/•|\d+\./g, '') // Remove bullet points
    .replace(/[\n\r]+/g, '. ') // Replace linebreaks with pauses
    .trim();
}

/**
 * Text-to-Speech: Read answer aloud in Gujarati, Hindi, or English
 */
let activeUtterance = null;

export function speakAnswer({
  text,
  language = 'gu',
  onStart = () => {},
  onEnd = () => {}
}) {
  if (!isSpeechSynthesisSupported()) return;

  stopSpeaking();

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  activeUtterance = utterance;

  const langCodes = {
    gu: 'gu-IN',
    hi: 'hi-IN',
    en: 'en-IN'
  };
  utterance.lang = langCodes[language] || 'gu-IN';
  utterance.rate = 0.95; // Slightly slower, clear pace for farmers
  utterance.pitch = 1.0;

  // Attempt to select specific Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetCode = utterance.lang.toLowerCase();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase() === targetCode || v.lang.toLowerCase().includes(language)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = onStart;
  utterance.onend = () => {
    activeUtterance = null;
    onEnd();
  };
  utterance.onerror = () => {
    activeUtterance = null;
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}
