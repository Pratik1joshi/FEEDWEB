'use client';

import {
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiCodeAlt,
  BiCodeCurly,
  BiImageAlt,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
  BiTable,
  BiCheck,
} from "react-icons/bi";
import { MdFormatColorText, MdHighlight, MdPalette, MdUndo, MdRedo } from "react-icons/md";
import { IconSubscript, IconSuperscript } from "@tabler/icons-react";
import ToolButton from "./ToolButton.jsx";
import LinkForm from "./LinkForm.jsx";
import LinkEditForm from "./LinkEditForm.jsx";
import { useState } from "react";

const tools = [
  {
    task: "bold",
    icon: <BiBold size={20} />,
    label: "Bold (Ctrl+B)",
  },
  {
    task: "italic",
    icon: <BiItalic size={20} />,
    label: "Italic (Ctrl+I)",
  },
  {
    task: "underline",
    icon: <BiUnderline size={20} />,
    label: "Underline (Ctrl+U)",
  },
  {
    task: "strike",
    icon: <BiStrikethrough size={20} />,
    label: "Strikethrough",
  },
  {
    task: "subscript",
    icon: <IconSubscript size={20} />,
    label: "Subscript",
  },
  {
    task: "superscript",
    icon: <IconSuperscript size={20} />,
    label: "Superscript",
  },
  {
    task: "code",
    icon: <BiCodeAlt size={20} />,
    label: "Inline Code",
  },
  {
    task: "codeBlock",
    icon: <BiCodeCurly size={20} />,
    label: "Code Block",
  },
  {
    task: "highlight",
    icon: <MdHighlight size={20} />,
    label: "Highlight",
  },
  {
    task: "left",
    icon: <BiAlignLeft size={20} />,
    label: "Align Left",
  },
  {
    task: "center",
    icon: <BiAlignMiddle size={20} />,
    label: "Align Center",
  },
  {
    task: "right",
    icon: <BiAlignRight size={20} />,
    label: "Align Right",
  },
  {
    task: "bulletList",
    icon: <BiListUl size={20} />,
    label: "Bullet List",
  },
  {
    task: "orderedList",
    icon: <BiListOl size={20} />,
    label: "Numbered List",
  },
  {
    task: "taskList",
    icon: <BiCheck size={20} />,
    label: "Task List",
  },
  {
    task: "table",
    icon: <BiTable size={20} />,
    label: "Insert Table",
  },
  {
    task: "image",
    icon: <BiImageAlt size={20} />,
    label: "Insert Image",
  },
];

const headingOptions = [
  { task: "p", value: "Paragraph" },
  { task: "h1", value: "Heading 1" },
  { task: "h2", value: "Heading 2" },
  { task: "h3", value: "Heading 3" },
  { task: "h4", value: "Heading 4" },
  { task: "h5", value: "Heading 5" },
  { task: "h6", value: "Heading 6" },
];

const fontFamilies = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Courier New", label: "Courier New" },
  { value: "Impact", label: "Impact" },
  { value: "Verdana", label: "Verdana" },
  { value: "Inter", label: "Inter" },
  { value: "system-ui", label: "System UI" },
];

const textColors = [
  "#000000", "#374151", "#6b7280", "#9ca3af", "#d1d5db",
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#dc2626", "#ea580c", "#d97706"
];

const highlightColors = [
  "#fef3c7", "#fde68a", "#fed7aa", "#fecaca", "#fca5a5",
  "#f9a8d4", "#ddd6fe", "#c7d2fe", "#bfdbfe", "#a7f3d0",
  "#bbf7d0", "#d9f99d", "#fde047", "#fed7aa", "#fecdd3"
];

const chainMethods = (editor, command) => {
  if (!editor) return;
  command(editor.chain().focus()).run();
};

