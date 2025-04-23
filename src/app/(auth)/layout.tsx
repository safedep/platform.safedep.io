import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-gradient-to-br from-gray-50 to-blue-50">
      {children}
    </div>
  );
}
