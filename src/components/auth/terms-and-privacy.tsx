import React from "react";

export default function TermsAndPrivacy() {
  return (
    <div className="text-center text-xs text-gray-500">
      <p>
        By continuing, you agree to our{" "}
        <a
          href="https://safedep.io/terms"
          className="text-blue-600 hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://safedep.io/privacy"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
