import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ChatInterface from "../../components/chat/ChatInterface";
import AiActions from "../../components/ai/AiActions";
import FlashcardsManager from "../../components/flashcards/FlashcardsManager";

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const res = await documentService.getDocumentById(id);
        setDocument(res.data || res);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    const filePath = document.filePath;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:8000";

    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!document || !document.filePath) {
      return <div className="p-4 text-slate-500">PDF not available.</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[600px]"
            frameBorder="0"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div className="p-4 text-slate-600">
        <ChatInterface/>
      </div>
    );
  };

  const renderAIActions = () => {
    return (
      <div className="p-4 text-slate-600">
        <AiActions/>
      </div>
    );
  };

  const renderFlashcardsTab = () => {
    return (
      <div className="p-4 text-slate-600">
        <FlashcardsManager/>
      </div>
    );
  };

  const renderQuizzesTab = () => {
    return (
      <div className="p-4 text-slate-600">
        📝 Quizzes feature coming soon...
      </div>
    );
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: renderFlashcardsTab(),
    },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return (
      <div className="p-6 text-center text-slate-600">
        Document not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/documents"
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Documents
        </Link>

        <h1 className="text-xl font-semibold text-slate-900">
          {document.title}
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.name
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* <PageHeader title={document.data.title}/> */}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tabs.find((t) => t.name === activeTab)?.content}
      </div>
    </div>
  );
};

export default DocumentDetailPage;
