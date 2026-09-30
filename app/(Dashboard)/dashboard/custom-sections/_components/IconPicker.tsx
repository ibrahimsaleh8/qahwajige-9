"use client";

import { getIconComponent, ICON_OPTIONS } from "@/lib/getIconComponent";
import { useState, useRef, useEffect } from "react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function IconPicker({
  value,
  onChange,
  disabled,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search.trim()
    ? ICON_OPTIONS.filter(
        (o) =>
          o.label.includes(search.trim()) ||
          o.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : ICON_OPTIONS;

  const SelectedIcon = getIconComponent(value);

  const handleSelect = (name: string) => {
    onChange(name === value ? "" : name); // toggle off if same
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((p) => !p)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm
          transition-all duration-150 text-right
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-primary/60 cursor-pointer bg-white"}
          ${isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-200"}
        `}
        dir="rtl">
        {/* Icon preview */}
        <span
          className={`
            flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center
            ${SelectedIcon ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}
          `}>
          {SelectedIcon ? (
            <SelectedIcon className="w-4 h-4" />
          ) : (
            <span className="text-xs font-medium">؟</span>
          )}
        </span>

        <span
          className={`flex-1 truncate ${value ? "text-gray-800" : "text-gray-400"}`}>
          {value
            ? (ICON_OPTIONS.find((o) => o.name === value)?.label ?? value)
            : "اختر أيقونة (اختياري)"}
        </span>

        <span className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              onClick={handleClear}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              ✕
            </span>
          )}
          <span
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          className="sticky z-100000! mt-2 w-full min-w-[280px] bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
          dir="rtl">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أيقونة..."
              className="w-full text-sm px-3 py-1.5 rounded-md border border-gray-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              autoFocus
            />
          </div>

          {/* Grid */}
          <div className="p-2 grid md:grid-cols-6 grid-cols-4 gap-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="col-span-6 text-center text-xs text-gray-400 py-6">
                لا توجد أيقونات مطابقة
              </p>
            ) : (
              filtered.map(({ name, icon: Icon, label }) => {
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    title={label}
                    onClick={() => handleSelect(name)}
                    className={`
                      flex flex-col items-center justify-center gap-1 p-2 rounded-lg
                      transition-all duration-100 group cursor-pointer
                      ${
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "hover:bg-primary/10 text-gray-600 hover:text-primary"
                      }
                    `}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] leading-none truncate w-full text-center opacity-70 group-hover:opacity-100">
                      {label}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="px-3 py-2 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400">
              {filtered.length} أيقونة متاحة · اضغط مرة أخرى لإلغاء الاختيار
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
