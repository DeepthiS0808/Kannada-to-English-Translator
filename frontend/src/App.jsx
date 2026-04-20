import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Languages, Loader2, Sparkles, Copy, Trash2, CheckCircle2 } from 'lucide-react';
import './index.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/translate', {
        text: inputText,
        sourcePath: 'kn',
        targetPath: 'en'
      });
      
      setTranslatedText(response.data.translatedText);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to translation server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
    }
  };

  return (
    <div className="translator-container">
      <div className="header">
        <h1>Kannada to English</h1>
        <p>Instant, seamless translation powered by AI</p>
      </div>

      <div className="translation-grid">
        {/* Source Text Area */}
        <div className="text-area-container">
          <div className="lang-label">
            <Languages size={18} />
            Kannada
          </div>
          <div className="textarea-wrapper">
            <textarea
              className="translate-textarea"
              placeholder="ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... (Type here...)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Target Text Area */}
        <div className="text-area-container">
          <div className="lang-label">
            <Sparkles size={18} />
            English
          </div>
          <div className="textarea-wrapper">
            <textarea
              className="translate-textarea output"
              placeholder="Translation will appear here"
              value={translatedText}
              readOnly
            />
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="actions">
        <button
          className="btn-secondary"
          onClick={handleClear}
          title="Clear text"
          disabled={!inputText && !translatedText || isLoading}
        >
          <Trash2 size={20} />
        </button>

        <button 
          className="btn-primary" 
          onClick={handleTranslate} 
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" size={20} />
              Translating...
            </>
          ) : (
            <>
              <ArrowRightLeft size={20} />
              Translate Now
            </>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={handleCopy}
          title="Copy translation"
          disabled={!translatedText}
        >
          {isCopied ? <CheckCircle2 size={20} color="#10b981" /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
}

export default App;
