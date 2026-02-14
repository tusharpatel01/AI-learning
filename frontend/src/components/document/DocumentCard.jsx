import React from "react";
import { FileText, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();        // prevent navigation
    onDelete(document);        // 🔥 PASS THE DOCUMENT
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
          <FileText size={24} />
        </div>

        {/* 🔥 DELETE BUTTON */}
        <button
          onClick={handleDelete}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete document"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">
          {document.title}
        </h3>

        <div className="flex items-center text-sm text-slate-500 space-x-3">
          <span>{formatFileSize(document.fileSize)}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{document.flashcardsCount || 0} Flashcards</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center text-xs text-slate-400">
          <Clock size={14} className="mr-1" />
          <span>
            Uploaded {new Date(document.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-xs font-medium text-emerald-600">
          Open Document
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
