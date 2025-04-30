import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh bg-gradient-to-br from-gray-50 to-blue-200">
      {children}
    </div>
  );
}
