"use client";

import React, { useState } from "react";
import { HelpCircle, Plus, Trash2, Power } from "lucide-react";
import { IContactPageSettings, IFaqItem } from "@/lib/redux/features/page-settings/pageSettingsApi";

interface FaqConfigCardProps {
  faqs: IContactPageSettings["faqs"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: IContactPageSettings["faqs"]) => void;
}

export function FaqConfigCard({
  faqs,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: FaqConfigCardProps) {
  const items = faqs?.items || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem: IFaqItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };

    onChange({
      ...faqs,
      items: [...items, newItem],
    });

    setNewQuestion("");
    setNewAnswer("");
    setShowAddForm(false);
  };

  const handleDeleteFaq = (id: string) => {
    onChange({
      ...faqs,
      items: items.filter((item) => item.id !== id),
    });
  };

  const handleUpdateItem = (id: string, field: "question" | "answer", value: string) => {
    onChange({
      ...faqs,
      items: items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <HelpCircle className="size-4 text-violet-600" />
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            disabled={!isVisible}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add FAQ
          </button>

          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                isVisible
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Power className="size-3.5" />
              {isVisible ? "Active" : "Hidden"}
            </button>
          )}
        </div>
      </div>

      <div
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Section Title
            </label>
            <input
              type="text"
              value={faqs?.title || ""}
              onChange={(e) => onChange({ ...faqs, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="Frequently Asked Questions"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Section Subtitle
            </label>
            <input
              type="text"
              value={faqs?.subtitle || ""}
              onChange={(e) => onChange({ ...faqs, subtitle: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 transition-all"
              placeholder="Quick answers to common inquiries"
            />
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900">
              Add New Question & Answer
            </h4>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Question
              </label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="e.g. Why should I choose ASH Academy?"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Answer
              </label>
              <textarea
                rows={3}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Provide a helpful, detailed answer..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFaq}
                className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                  Q{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(item.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove FAQ"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={item.question}
                onChange={(e) => handleUpdateItem(item.id, "question", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Question"
              />

              <textarea
                rows={2}
                value={item.answer}
                onChange={(e) => handleUpdateItem(item.id, "answer", e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 resize-y"
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
