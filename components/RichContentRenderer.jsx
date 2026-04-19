/**
 * RichContentRenderer - Component for safely rendering rich HTML content from the BasicRichTextEditor
 * 
 * This component takes HTML content from the database and renders it with proper styling
 * that matches the TipTap editor's output format. It includes security measures to prevent XSS.
 */

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import './RichContentRenderer.css';

const RichContentRenderer = ({ 
  content, 
  className = '',
  maxHeight = null,
  showExpandButton = false 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Sanitize HTML content to prevent XSS attacks
  const sanitizeHTML = (html) => {
    if (!html) return '';
    
    // DOMPurify configuration for rich content
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption',
        'a', 'div', 'span', 'hr',
        'sub', 'sup'
      ],
      ALLOWED_ATTR: [
        'class', 'style', 'data-*',
        'href', 'target', 'rel',
        'src', 'alt', 'title', 'width', 'height',
        'rowspan', 'colspan',
        'data-type', 'contenteditable'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    };

    return DOMPurify.sanitize(html, config);
  };

  const sanitizedContent = sanitizeHTML(content);

  const contentStyle = {
    maxHeight: !isExpanded && maxHeight ? maxHeight : 'none',
    overflow: !isExpanded && maxHeight ? 'hidden' : 'visible',
    position: 'relative'
  };

  const shouldShowExpandButton = showExpandButton && maxHeight && content && content.length > 500;

  return (
    <div className={`rich-content-renderer break-words overflow-hidden ${className}`}>
      <div 
        className="prose prose-lg max-w-none rich-content break-words whitespace-pre-wrap overflow-hidden"
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      
      {shouldShowExpandButton && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Read More
              </>
            )}
          </button>
        </div>
      )}
      
      {!isExpanded && maxHeight && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"
          style={{ display: shouldShowExpandButton ? 'block' : 'none' }}
        />
      )}
    </div>
  );
};

export default RichContentRenderer;
