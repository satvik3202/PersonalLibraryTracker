import React, { useState, useEffect } from 'react';
import { X, Zap, Loader } from 'lucide-react';
import api from '../services/api';

const InsightModal = ({ isOpen, onClose, book }) => {
  const [insight, setInsight] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && book) {
      const fetchInsights = async () => {
        setLoading(true);
        setInsight('');
        setSources([]);
        try {
          // Humara backend API call karein
          const { data } = await api.post('/external/gemini/insights', {
            title: book.title,
            author: book.author,
          });
          setInsight(data.insight);
          setSources(data.sources);
        } catch (error) {
          console.error("Error fetching insights:", error);
          setInsight("Sorry, I couldn't fetch insights for this book right now.");
        }
        setLoading(false);
      };
      fetchInsights();
    }
  }, [isOpen, book]);
  
  const formatGeminiResponse = (text) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        // Bold headings
        if (line.match(/^\d+\. .+/)) {
            return <p key={index} className="mb-2 font-semibold text-gray-800">{line}</p>;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap size={20} className="text-purple-500 mr-2" />
            AI Insights: {book?.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition duration-150"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader size={32} className="animate-spin text-indigo-600" />
              <p className="mt-4 text-gray-500">Generating insights...</p>
            </div>
          ) : (
            <>
              <div className="text-gray-700 space-y-2">
                {formatGeminiResponse(insight)}
              </div>
              
              {sources.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Sources (from Google Search):</h4>
                  <ul className="space-y-1">
                    {sources.map((source, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-xs text-gray-400 mr-2">{index + 1}.</span>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:underline truncate"
                        >
                          {source.title || source.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightModal;

