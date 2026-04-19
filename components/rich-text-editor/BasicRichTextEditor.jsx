'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Blockquote } from '@tiptap/extension-blockquote';
// Import CustomImage extension that preserves layout styles (float, width, margin, etc.)
import { CustomImage } from './CustomImageExtension';
import { 
  BiBold, 
  BiItalic, 
  BiUnderline, 
  BiStrikethrough,
  BiListUl, 
  BiListOl, 
  BiLink,
  BiUnlink,
  BiCode,
  BiCodeCurly,
  BiImageAlt,
  BiTable,
  BiFont,
  BiUpload,
  BiMinus,
  BiText,
  BiMove,
  BiCrop,
  BiExpand
} from 'react-icons/bi';
import { 
  MdFormatColorText, 
  MdHighlight, 
  MdUndo, 
  MdRedo,
  MdFormatQuote,
  MdSubscript,
  MdSuperscript,
  MdHorizontalRule
} from 'react-icons/md';

const BasicRichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...', 
  label,
  height = '300px',
  className = '',
  name = 'content'
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showImageControls, setShowImageControls] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageElement, setSelectedImageElement] = useState(null);
  const [selectedImagePos, setSelectedImagePos] = useState(null);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);
  const lastSyncedValueRef = useRef(value);

  const colors = [
    '#000000', '#374151', '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
  ];

  const highlightColors = [
    '#fef3c7', '#fde68a', '#fed7aa', '#fecaca', '#f9a8d4', '#ddd6fe',
    '#c7d2fe', '#bfdbfe', '#a7f3d0', '#bbf7d0', '#d9f99d', '#fde047'
  ];

  const fonts = [
    'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
    'Courier New', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
  ];

  const fontSizes = [
    '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'
  ];

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      HorizontalRule,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic text-gray-700',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      // Use CustomImage extension that preserves float/positioning styles
      CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rich-editor-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastSyncedValueRef.current = html;
      onChange && onChange(html);
      
      // Also trigger a form input event for form handling
      if (name) {
        const event = new CustomEvent('input', { 
          detail: { name, value: html },
          bubbles: true 
        });
        document.dispatchEvent(event);
      }
      
      setForceUpdate(prev => prev + 1); // Force button state updates
    },
    onSelectionUpdate: ({ editor }) => {
      setForceUpdate(prev => prev + 1); // Force button state updates
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none outline-none px-4 py-3 min-h-[200px] focus:ring-0 whitespace-pre-wrap break-words w-full`,
      },
      handleClick: (view, pos, event) => {
        try {
          const target = event.target;
          if (target && target.tagName === 'IMG') {
            const imagePos = view.posAtDOM(target, 0);
            editor.chain().focus().setNodeSelection(imagePos).run();
            setSelectedImageElement(target);
            setSelectedImage(target.src);
            setSelectedImagePos(imagePos);
            setShowImageControls(true);
            setShowContextMenu(false);
            return true;
          }
        } catch (error) {
          console.error('Error handling image click:', error);
        }

        // Hide context menu on regular clicks
        setShowContextMenu(false);
        setShowImageControls(false);
        return false;
      },
      handleDOMEvents: {
        contextmenu: (view, event) => {
          try {
            const target = event.target;
            if (target.tagName === 'IMG') {
              event.preventDefault();
              const pos = view.posAtDOM(target, 0);
              editor.chain().focus().setNodeSelection(pos).run();
              setSelectedImageElement(target);
              setSelectedImage(target.src);
              setSelectedImagePos(pos);
              setContextMenuPosition({
                x: event.clientX,
                y: event.clientY
              });
              setShowContextMenu(true);
              setShowImageControls(false);
              return true;
            }
            // Hide context menu if not on image
            setShowContextMenu(false);
            return false;
          } catch (error) {
            console.error('Error handling context menu:', error);
            setShowContextMenu(false);
            return false;
          }
        },
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value === undefined || value === null) {
      return;
    }

    if (value !== lastSyncedValueRef.current) {
      editor.commands.setContent(value, false);
      lastSyncedValueRef.current = value;
    }
  }, [editor, value]);

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    try {
      const finalUrl = uploadedImageUrl || imageUrl;
      if (finalUrl && editor) {
        editor.chain().focus().setImage({ src: finalUrl }).run();
        setImageUrl('');
        setUploadedImageUrl('');
        setImageFile(null);
        setShowImageDialog(false);
      } else {
        console.warn('No image URL provided');
      }
    } catch (error) {
      console.error('Error inserting image:', error);
      alert('Failed to insert image. Please try again.');
    }
  };

  const handleFileUpload = (event) => {
    try {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        setImageFile(file);
        
        // Create a local URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            setUploadedImageUrl(e.target.result);
          } catch (error) {
            console.error('Error setting uploaded image URL:', error);
          }
        };
        reader.onerror = () => {
          console.error('Error reading file');
          alert('Failed to read the selected file. Please try again.');
        };
        reader.readAsDataURL(file);
      } else if (file) {
        alert('Please select a valid image file.');
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteTable = () => editor.chain().focus().deleteTable().run();

  // Font size helper
  const setFontSize = (size) => {
    editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
  };

  // Image control functions - These update both DOM and TipTap node attributes
  // Helper function to find and update image node in TipTap
  const updateImageNode = (imageSrc, attributes) => {
    if (!editor) return;
    
    try {
      const state = editor.view.state;
      const view = editor.view;

      const applyAtPos = (pos) => {
        const node = state.doc.nodeAt(pos);
        if (!node || node.type.name !== 'image') return false;

        const tr = state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...attributes,
        });
        view.dispatch(tr);
        return true;
      };

      if (selectedImagePos !== null && selectedImagePos !== undefined && applyAtPos(selectedImagePos)) {
        return;
      }

      const selection = state.selection;
      if (selection && selection.node && selection.node.type && selection.node.type.name === 'image') {
        if (applyAtPos(selection.from)) return;
      }

      if (selectedImageElement) {
        const domPos = view.posAtDOM(selectedImageElement, 0);
        if (applyAtPos(domPos)) return;
      }

      // Fallback: Find the first matching image by src and update it
      let updated = false;
      state.doc.descendants((node, pos) => {
        if (updated) return false;
        if (node.type.name === 'image' && node.attrs.src === imageSrc) {
          updated = applyAtPos(pos);
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error updating image node:', error);
    }
  };

  const updateImageStyle = (element, styles) => {
    try {
      if (element && element.style) {
        element.style.cssText = styles;
        setForceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating image style:', error);
    }
  };

  const syncImageAlignmentClasses = (element, alignment) => {
    if (!element) return;

    element.classList.remove('image-left', 'image-right', 'image-center');

    if (alignment === 'left') {
      element.classList.add('image-left');
    } else if (alignment === 'right') {
      element.classList.add('image-right');
    } else if (alignment === 'center') {
      element.classList.add('image-center');
    }
  };

  const setImageSize = (element, width, height = 'auto') => {
    try {
      if (element && element.style) {
        // Update DOM
        element.style.width = width;
        element.style.height = height;
        element.style.objectFit = 'cover';
        
        // Update TipTap node attributes so changes persist
        if (selectedImage) {
          updateImageNode(selectedImage, { width, height });
        }
        
        setForceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error setting image size:', error);
    }
  };

  const setImageAlignment = (element, alignment) => {
    try {
      if (!element || !element.style) return;
      
      // Prepare attribute updates for TipTap
      let nodeAttrs = {
        float: null,
        display: null,
        margin: null,
        width: null,
      };
      
      // Clear existing alignment styles
      element.style.float = '';
      element.style.display = '';
      element.style.margin = '';
      syncImageAlignmentClasses(element, alignment === 'default' ? null : alignment);
      
      switch (alignment) {
        case 'left':
          element.style.float = 'left';
          element.style.margin = '0 1em 1em 0';
          element.style.display = 'inline';
          if (!element.style.width || element.style.width === '100%') {
            element.style.width = '250px';
          }
          nodeAttrs = { float: 'left', display: 'inline', margin: '0 1em 1em 0', width: element.style.width || '250px' };
          break;
        case 'right':
          element.style.float = 'right';
          element.style.margin = '0 0 1em 1em';
          element.style.display = 'inline';
          if (!element.style.width || element.style.width === '100%') {
            element.style.width = '250px';
          }
          nodeAttrs = { float: 'right', display: 'inline', margin: '0 0 1em 1em', width: element.style.width || '250px' };
          break;
        case 'center':
          element.style.display = 'block';
          element.style.margin = '1.5em auto';
          element.style.float = 'none';
          nodeAttrs = { float: 'none', display: 'block', margin: '1.5em auto', width: element.style.width || null };
          break;
        default:
          element.style.display = 'block';
          element.style.margin = '1.5em auto';
          element.style.float = 'none';
          nodeAttrs = { float: 'none', display: 'block', margin: '1.5em auto', width: element.style.width || null };
      }
      
      // Update TipTap node attributes so changes persist
      if (selectedImage) {
        updateImageNode(selectedImage, {
          ...nodeAttrs,
          alignment: alignment === 'default' ? null : alignment,
        });
      }
      
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error setting image alignment:', error);
    }
  };

  const addImageBorder = (element) => {
    try {
      if (element && element.style) {
        element.style.border = '3px solid #e5e7eb';
        element.style.padding = '4px';
        
        // Update TipTap node attributes
        if (selectedImage) {
          updateImageNode(selectedImage, { border: '3px solid #e5e7eb' });
        }
        
        setForceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error adding image border:', error);
    }
  };

  const roundImageCorners = (element) => {
    try {
      if (element && element.style) {
        element.style.borderRadius = '12px';
        element.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        
        // Update TipTap node attributes
        if (selectedImage) {
          updateImageNode(selectedImage, { 
            borderRadius: '12px', 
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)' 
          });
        }
        
        setForceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error rounding image corners:', error);
    }
  };

  const resetImageStyle = (element) => {
    try {
      if (element && element.style) {
        element.style.cssText = 'max-width: 100%; height: auto; cursor: pointer; transition: all 0.3s ease;';
        
        // Reset TipTap node attributes
        if (selectedImage) {
          updateImageNode(selectedImage, { 
            float: null, 
            display: null, 
            margin: null,
            alignment: null,
            width: null,
            height: null,
            border: null,
            borderRadius: null,
            boxShadow: null
          });
        }

        syncImageAlignmentClasses(element, null);
        
        setForceUpdate(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error resetting image style:', error);
    }
  };

  // Improved active state checker

  const isActive = (type, attrs = {}) => {
    if (!editor) return false;
    return editor.isActive(type, attrs);
  };

  if (!editor) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="w-full h-32 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center border">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          
          {/* Heading Selector */}
          <select
            className="text-sm border rounded px-2 py-1 mr-2 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 }) ? 1 :
              editor.isActive('heading', { level: 2 }) ? 2 :
              editor.isActive('heading', { level: 3 }) ? 3 : 0
            }
          >
            <option value={0}>Paragraph</option>
            <option value={1}>Heading 1</option>
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
          </select>

          {/* Font Family Selector */}
          <select
            className="text-sm border rounded px-2 py-1 mr-2 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.value === 'default') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            value={editor.getAttributes('textStyle').fontFamily || 'default'}
          >
            <option value="default">Default Font</option>
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          {/* Font Size Selector */}
          <select
            className="text-sm border rounded px-2 py-1 mr-2 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.value === 'default') {
                editor.chain().focus().unsetMark('textStyle').run();
              } else {
                setFontSize(e.target.value);
              }
            }}
            value={editor.getAttributes('textStyle').fontSize || 'default'}
          >
            <option value="default">Size</option>
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              !editor.can().chain().focus().undo().run() ? 'text-gray-400' : 'text-gray-700'
            }`}
            title="Undo"
          >
            <MdUndo size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              !editor.can().chain().focus().redo().run() ? 'text-gray-400' : 'text-gray-700'
            }`}
            title="Redo"
          >
            <MdRedo size={18} />
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Basic Formatting */}
          <button
            onClick={() => {
              editor.chain().focus().toggleBold().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('bold') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Bold"
          >
            <BiBold size={18} />
          </button>
          
          <button
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('italic') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Italic"
          >
            <BiItalic size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleUnderline().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('underline') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Underline"
          >
            <BiUnderline size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('strike') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Strikethrough"
          >
            <BiStrikethrough size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleSubscript().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('subscript') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Subscript"
          >
            <MdSubscript size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleSuperscript().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('superscript') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Superscript"
          >
            <MdSuperscript size={18} />
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Colors */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
              title="Text Color"
            >
              <MdFormatColorText size={18} />
            </button>
            {showColorPicker && (
              <div className="absolute top-12 left-0 z-50 bg-white border rounded-xl shadow-2xl p-4 min-w-[280px]">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MdFormatColorText className="text-blue-600" />
                  Text Colors
                </h4>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md relative group"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                        setForceUpdate(prev => prev + 1);
                      }}
                      title={`Set color to ${color}`}
                    >
                      <div className="absolute inset-0 rounded-lg bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                    </button>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <button
                    className="text-sm text-gray-600 hover:text-white hover:bg-red-500 px-3 py-2 border border-gray-300 hover:border-red-500 rounded-lg w-full transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                      setForceUpdate(prev => prev + 1);
                    }}
                  >
                    ✕ Remove Color
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
              title="Highlight"
            >
              <MdHighlight size={18} />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-12 left-0 z-50 bg-white border rounded-xl shadow-2xl p-4 min-w-[280px]">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MdHighlight className="text-yellow-600" />
                  Highlight Colors
                </h4>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-yellow-400 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md relative group"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run();
                        setShowHighlightPicker(false);
                        setForceUpdate(prev => prev + 1);
                      }}
                      title={`Highlight with ${color}`}
                    >
                      <div className="absolute inset-0 rounded-lg bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                    </button>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <button
                    className="text-sm text-gray-600 hover:text-white hover:bg-orange-500 px-3 py-2 border border-gray-300 hover:border-orange-500 rounded-lg w-full transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightPicker(false);
                      setForceUpdate(prev => prev + 1);
                    }}
                  >
                    ✕ Remove Highlight
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Alignment */}
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Align Left"
          >
            L
          </button>

          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('center').run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Align Center"
          >
            C
          </button>

          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('right').run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Align Right"
          >
            R
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Lists */}
          <button
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('bulletList') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Bullet List"
          >
            <BiListUl size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('orderedList') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Numbered List"
          >
            <BiListOl size={18} />
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Code */}
          <button
            onClick={() => {
              editor.chain().focus().toggleCode().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('code') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Inline Code"
          >
            <BiCode size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleCodeBlock().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('codeBlock') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Code Block"
          >
            <BiCodeCurly size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              setForceUpdate(prev => prev + 1);
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              isActive('blockquote') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Blockquote"
          >
            <MdFormatQuote size={18} />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run();
              setForceUpdate(prev => prev + 1);
            }}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Horizontal Rule"
          >
            <MdHorizontalRule size={18} />
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Links */}
          <button
            onClick={addLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('link') ? 'bg-blue-500 text-white' : 'text-gray-700'
            }`}
            title="Add Link"
          >
            <BiLink size={18} />
          </button>

          <button
            onClick={removeLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Remove Link"
            disabled={!editor.isActive('link')}
          >
            <BiUnlink size={18} />
          </button>

          {/* Image */}
          <button
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Add Image"
          >
            <BiImageAlt size={18} />
          </button>

          {/* Separator */}
          <div className="border-l mx-1 h-6"></div>

          {/* Table Controls */}
          <button
            onClick={insertTable}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Insert Table"
          >
            <BiTable size={18} />
          </button>

          {editor.isActive('table') && (
            <>
              <button
                onClick={addColumnBefore}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
                title="Add Column Before"
              >
                C←
              </button>
              <button
                onClick={addColumnAfter}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
                title="Add Column After"
              >
                C→
              </button>
              <button
                onClick={deleteColumn}
                className="p-2 rounded hover:bg-red-200 transition-colors text-red-700 text-xs"
                title="Delete Column"
              >
                C✕
              </button>
              <button
                onClick={addRowBefore}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
                title="Add Row Before"
              >
                R↑
              </button>
              <button
                onClick={addRowAfter}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
                title="Add Row After"
              >
                R↓
              </button>
              <button
                onClick={deleteRow}
                className="p-2 rounded hover:bg-red-200 transition-colors text-red-700 text-xs"
                title="Delete Row"
              >
                R✕
              </button>
              <button
                onClick={deleteTable}
                className="p-2 rounded hover:bg-red-200 transition-colors text-red-700 text-xs"
                title="Delete Table"
              >
                T✕
              </button>
            </>
          )}
        </div>
        
        {/* Editor Content */}
        <div style={{ minHeight: height }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Right-Click Context Menu for Images */}
      {showContextMenu && (
        <div 
          className="fixed bg-white border rounded-lg shadow-2xl py-2 z-[100] min-w-[200px]"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <div className="px-3 py-2 text-sm font-semibold text-gray-700 border-b flex items-center gap-2">
            <BiImageAlt className="text-blue-600" />
            Image Options
          </div>
          
          <button
            onClick={() => {
              try {
                setShowImageControls(true);
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error opening image controls:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-gray-700"
          >
            <BiMove className="text-blue-600" />
            Open Image Panel
          </button>
          
          <div className="border-t my-1"></div>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageSize(selectedImageElement, '150px');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting small image size:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
          >
            📏 Small Size
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageSize(selectedImageElement, '250px');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting medium image size:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
          >
            📐 Medium Size
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageSize(selectedImageElement, '400px');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting large image size:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-2 text-gray-700"
          >
            📊 Large Size
          </button>
          
          <div className="border-t my-1"></div>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageAlignment(selectedImageElement, 'left');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting left alignment:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2 text-gray-700"
          >
            ⬅️ Align Left
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageAlignment(selectedImageElement, 'center');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting center alignment:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2 text-gray-700"
          >
            ↔️ Center
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                setImageAlignment(selectedImageElement, 'right');
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error setting right alignment:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2 text-gray-700"
          >
            ➡️ Align Right
          </button>
          
          <div className="border-t my-1"></div>
          
          <button
            type="button"
            onClick={() => {
              try {
                roundImageCorners(selectedImageElement);
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error rounding image corners:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-yellow-50 flex items-center gap-2 text-gray-700"
          >
            🔘 Round Corners
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                addImageBorder(selectedImageElement);
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error adding image border:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-yellow-50 flex items-center gap-2 text-gray-700"
          >
            🖼️ Add Border
          </button>
          
          <button
            type="button"
            onClick={() => {
              try {
                resetImageStyle(selectedImageElement);
                setShowContextMenu(false);
              } catch (error) {
                console.error('Error resetting image style:', error);
                setShowContextMenu(false);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-gray-700"
          >
            🔄 Reset Style
          </button>
        </div>
      )}

      {/* Side Image Control Panel */}
      {showImageControls && selectedImageElement && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-xl shadow-2xl p-6 z-[90] w-80">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BiImageAlt className="text-blue-600" />
              Image Controls
            </h4>
            <button
              type="button"
              onClick={() => {
                try {
                  setShowImageControls(false);
                  setSelectedImageElement(null);
                  setSelectedImage(null);
                  setSelectedImagePos(null);
                } catch (error) {
                  console.error('Error closing image controls:', error);
                  setShowImageControls(false);
                }
              }}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Image Preview */}
          <div className="mb-4 text-center">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="max-w-full max-h-24 mx-auto rounded border shadow-sm"
            />
          </div>
          
          {/* Size Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">📏 Size</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageSize(selectedImageElement, '120px');
                  } catch (error) {
                    console.error('Error setting small size:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-lg hover:from-green-200 hover:to-green-300 transition-all"
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageSize(selectedImageElement, '250px');
                  } catch (error) {
                    console.error('Error setting medium size:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all"
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageSize(selectedImageElement, '400px');
                  } catch (error) {
                    console.error('Error setting large size:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-lg hover:from-purple-200 hover:to-purple-300 transition-all"
              >
                Large
              </button>
            </div>
          </div>

          {/* Alignment Controls */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">📍 Position</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageAlignment(selectedImageElement, 'left');
                  } catch (error) {
                    console.error('Error setting left alignment:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-lg hover:from-orange-200 hover:to-orange-300 transition-all"
              >
                ⬅️ Left
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageAlignment(selectedImageElement, 'center');
                  } catch (error) {
                    console.error('Error setting center alignment:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all"
              >
                ↔️ Center
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    setImageAlignment(selectedImageElement, 'right');
                  } catch (error) {
                    console.error('Error setting right alignment:', error);
                  }
                }}
                className="px-3 py-2 text-sm bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300 rounded-lg hover:from-orange-200 hover:to-orange-300 transition-all"
              >
                ➡️ Right
              </button>
            </div>
          </div>

          {/* Style Controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">🎨 Style</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    roundImageCorners(selectedImageElement);
                  } catch (error) {
                    console.error('Error rounding corners:', error);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-gradient-to-r from-pink-100 to-pink-200 border border-pink-300 rounded-lg hover:from-pink-200 hover:to-pink-300 transition-all"
              >
                🔘 Round Corners
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    addImageBorder(selectedImageElement);
                  } catch (error) {
                    console.error('Error adding border:', error);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg hover:from-yellow-200 hover:to-yellow-300 transition-all"
              >
                🖼️ Add Border
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    resetImageStyle(selectedImageElement);
                  } catch (error) {
                    console.error('Error resetting style:', error);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-lg hover:from-red-200 hover:to-red-300 transition-all"
              >
                🔄 Reset Style
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BiImageAlt className="text-blue-600" />
              Insert Image
            </h3>
            <div className="space-y-6">
              
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <BiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">Upload from your computer</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <BiUpload className="mr-2" />
                  Choose File
                </label>
                {imageFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {imageFile.name}</p>
                )}
              </div>

              {/* Preview */}
              {uploadedImageUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={uploadedImageUrl}
                    alt="Preview"
                    className="max-w-full max-h-32 mx-auto rounded border"
                  />
                </div>
              )}

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* URL Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      setShowImageDialog(false);
                      setImageUrl('');
                      setUploadedImageUrl('');
                      setImageFile(null);
                    } catch (error) {
                      console.error('Error canceling image dialog:', error);
                      setShowImageDialog(false);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      addImage();
                    } catch (error) {
                      console.error('Error adding image:', error);
                      alert('Failed to add image. Please try again.');
                    }
                  }}
                  disabled={!uploadedImageUrl && !imageUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showColorPicker || showHighlightPicker || showContextMenu || showImageControls) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowColorPicker(false);
            setShowHighlightPicker(false);
            setShowContextMenu(false);
            setShowImageControls(false);
            setSelectedImageElement(null);
            setSelectedImage(null);
            setSelectedImagePos(null);
          }}
        />
      )}      <style jsx global>{`
        .ProseMirror {
          outline: none;
          line-height: 1.7;
          color: #374151;
        }
        
        .ProseMirror p {
          margin: 0.75em 0;
        }
        
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          font-weight: 600;
          margin: 1.5em 0 0.75em 0;
          color: #111827;
        }
        
        .ProseMirror h1 { font-size: 1.875em; }
        .ProseMirror h2 { font-size: 1.5em; }
        .ProseMirror h3 { font-size: 1.25em; }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }
        
        .ProseMirror li {
          margin: 0.25em 0;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          margin: 1.5em 0;
          padding: 0.75em 1.5em;
          background: #f8fafc;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: #475569;
        }
        
        .ProseMirror code {
          background: #f1f5f9;
          border-radius: 4px;
          color: #be185d;
          font-size: 0.875em;
          padding: 0.125em 0.375em;
          font-family: 'Fira Code', 'Consolas', monospace;
        }
        
        .ProseMirror pre {
          background: #1f2937;
          border-radius: 8px;
          color: #f9fafb;
          font-family: 'Fira Code', 'Consolas', monospace;
          margin: 1.5em 0;
          padding: 1.25em;
          overflow-x: auto;
          line-height: 1.5;
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
        
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
        
        .ProseMirror img, .ProseMirror .rich-editor-image {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5em auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .ProseMirror img:hover, .ProseMirror .rich-editor-image:hover {
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
        }

        .ProseMirror img:active, .ProseMirror .rich-editor-image:active {
          transform: scale(0.98);
        }

        .ProseMirror img.image-left,
        .ProseMirror .rich-editor-image.image-left {
          float: left !important;
          margin: 0 1em 1em 0 !important;
          display: inline !important;
        }

        .ProseMirror img.image-right,
        .ProseMirror .rich-editor-image.image-right {
          float: right !important;
          margin: 0 0 1em 1em !important;
          display: inline !important;
        }

        .ProseMirror img.image-center,
        .ProseMirror .rich-editor-image.image-center {
          float: none !important;
          display: block !important;
          margin: 1.5em auto !important;
        }

        .ProseMirror img[style*="float: left"] {
          float: left !important;
          margin: 0 1em 1em 0 !important;
          display: inline !important;
        }

        .ProseMirror img[style*="float: right"] {
          float: right !important;
          margin: 0 0 1em 1em !important;
          display: inline !important;
        }

        .ProseMirror img[style*="display: block"] {
          display: block !important;
          margin: 1.5em auto !important;
          float: none !important;
        }
        
        .ProseMirror .ProseMirror-focused {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: "${placeholder}";
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .ProseMirror strong {
          font-weight: 600;
        }
        
        .ProseMirror em {
          font-style: italic;
        }
        
        .ProseMirror u {
          text-decoration: underline;
        }
        
        .ProseMirror s {
          text-decoration: line-through;
        }

        /* Table Styles */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1.5em 0;
          width: 100%;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .ProseMirror th, .ProseMirror td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
          position: relative;
        }
        
        .ProseMirror th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        
        .ProseMirror td {
          background-color: #ffffff;
        }
        
        .ProseMirror .selectedCell {
          background-color: #dbeafe !important;
        }
        
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #3b82f6;
          cursor: col-resize;
        }
        
        .ProseMirror .tableWrapper {
          overflow-x: auto;
        }

        /* Font Family Styles */
        .ProseMirror [style*="font-family"] {
          font-family: inherit;
        }

        /* Subscript and Superscript */
        .ProseMirror sub {
          vertical-align: sub;
          font-size: smaller;
        }

        .ProseMirror sup {
          vertical-align: super;
          font-size: smaller;
        }

        /* Blockquote Enhanced Styles */
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1.5em 0;
          padding-left: 1em;
          color: #6b7280;
          font-style: italic;
          background-color: #f9fafb;
          border-radius: 0 6px 6px 0;
        }

        /* Horizontal Rule */
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2em 0;
          border-radius: 2px;
        }

        /* Enhanced Code Styles */
        .ProseMirror code {
          background-color: #f1f5f9;
          color: #e11d48;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'Courier New', Courier, monospace;
          font-weight: 500;
        }

        .ProseMirror pre {
          background-color: #1e293b;
          color: #f1f5f9;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
          border: 1px solid #334155;
        }

        .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-weight: normal;
        }

        /* Font Size Styles */
        .ProseMirror [style*="font-size"] {
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default BasicRichTextEditor;
