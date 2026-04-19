'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Enter detailed description...",
  height = "300px",
  className = ""
}) => {
  const [mounted, setMounted] = useState(false)
  const quillRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Custom toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ]

  // Custom image handler for better image management
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        // In a real application, you would upload this to your server or cloud storage
        // For now, we'll create a local URL
        const reader = new FileReader()
        reader.onload = (e) => {
          const quill = quillRef.current?.getEditor()
          if (quill) {
            const range = quill.getSelection(true)
            quill.insertEmbed(range.index, 'image', e.target.result)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }, [])

  // Enhanced modules with custom image handler
  const enhancedModules = {
    ...modules,
    toolbar: {
      container: modules.toolbar,
      handlers: {
        image: imageHandler
      }
    }
  }

  if (!mounted) {
    return (
      <div 
        className={`border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500">Loading editor...</span>
      </div>
    )
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <style jsx global>{`
        .ql-editor {
          min-height: ${height};
          max-height: 500px;
          overflow-y: auto;
        }
        
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
          font-family: inherit;
        }

        .ql-editor strong {
          font-weight: 600;
        }

        .ql-editor h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 1em 0 0.5em 0;
        }

        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
        }

        .ql-editor blockquote {
          border-left: 4px solid #1A365D;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 4px;
        }

        .ql-editor ul, .ql-editor ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .ql-editor li {
          margin: 0.5rem 0;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .ql-editor a {
          color: #1A365D;
          text-decoration: underline;
        }

        .ql-editor a:hover {
          color: #2c5aa0;
        }

        .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          z-index: 10;
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={enhancedModules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: 'auto' }}
      />
    </div>
  )
}

export default React.memo(RichTextEditor, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className
  )
})
