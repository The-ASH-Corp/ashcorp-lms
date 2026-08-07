"use client";

import React, { useState } from "react";
import { Diamond, Plus, Trash2, Power, ShieldCheck, Zap, Users } from "lucide-react";
import { IAboutPageSettings, ICoreValue } from "./aboutSettingsTypes";

interface CoreValuesCardProps {
  coreValues: IAboutPageSettings["coreValues"];
  onChange: (updated: IAboutPageSettings["coreValues"]) => void;
}

export function CoreValuesCard({
  coreValues,
  onChange,
}: CoreValuesCardProps) {
  const isEnabled = coreValues?.enabled ?? true;
  const items = coreValues?.items || [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddCoreValue = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newItem: ICoreValue = {
      id: `cv-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
    };

    onChange({
      ...coreValues,
      items: [...items, newItem],
    });

    setNewTitle("");
    setNewDescription("");
    setShowAddForm(false);
  };

  const handleDeleteCoreValue = (id: string) => {
    onChange({
      ...coreValues,
      items: items.filter((item) => item.id !== id),
    });
  };

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Diamond className="size-4 text-violet-600" />
          Core Values
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Value
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...coreValues, enabled: !isEnabled })}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              isEnabled
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <Power className="size-3.5" />
            {isEnabled ? "Active" : "Hidden"}
          </button>
        </div>
      </div>

      <div
        className={`space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${
          !isEnabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-2xl border border-violet-200 bg-white p-4 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-900">
              Create Core Value
            </h4>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="e.g. Innovation"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Description
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600/10"
                placeholder="We constantly push the boundaries..."
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
                onClick={handleAddCoreValue}
                className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 cursor-pointer"
              >
                Save Value
              </button>
            </div>
          </div>
        )}

        {/* List of Values */}
        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const icons = [Zap, ShieldCheck, Users, Diamond];
            const IconComponent = icons[idx % icons.length];
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-violet-200 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="grid size-8 place-items-center rounded-xl bg-violet-50 text-violet-600 shrink-0 mt-0.5">
                    <IconComponent className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCoreValue(item.id)}
                  className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                  title="Delete Core Value"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
