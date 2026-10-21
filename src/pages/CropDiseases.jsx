import React, { useState, useRef } from 'react';
import { 
  Stethoscope, 
  Upload, 
  Camera, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Key,
  ShieldAlert,
  Search,
  Sparkles,
  ExternalLink,
  Save,
  Mic,
  MicOff
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import FormattedAnswer from '../components/FormattedAnswer';
import { startListening, isSpeechRecognitionSupported } from '../utils/speechUtils';

export default function CropDiseases() {
  const { language, t } = useLanguage();
  const { apiKey, isConfigured, setKeyModalOpen } = useApiKey();
  const { user } = useAuth();

  const [crop, setCrop] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WEBP).');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert(language === 'gu' 
        ? 'આ બ્રાઉઝરમાં વોઇસ રેકોર્ડિંગ સપોર્ટ નથી. કૃપા કરીને ગૂગલ ક્રોમ અથવા એજ ઉપયોગ કરો.' 
        : 'Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    setIsListening(true);
    const recognition = startListening({
      language,
      onResult: (transcript) => {
        setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
    recognitionRef.current = recognition;
  };

  const handleAnalyzeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage && !symptoms.trim()) {
      alert('Please upload a crop photograph or describe the observable symptoms.');
      return;
    }

    const effectiveCrop = crop === 'Other' && customCrop.trim() ? customCrop.trim() : crop;

    setLoading(true);
    setApiError(null);
    setDiagnosisResult(null);

    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    formData.append('crop', effectiveCrop);
    formData.append('symptoms', symptoms);
    formData.append('language', language);
    if (apiKey) {
      formData.append('apiKey', apiKey);
    }

    try {
      let endpoint = selectedImage ? '/api/ai/analyze-crop' : '/api/ai/ask';
      let options = {};

      if (selectedImage) {
        options = {
          method: 'POST',
          body: formData
        };
      } else {
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: `Diagnose this crop issue: Crop: ${effectiveCrop || 'Unknown'}, Symptoms: ${symptoms}. Please provide a differential diagnosis, confidence level, follow-up questions, and IPM steps.`,
            crop: effectiveCrop,
            language,
            apiKey
          })
        };
      }

      const res = await fetch(endpoint, options);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.message || 'Diagnosis failed. Please verify your Gemini API key and image.');
        return;
      }

      setDiagnosisResult({
        report: data.diagnosis || data.answer,
        modelUsed: data.modelUsed,
        sources: data.sources || [],
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Diagnosis error:', err);
      setApiError('Network connection failed. Could not communicate with vision backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiagnosis = async () => {
    if (!diagnosisResult) return;
    try {
      await fetch('/api/farm/saved-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest'
        },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          title: `Disease Diagnosis: ${crop || 'Crop'} - ${new Date().toLocaleDateString()}`,
          crop: crop || 'General',
          category: 'Crop Pathology',
          question: symptoms || 'Visual Crop Photo Inspection',
          answer: diagnosisResult.report,
          sources: diagnosisResult.sources || []
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Crop Disease Doctor' }]} />

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#14532D', marginBottom: '8px' }}>
          Crop Disease Doctor
        </h1>
        <p style={{ color: '#647067', margin: 0, fontSize: '1rem', maxWidth: '780px' }}>
          Real AI vision analysis and symptom differential diagnosis grounded in ICAR and State Agricultural University phytopathology standards.
        </p>
      </div>

      {!isConfigured && (
        <div className="alert-banner warning">
          <AlertTriangle size={20} />
          <div style={{ flex: 1 }}>
            <strong>Gemini Vision API Key Required</strong>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>
              Real image analysis requires a Google Gemini key. Set <code>GEMINI_API_KEY</code> in <code>.env</code> or configure it here.
            </p>
          </div>
          <button onClick={() => setKeyModalOpen(true)} className="btn btn-primary btn-sm">
            <Key size={14} /> Configure Key
          </button>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Upload & Symptoms Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#166534" />
            <span>Upload Crop Photo or Describe Symptoms</span>
          </h2>

          <form onSubmit={handleAnalyzeSubmit}>
            {/* Image Upload Zone */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Crop Photograph (JPG, PNG, WEBP)</label>
              
              {!imagePreview ? (
                <div
                  className="upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      const file = e.dataTransfer.files[0];
                      setSelectedImage(file);
                      const reader = new FileReader();
                      reader.onload = () => setImagePreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  <div className="upload-icon-circle">
                    <Upload size={28} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '1rem', color: '#166534', marginBottom: '4px' }}>
                    Click to browse or drag & drop crop leaf photo
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#647067' }}>
                    Capture clear close-up of spots, discoloration, or wilted tissue (Up to 10MB)
                  </span>
                </div>
              ) : (
                <div className="preview-image-container">
                  <img src={imagePreview} alt="Selected crop symptom" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-img-btn"
                    title="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
              />
            </div>

            {/* Crop Selector */}
            <div className="form-group">
              <label className="form-label" htmlFor="crop-select">
                {language === 'gu' ? 'પાક પસંદ કરો:' : language === 'hi' ? 'फसल चुनें:' : 'Target Crop'}
              </label>
              <select
                id="crop-select"
                className="form-select"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="">{language === 'gu' ? 'ફોટો પરથી આપમેળે ઓળખો અથવા પાક પસંદ કરો...' : 'Auto-detect from photograph or select...'}</option>
                <option value="Cotton">Cotton (કપાસ / कपास)</option>
                <option value="Wheat">Wheat (ઘઉં / गेहूं)</option>
                <option value="Rice">Rice / Paddy (ડાંગર / धान)</option>
                <option value="Groundnut">Groundnut (મગફળી / मूंगफली)</option>
                <option value="Chilli">Chilli (મરચી / मिर्च)</option>
                <option value="Tomato">Tomato (ટામેટા / टमाटर)</option>
                <option value="Potato">Potato (બટાટા / आलू)</option>
                <option value="Cumin">Cumin (જીરું / जीरा)</option>
                <option value="Mustard">Mustard (રાઇ / सरसों)</option>
                <option value="Onion">Onion (ડુંગળી / प्याज)</option>
                <option value="Garlic">Garlic (લસણ / लहसुन)</option>
                <option value="Sesame">Sesame (તલ / तिल)</option>
                <option value="Soybean">Soybean (સોયાબીન / सोयाबीन)</option>
                <option value="Maize">Maize (મકાઈ / मक्का)</option>
                <option value="Sugarcane">Sugarcane (શેરડી / गन्ना)</option>
                <option value="Pulses">Pulses / Gram / Tur (કઠોળ / दालें)</option>
                <option value="Other">{language === 'gu' ? 'અન્ય પાક (Other Crop - Custom)...' : language === 'hi' ? 'अन्य फसल (Other Crop)...' : 'Other Crop (Custom)...'}</option>
              </select>
            </div>

            {/* Custom Crop Input when Other is selected */}
            {crop === 'Other' && (
              <div className="form-group" style={{ background: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                <label className="form-label" style={{ color: '#92400E', fontWeight: '700' }}>
                  {language === 'gu' ? 'તમારા પાકનું નામ લખો:' : language === 'hi' ? 'अपनी फसल का नाम दर्ज करें:' : 'Enter Custom Crop Name:'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={language === 'gu' ? 'દા.ત. ડુંગળી, લસણ, તલ, વરિયાળી, દાડમ, પપૈયા...' : language === 'hi' ? 'उदा. लहसुन, प्याज, अनार, पपीता...' : 'e.g. Onion, Garlic, Pomegranate, Papaya...'}
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                />
              </div>
            )}

            {/* Symptoms Text Area with Voice Mic Dictation Button */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" htmlFor="symptoms-textarea" style={{ margin: 0 }}>
                  {language === 'gu' ? 'જોવાયેલા લક્ષણો અને વિગતો:' : language === 'hi' ? 'दिखने वाले लक्षण एवं स्थिति:' : 'Observed Symptoms & Context'}
                </label>
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`voice-mic-btn ${isListening ? 'active' : ''}`}
                  title={isListening ? 'Stop recording' : 'Speak symptoms (બોલીને લખાવો)'}
                  style={{ width: 'auto', padding: '4px 10px', height: '30px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {isListening ? <MicOff size={14} color="#DC2626" /> : <Mic size={14} />}
                  <span>{isListening ? (language === 'gu' ? 'સાંભળે છે...' : 'सुन रहा है...') : (language === 'gu' ? 'બોલીને લખાવો 🎙️' : language === 'hi' ? 'बोलकर बताएं 🎙️' : 'Voice Input 🎙️')}</span>
                </button>
              </div>

              {isListening && (
                <div style={{ background: '#FEE2E2', padding: '6px 12px', borderRadius: '6px', marginBottom: '8px', fontSize: '0.8rem', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={14} className="mic-listening-pulse" />
                  <span>{language === 'gu' ? 'સાંભળી રહ્યો છું... ગુજરાતીમાં પાકના લક્ષણો બોલો' : 'सुन रहा हूँ... फसल के लक्षण बोलें'}</span>
                </div>
              )}

              <textarea
                id="symptoms-textarea"
                rows="4"
                className="form-textarea"
                placeholder={language === 'gu' 
                  ? 'દા.ત., નીચેના પાંદડા પીળા પડી રહ્યા છે, બપોરે છોડ કરમાઈ જાય છે, પાનની નીચે કાળા ડાઘા છે, ભારે વરસાદ પડ્યો હતો...' 
                  : 'E.g., Yellow concentric rings on lower leaves, drooping during noon, black powdery spots on underside, recent heavy unseasonal rainfall...'}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading || (!selectedImage && !symptoms.trim())}
            >
              <Stethoscope size={20} />
              <span>{loading ? (language === 'gu' ? 'AI વિઝન દ્વારા તપાસ ચાલુ છે...' : 'Analyzing with Vision Model...') : (language === 'gu' ? 'પાક રોગ નિદાન કરો' : 'Run Agricultural Diagnosis')}</span>
            </button>
          </form>

          {/* Safety Reminder */}
          <div style={{ marginTop: '20px', padding: '14px', background: '#F8FAF9', borderRadius: '10px', border: '1px solid #E1EAE2', fontSize: '0.8rem', color: '#647067' }}>
            <strong style={{ color: '#166534' }}>Diagnostic Safety Standard:</strong> AI vision is an advisory screening tool. For large-scale outbreaks or quarantine diseases, always seek physical laboratory confirmation from your local Krishi Vigyan Kendra (KVK).
          </div>
        </div>

        {/* Right Column: Diagnostic Results */}
        <div>
          {apiError && (
            <div className="alert-banner danger">
              <AlertTriangle size={20} />
              <div>
                <strong>Diagnosis Error</strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem' }}>{apiError}</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#166534', fontWeight: '700', marginBottom: '16px' }}>
                <Sparkles size={20} />
                <span>AI Vision Inspection in Progress...</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#647067', marginBottom: '20px' }}>
                The model is examining lesion geometry, chlorotic patterns, necrotic rings, and matching symptoms against ICAR phytopathology evidence...
              </p>
              <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '18px', width: '100%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '18px', width: '92%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '18px', width: '85%', marginBottom: '18px' }}></div>
              <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '12px' }}></div>
            </div>
          )}

          {!loading && diagnosisResult && (
            <div className="card" style={{ border: '2px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #E1EAE2', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={22} color="#15803D" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#14532D' }}>
                    {language === 'gu' ? 'પાક રોગ નિદાન પરિણામ' : language === 'hi' ? 'फसल रोग निदान परिणाम' : 'Diagnostic Assessment'}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSaveDiagnosis}
                    className="btn btn-secondary btn-sm"
                  >
                    <Save size={14} />
                    <span>{savedSuccess ? (language === 'gu' ? 'ખેતરમાં સચવાઈ ગયું!' : 'Saved!') : (language === 'gu' ? 'સલાહ સાચવો' : 'Save Advice')}</span>
                  </button>
                </div>
              </div>

              {/* Formatted Gemini/ChatGPT-style answer with TTS Audio playback */}
              <FormattedAnswer text={diagnosisResult.report} language={language} sources={diagnosisResult.sources} />

              {diagnosisResult.sources && diagnosisResult.sources.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E1EAE2', background: '#F0FDF4', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                    Referenced ICAR & University Protocols:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#647067' }}>
                    {diagnosisResult.sources.map((s, idx) => (
                      <li key={idx}><strong>{s.title}</strong> — {s.source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!loading && !diagnosisResult && !apiError && (
            <div className="card card-soft" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#166534', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <Stethoscope size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#14532D' }}>
                Ready to Diagnose Your Crop
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#647067', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Select a crop, upload a leaf photograph or describe the observable symptoms to receive an evidence-backed differential diagnostic report.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#166534', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> Strict IPM hierarchy applied to all recommendations
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
