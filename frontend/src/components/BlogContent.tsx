// src/components/BlogContent.tsx
import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import languages you want to use
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';

// Register the languages you want to use
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);

interface BlogContentProps {
  content: BlogContent[];
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  return (
    <div className="space-y-6">
      {content.map((block, index) => (
        <div key={index}>
          {block.type === 'text' && <p className="text-gray-800">{block.content}</p>}
          {block.type === 'code' && (
            <SyntaxHighlighter 
              language={block.language || 'javascript'} 
              style={vscDarkPlus}
              customStyle={{
                padding: '1rem',
                borderRadius: '0.375rem',
              }}
            >
              {block.content}
            </SyntaxHighlighter>
          )}
          {block.type === 'image' && (
            <img src={block.content} alt={block.alt || 'Blog post image'} className="max-w-full h-auto rounded-lg shadow-md" />
          )}
          {block.type === 'link' && (
            <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
              {block.alt || block.content}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogContent;