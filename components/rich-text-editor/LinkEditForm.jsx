'use client';

import { useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";

const LinkEditForm = ({ initialState = "", onSubmit }) => {
  const [link, setLink] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    onSubmit(link);
    setIsEditing(false);
  };

  const handleRemove = () => {
    onSubmit("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-lg shadow-lg">
        <span className="text-sm text-blue-600 font-medium truncate max-w-[200px]">
          {initialState}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="Edit Link"
        >
          <BiEdit size={16} />
        </button>
        <button
          onClick={handleRemove}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Remove Link"
        >
          <BiTrash size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
      <input
        value={link}
        onChange={({ target }) => setLink(target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        onBlur={() => setIsEditing(false)}
        type="text"
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="https://example.com"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
      >
        Save
      </button>
    </div>
  );
};

export default LinkEditForm;
