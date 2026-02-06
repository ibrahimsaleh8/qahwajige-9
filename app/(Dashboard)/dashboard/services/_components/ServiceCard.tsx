// components/ui/card.tsx
import React from "react";

interface CardProps {
  title?: string;
  body?: string;
  className?: string;
}

export default function Card({ title, body, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Header */}
      {title && (
        <div className="p-6">
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
      )}

      {/* Body */}
      {body && (
        <div className="p-6 pt-0">
          <p>{body}</p>
        </div>
      )}
    </div>
  );
}
