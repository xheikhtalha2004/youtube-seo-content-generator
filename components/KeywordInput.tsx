
import React, { useState } from 'react';

interface KeywordInputProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onGenerate: (model: string) => void;
  isLoading: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ keyword, setKeyword, onGenerate, isLoading }) => {
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onGenerate(selectedModel);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700 shadow-lg">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your YouTube video keyword..."
        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition-shadow duration-200"
        disabled={isLoading}
      />
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none transition-shadow duration-200"
        disabled={isLoading}
      >
        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
      </select>
      <button
        onClick={() => onGenerate(selectedModel)}
        disabled={isLoading || !keyword.trim()}
        className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Generate
          </>
        )}
      </button>
    </div>
  );
};

export default KeywordInput;