const EditorTools = ({ editor, onImageSelection }) => {
  const [showTextColors, setShowTextColors] = useState(false);
  const [showHighlightColors, setShowHighlightColors] = useState(false);
  
  const handleOnClick = (task) => {
    switch (task) {
      case "bold":
        return chainMethods(editor, (chain) => chain.toggleBold());
      case "italic":
        return chainMethods(editor, (chain) => chain.toggleItalic());
      case "underline":
        return chainMethods(editor, (chain) => chain.toggleUnderline());
      case "strike":
        return chainMethods(editor, (chain) => chain.toggleStrike());
      case "subscript":
        return chainMethods(editor, (chain) => chain.toggleSubscript());
      case "superscript":
        return chainMethods(editor, (chain) => chain.toggleSuperscript());
      case "code":
        return chainMethods(editor, (chain) => chain.toggleCode());
      case "codeBlock":
        return chainMethods(editor, (chain) => chain.toggleCodeBlock());
      case "highlight":
        return chainMethods(editor, (chain) => chain.toggleHighlight());
      case "orderedList":
        return chainMethods(editor, (chain) => chain.toggleOrderedList());
      case "bulletList":
        return chainMethods(editor, (chain) => chain.toggleBulletList());
      case "taskList":
        return chainMethods(editor, (chain) => chain.toggleTaskList());
      case "left":
        return chainMethods(editor, (chain) => chain.setTextAlign("left"));
      case "center":
        return chainMethods(editor, (chain) => chain.setTextAlign("center"));
      case "right":
        return chainMethods(editor, (chain) => chain.setTextAlign("right"));
      case "table":
        return chainMethods(editor, (chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }));
      case "image":
        return onImageSelection && onImageSelection();
      case "undo":
        return chainMethods(editor, (chain) => chain.undo());
      case "redo":
        return chainMethods(editor, (chain) => chain.redo());
    }
  };

  const handleLinkSubmission = (href) => {
    if (href === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const handleHeadingSelection = ({ target }) => {
    const { value } = target;
    switch (value) {
      case "p":
        return chainMethods(editor, (chain) => chain.setParagraph());
      case "h1":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 1 }));
      case "h2":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 2 }));
      case "h3":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 3 }));
      case "h4":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 4 }));
      case "h5":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 5 }));
      case "h6":
        return chainMethods(editor, (chain) => chain.toggleHeading({ level: 6 }));
    }
  };

  const getInitialLink = () => {
    const attributes = editor?.getAttributes("link");
    if (attributes) return attributes.href;
  };

  const getSelectedHeading = () => {
    let result = "p";
    if (editor?.isActive("heading", { level: 1 })) result = "h1";
    if (editor?.isActive("heading", { level: 2 })) result = "h2";
    if (editor?.isActive("heading", { level: 3 })) result = "h3";
    if (editor?.isActive("heading", { level: 4 })) result = "h4";
    if (editor?.isActive("heading", { level: 5 })) result = "h5";
    if (editor?.isActive("heading", { level: 6 })) result = "h6";
    return result;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 rounded-t-xl">
      {/* Undo/Redo */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        <ToolButton
          onClick={() => handleOnClick("undo")}
          title="Undo (Ctrl+Z)"
          disabled={!editor?.can().undo()}
        >
          <MdUndo size={20} />
        </ToolButton>
        <ToolButton
          onClick={() => handleOnClick("redo")}
          title="Redo (Ctrl+Y)"
          disabled={!editor?.can().redo()}
        >
          <MdRedo size={20} />
        </ToolButton>
      </div>

      {/* Text Formatting Section */}
      <div className="flex items-center gap-2 border-r border-gray-300 pr-3">
        <select
          value={getSelectedHeading()}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          onChange={handleHeadingSelection}
        >
          {headingOptions.map((item) => (
            <option key={item.task} value={item.task}>
              {item.value}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          onChange={({ target }) => {
            if (target.value) {
              chainMethods(editor, (chain) => chain.setFontFamily(target.value));
            }
          }}
          value={editor?.getAttributes("textStyle")?.fontFamily || ""}
        >
          <option value="">Default Font</option>
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Formatting */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        {tools.slice(0, 6).map(({ icon, task, label }) => (
          <ToolButton
            key={task}
            onClick={() => handleOnClick(task)}
            active={editor?.isActive(task)}
            title={label}
          >
            {icon}
          </ToolButton>
        ))}
      </div>

      {/* Code and Highlight */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        {tools.slice(6, 9).map(({ icon, task, label }) => (
          <ToolButton
            key={task}
            onClick={() => handleOnClick(task)}
            active={editor?.isActive(task)}
            title={label}
          >
            {icon}
          </ToolButton>
        ))}
      </div>

      {/* Colors Section */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        <div className="relative">
          <ToolButton 
            title="Text Color"
            onMouseEnter={() => setShowTextColors(true)}
            onMouseLeave={() => setShowTextColors(false)}
          >
            <MdFormatColorText size={20} />
          </ToolButton>
          {showTextColors && (
            <div 
              className="absolute top-full left-0 mt-2 p-4 bg-white border-2 rounded-xl shadow-2xl z-50 min-w-[320px]"
              onMouseEnter={() => setShowTextColors(true)}
              onMouseLeave={() => setShowTextColors(false)}
            >
              <div className="text-sm font-semibold text-gray-700 mb-3">Text Colors</div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg hover:border-blue-400"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      chainMethods(editor, (chain) => chain.setColor(color));
                      setShowTextColors(false);
                    }}
                    title={`Set text color to ${color}`}
                  />
                ))}
              </div>
              <button
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all duration-200 border-2 border-gray-300 font-medium"
                onClick={() => {
                  chainMethods(editor, (chain) => chain.unsetColor());
                  setShowTextColors(false);
                }}
              >
                Remove Text Color
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <ToolButton 
            title="Highlight Color"
            onMouseEnter={() => setShowHighlightColors(true)}
            onMouseLeave={() => setShowHighlightColors(false)}
          >
            <MdPalette size={20} />
          </ToolButton>
          {showHighlightColors && (
            <div 
              className="absolute top-full left-0 mt-2 p-4 bg-white border-2 rounded-xl shadow-2xl z-50 min-w-[320px]"
              onMouseEnter={() => setShowHighlightColors(true)}
              onMouseLeave={() => setShowHighlightColors(false)}
            >
              <div className="text-sm font-semibold text-gray-700 mb-3">Highlight Colors</div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg hover:border-blue-400"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      chainMethods(editor, (chain) => chain.toggleHighlight({ color }));
                      setShowHighlightColors(false);
                    }}
                    title={`Highlight with ${color}`}
                  />
                ))}
              </div>
              <button
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all duration-200 border-2 border-gray-300 font-medium"
                onClick={() => {
                  chainMethods(editor, (chain) => chain.unsetHighlight());
                  setShowHighlightColors(false);
                }}
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        {tools.slice(9, 12).map(({ icon, task, label }) => (
          <ToolButton
            key={task}
            onClick={() => handleOnClick(task)}
            active={editor?.isActive({ textAlign: task })}
            title={label}
          >
            {icon}
          </ToolButton>
        ))}
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        {tools.slice(12, 15).map(({ icon, task, label }) => (
          <ToolButton
            key={task}
            onClick={() => handleOnClick(task)}
            active={editor?.isActive(task === "taskList" ? "taskList" : task)}
            title={label}
          >
            {icon}
          </ToolButton>
        ))}
      </div>

      {/* Table and Image */}
      <div className="flex items-center gap-1 border-r border-gray-300 pr-3">
        <ToolButton
          onClick={() => handleOnClick("table")}
          title="Insert Table"
        >
          <BiTable size={20} />
        </ToolButton>

        {/* Table Controls - only show when in table */}
        {editor?.isActive("table") && (
          <div className="flex gap-1 ml-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">Rows:</div>
              <div className="flex gap-1">
                <button
                  className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded-lg border border-green-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.addRowBefore())}
                  title="Add Row Above"
                >
                  + ↑
                </button>
                <button
                  className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded-lg border border-green-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.addRowAfter())}
                  title="Add Row Below"
                >
                  + ↓
                </button>
                <button
                  className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.deleteRow())}
                  title="Delete Current Row"
                >
                  - Row
                </button>
              </div>
            </div>
            
            <div className="border-l border-gray-300 mx-2"></div>
            
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">Columns:</div>
              <div className="flex gap-1">
                <button
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.addColumnBefore())}
                  title="Add Column Left"
                >
                  + ←
                </button>
                <button
                  className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.addColumnAfter())}
                  title="Add Column Right"
                >
                  + →
                </button>
                <button
                  className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors"
                  onClick={() => chainMethods(editor, (chain) => chain.deleteColumn())}
                  title="Delete Current Column"
                >
                  - Col
                </button>
              </div>
            </div>
            
            <div className="border-l border-gray-300 mx-2"></div>
            
            <div className="flex flex-col gap-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">Table:</div>
              <button
                className="px-3 py-1 text-xs bg-red-200 hover:bg-red-300 rounded-lg border border-red-400 transition-colors font-semibold"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this table?")) {
                    chainMethods(editor, (chain) => chain.deleteTable());
                  }
                }}
                title="Delete Entire Table"
              >
                🗑️ Delete Table
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Link and Image */}
      <div className="flex items-center gap-1">
        <LinkForm onSubmit={handleLinkSubmission} />
        
        <ToolButton
          onClick={() => handleOnClick("image")}
          title="Insert Image"
        >
          <BiImageAlt size={20} />
        </ToolButton>
      </div>
    </div>
  );
};

export default EditorTools;
