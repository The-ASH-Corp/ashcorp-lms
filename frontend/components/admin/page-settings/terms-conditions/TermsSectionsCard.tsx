"use client";

import React, { useState } from "react";
import { FileText, Plus, Trash2, Power, GripVertical } from "lucide-react";
import {
  ITermsConditionsSettings,
  ITermsSectionItem,
} from "@/lib/redux/features/page-settings/pageSettingsApi";

interface TermsSectionsCardProps {
  termsSections: ITermsConditionsSettings["termsSections"];
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onChange: (updated: ITermsConditionsSettings["termsSections"]) => void;
}

export function TermsSectionsCard({
  termsSections,
  isVisible = true,
  onToggleVisibility,
  onChange,
}: TermsSectionsCardProps) {
  const items = termsSections?.items || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleAddSection = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const nextNumber =
      items.length > 0
        ? Math.max(...items.map((i) => i.sectionNumber)) + 1
        : 1;

    const newItem: ITermsSectionItem = {
      id: `tc-${Date.now()}`,
      sectionNumber: nextNumber,
      title: newTitle.trim(),
      content: newContent.trim(),
    };

    onChange({
      ...termsSections,
      items: [...items, newItem],
    });

    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
  };

  const handleDeleteSection = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    // Re-number remaining sections
    const renumbered = filtered.map((item, idx) => ({
      ...item,
      sectionNumber: idx + 1,
    }));
    onChange({
      ...termsSections,
      items: renumbered,
    });
  };

  const handleUpdateItem = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    onChange({
      ...termsSections,
      items: items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <FileText className="size-4 text-violet-600" />
          Terms Sections ({items.length})
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            disabled={!isVisible}
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Section
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
        className={`space-y-4 transition-opacity ${
          !isVisible ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900">
              Add New Terms Section
            </h4>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Section Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="e.g. Limitation of Liability"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Section Content
              </label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Describe the terms details for this section..."
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
                onClick={handleAddSection}
                className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 cursor-pointer"
              >
                Save Section
              </button>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5 hover:border-violet-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="size-4 text-slate-300" />
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                    §{item.sectionNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSection(item.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove section"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  handleUpdateItem(item.id, "title", e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="Section Title"
              />

              <textarea
                rows={3}
                value={item.content}
                onChange={(e) =>
                  handleUpdateItem(item.id, "content", e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 leading-relaxed outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10 resize-y"
                placeholder="Section Content"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
