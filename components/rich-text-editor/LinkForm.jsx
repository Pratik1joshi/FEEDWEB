'use client';

import { useState } from "react";
import ToolButton from "./ToolButton.jsx";
import { BiLink } from "react-icons/bi";

const LinkForm = ({ onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    onSubmit(link);
    setLink("");
    setShowForm(false);
  };

  return (
    <div className="relative">
      <ToolButton 
        onClick={() => setShowForm(true)}
        title="Insert Link"
      >
        <BiLink size={20} />
      </ToolButton>
      
      {showForm && (
        <div className="absolute top-12 left-0 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 min-w-[300px]">
          <div className="text-sm font-semibold text-gray-700 mb-3">Insert Link</div>
          <div className="flex gap-2">
            <input
              value={link}
              onChange={({ target }) => setLink(target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Add
            </button>
            <button
              onClick={() => {
                setLink("");
                setShowForm(false);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Backdrop to close form */}
      {showForm && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default LinkForm;
