import React from 'react';

interface KeywordInputProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ keyword, setKeyword, onGenerate, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-500/50 transition-colors p-2 shadow-2xl">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your YouTube video topic (e.g. iPhone 15 review)"
          className="w-full px-6 py-4 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-slate-500 text-lg font-medium tracking-wide flex-grow"
          disabled={isLoading}
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || !keyword.trim()}
          className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-all shadow-lg active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Generate Content"
          )}
        </button>
      </div>
    </div>
  );
};

export default KeywordInput;
