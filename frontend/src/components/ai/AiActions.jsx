import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../components/common/MarkdownRendered";
import Modal from "../../components/common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const response = await aiService.generateSummary(documentId);
      const summary = response.data?.summary;

      if (!summary) {
        throw new Error("Summary missing in API response");
      }

      setModalTitle("Generated Summary");
      setModalContent(summary);
      console.log("SUMMARY:", summary);

      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
      console.error("SUMMARY ERROR:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");
    try {
      const response = await aiService.explainConcept(documentId, concept);
      const explanation = response.data?.explanation;

      if (!explanation) {
        throw new Error("Explanation missing in API response");
      }

      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
      console.error("EXPLAIN ERROR:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Powered by advanced AI
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Generate Summary */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <BookOpen
                    className="w-4 h-4 text-blue-600"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Generate Summary
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get a concise summary of the entire document.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingAction === "summary"}
              className="mt-4 w-full h-11 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loadingAction === "summary" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                "Generate Summary"
              )}
            </button>
          </div>

          {/* Explain Concept */}
          <form
            onSubmit={handleExplainConcept}
            className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Lightbulb
                  className="w-4 h-4 text-amber-600"
                  strokeWidth={2}
                />
              </div>
              <h4 className="font-semibold text-slate-900">
                Explain a Concept
              </h4>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Enter a topic or concept from the document to get a detailed
              explanation.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder='e.g., "React Hooks"'
                disabled={loadingAction === "explain"}
                className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={
                  loadingAction === "explain" || !concept.trim()
                }
                className="shrink-0 h-11 px-5 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loadingAction === "explain" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Explain"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;
