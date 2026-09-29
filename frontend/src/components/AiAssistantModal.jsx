// AiAssistantModal.jsx - Multilingual AI Safety Assistant with Speech/Voice
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  X, 
  Globe, 
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { api } from '../api';

export default function AiAssistantModal({ isOpen, onClose, defaultLanguage = 'en' }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: defaultLanguage === 'hi' 
        ? 'नमस्ते! मैं आपका आपदा प्रबंधन AI सहायक हूँ। बाढ़, भूकंप, तूफान या निकटतम राहत शिविर के बारे में पूछें।'
        : defaultLanguage === 'mr'
        ? 'नमस्कार! मी आपला आपत्ती व्यवस्थापन AI सहाय्यक आहे. पूर, भूकंप, वादळ किंवा तात्काळ मदतीबाबत विचारा.'
        : 'Hello! I am your Official Emergency Response AI Assistant. Ask me about flood safety, earthquakes, storm precautions, or nearby shelters.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Speech Recognition if supported
  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  // Text to Speech
  const handleSpeak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.queryAi(textToSend, language);
      const aiReply = res?.data?.response || "Please contact National Emergency 112 directly for emergency guidance.";

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: aiReply,
        helplines: res?.data?.officialHelplines,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Automatically speak the response
      handleSpeak(aiReply);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I am currently running in offline fallback mode. During an emergency, immediately dial 112 or 108.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px', display: 'flex', flexDirection: 'column', height: '620px' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'var(--blue-dark)', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px', borderRadius: '8px' }}>
              <Sparkles size={20} color="#93C5FD" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF' }}>
                AI Disaster Safety Assistant
              </h3>
              <p style={{ fontSize: '11px', color: '#93C5FD' }}>
                Multilingual Guidance • NDMA Protocols • Voice First
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Picker */}
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', padding: '4px 8px', borderRadius: '6px', fontSize: '11px' }}
            >
              <option value="en" style={{ color: '#000' }}>English</option>
              <option value="hi" style={{ color: '#000' }}>हिंदी (Hindi)</option>
              <option value="mr" style={{ color: '#000' }}>मराठी (Marathi)</option>
            </select>

            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '8px 16px', background: 'var(--blue-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {[
            { label: '🌊 Flood Safety', q: 'What to do during rising flood?' },
            { label: '🏢 Earthquake Rules', q: 'What should I do during an earthquake?' },
            { label: '🏠 Nearest Shelter', q: 'Where is the nearest shelter?' },
            { label: '📞 Emergency 112', q: 'What emergency helpline should I contact?' }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip.q)}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                background: '#FFFFFF',
                border: '1px solid var(--blue-border)',
                borderRadius: '14px',
                cursor: 'pointer',
                color: 'var(--blue-primary)',
                fontWeight: '600'
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              <div 
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  background: m.sender === 'user' ? 'var(--blue-primary)' : 'var(--bg-muted)',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)'
                }}
              >
                {m.text}

                {/* Optional Helplines attachment */}
                {m.helplines && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-medium)', fontSize: '11px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Emergency Contacts:</div>
                    <div>🚨 National: <strong>{m.helplines.national}</strong></div>
                    <div>🚑 Ambulance: <strong>{m.helplines.ambulance}</strong></div>
                    <div>📞 NDRF: <strong>{m.helplines.ndrf}</strong></div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', gap: '6px', marginTop: '4px', fontSize: '10px', color: 'var(--text-light)' }}>
                <span>{m.timestamp}</span>
                {m.sender === 'ai' && (
                  <button 
                    onClick={() => handleSpeak(m.text)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue-primary)', display: 'flex', alignItems: 'center' }}
                    title="Listen to this message"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-light)' }}>
              AI Assistant is thinking...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px', alignItems: 'center', background: '#FFFFFF' }}>
          <button 
            type="button"
            className={`btn ${isListening ? 'btn-emergency-sos' : 'btn-secondary'}`}
            onClick={handleStartListening}
            title={isListening ? "Listening... Speak now" : "Speak your emergency question"}
            style={{ padding: '10px', borderRadius: '50%', minWidth: '40px', height: '40px' }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input 
            type="text"
            className="form-input"
            placeholder={language === 'hi' ? "आपदा संबंधी प्रश्न पूछें..." : language === 'mr' ? "आपत्कालीन प्रश्न विचारा..." : "Ask safety guidelines, shelters, precautions..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ margin: 0 }}
          />

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            style={{ padding: '10px 14px' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
