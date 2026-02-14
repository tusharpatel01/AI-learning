import React, { useState, useEffect } from "react";
import { Plus, FileText, X, Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/document/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchData = async () => {
    try {
      const res = await documentService.getDocuments();
      console.log("API RESPONSE:", res.data);

      const docs = Array.isArray(res.data)
        ? res.data
        : res.data?.documents || [];

      setDocuments(docs);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle.trim()) {
      toast.error("Please provide a title and select a file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle);

      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");

      setIsLoading(true);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // 🔥 THIS MUST RECEIVE doc
  const handleDeleteRequest = (doc) => {
    console.log("DELETE REQUEST:", doc);
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("CONFIRM DELETE:", selectedDoc);

    if (!selectedDoc?._id) {
      toast.error("Invalid document selected");
      return;
    }

    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);

      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== selectedDoc._id)
      );

      toast.success(`"${selectedDoc.title}" deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
    } catch (error) {
      console.error("DELETE ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete document."
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!documents.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <FileText size={48} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">
            No Documents Yet
          </h3>
          <p className="text-slate-500 max-w-sm mb-6">
            Get started by uploading your first PDF document to begin learning.
          </p>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus strokeWidth={2.5} className="mr-2" />
            Upload Document
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}   // 🔥 MUST PASS HANDLER
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
          <p className="text-slate-500">
            Manage and organize your learning materials
          </p>
        </div>

        {documents.length > 0 && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Upload
          </Button>
        )}
      </div>

      {renderContent()}

      {/* ================= Upload Modal ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Upload New Document
              </h2>
              <p className="text-slate-500 text-sm">
                Add a PDF document to your library
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., React Interview Prep"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  PDF File
                </label>

                <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7 text-emerald-600" />
                    </div>

                    <p className="text-sm text-slate-700">
                      {uploadFile ? uploadFile.name : "Click to upload"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= Delete Modal ================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Confirm Deletion
              </h2>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {selectedDoc?.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-11 px-4 rounded-xl bg-red-500 text-white font-medium flex items-center justify-center gap-2"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
