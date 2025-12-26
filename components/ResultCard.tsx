

import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let textToCopy = '';
    
    // Recursively extracts text content from React nodes.
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (typeof node === 'number') return String(node);
        if (Array.isArray(node)) return node.map(extractText).join(' ');

        // FIX: Add generic type to React.isValidElement to inform TypeScript about the 'children' prop.
        if (React.isValidElement<{ children?: React.ReactNode }>(node) && node.props.children) {
            return extractText(node.props.children);
        }
        return '';
    };

    // FIX: Add generic type to React.isValidElement to inform TypeScript about the 'children' prop.
    if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
      const childNodes = children.props.children;
      if (title === "Suggested Tags") {
          const tags = React.Children.toArray(childNodes).map(child => extractText(child));
          textToCopy = tags.join(', ');
      } else if (title === "Script Outline") {
          const sections = React.Children.toArray(childNodes);
          textToCopy = sections.map(section => {
              // FIX: Add generic type to React.isValidElement to inform TypeScript about the 'children' prop.
              if (React.isValidElement<{ children?: React.ReactNode }>(section) && section.props.children) {
                const sectionChildren = React.Children.toArray(section.props.children);
                const titleText = extractText(sectionChildren[0]);
                const contentText = extractText(sectionChildren[1]);
                return `${titleText}\n${contentText}`;
              }
              return '';
          }).join('\n\n');
      }
      else {
          const elements = React.Children.toArray(childNodes);
          textToCopy = elements.map(child => extractText(child)).join('\n\n');
      }
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
            <span className="text-red-400">{icon}</span>
            <h3 className="text-xl font-semibold text-slate-200">{title}</h3>
        </div>
        <button 
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors flex items-center gap-1.5"
            title="Copy to clipboard"
        >
            {copied ? (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Copied!
                </>
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
                </>
            )}
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ResultCard;