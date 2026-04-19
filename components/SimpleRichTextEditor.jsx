'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Link2,
  Quote,
  Type,
  Eye,
  EyeOff
} from 'lucide-react';

// Simple dynamic import for ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center border border-gray-200">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
});

const SimpleRichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...', 
  label,
  height = '200px',
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple toolbar - just the essentials
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link'],
      [{ 'header': [1, 2, 3, false] }],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote', 'link'
  ];

  if (!mounted) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="w-full h-32 bg-gray-50 animate-pulse rounded-lg flex items-center justify-center border border-gray-200">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      )}
      
      <div className="relative">
        {isPreviewMode ? (
          <div 
            className="min-h-[120px] p-4 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="simple-rich-editor">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              style={{ 
                height: height,
                borderRadius: '8px'
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx global>{`
        /* Simple and clean styles */
        .simple-rich-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
          padding: 8px;
        }
        
        .simple-rich-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 8px 8px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .simple-rich-editor .ql-editor {
          min-height: 120px;
          padding: 16px;
          color: #374151;
        }
        
        .simple-rich-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .simple-rich-editor .ql-toolbar button {
          color: #6b7280;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .simple-rich-editor .ql-toolbar button:hover {
          color: #374151;
          background: #e5e7eb;
        }
        
        .simple-rich-editor .ql-toolbar button.ql-active {
          color: #2563eb;
          background: #dbeafe;
        }
        
        .simple-rich-editor .ql-editor h1 {
          font-size: 1.5em;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5em;
        }
        
        .simple-rich-editor .ql-editor h2 {
          font-size: 1.25em;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5em;
        }
        
        .simple-rich-editor .ql-editor h3 {
          font-size: 1.125em;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5em;
        }
        
        .simple-rich-editor .ql-editor blockquote {
          border-left: 4px solid #2563eb;
          margin: 1em 0;
          padding: 0.5em 1em;
          background: #f8fafc;
          border-radius: 0 4px 4px 0;
        }
        
        .simple-rich-editor .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .simple-rich-editor .ql-editor ul, 
        .simple-rich-editor .ql-editor ol {
          padding-left: 1.5em;
        }
        
        .simple-rich-editor .ql-editor li {
          margin-bottom: 0.25em;
        }
      `}</style>
    </div>
  );
};

export default SimpleRichTextEditor;
