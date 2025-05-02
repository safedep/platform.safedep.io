import React from "react";
import Image from "next/image";
import Badge from "@/components/auth/auth-badge";
import { CheckCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthCard({
  children,
  title,
  description,
}: AuthCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-gray-200 shadow-lg shadow-blue-600/10">
      <CardContent className="p-0">
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex justify-center">
            <Image
              src="/safedep-logo.svg"
              alt="SafeDep Logo"
              width={80}
              height={80}
              className="transition-transform hover:scale-105"
              priority
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge
              icon={CheckCircle}
              text="Secure"
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            <Badge
              icon={Shield}
              text="Verified"
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2 text-center">
            <h1
              className={cn(
                "text-xl font-bold tracking-tight text-gray-900 sm:text-2xl",
              )}
            >
              {title}
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">{description}</p>
          </div>

          {children}
        </div>
      </CardContent>
    </Card>
  );
}
