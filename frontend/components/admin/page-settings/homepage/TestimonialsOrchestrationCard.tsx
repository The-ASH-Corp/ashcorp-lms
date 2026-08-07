"use client";

import React, { useState } from "react";
import { MessageSquareText, Plus, Trash2, CheckCircle2, XCircle, Star, Power } from "lucide-react";
import {
  IHomepageSettings,
  ITestimonial,
} from "@/lib/redux/features/page-settings/pageSettingsApi";

interface TestimonialsOrchestrationCardProps {
  testimonialsSection: IHomepageSettings["testimonialsSection"];
  onChange: (updated: IHomepageSettings["testimonialsSection"]) => void;
}

export function TestimonialsOrchestrationCard({
  testimonialsSection,
  onChange,
}: TestimonialsOrchestrationCardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newRole, setNewRole] = useState("Student");

  const handleAddTestimonial = () => {
    if (!newQuote.trim() || !newAuthor.trim()) return;

    const newItem: ITestimonial = {
      id: `custom-${Date.now()}`,
      quote: newQuote.trim(),
      authorName: newAuthor.trim(),
      role: newRole.trim() || "Student",
      rating: 5,
      isApproved: true,
    };

    onChange({
      ...testimonialsSection,
      items: [newItem, ...(testimonialsSection.items || [])],
    });

    setNewQuote("");
    setNewAuthor("");
    setNewRole("Student");
    setShowAddForm(false);
  };

  const handleToggleApproval = (id: string) => {
    const updated = (testimonialsSection.items || []).map((item) =>
      item.id === id ? { ...item, isApproved: !item.isApproved } : item
    );
    onChange({ ...testimonialsSection, items: updated });
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = (testimonialsSection.items || []).filter(
      (item) => item.id !== id
    );
    onChange({ ...testimonialsSection, items: updated });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <MessageSquareText className="size-4 text-violet-600" />
          Testimonials Section
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add
          </button>

          {/* On/Off Switch */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...testimonialsSection,
                enabled: !testimonialsSection.enabled,
              })
            }
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              testimonialsSection.enabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {testimonialsSection.enabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 transition-opacity ${!testimonialsSection.enabled ? "opacity-40 pointer-events-none" : ""}`}>
        {/* Title & Subtitle Inputs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Section Subtitle
            </label>
            <input
              type="text"
              value={testimonialsSection.subtitle || ""}
              onChange={(e) =>
                onChange({
                  ...testimonialsSection,
                  subtitle: e.target.value,
                })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="Testimonials"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Main Section Title
            </label>
            <input
              type="text"
              value={testimonialsSection.title || ""}
              onChange={(e) =>
                onChange({
                  ...testimonialsSection,
                  title: e.target.value,
                })
              }
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500"
              placeholder="What our Students say about us"
            />
          </div>
        </div>

        {/* Add Testimonial Form */}
        {showAddForm && (
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900">
              Create New Student Testimonial
            </h4>
            <div>
              <label className="text-[10px] font-medium text-slate-500">
                Student Review Quote
              </label>
              <textarea
                rows={2}
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-500"
                placeholder="Write student feedback here..."
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-medium text-slate-500">
                  Author Name
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-violet-500"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">
                  Role / Course
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-violet-500"
                  placeholder="e.g. MERN Stack Learner"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        )}

        {/* Existing Testimonials List */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Published & Moderated Testimonials (
            {(testimonialsSection.items || []).length})
          </p>
          {(testimonialsSection.items || []).map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-2xs"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs italic text-slate-700 line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-900">
                    {t.authorName}
                  </span>
                  <span>•</span>
                  <span>{t.role || "Student"}</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    <Star className="size-3 fill-amber-400" />
                    {t.rating || 5}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleApproval(t.id)}
                  className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium ${
                    t.isApproved
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {t.isApproved ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3.5 text-slate-400" />
                      Hidden
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(t.id)}
                  className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
