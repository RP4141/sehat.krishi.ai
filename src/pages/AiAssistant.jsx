import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Key,
  Volume2
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import FormattedAnswer from '../components/FormattedAnswer';
import { startListening, isSpeechRecognitionSupported } from '../utils/speechUtils';

export default function AiAssistant() {
  const { language, setLanguage, t } = useLanguage();
  const { apiKey, isConfigured, setKeyModalOpen } = useApiKey();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      role: 'assistant',
      text: language === 'gu'
        ? `નમસ્તે ખેડૂત મિત્ર! 🙏 હું SEHAT-KRISHI AI નો મુખ્ય કૃષિ નિષ્ણાત છું.\nતમે મને ગુજરાતીમાં માઇક દ્વારા બોલીને અથવા લખીને કોઈપણ સવાલ પૂછી શકો છો:\n• પાકના રોગ, ઇયળ કે જીવાતનું સચોટ નિદાન અને દવાનો છંટકાવ\n• જમીન મુજબ ખાતરની માત્રા (યુરિયા, ડીએપી, પોટાશ અને સૂક્ષ્મ તત્ત્વો)\n• બિયારણની જાતો, વાવણી સમય અને પિયતનું આયોજન\n• સરકારી સહાય યોજનાઓ (પીએમ-કિસાન, પાક વીમો, આઈ-ખેડૂત)\n\nઆજે તમને કયા પાક વિશે સલાહ જોઈએ છે?`
        : language === 'hi'
        ? `नमस्ते किसान भाई! 🙏 मैं SEHAT-KRISHI AI का मुख्य कृषि विशेषज्ञ हूँ।\nआप मुझसे माइक द्वारा बोलकर या लिखकर फसलों, कीट, खाद, बीज और सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछ सकते हैं।\n\nआज आपकी किस फसल में क्या समस्या है?`
        : `Namaste Farmer Friend! 🙏 I am your SEHAT-KRISHI AI Agronomic Consultant.\nYou can ask questions by typing or speaking in Gujarati, Hindi, or English about crop diseases, balanced NPK fertilizers, irrigation, and government subsidies.\n\nWhich crop can I help you with today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim()) {
      handleAskQuestion(q.trim());
    }
  }, [searchParams]);

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
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
        setInputQuestion(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  const handleAskQuestion = async (queryText) => {
    const questionToSend = queryText || inputQuestion.trim();
    if (!questionToSend || loading) return;

    setInputQuestion('');
    setApiError(null);

    const effectiveCrop = selectedCrop === 'Other' ? (customCrop || 'Custom Crop') : selectedCrop;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: questionToSend,
      crop: effectiveCrop,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest'
        },
        body: JSON.stringify({
          question: questionToSend,
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
            isError: true,
            errorType: data.error,
            text: data.message || 'AI service unavailable.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          isError: true,
          text: 'Network communication error.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    setApiError(null);
  };

  const suggestedQuestions = language === 'gu'
    ? [
        "કપાસમાં ગુલાબી ઈયળ માટે કઈ દવા છાંટવી અને પપેટ્રાપ કેવી રીતે લગાવવા?",
        "મગફળીમાં પાન પીળા પડે છે અને ટપકાં દેખાય છે - ઉપાય જણાવો",
        "જીરુંના પાકમાં ચરમી અને કાળીયો રોગ અટકાવવા શું કરવું?",
        "પીએમ-કિસાન યોજનાની 6000 સહાય માટે ઈ-કેવાયસી કેવી રીતે કરવું?",
        "ઘઉંમાં પહેલું પિયત (CRI) ક્યારે આપવું અને કયું ખાતર નાખવું?"
      ]
    : language === 'hi'
    ? [
        "कपास में गुलाबी सुंडी (Pink Bollworm) की रोकथाम के लिए क्या करें?",
        "गेहूं में सीआरआई (CRI) अवस्था पर कौन सी खाद देनी चाहिए?",
        "चना में फली छेदक कीट (Pod Borer) से बचाव का जैविक उपाय?",
        "मिर्च में पत्ता मरोड़ (Leaf Curl) रोग का क्या इलाज है?"
      ]
    : [
        "What is the recommended NPK dose for groundnut in Saurashtra?",
        "How to manage yellow rust in wheat with biological & chemical options?",
        "What are the symptoms and ETL threshold of Pink Bollworm?",
        "How does PM-KISAN e-KYC work for farmers?"
      ];

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: language === 'gu' ? 'AI ખેતી સહાયક' : 'AI Farming Assistant' }]} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', color: '#14532D', marginBottom: '4px' }}>
            {language === 'gu' ? 'AI કૃષિ સહાયક અને અવાજ પરામર્શ' : language === 'hi' ? 'AI कृषि सहायक एवं वॉइस परामर्श' : 'AI Agricultural Assistant & Voice Counsel'}
          </h1>
          <p style={{ color: '#647067', margin: 0, fontSize: '0.95rem' }}>
            {language === 'gu' 
              ? 'બોલીને કે લખીને સવાલ પૂછો — ICAR અને કૃષિ વિજ્ઞાન કેન્દ્ર આધારિત સચોટ ગુજરાતી માર્ગદર્શન.'
              : 'Ask by speaking (Voice) or typing — Evidence-grounded advice powered by Google Gemini.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={clearChat} className="btn btn-secondary btn-sm" title="Clear Chat">
            <Trash2 size={15} />
            <span>{language === 'gu' ? 'ચેટ સાફ કરો' : 'Clear Chat'}</span>
          </button>
          {!isConfigured && (
            <button onClick={() => setKeyModalOpen(true)} className="btn btn-primary btn-sm">
              <Key size={15} />
              <span>{language === 'gu' ? 'Gemini કી સેટ કરો' : 'Configure Gemini Key'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="chat-container">
        {/* Left Sidebar */}
        <aside className="chat-sidebar">
          <div>
            <label className="form-label">
              {language === 'gu' ? 'પાક પસંદગી (Crop Context)' : 'Active Crop Context'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
              style={{ width: '100%', fontSize: '0.88rem' }}
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
              <option value="Rice">Rice / Paddy (ડાંગર / धान)</option>
              <option value="Maize">Maize (મકાઈ / मक्का)</option>
              <option value="Sugarcane">Sugarcane (શેરડી / गन्ना)</option>
              <option value="Pulses">Pulses (ચણા/તુવેર / दालें)</option>
              <option value="Other">⭐ {language === 'gu' ? 'અન્ય પાક (Other Crop)' : 'Other Crop (अन्य फसल)'}</option>
            </select>
          </div>

          {/* If "Other" crop selected, provide custom input */}
          {selectedCrop === 'Other' && (
            <div style={{ background: '#FFFBEB', padding: '10px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', color: '#92400E' }}>
                {language === 'gu' ? 'અન્ય પાકનું નામ લખો:' : 'Specify Other Crop Name:'}
              </label>
              <input
                type="text"
                placeholder={language === 'gu' ? 'દા.ત. ડુંગળી, લસણ, સોયાબીન, તલ...' : 'E.g., Onion, Garlic, Soybean, Sesame...'}
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          )}

          <div>
            <label className="form-label">
              {language === 'gu' ? 'જવાબની ભાષા (Language)' : 'Response Language'}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="form-select"
              style={{ width: '100%', fontSize: '0.88rem', fontWeight: '600', color: '#166534' }}
            >
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid #E1EAE2', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#166534', display: 'block', marginBottom: '10px' }}>
              {language === 'gu' ? 'વારંવાર પૂછાતા સવાલો' : 'Suggested Inquiries'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskQuestion(q)}
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    color: '#166534',
                    cursor: 'pointer',
                    lineHeight: 1.4
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Chat Main */}
        <section className="chat-main">
          {/* Messages Feed */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.role}`}>
                {msg.role === 'user' ? (
                  <div>
                    {msg.crop && msg.crop !== 'Custom Crop' && (
                      <span style={{ display: 'inline-block', fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>
                        🌾 {msg.crop}
                      </span>
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                ) : (
                  <FormattedAnswer text={msg.text} language={language} sources={msg.sources} />
                )}
              </div>
            ))}

            {loading && (
              <div className="message-bubble assistant">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span>
                    {language === 'gu' 
                      ? 'કૃષિ વિજ્ઞાન કેન્દ્ર અને ICAR પુસ્તિકામાંથી ઉત્તર તૈયાર કરી રહ્યો છે...' 
                      : 'Synthesizing agricultural guidance with ICAR evidence...'}
                  </span>
                </div>
                <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '6px' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '75%', marginBottom: '6px' }}></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Active Strip */}
          {isListening && (
            <div style={{ background: '#FEE2E2', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #FECACA', fontSize: '0.85rem', color: '#991B1B' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={18} className="mic-listening-pulse" />
                <strong>
                  {language === 'gu' 
                    ? 'સાંભળી રહ્યો છું... તમારો સવાલ ગુજરાતીમાં બોલો' 
                    : language === 'hi' 
                    ? 'सुन रहा हूँ... अपना सवाल बोलिए' 
                    : 'Listening... please speak your question'}
                </strong>
              </span>
              <button
                type="button"
                onClick={handleVoiceToggle}
                className="btn btn-sm btn-secondary"
                style={{ padding: '2px 10px', fontSize: '0.78rem' }}
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Bar with Mic Button */}
          <div className="chat-input-bar">
            <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className="chat-input-form">
              <input
                type="text"
                className="chat-input-field"
                placeholder={language === 'gu' ? 'પાક, રોગ, ખાતર કે દવા વિશે પૂછો અથવા માઇક દબાવી બોલો...' : 'Ask about crops, fertilizers, pests, or click Mic to speak...'}
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`voice-mic-btn ${isListening ? 'active' : ''}`}
                title={isListening ? 'Stop listening' : 'Click to speak in Gujarati / Hindi (Voice Input)'}
                style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid #E1EAE2', background: isListening ? '#FEE2E2' : '#F0FDF4', color: isListening ? '#DC2626' : '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !inputQuestion.trim()}
              >
                <Send size={16} />
                <span>{language === 'gu' ? 'પૂછો' : 'Ask'}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
