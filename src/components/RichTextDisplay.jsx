'use client'

import { useEffect, useState } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import './RichTextDisplay.css'

const RichTextDisplay = ({ content, className = "" }) => {
  const [sanitizedContent, setSanitizedContent] = useState('')

  useEffect(() => {
    if (content) {
      // Enhanced DOMPurify configuration for better layout preservation
      const cleanConfig = {
        ALLOWED_TAGS: [
          'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
          'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
          'a', 'img', 'br', 'hr',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'figure', 'figcaption', 'section', 'article'
        ],
        ALLOWED_ATTR: [
          'style', 'class', 'id', 'data-*',
          'href', 'target', 'rel',
          'src', 'alt', 'width', 'height',
          'colspan', 'rowspan',
          'align', 'data-align', 'data-float',
          'contenteditable', 'draggable'
        ],
        ALLOW_DATA_ATTR: true,
        KEEP_CONTENT: true,
        // CRITICAL: Allow all CSS properties including float, position, etc.
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        // Don't remove any style attributes - this is crucial for layout preservation
        FORBID_ATTR: [],
        // Custom hook to preserve critical layout styles
        SANITIZE_NAMED_PROPS: {
          style: function(value, node) {
            // Preserve all style attributes, especially float-related ones
            return value;
          }
        }
      };

      // Additional configuration to prevent removal of critical CSS properties
      DOMPurify.addHook('uponSanitizeAttribute', function (node, data) {
        if (data.attrName === 'style') {
          // Ensure float styles are preserved
          if (data.attrValue && (
            data.attrValue.includes('float:') || 
            data.attrValue.includes('display:') || 
            data.attrValue.includes('margin:') ||
            data.attrValue.includes('width:') ||
            data.attrValue.includes('height:')
          )) {
            // Keep the style attribute as-is
            return;
          }
        }
      });
      
      // Sanitize the HTML content while preserving ALL layout styles
      const cleaned = DOMPurify.sanitize(content, cleanConfig)
      setSanitizedContent(cleaned)
      
      // Remove the hook after use to prevent conflicts
      DOMPurify.removeHook('uponSanitizeAttribute');
    }
  }, [content])

  if (!content) return null

  return (
    <div
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        // Base styles that don't override inline styles
        lineHeight: '1.6',
        wordBreak: 'break-word',
        // CRITICAL: Don't set position relative here
        display: 'block',
        overflow: 'visible', // Allow content to flow around floated elements
        width: '100%'
      }}
    />
  )
}

export default RichTextDisplay