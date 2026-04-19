'use client';

import React, { useState, useEffect } from 'react';
import BasicRichTextEditor from '../../components/rich-text-editor/BasicRichTextEditor';
import RichContentRenderer from '../../components/RichContentRenderer';

export default function RichTextDemo() {
  const [content, setContent] = useState(`
    <h1>🎉 Rich Text Editor Demo</h1>
    <p>This demo shows the complete workflow:</p>
    <ol>
      <li><strong>Create content</strong> with the BasicRichTextEditor</li>
      <li><strong>Store as HTML</strong> in the database</li>
      <li><strong>Render safely</strong> on the frontend with RichContentRenderer</li>
    </ol>
    
    <h2>🎨 Formatting Features</h2>
    <p>Try these features in the editor above:</p>
    <ul>
      <li>🎨 <span style="color: #ef4444">Colors</span> and <span style="background-color: #fef3c7">highlights</span></li>
      <li>🔤 <span style="font-family: 'Times New Roman', serif">Different fonts</span></li>
      <li>📐 Text alignment (left, center, right, justify)</li>
      <li>📋 Tables, lists, and blockquotes</li>
      <li>🖼️ Images with right-click controls</li>
      <li>⬆️ <sup>Superscript</sup> and ⬇️ <sub>subscript</sub></li>
    </ul>

    <blockquote>
      <p>💡 <em>Pro tip:</em> Right-click on images to access positioning and sizing controls!</p>
    </blockquote>

    <h3>📊 Sample Table</h3>
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rich Text Editor</td>
          <td>✅ Complete</td>
          <td>Full TipTap editor with all formatting options</td>
        </tr>
        <tr>
          <td>Database Storage</td>
          <td>✅ Complete</td>
          <td>HTML content stored in TEXT fields</td>
        </tr>
        <tr>
          <td>Frontend Renderer</td>
          <td>✅ Complete</td>
          <td>Secure HTML rendering with DOMPurify</td>
        </tr>
      </tbody>
    </table>

    <hr>

    <p><code>Code snippets</code> are also supported, and you can create <mark>highlighted text</mark> easily!</p>
  `);

  const [savedContent, setSavedContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Simulate saving to database
  const handleSave = () => {
    setSavedContent(content);
    alert('✅ Content saved! (This would normally save to the database)');
  };

  // Simulate loading from database
  const handleLoad = () => {
    if (savedContent) {
      setContent(savedContent);
      alert('📥 Content loaded from "database"!');
    } else {
      alert('ℹ️ No saved content found. Save some content first!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Rich Text Editor Complete Integration Demo
            </h1>
            <p className="text-gray-600 mb-6">
              This page demonstrates the complete workflow from creating rich content 
              to storing in database and rendering on frontend.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPreviewMode ? '✏️ Edit Mode' : '👁️ Preview Mode'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                💾 Save to "Database"
              </button>
              <button
                onClick={handleLoad}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📥 Load from "Database"
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ✏️ Rich Text Editor
              </h2>
              <div className="border border-gray-200 rounded-lg">
                {!isPreviewMode ? (
                  <BasicRichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start typing your rich content here..."
                    height="500px"
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-center py-8">
                      📝 Switch to Edit Mode to see the editor
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Renderer Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🖼️ Frontend Renderer
              </h2>
              <div className="border border-gray-200 rounded-lg p-6 bg-white max-h-[500px] overflow-y-auto">
                <RichContentRenderer 
                  content={content}
                  className="demo-content"
                />
              </div>
            </div>
          </div>

          {/* HTML Output */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔧 HTML Output (What gets stored in database)
            </h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{content}</code>
              </pre>
            </div>
          </div>

          {/* Saved Content Preview */}
          {savedContent && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💾 Saved Content Preview
              </h2>
              <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                <RichContentRenderer 
                  content={savedContent}
                  className="saved-content"
                />
              </div>
            </div>
          )}

          {/* Integration Steps */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              🔄 Integration Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span className="text-gray-700">
                  <strong>Step 1:</strong> All admin forms updated to use BasicRichTextEditor
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span className="text-gray-700">
                  <strong>Step 2:</strong> Database schema supports HTML content storage
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span className="text-gray-700">
                  <strong>Step 3:</strong> RichContentRenderer component created for frontend
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl mr-3">🔄</span>
                <span className="text-gray-700">
                  <strong>Next:</strong> Integrate RichContentRenderer into actual pages (publications, news, etc.)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
