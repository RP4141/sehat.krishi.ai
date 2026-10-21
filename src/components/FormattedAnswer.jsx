import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Sparkles } from 'lucide-react';
import { speakAnswer, stopSpeaking, isSpeechSynthesisSupported } from '../utils/speechUtils';

export default function FormattedAnswer({ text, language = 'gu', sources = [] }) {
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakAnswer({
        text,
        language,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false)
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert markdown-style text into structured HTML elements
  const renderFormattedLines = () => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3 or 4
      if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
        const title = trimmed.replace(/^#+\s*/, '');
        return (
          <h4 key={idx} style={{ 
            fontSize: '1.05rem', 
            fontWeight: '700', 
            color: '#14532D', 
            marginTop: '16px', 
            marginBottom: '6px',
            borderBottom: '1px solid #E1EAE2',
            paddingBottom: '4px'
          }}>
            {parseInlineBold(title)}
          </h4>
        );
      }

      // Bullet points
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0', paddingLeft: '4px' }}>
            <span style={{ color: '#166534', fontWeight: 'bold' }}>•</span>
            <span style={{ flex: 1, lineHeight: 1.55 }}>{parseInlineBold(content)}</span>
          </div>
        );
      }

      // Numbered items
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} style={{ margin: '6px 0', paddingLeft: '4px', fontWeight: '500' }}>
            {parseInlineBold(trimmed)}
          </div>
        );
      }

      // Empty line / paragraph gap
      if (!trimmed) {
        return <div key={idx} style={{ height: '8px' }}></div>;
      }

      // Regular text paragraph
      return (
        <p key={idx} style={{ margin: '4px 0', lineHeight: 1.6 }}>
          {parseInlineBold(trimmed)}
        </p>
      );
    });
  };

  // Helper to parse **bold** and `code`
  const parseInlineBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: '#14532D', fontWeight: '700' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="formatted-answer-container">
      {/* Content */}
      <div className="formatted-text-content" style={{ fontSize: '0.94rem', color: '#17251B' }}>
        {renderFormattedLines()}
      </div>

      {/* Grounded Sources */}
      {sources && sources.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #E1EAE2', background: '#F0FDF4', padding: '10px 14px', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Sparkles size={12} /> {language === 'gu' ? 'પ્રમાણિત કૃષિ સ્ત્રોતો:' : language === 'hi' ? 'प्रमाणित कृषि स्रोत:' : 'Verified ICAR Sources:'}
          </span>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#647067' }}>
            {sources.map((src, i) => (
              <li key={i}><strong>{src.title}</strong> — {src.source}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions Toolbar: Voice Read & Copy */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {isSpeechSynthesisSupported() && (
          <button
            type="button"
            onClick={handleSpeak}
            className={`btn btn-sm ${speaking ? 'btn-primary' : 'btn-soft'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '4px 10px' }}
            title={speaking ? 'Stop Voice' : 'Listen Aloud in Gujarati/Hindi'}
          >
            {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{speaking ? (language === 'gu' ? 'અવાજ બંધ કરો' : language === 'hi' ? 'रोकें' : 'Stop') : (language === 'gu' ? 'સાંભળો (Voice)' : language === 'hi' ? 'सुनें (Voice)' : 'Listen')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '4px 10px' }}
          title="Copy Answer"
        >
          {copied ? <Check size={14} color="#15803D" /> : <Copy size={14} />}
          <span>{copied ? (language === 'gu' ? 'કોપી થઈ ગયું' : language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'gu' ? 'કોપી' : language === 'hi' ? 'कॉपी' : 'Copy')}</span>
        </button>
      </div>
    </div>
  );
}
