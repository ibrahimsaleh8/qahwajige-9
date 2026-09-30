"use client";

import { useState } from "react";
import { CustomSection } from "../page";
import { APP_URL } from "@/lib/ProjectId";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Layers } from "lucide-react";
import SectionCard from "./SectionCard";
import CreateSectionModal from "./CreateSectionModal";

interface CustomSectionsClientProps {
  projectId: string;
  initialSections: CustomSection[];
}

export default function CustomSectionsClient({
  projectId,
  initialSections,
}: CustomSectionsClientProps) {
  const [sections, setSections] = useState<CustomSection[]>(initialSections);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSectionCreated = (newSection: CustomSection) => {
    setSections((prev) => [newSection, ...prev]);
  };

  const handleSectionUpdated = (updatedSection: CustomSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  const handleSectionDeleted = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {sections.length === 0
            ? "لا توجد أقسام بعد"
            : `${sections.length} قسم مخصص`}
        </p>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إنشاء قسم جديد
        </Button>
      </div>

      {/* Empty state */}
      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <Layers className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            لا توجد أقسام مخصصة بعد
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            ابدأ بإنشاء قسمك الأول وأضف البطاقات التي تريدها
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            إنشاء قسم جديد
          </Button>
        </div>
      )}

      {/* Sections list */}
      <div className="space-y-6">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            projectId={projectId}
            onUpdated={handleSectionUpdated}
            onDeleted={handleSectionDeleted}
          />
        ))}
      </div>

      {/* Create modal */}
      <CreateSectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onCreated={handleSectionCreated}
      />
    </div>
  );
}
