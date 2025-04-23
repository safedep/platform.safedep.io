"use client";

import React from "react";
import { motion } from "framer-motion";
import AuthCard from "@/components/auth/auth-card";
import AuthButtons from "@/components/auth/auth-buttons";
import TermsAndPrivacy from "@/components/auth/terms-and-privacy";

export default function AuthPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <AuthCard
          title="Welcome to SafeDep"
          description="Get access to SafeDep Cloud APIs to integrate open-source component analysis and risk assessment into your CI/CD pipeline or custom workflow."
        >
          <div className="flex flex-col gap-6">
            <AuthButtons />
            <TermsAndPrivacy />
          </div>
        </AuthCard>
      </motion.div>
    </div>
  );
}
