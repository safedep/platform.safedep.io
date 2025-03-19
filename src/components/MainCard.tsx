import React from "react";

export default function MainCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-8">{children}</div>
    </div>
  );
}
