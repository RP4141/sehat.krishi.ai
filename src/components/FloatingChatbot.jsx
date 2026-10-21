import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  RotateCcw, 
  MessageSquare,
  Volume2,
  Minus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import FormattedAnswer from './FormattedAnswer';
import { startListening, isSpeechRecognitionSupported } from '../utils/speechUtils';

export default function FloatingChatbot() {
  const { language, setLanguage } = useLanguage();
  const { apiKey } = useApiKey();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCrop, setActiveCrop] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'bot_welcome',
      role: 'assistant',
      text: language === 'gu'
        ? `નમસ્તે ખેડૂત મિત્ર! 🙏 હું SEHAT-KRISHI AI સહાયક છું.\nતમે મને બોલીને (માઇક વડે) અથવા લખીને પાકના રોગ, ખાતર, પિયત કે દવા વિશે કોઈપણ સવાલ પૂછી શકો છો. હું તમને ચોક્કસ ગુજરાતીમાં જવાબ આપીશ.`
        : language === 'hi'
        ? `नमस्ते किसान भाई! 🙏 मैं SEHAT-KRISHI AI सहायक हूँ।\nआप मुझसे बोलकर (माइक द्वारा) या लिखकर फसलों, कीट, खाद या मौसम के बारे में कोई भी सवाल पूछ सकते हैं।`
        : `Namaste Farmer Friend! 🙏 I am your SEHAT-KRISHI AI Assistant.\nYou can speak (using Mic) or type any question about crop diseases, fertilizers, pests, or irrigation. How can I help you today?`
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Brave.');
      return;
    }

    setIsListening(true);
    recognitionRef.current = startListening({
      language,
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setInputVal(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.warn('Voice error:', err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false)
    });
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query || loading) return;

    setInputVal('');
    const effectiveCrop = activeCrop === 'Other' ? (customCrop || 'General Crop') : activeCrop;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: query,
      crop: effectiveCrop
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          language,
          crop: effectiveCrop,
          apiKey
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            text: language === 'gu'
              ? `માફ કરશો, AI સાથે સંપર્ક થઈ શક્યો નથી: ${data.message || 'API કી ચકાસો'}.`
              : `Sorry, unable to connect to AI: ${data.message || 'Check API key'}.`
          }
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          text: data.answer,
          sources: data.sources || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Network error: Could not reach the server.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible bottom-right) */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="floating-bot-trigger-btn"
          title="Open AI Farming Voice Assistant"
          aria-label="Open AI Farming Assistant"
          type="button"
        >
          <div className="bot-pulse-ring"></div>
          <Bot size={28} />
          <span className="bot-badge-text">
            {language === 'gu' ? 'AI સહાયક' : language === 'hi' ? 'AI मित्र' : 'AI Help'}
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className={`floating-chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="floating-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#fff', display: 'block', lineHeight: 1.2 }}>
                  SEHAT AI Assistant
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#DCFCE7' }}>
                  {language === 'gu' ? 'ખેતી માર્ગદર્શક' : language === 'hi' ? 'कृषि मार्गदर्शक' : 'Farming Advisor'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Language Switcher */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="gu" style={{ color: '#000' }}>ગુજરાતી</option>
                <option value="hi" style={{ color: '#000' }}>हिन्दी</option>
                <option value="en" style={{ color: '#000' }}>English</option>
              </select>

              <button
                type="button"
                onClick={clearChat}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title="Clear"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                <Minus size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Crop Selector Bar */}
              <div style={{ background: '#F0FDF4', padding: '8px 12px', borderBottom: '1px solid #E1EAE2', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: '600', color: '#166534', whiteSpace: 'nowrap' }}>
                  {language === 'gu' ? 'પાક પસંદ કરો:' : language === 'hi' ? 'फसल चुनें:' : 'Crop:'}
                </span>
                <select
                  value={activeCrop}
                  onChange={(e) => setActiveCrop(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #BBF7D0',
                    background: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                >
                  <option value="">{language === 'gu' ? 'સામાન્ય / તમામ પાક' : 'General / All Crops'}</option>
                  <option value="Cotton">Cotton (કપાસ / कपास)</option>
                  <option value="Groundnut">Groundnut (મગફળી / मूंगफली)</option>
                  <option value="Wheat">Wheat (ઘઉં / गेहूं)</option>
                  <option value="Cumin">Cumin (જીરું / जीरा)</option>
                  <option value="Mustard">Mustard (રાઇ / सरसों)</option>
                  <option value="Chilli">Chilli (મરચી / मिर्च)</option>
                  <option value="Tomato">Tomato (ટામેટા / टमाटर)</option>
                  <option value="Potato">Potato (બટાટા / आलू)</option>
                  <option value="Other">{language === 'gu' ? 'અન્ય પાક (Other)' : 'Other Crop (अन्य फसल)'}</option>
                </select>
              </div>

              {/* If "Other" crop selected, show custom crop input */}
              {activeCrop === 'Other' && (
                <div style={{ background: '#FFFBEB', padding: '6px 12px', borderBottom: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder={language === 'gu' ? 'પાકનું નામ લખો (દા.ત. ડુંગળી, લસણ, તલ)...' : 'Type crop name (e.g. Onion, Garlic, Sesame)...'}
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #FDE68A', fontSize: '0.78rem', outline: 'none' }}
                  />
                </div>
              )}

              {/* Messages Body */}
              <div className="floating-chat-body">
                {messages.map((m) => (
                  <div key={m.id} className={`floating-msg ${m.role}`}>
                    {m.role === 'user' ? (
                      <div>
                        {m.crop && m.crop !== 'General Crop' && (
                          <span style={{ display: 'inline-block', fontSize: '0.7rem', background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: '4px', marginBottom: '4px' }}>
                            {m.crop}
                          </span>
                        )}
                        <div>{m.text}</div>
                      </div>
                    ) : (
                      <FormattedAnswer text={m.text} language={language} sources={m.sources} />
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="floating-msg assistant" style={{ background: '#F0FDF4' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.82rem', fontWeight: '600' }}>
                      <Sparkles size={14} className="animate-spin" />
                      <span>{language === 'gu' ? 'જવાબ તૈયાર કરી રહ્યો છે...' : language === 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Formulating guidance...'}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Listening Active Indicator */}
              {isListening && (
                <div style={{ background: '#FEE2E2', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #FECACA', fontSize: '0.78rem', color: '#991B1B' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mic size={14} className="mic-listening-pulse" />
                    <strong>{language === 'gu' ? 'સાંભળી રહ્યો છું... ગુજરાતીમાં બોલો' : language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... speak now'}</strong>
                  </span>
                  <button type="button" onClick={handleVoiceToggle} style={{ background: 'none', border: 'none', color: '#991B1B', fontWeight: 'bold', cursor: 'pointer' }}>
                    Stop
                  </button>
                </div>
              )}

              {/* Input Footer */}
              <form onSubmit={handleSend} className="floating-chat-footer">
                <input
                  type="text"
                  placeholder={language === 'gu' ? 'સવાલ પૂછો અથવા માઇક દબાવો...' : language === 'hi' ? 'सवाल पूछें या माइक दबाएं...' : 'Ask question or use Mic...'}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="floating-input"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`voice-mic-btn ${isListening ? 'active' : ''}`}
                  title={isListening ? 'Stop listening' : 'Speak your question (Voice Input)'}
                >
                  {isListening ? <MicOff size={16} color="#DC2626" /> : <Mic size={16} />}
                </button>

                <button
                  type="submit"
                  className="floating-send-btn"
                  disabled={loading || !inputVal.trim()}
                  title="Send"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
