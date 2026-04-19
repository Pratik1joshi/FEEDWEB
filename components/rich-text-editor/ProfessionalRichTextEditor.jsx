'use client';

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
// Import CustomImage extension that preserves layout styles (float, width, margin, etc.)
import { CustomImage } from "./CustomImageExtension";
import EditorTools from "./EditorTools.jsx";
import { BiImageAlt, BiSave, BiCheck, BiX } from "react-icons/bi";
import { MdPreview, MdEdit } from "react-icons/md";

const extensions = [
  StarterKit,
  Underline,
  Subscript,
  Superscript,
  TextStyle,
  FontFamily,
  Color.configure({ types: ['textStyle'] }),
  Highlight.configure({ multicolor: true }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
      class: "text-blue-600 hover:text-blue-800 underline transition-colors",
    },
  }),
  // Use CustomImage extension that preserves float/positioning styles
  CustomImage.configure({
    inline: false,
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg shadow-lg mx-auto",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "border-collapse border border-gray-300",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border border-gray-300",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: "border border-gray-300 bg-gray-100 font-semibold p-2",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 p-2",
    },
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: "flex items-start gap-2",
    },
  }),
  Placeholder.configure({
    placeholder: "Start writing your content here...",
  }),
];

const ProfessionalRichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your amazing content...', 
  label,
  error,
  height = '400px',
  className = '',
  showWordCount = true,
  showPreview = true,
  autoSave = false,
  onSave
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');

  const editor = useEditor({
    extensions,
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base max-w-none outline-none px-6 py-4 min-h-[300px] focus:ring-0 whitespace-pre-wrap break-words w-full`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange && onChange(html);
      
      // Update word and character count
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
      
      // Auto-save if enabled
      if (autoSave && onSave) {
        setSaveStatus('Saving...');
        setTimeout(() => {
          onSave(html);
          setSaveStatus('Saved');
          setTimeout(() => setSaveStatus(''), 2000);
        }, 1000);
      }
    },
  });

  const handleImageInsert = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl, alt: 'Inserted image' }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  const handleSave = () => {
    if (onSave && editor) {
      setSaveStatus('Saving...');
      const content = editor.getHTML();
      onSave(content);
      setTimeout(() => {
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 500);
    }
  };

  if (!editor) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-xl flex items-center justify-center border-2 border-gray-300">
          <div className="text-gray-500 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-lg font-medium">Loading professional editor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Controls */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="flex items-center gap-3">
            {/* Save Status */}
            {saveStatus && (
              <div className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                saveStatus === 'Saving...' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {saveStatus === 'Saving...' ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                ) : (
                  <BiCheck className="w-3 h-3" />
                )}
                <span>{saveStatus}</span>
              </div>
            )}
            
            {/* Word Count */}
            {showWordCount && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {wordCount} words, {charCount} chars
              </div>
            )}
            
            {/* Preview Toggle */}
            {showPreview && (
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
                  isPreviewMode 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? (
                  <>
                    <MdEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <MdPreview className="w-4 h-4" />
                    <span>Preview</span>
                  </>
                )}
              </button>
            )}
            
            {/* Manual Save */}
            {onSave && !autoSave && (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
              >
                <BiSave className="w-4 h-4" />
                Save
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Editor Container */}
      <div className="relative">
        {isPreviewMode ? (
          <div 
            className="min-h-[300px] p-6 border-2 border-gray-300 rounded-xl bg-white prose prose-sm sm:prose-base max-w-none"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-lg">
            {/* Toolbar */}
            <EditorTools 
              editor={editor} 
              onImageSelection={() => setShowImageDialog(true)}
            />
            
            {/* Editor Content */}
            <div style={{ minHeight: height }}>
              <EditorContent 
                editor={editor}
                className="prose prose-sm sm:prose-base max-w-none"
              />
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <BiX className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Image Insert Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <BiImageAlt className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Insert Image</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowImageDialog(false);
                    setImageUrl('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageInsert}
                  disabled={!imageUrl}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style jsx global>{`
        /* Professional editor styles */
        .ProseMirror {
          outline: none;
          line-height: 1.7;
          color: #374151;
        }
        
        .ProseMirror p {
          margin: 0.75em 0;
        }
        
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
        .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
          line-height: 1.3;
          margin: 1.5em 0 0.75em 0;
          font-weight: 600;
          color: #111827;
        }
        
        .ProseMirror h1 { font-size: 2em; }
        .ProseMirror h2 { font-size: 1.5em; }
        .ProseMirror h3 { font-size: 1.25em; }
        .ProseMirror h4 { font-size: 1.125em; }
        .ProseMirror h5 { font-size: 1em; }
        .ProseMirror h6 { font-size: 0.875em; }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        .ProseMirror li {
          margin: 0.25em 0;
        }
        
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .ProseMirror ul[data-type="taskList"] li input[type="checkbox"] {
          margin: 0.25rem 0 0 0;
          accent-color: #3b82f6;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1.5em 0;
          padding: 0.75em 1.5em;
          background: linear-gradient(to right, #f8fafc, #f1f5f9);
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #475569;
        }
        
        .ProseMirror code {
          background: #f1f5f9;
          border-radius: 4px;
          color: #be185d;
          font-size: 0.9em;
          padding: 0.125em 0.25em;
        }
        
        .ProseMirror pre {
          background: #1f2937;
          border-radius: 8px;
          color: #f9fafb;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          margin: 1.5em 0;
          padding: 1em;
          overflow-x: auto;
        }
        
        .ProseMirror pre code {
          background: none;
          color: inherit;
          font-size: inherit;
          padding: 0;
        }
        
        .ProseMirror mark {
          border-radius: 3px;
          padding: 0.125em 0.25em;
        }
        
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1.5em 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }
        
        .ProseMirror table td, .ProseMirror table th {
          border: 1px solid #e5e7eb;
          box-sizing: border-box;
          min-width: 1em;
          padding: 0.75em;
          position: relative;
          vertical-align: top;
        }
        
        .ProseMirror table th {
          background-color: #f9fafb;
          font-weight: 600;
          text-align: left;
        }
        
        .ProseMirror table .selectedCell {
          background: #dbeafe;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5em auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
        
        .ProseMirror .ProseMirror-focused {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalRichTextEditor;
