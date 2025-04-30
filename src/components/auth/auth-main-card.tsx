import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MainCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-xl bg-white">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
