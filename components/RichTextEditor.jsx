'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Save,
  Sparkles,
  Wand2
} from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-40 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center border border-gray-300">
      <div className="text-gray-500 flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span>Loading awesome editor...</span>
      </div>
    </div>
  )
});

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing something amazing...', 
  label,
  error,
  height = '300px',
  className = '',
  showWordCount = true,
  showCharCount = true,
  autoSave = false,
  onSave
}) => {
  const [mounted, setMounted] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && onSave && value) {
      const timer = setTimeout(() => {
        onSave(value);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [value, autoSave, onSave]);

  // Update word and character count
  useEffect(() => {
    if (value) {
      const text = value.replace(/<[^>]*>/g, ''); // Strip HTML tags
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    } else {
      setWordCount(0);
      setCharCount(0);
    }
  }, [value]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleManualSave = () => {
    if (onSave) {
      onSave(value);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  // Custom toolbar configuration for maximum coolness
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  if (!mounted) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="w-full h-40 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading awesome editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
            {label}
          </label>
          <div className="flex items-center space-x-2">
            {/* Save Status */}
            {saveStatus && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <Save className="w-3 h-3" />
                <span>Auto-saved</span>
              </div>
            )}
            
            {/* Manual Save Button */}
            {onSave && (
              <button
                type="button"
                onClick={handleManualSave}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
              >
                <Save className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}
            
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={handleFullscreen}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3 h-3" />
                  <span>Exit</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3 h-3" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
            
            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
        </div>
      )}
      
      <div className="relative">
        {isPreviewMode ? (
          <div 
            className={`min-h-[200px] p-4 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none ${isFullscreen ? 'h-full overflow-auto' : ''}`}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="rich-text-editor-wrapper">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              style={{ 
                height: isFullscreen ? 'calc(100vh - 200px)' : height,
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Stats Bar */}
      {(showWordCount || showCharCount) && (
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
          <div className="flex items-center space-x-4">
            {showWordCount && (
              <div className="flex items-center space-x-1">
                <Type className="w-3 h-3" />
                <span>{wordCount} words</span>
              </div>
            )}
            {showCharCount && (
              <div className="flex items-center space-x-1">
                <Wand2 className="w-3 h-3" />
                <span>{charCount} characters</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-purple-500">
            <Sparkles className="w-3 h-3" />
            <span>Rich Text Editor</span>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
      
      <style jsx global>{`
        /* Custom styles for the ULTRA COOL rich text editor */
        .rich-text-editor-wrapper .ql-toolbar {
          border: 1px solid #d1d5db;
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          padding: 16px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .rich-text-editor-wrapper .ql-toolbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%);
          background-size: 20px 20px;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }
        
        .rich-text-editor-wrapper .ql-toolbar button {
          color: white;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
          margin: 0 2px;
          padding: 8px;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transform: translateY(-1px);
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-picker {
          color: white;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .rich-text-editor-wrapper .ql-container {
          border: 2px solid transparent;
          border-image: linear-gradient(135deg, #667eea, #764ba2, #f093fb) 1;
          border-top: none;
          border-radius: 0 0 12px 12px;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 15px;
          line-height: 1.7;
          background: linear-gradient(to bottom, #ffffff, #fafbff);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.1);
        }
        
        .rich-text-editor-wrapper .ql-editor {
          min-height: 200px;
          padding: 24px;
          color: #1f2937;
          background: transparent;
        }
        
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
          opacity: 0.7;
        }
        
        .rich-text-editor-wrapper .ql-editor h1 {
          font-size: 2.2em;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.5em;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 1.8em;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.5em;
          background: linear-gradient(135deg, #764ba2, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.4em;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5em;
        }
        
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 5px solid #667eea;
          margin: 1.5em 0;
          padding: 1em 1.5em;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(240, 147, 251, 0.05));
          border-radius: 0 12px 12px 0;
          position: relative;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
        }
        
        .rich-text-editor-wrapper .ql-editor blockquote::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 10px;
          font-size: 4em;
          color: rgba(102, 126, 234, 0.2);
          font-family: serif;
        }
        
        .rich-text-editor-wrapper .ql-editor code {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          padding: 4px 8px;
          border-radius: 6px;
          font-family: 'Fira Code', 'Monaco', monospace;
          color: #e11d48;
          border: 1px solid rgba(102, 126, 234, 0.2);
          font-size: 0.9em;
        }
        
        .rich-text-editor-wrapper .ql-editor pre {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #e2e8f0;
          padding: 1.5em;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(102, 126, 234, 0.3);
        }
        
        .rich-text-editor-wrapper .ql-editor a {
          color: #667eea;
          text-decoration: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          border-bottom: 2px solid rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }
        
        .rich-text-editor-wrapper .ql-editor a:hover {
          border-bottom-color: #667eea;
          transform: translateY(-1px);
        }
        
        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          margin: 1.5em 0;
          transition: transform 0.3s ease;
        }
        
        .rich-text-editor-wrapper .ql-editor img:hover {
          transform: scale(1.02);
        }
        
        .rich-text-editor-wrapper .ql-editor ul, .rich-text-editor-wrapper .ql-editor ol {
          padding-left: 1.5em;
        }
        
        .rich-text-editor-wrapper .ql-editor li {
          margin-bottom: 0.5em;
          position: relative;
        }
        
        .rich-text-editor-wrapper .ql-editor ul li::marker {
          color: #667eea;
        }
        
        .rich-text-editor-wrapper .ql-editor ol li::marker {
          color: #764ba2;
          font-weight: bold;
        }
        
        /* Scrollbar styling */
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar {
          width: 10px;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        
        .rich-text-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }
        
        /* Animation for toolbar buttons */
        .rich-text-editor-wrapper .ql-toolbar button {
          position: relative;
          overflow: hidden;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:active::before {
          width: 120px;
          height: 120px;
        }
        
        /* Focus styles */
        .rich-text-editor-wrapper .ql-container.ql-focused {
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2), 0 8px 30px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        /* Loading animation */
        @keyframes editorPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .rich-text-editor-wrapper {
          animation: editorPulse 0.5s ease-in-out;
        }
        
        /* Selection styling */
        .rich-text-editor-wrapper .ql-editor ::selection {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(240, 147, 251, 0.3));
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .rich-text-editor-wrapper .ql-toolbar {
            padding: 12px;
            border-radius: 8px 8px 0 0;
          }
          
          .rich-text-editor-wrapper .ql-toolbar .ql-formats {
            margin-right: 8px;
          }
          
          .rich-text-editor-wrapper .ql-editor {
            padding: 16px;
          }
          
          .rich-text-editor-wrapper .ql-container {
            border-radius: 0 0 8px 8px;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .rich-text-editor-wrapper .ql-container {
            background: linear-gradient(to bottom, #1f2937, #111827);
          }
          
          .rich-text-editor-wrapper .ql-editor {
            color: #f9fafb;
          }
          
          .rich-text-editor-wrapper .ql-editor.ql-blank::before {
            color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
