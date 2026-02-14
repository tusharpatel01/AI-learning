import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashCardsService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import Modal from "../../components/common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      const sets = response.data?.sets || response.data || [];
      setFlashcardSets(sets);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error?.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (!selectedSet?.cards?.length) return;
    setCurrentCardIndex(
      (prev) => (prev + 1) % selectedSet.cards.length
    );
  };

  const handlePrevCard = () => {
    if (!selectedSet?.cards?.length) return;
    setCurrentCardIndex(
      (prev) =>
        (prev - 1 + selectedSet.cards.length) %
        selectedSet.cards.length
    );
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard set deleted!");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);

      if (selectedSet?._id === setToDelete._id) {
        setSelectedSet(null);
      }

      fetchFlashcardSets();
    } catch (error) {
      toast.error("Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    if (!selectedSet?.cards?.length) {
      return (
        <div className="p-10 text-center text-slate-500">
          No cards found in this set.
        </div>
      );
    }

    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSet(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to sets
          </button>

          <div className="text-sm text-slate-500">
            Card {currentCardIndex + 1} of{" "}
            {selectedSet.cards.length}
          </div>
        </div>

        <Flashcard card={currentCard} />

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevCard}
            className="px-4 py-2 rounded-xl border hover:bg-slate-50 flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          <button
            onClick={handleNextCard}
            className="px-4 py-2 rounded-xl border hover:bg-slate-50 flex items-center gap-2"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <Brain className="w-8 h-8 text-emerald-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet
          </h3>

          <p className="text-sm text-slate-500 mb-8 max-w-sm">
            Generate flashcards from your document to start learning.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition cursor-pointer"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    {set.title || "Flashcard Set"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {set.cards?.length || 0} cards •{" "}
                    {moment(set.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 h-10 rounded-xl border hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 h-10 rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
